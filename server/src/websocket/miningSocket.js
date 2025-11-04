import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

// Store active connections by user ID (supports multiple devices per user)
// Structure: Map<userId, Set<socketId>>
const userConnections = new Map();
// Track users with active mining sessions
const usersWithActiveMining = new Set();
// Cache mining sessions data to avoid repeated DB queries
// Structure: Map<userId, { sessions: Array, wallets: Array, miningColleges: Array, earningRate: Object, lastFetched: Date, cacheExpiry: Number }>
const userMiningCache = new Map();
// Store last sent data hash for delta updates
// Structure: Map<userId, { dataHash: String, lastSent: Number }>
const lastSentDataHash = new Map();
// Store socket.io instance for room-based broadcasting
let ioInstance = null;

// Helper function to generate hash for data comparison (delta updates)
const generateDataHash = (miningStatus) => {
  // Only hash the parts that matter for meaningful updates
  // Don't include currentTokens in hash since they change every second
  const relevantData = {
    activeSessionsCount: miningStatus.activeSessions?.length || 0,
    sessionIds: miningStatus.activeSessions?.map(s => s.sessionId?.toString()).sort().join(',') || '',
    isActiveStates: miningStatus.activeSessions?.map(s => s.isActive).join(',') || '',
    walletsCount: miningStatus.wallets?.length || 0,
    walletBalances: miningStatus.wallets?.map(w => w.balance).join(',') || ''
  };
  return JSON.stringify(relevantData);
};

// Check if data has changed significantly (for delta updates)
const hasSignificantChange = (userId, miningStatus) => {
  const currentHash = generateDataHash(miningStatus);
  const lastSent = lastSentDataHash.get(userId.toString());

  if (!lastSent || lastSent.dataHash !== currentHash) {
    // Update hash
    lastSentDataHash.set(userId.toString(), {
      dataHash: currentHash,
      lastSent: Date.now()
    });
    return true;
  }

  // Even if hash is same, send update every 30 seconds to keep client in sync
  if (Date.now() - lastSent.lastSent > 30000) {
    lastSentDataHash.set(userId.toString(), {
      dataHash: currentHash,
      lastSent: Date.now()
    });
    return true;
  }

  return false;
};

// Authenticate WebSocket connection
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

// Setup WebSocket handlers
export const setupWebSocketHandlers = (io) => {
  // Store io instance for room-based broadcasting
  ioInstance = io;
  
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.userId} connected to mining WebSocket (socket: ${socket.id})`);
    
    // Store user connection (support multiple devices)
    if (!userConnections.has(socket.userId)) {
      userConnections.set(socket.userId, new Set());
    }
    userConnections.get(socket.userId).add(socket.id);
    
    // Join user to their personal room for targeted updates
    socket.join(`user:${socket.userId}`);
    
    // Handle mining status requests
    socket.on('getMiningStatus', async () => {
      try {
        const miningStatus = await getMiningStatusForUser(socket.userId);
        socket.emit('miningStatus', miningStatus);
        
        // Add/remove user from active mining tracking based on active sessions
        const hasActiveSessions = miningStatus.activeSessions?.some(session => 
          session.isActive && session.remainingHours > 0
        );
        
        if (hasActiveSessions) {
          usersWithActiveMining.add(socket.userId);
        } else {
          usersWithActiveMining.delete(socket.userId);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to fetch mining status' });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.userId} disconnected from mining WebSocket (socket: ${socket.id})`);

      // Remove this specific socket from user's connections
      const userSockets = userConnections.get(socket.userId);
      if (userSockets) {
        userSockets.delete(socket.id);

        // If user has no more connections, clean up completely
        if (userSockets.size === 0) {
          userConnections.delete(socket.userId);
          usersWithActiveMining.delete(socket.userId);
          userMiningCache.delete(socket.userId);
          lastSentDataHash.delete(socket.userId.toString());
        }
      }
    });
  });

  // Send periodic updates every 5 seconds to users with active mining sessions
  // Using optimized parallel batch processing
  setInterval(async () => {
    const now = Date.now();
    const usersArray = Array.from(usersWithActiveMining);

    // If no users, skip processing
    if (usersArray.length === 0) return;

    // Process users in larger batches for better performance
    const BATCH_SIZE = 1000; // Process 1000 users at a time

    for (let i = 0; i < usersArray.length; i += BATCH_SIZE) {
      const batch = usersArray.slice(i, i + BATCH_SIZE);

      // Process entire batch in parallel using allSettled to prevent one failure from stopping others
      const batchPromises = batch.map(async (userId) => {
        const userSockets = userConnections.get(userId);
        if (userSockets && userSockets.size > 0) {
          try {
            const miningStatus = await getMiningStatusForUserOptimized(userId, now);

            // Only broadcast if data has changed significantly (delta updates)
            // This reduces unnecessary network traffic for unchanged data
            if (hasSignificantChange(userId, miningStatus)) {
              // Broadcast to all devices of this user using room
              ioInstance.to(`user:${userId}`).emit('miningStatus', miningStatus);
            }

            // Check if user still has active sessions
            const hasActiveSessions = miningStatus.activeSessions?.some(session =>
              session.isActive && session.remainingHours > 0
            );

            if (!hasActiveSessions) {
              usersWithActiveMining.delete(userId);
              userMiningCache.delete(userId);
              lastSentDataHash.delete(userId.toString());
            }
          } catch (error) {
            console.error(`Error sending periodic update to user ${userId}:`, error);
            // Don't remove user from tracking on temporary errors
          }
        } else {
          // Clean up tracking for disconnected users
          usersWithActiveMining.delete(userId);
          userMiningCache.delete(userId);
          lastSentDataHash.delete(userId.toString());
        }
      });

      // Use allSettled to handle all promises even if some fail
      await Promise.allSettled(batchPromises);
    }
  }, 5000); // Update every 5 seconds
};

