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

        // Update wallet - credit tokens
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

        // Mark session as inactive and set tokens earned
        session.isActive = false;
        session.tokensEarned = tokensEarned;
        await session.save();

        // Update college stats - decrement active miners
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
