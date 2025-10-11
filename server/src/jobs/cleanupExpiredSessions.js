import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import College from '../models/College.js';

export const cleanupExpiredSessions = async () => {
  const now = new Date();

  try {
    console.log(`[Cleanup Job] Starting expired sessions cleanup at ${now.toISOString()}`);

    // Find all expired but still active sessions
    const expiredSessions = await MiningSession.find({
      isActive: true,
      endTime: { $lt: now }
    }).populate('college', 'name');

    if (expiredSessions.length === 0) {
      console.log('[Cleanup Job] No expired sessions to clean up');
      return { cleaned: 0 };
    }

    console.log(`[Cleanup Job] Found ${expiredSessions.length} expired sessions to clean up`);

    let successCount = 0;
    let errorCount = 0;

    // Process each expired session
    for (const session of expiredSessions) {
      try {
        // Calculate tokens earned
        const miningDuration = (session.endTime - session.startTime) / (1000 * 60 * 60); // in hours
        const tokensEarned = Math.max(0, miningDuration * session.earningRate);

        // Atomically mark session inactive - only if STILL active
        const updatedSession = await MiningSession.findOneAndUpdate(
          {
            _id: session._id,
            isActive: true
          },
          {
            $set: {
              isActive: false,
              tokensEarned: tokensEarned
            }
          },
          { new: false }
        );

        // If null, another process already stopped this session - skip wallet/stats updates
        if (!updatedSession) {
          continue;
        }

        // We successfully stopped the session - proceed with wallet and stats updates
        await Wallet.findOneAndUpdate(
          {
            student: session.student,
            college: session.college
          },
          {
            $inc: {
              balance: tokensEarned,
              totalMined: tokensEarned
            }
          },
          { upsert: true }
        );

        // Decrement activeMiners by 1 (we know this session was active)
        if (session.college) {
          await College.findByIdAndUpdate(session.college._id, {
            $inc: {
              'stats.activeMiners': -1,
              'stats.totalTokensMined': tokensEarned
            }
          });
        }

        successCount++;
        console.log(`[Cleanup Job] Cleaned session ${session._id} for college ${session.college?.name || session.college} - Tokens: ${tokensEarned.toFixed(4)}`);
      } catch (error) {
        errorCount++;
        console.error(`[Cleanup Job] Error cleaning session ${session._id}:`, error.message);
      }
    }

    console.log(`[Cleanup Job] Completed - Success: ${successCount}, Errors: ${errorCount}`);

    return {
      cleaned: successCount,
      errors: errorCount,
      total: expiredSessions.length
    };
  } catch (error) {
    console.error('[Cleanup Job] Fatal error during cleanup:', error);
    throw error;
  }
};