// Optimized function that uses cached data for periodic updates
const getMiningStatusForUserOptimized = async (userId, currentTime) => {
  try {
    const cached = userMiningCache.get(userId);

    // If cache is missing or expired (uses staggered expiry), refresh from DB
    if (!cached || Date.now() > cached.cacheExpiry) {
      return await getMiningStatusForUser(userId, true);
    }
    
    // Use cached session data, only recalculate time-based values
    const now = new Date(currentTime);
    const sessionsWithCurrentTokens = cached.sessions.map(session => {
      const miningDuration = (now - new Date(session.startTime)) / (1000 * 60 * 60);
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = new Date(session.endTime) - now;
      const remainingHours = Math.max(0, remainingTime / (1000 * 60 * 60));

      // Periodic logging (only log every 30 seconds to avoid spam)
      const shouldLog = Math.floor(Date.now() / 30000) !== Math.floor((Date.now() - 5000) / 30000);
      if (shouldLog && remainingHours > 0) {
        console.log(`[WS Real-time] College: ${session.college?._id || session.college}, Duration: ${miningDuration.toFixed(8)}h, Tokens: ${currentTokens.toFixed(8)}`);
      }

      return {
        college: session.college,
        startTime: session.startTime,
        endTime: session.endTime,
        earningRate: session.earningRate,
        currentTokens: Math.max(0, currentTokens),
        remainingHours: remainingHours,
        isActive: remainingHours > 0,
        sessionId: session.sessionId
      };
    });

    return {
      miningColleges: cached.miningColleges,
      activeSessions: sessionsWithCurrentTokens,
      wallets: cached.wallets
      // Note: Earning rates are now per-college, available in each session's earningRate field
    };
  } catch (error) {
    console.error('Error in optimized mining status:', error);
    // Fall back to full DB query on error
    return await getMiningStatusForUser(userId, true);
  }
};

