import BridgeLink from '../models/BridgeLink.js';
import Migration from '../models/Migration.js';
import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import College from '../models/College.js';
import {
  generateStateToken,
  getExchangeAuthorizeUrl,
  exchangeCodeForLink,
  revokeExchangeLink,
  migrateBalancesToExchange
} from '../services/bridge.service.js';

// @desc    Generate state token and return Exchange authorize URL
// @route   POST /api/bridge/initiate-link
// @access  Private (User only)
export const initiateLink = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if user already has an active bridge link
    const existingLink = await BridgeLink.findOne({
      user: userId,
      status: 'active'
    });

    if (existingLink) {
      return res.status(400).json({
        success: false,
        message: 'Your account is already linked to an Exchange account'
      });
    }

    // Generate state token and create/update pending link
    const bridgeLink = await generateStateToken(userId);

    // Build the Exchange authorize URL
    const authorizeUrl = getExchangeAuthorizeUrl(bridgeLink.stateToken, req.user.email);

    res.status(200).json({
      success: true,
      message: 'Link initiation successful. Redirect user to authorizeUrl.',
      data: {
        authorizeUrl,
        stateToken: bridgeLink.stateToken,
        expiresAt: bridgeLink.stateTokenExpiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle redirect from Exchange after user authorizes linking
// @route   GET /api/bridge/callback
// @access  Public (Exchange redirects here; state token identifies the user)
export const handleCallback = async (req, res, next) => {
  try {
    const { state, code, error: callbackError } = req.query;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // Handle error from Exchange
    if (callbackError) {
      return res.redirect(`${clientUrl}/user/bridge?status=error&message=${encodeURIComponent(callbackError)}`);
    }

    if (!state || !code) {
      return res.redirect(`${clientUrl}/user/bridge?status=error&message=${encodeURIComponent('Missing state or code parameter')}`);
    }

    // Find the pending BridgeLink by state token
    const bridgeLink = await BridgeLink.findOne({
      stateToken: state,
      status: 'pending'
    });

    if (!bridgeLink) {
      return res.redirect(`${clientUrl}/user/bridge?status=error&message=${encodeURIComponent('Invalid or expired state token')}`);
    }

    // Check if state token has expired
    if (bridgeLink.stateTokenExpiresAt < new Date()) {
      return res.redirect(`${clientUrl}/user/bridge?status=error&message=${encodeURIComponent('State token has expired. Please try again.')}`);
    }

    // Exchange the code for link data from Exchange API
    let linkData;
    try {
      linkData = await exchangeCodeForLink(code, state);
    } catch (exchangeError) {
      console.error('Exchange code exchange failed:', exchangeError);
      return res.redirect(`${clientUrl}/user/bridge?status=error&message=${encodeURIComponent('Failed to verify with Exchange. Please try again.')}`);
    }

    // Update BridgeLink to active
    bridgeLink.status = 'active';
    bridgeLink.exchangeUserId = linkData.exchangeUserId;
    bridgeLink.linkedAt = new Date();
    bridgeLink.stateToken = null;
    bridgeLink.stateTokenExpiresAt = null;
    bridgeLink.metadata = {
      exchangeEmail: linkData.email || null
    };
    await bridgeLink.save();

    // Redirect to CFC frontend with success
    res.redirect(`${clientUrl}/user/bridge?status=success`);
  } catch (error) {
    console.error('Bridge callback error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/user/bridge?status=error&message=${encodeURIComponent('An unexpected error occurred')}`);
  }
};

// @desc    Get current bridge link status
// @route   GET /api/bridge/status
// @access  Private (User only)
export const getLinkStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bridgeLink = await BridgeLink.findOne({ user: userId });

    if (!bridgeLink || bridgeLink.status === 'revoked') {
      return res.status(200).json({
        success: true,
        data: {
          linked: false,
          status: bridgeLink ? bridgeLink.status : null
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        linked: bridgeLink.status === 'active',
        status: bridgeLink.status,
        linkedAt: bridgeLink.linkedAt,
        exchangeEmail: bridgeLink.metadata?.exchangeEmail || null,
        migrated: bridgeLink.status === 'migrated'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke the link between CFC and Exchange accounts
// @route   POST /api/bridge/unlink
// @access  Private (User only)
export const unlinkExchange = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bridgeLink = await BridgeLink.findOne({
      user: userId,
      status: 'active'
    });

    if (!bridgeLink) {
      return res.status(400).json({
        success: false,
        message: 'No active Exchange link found'
      });
    }

    // Call Exchange API to revoke the link
    try {
      await revokeExchangeLink(bridgeLink.exchangeUserId);
    } catch (exchangeError) {
      console.error('Exchange revoke failed:', exchangeError);
      return res.status(502).json({
        success: false,
        message: 'Failed to revoke link on Exchange. Please try again later.'
      });
    }

    // Update local BridgeLink
    bridgeLink.status = 'revoked';
    bridgeLink.revokedAt = new Date();
    await bridgeLink.save();

    res.status(200).json({
      success: true,
      message: 'Exchange link revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate balance migration from CFC to Exchange
// @route   POST /api/bridge/migrate/initiate
// @access  Private (User only)
export const initiateMigration = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verify user has active bridge link
    const bridgeLink = await BridgeLink.findOne({
      user: userId,
      status: 'active'
    });

    if (!bridgeLink) {
      return res.status(400).json({
        success: false,
        message: 'You must link your Exchange account before migrating'
      });
    }

    // Check no pending/processing migration exists
    const existingMigration = await Migration.findOne({
      user: userId,
      status: { $in: ['pending', 'processing'] }
    });

    if (existingMigration) {
      return res.status(400).json({
        success: false,
        message: 'A migration is already in progress'
      });
    }

    // Check if already migrated
    const completedMigration = await Migration.findOne({
      user: userId,
      status: 'completed'
    });

    if (completedMigration) {
      return res.status(400).json({
        success: false,
        message: 'Migration has already been completed'
      });
    }

    // Stop all active mining sessions for this user
    const now = new Date();
    const activeSessions = await MiningSession.find({
      user: userId,
      isActive: true
    }).populate('college', 'name stats');

    for (const session of activeSessions) {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      const updatedSession = await MiningSession.findOneAndUpdate(
        { _id: session._id, isActive: true },
        { $set: { isActive: false, tokensEarned, endTime: now } },
        { new: false }
      );

      if (updatedSession) {
        await Wallet.findOneAndUpdate(
          { user: userId, college: session.college._id },
          {
            $inc: { balance: tokensEarned, totalMined: tokensEarned },
            lastUpdated: now
          },
          { upsert: true }
        );

        await College.findByIdAndUpdate(session.college._id, {
          $inc: {
            'stats.activeMiners': -1,
            'stats.totalTokensMined': tokensEarned
          }
        });
      }
    }

    // Snapshot all wallet balances
    const wallets = await Wallet.find({ user: userId })
      .populate('college', 'name shortName tokenPreferences');

    const walletSnapshots = wallets
      .filter(w => w.college && w.balance > 0)
      .map(w => ({
        _id: w._id,
        college: w.college._id,
        collegeName: w.college.name,
        collegeTicker: w.college.tokenPreferences?.ticker || w.college.shortName || '',
        balance: w.balance,
        totalMined: w.totalMined
      }));

    const totalTokensMigrated = walletSnapshots.reduce((sum, ws) => sum + ws.balance, 0);

    if (totalTokensMigrated === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tokens to migrate'
      });
    }

    // Create migration record
    const migration = await Migration.create({
      user: userId,
      bridgeLink: bridgeLink._id,
      status: 'processing',
      walletSnapshots,
      totalTokensMigrated,
      initiatedAt: now
    });

    // Call Exchange API to migrate balances
    try {
      const result = await migrateBalancesToExchange(
        bridgeLink.exchangeUserId,
        walletSnapshots
      );

      // Success: update migration and bridge link
      migration.status = 'completed';
      migration.completedAt = new Date();
      migration.exchangeTransactionId = result.transactionId;
      await migration.save();

      bridgeLink.status = 'migrated';
      await bridgeLink.save();

      res.status(200).json({
        success: true,
        message: 'Migration completed successfully',
        data: {
          migrationId: migration._id,
          status: migration.status,
          totalTokensMigrated,
          walletSnapshots,
          exchangeTransactionId: result.transactionId,
          completedAt: migration.completedAt
        }
      });
    } catch (exchangeError) {
      console.error('Exchange migration failed:', exchangeError);

      migration.status = 'failed';
      migration.error = exchangeError.message;
      await migration.save();

      res.status(502).json({
        success: false,
        message: 'Migration failed on Exchange side. Your tokens have been preserved. Please try again later.',
        data: {
          migrationId: migration._id,
          status: 'failed'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all colleges for Exchange token import
// @route   GET /api/bridge/colleges
// @access  Server-to-server (X-Bridge-Secret)
export const getCollegesForExchange = async (req, res, next) => {
  try {
    const secret = req.headers['x-bridge-secret'];
    if (!secret || secret !== process.env.EXCHANGE_BRIDGE_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Invalid bridge secret'
      });
    }

    const colleges = await College.find({})
      .select('name country logo tokenPreferences baseRate status stats shortName')
      .lean();

    const data = colleges.map(c => ({
      _id: c._id.toString(),
      name: c.name,
      shortName: c.shortName || '',
      country: c.country,
      logo: c.logo || null,
      ticker: c.tokenPreferences?.ticker || '',
      tokenName: c.tokenPreferences?.name || '',
      preferredIcon: c.tokenPreferences?.preferredIcon || null,
      baseRate: c.baseRate ?? 0.25,
      status: c.status,
      stats: {
        totalMiners: c.stats?.totalMiners || 0,
        activeMiners: c.stats?.activeMiners || 0,
        totalTokensMined: c.stats?.totalTokensMined || 0
      }
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Notify Exchange when a college is created or updated
// @route   POST /api/bridge/colleges/notify
// @access  Internal (called by CFC admin college create/update)
export const notifyExchangeCollegeUpdate = async (req, res, next) => {
  try {
    const secret = req.headers['x-bridge-secret'];
    if (!secret || secret !== process.env.EXCHANGE_BRIDGE_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Invalid bridge secret'
      });
    }

    const { collegeId } = req.body;
    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: 'collegeId is required'
      });
    }

    const college = await College.findById(collegeId)
      .select('name country logo tokenPreferences baseRate status stats shortName')
      .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    const collegeData = {
      _id: college._id.toString(),
      name: college.name,
      shortName: college.shortName || '',
      country: college.country,
      logo: college.logo || null,
      ticker: college.tokenPreferences?.ticker || '',
      tokenName: college.tokenPreferences?.name || '',
      preferredIcon: college.tokenPreferences?.preferredIcon || null,
      baseRate: college.baseRate ?? 0.25,
      status: college.status,
      stats: {
        totalMiners: college.stats?.totalMiners || 0,
        activeMiners: college.stats?.activeMiners || 0,
        totalTokensMined: college.stats?.totalTokensMined || 0
      }
    };

    // Forward to Exchange
    const exchangeApiUrl = process.env.EXCHANGE_API_URL || 'http://localhost:8000';
    const exchangeSecret = process.env.EXCHANGE_BRIDGE_SECRET || '';

    const response = await fetch(`${exchangeApiUrl}/api/bridge/colleges/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bridge-Secret': exchangeSecret
      },
      body: JSON.stringify({ college: collegeData })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: 'Failed to sync college to Exchange',
        exchangeError: result.message || null
      });
    }

    res.status(200).json({
      success: true,
      message: 'College synced to Exchange',
      data: result.data || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get migration status
// @route   GET /api/bridge/migrate/status
// @access  Private (User only)
export const getMigrationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const migration = await Migration.findOne({ user: userId })
      .sort({ createdAt: -1 });

    if (!migration) {
      return res.status(200).json({
        success: true,
        data: {
          hasMigration: false
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hasMigration: true,
        migrationId: migration._id,
        status: migration.status,
        totalTokensMigrated: migration.totalTokensMigrated,
        walletSnapshots: migration.walletSnapshots,
        exchangeTransactionId: migration.exchangeTransactionId,
        error: migration.error,
        initiatedAt: migration.initiatedAt,
        completedAt: migration.completedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