// Get mining status for a specific user using optimized aggregation pipeline
const getMiningStatusForUser = async (userId, updateCache = true) => {
  try {
    const now = new Date();

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    // Use aggregation pipeline to fetch all data in a single query
    // This replaces 3 separate queries with 1 optimized query
    const result = await User.aggregate([
      // Match the specific user
      { $match: { _id: userObjectId } },

      // Lookup mining colleges
      {
        $lookup: {
          from: 'colleges',
          localField: 'userProfile.miningColleges.college',
          foreignField: '_id',
          as: 'collegeDetails'
        }
      },

      // Lookup active mining sessions
      {
        $lookup: {
          from: 'miningsessions',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$userId'] },
                    { $eq: ['$isActive', true] }
                  ]
                }
              }
            },
            {
              $lookup: {
                from: 'colleges',
                localField: 'college',
                foreignField: '_id',
                as: 'collegeData'
              }
            },
            { $unwind: { path: '$collegeData', preserveNullAndEmptyArrays: true } }
          ],
          as: 'activeSessions'
        }
      },

      // Lookup wallets
      {
        $lookup: {
          from: 'wallets',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
            {
              $lookup: {
                from: 'colleges',
                localField: 'college',
                foreignField: '_id',
                as: 'collegeData'
              }
            },
            { $unwind: { path: '$collegeData', preserveNullAndEmptyArrays: true } }
          ],
          as: 'wallets'
        }
      },

      // Project only needed fields
      {
        $project: {
          'userProfile.miningColleges': 1,
          collegeDetails: 1,
          activeSessions: 1,
          wallets: 1
        }
      }
    ]);

    if (!result || result.length === 0) {
      return {
        miningColleges: [],
        activeSessions: [],
        wallets: []
      };
    }

    const userData = result[0];

    // Map college details back to miningColleges structure
    const collegeMap = new Map();
    userData.collegeDetails?.forEach(college => {
      collegeMap.set(college._id.toString(), college);
    });

    const validMiningColleges = userData.userProfile?.miningColleges
      ?.map(mc => {
        const college = collegeMap.get(mc.college?.toString());
        return college ? { ...mc, college } : null;
      })
      .filter(mc => mc !== null) || [];

    // Process active sessions with current token calculations
    const sessionsWithCurrentTokens = userData.activeSessions?.map(session => {
      const miningDuration = (now - new Date(session.startTime)) / (1000 * 60 * 60);
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = new Date(session.endTime) - now;
      const remainingHours = Math.max(0, remainingTime / (1000 * 60 * 60));

      return {
        college: session.collegeData || null,
        startTime: session.startTime,
        endTime: session.endTime,
        earningRate: session.earningRate,
        currentTokens: Math.max(0, currentTokens),
        remainingHours: remainingHours,
        isActive: remainingHours > 0,
        sessionId: session._id
      };
    }).filter(session => session.college) || [];

    // Process wallets
    const validWallets = userData.wallets?.map(wallet => ({
      _id: wallet._id,
      balance: wallet.balance,
      college: wallet.collegeData || null
    })).filter(w => w.college !== null) || [];

    const finalResult = {
      miningColleges: validMiningColleges,
      activeSessions: sessionsWithCurrentTokens,
      wallets: validWallets
    };

    // Update cache with staggered TTL to prevent thundering herd
    if (updateCache) {
      // Add random jitter (0-10 seconds) to cache TTL to stagger refreshes
      const jitter = Math.floor(Math.random() * 10000);
      userMiningCache.set(userId, {
        sessions: sessionsWithCurrentTokens.map(session => ({
          college: session.college,
          startTime: session.startTime,
          endTime: session.endTime,
          earningRate: session.earningRate,
          sessionId: session.sessionId
        })),
        wallets: finalResult.wallets,
        miningColleges: finalResult.miningColleges,
        lastFetched: Date.now(),
        cacheExpiry: Date.now() + 45000 + jitter // 45s base + jitter
      });
    }

    return finalResult;
  } catch (error) {
    console.error('Error getting mining status for user:', error);
    throw error;
  }
};

// Broadcast mining status update to a specific user (all their devices)
export const broadcastMiningUpdate = async (userId) => {
  try {
    // Clear cache to force fresh DB query (mining state changed)
    userMiningCache.delete(userId);
    
    const userSockets = userConnections.get(userId);
    if (userSockets && userSockets.size > 0) {
      const miningStatus = await getMiningStatusForUser(userId, true);
      
      // Broadcast to all devices of this user using room
      ioInstance.to(`user:${userId}`).emit('miningStatus', miningStatus);
      
      // Update tracking of users with active mining
      const hasActiveSessions = miningStatus.activeSessions?.some(session => 
        session.isActive && session.remainingHours > 0
      );
      
      if (hasActiveSessions) {
        usersWithActiveMining.add(userId);
      } else {
        usersWithActiveMining.delete(userId);
      }
    }
  } catch (error) {
    console.error('Error broadcasting mining update:', error);
  }
};

// Broadcast mining status update to all connected users (all devices)
export const broadcastMiningUpdateToAll = async () => {
  try {
    for (const [userId, userSockets] of userConnections) {
      if (userSockets && userSockets.size > 0) {
        const miningStatus = await getMiningStatusForUser(userId, false);
        // Broadcast to all devices of this user using room
        ioInstance.to(`user:${userId}`).emit('miningStatus', miningStatus);
      }
    }
  } catch (error) {
    console.error('Error broadcasting mining update to all:', error);
  }
};

// Broadcast notification to a specific user (all their devices)
export const broadcastNotification = (userId, notification) => {
  try {
    if (!ioInstance) {
      console.warn('WebSocket not initialized, cannot broadcast notification');
      return;
    }

    const userSockets = userConnections.get(userId.toString());
    if (userSockets && userSockets.size > 0) {
      // Broadcast to all devices of this user using room
      ioInstance.to(`user:${userId}`).emit('newNotification', notification);
      console.log(`📬 Notification sent to user ${userId} (${userSockets.size} device(s))`);
    }
  } catch (error) {
    console.error('Error broadcasting notification:', error);
  }
};

// Broadcast notification to multiple users (bulk)
export const broadcastNotificationBulk = (notifications) => {
  try {
    if (!ioInstance) {
      console.warn('WebSocket not initialized, cannot broadcast notifications');
      return;
    }

    notifications.forEach(notification => {
      const userId = notification.recipient.toString();
      const userSockets = userConnections.get(userId);
      if (userSockets && userSockets.size > 0) {
        ioInstance.to(`user:${userId}`).emit('newNotification', notification);
      }
    });

    console.log(`📬 Bulk notifications sent to ${notifications.length} user(s)`);
  } catch (error) {
    console.error('Error broadcasting bulk notifications:', error);
  }
};
