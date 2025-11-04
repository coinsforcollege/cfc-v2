import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import EmailLog from '../models/EmailLog.js';
import { sendMinerStoppedEmail } from '../utils/emailService.js';

export const sendMinerStoppedEmails = async () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    console.log(`[Miner Stopped Emails] Starting job at ${now.toISOString()}`);

    // Find sessions that were stopped in the last hour
    // We check sessions that ended between 1 hour ago and now, and are inactive
    const recentlyStoppedSessions = await MiningSession.find({
      isActive: false,
      endTime: {
        $gte: oneHourAgo,
        $lte: now
      },
      tokensEarned: { $gt: 0 }
    })
      .populate('user', 'name email')
      .populate('college', 'name')
      .sort({ user: 1, endTime: -1 });

    if (recentlyStoppedSessions.length === 0) {
      console.log('[Miner Stopped Emails] No recently stopped sessions found');
      return { sent: 0 };
    }

    console.log(`[Miner Stopped Emails] Found ${recentlyStoppedSessions.length} recently stopped sessions`);

    // Group sessions by user
    const sessionsByUser = {};
    for (const session of recentlyStoppedSessions) {
      const userId = session.user._id.toString();
      if (!sessionsByUser[userId]) {
        sessionsByUser[userId] = {
          user: session.user,
          sessions: []
        };
      }
      sessionsByUser[userId].sessions.push(session);
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    // Process each user
    for (const [userId, data] of Object.entries(sessionsByUser)) {
      try {
        // Check if we already sent this email recently (within 12 hours)
        const alreadySent = await EmailLog.wasRecentlySent(userId, 'miner_stopped', 12);
        if (alreadySent) {
          console.log(`[Miner Stopped Emails] Already sent to user ${userId} recently, skipping`);
          continue;
        }

        // Get wallet balances for each college
        const collegeIds = data.sessions.map(s => s.college._id);
        const wallets = await Wallet.find({
          user: userId,
          college: { $in: collegeIds }
        });

        // Create wallet map for quick lookup
        const walletMap = {};
        for (const wallet of wallets) {
          walletMap[wallet.college.toString()] = wallet.balance;
        }

        // Prepare session data for email
        const sessionsData = data.sessions.map(session => {
          const durationHours = (session.endTime - session.startTime) / (1000 * 60 * 60);
          return {
            collegeName: session.college.name,
            tokensEarned: session.tokensEarned,
            balance: walletMap[session.college._id.toString()] || 0,
            durationHours: durationHours
          };
        });

        // Create dashboard URL
        const dashboardUrl = `${process.env.CLIENT_URL}/user/dashboard`;

        // Log email attempt
        const emailLog = await EmailLog.logEmail(
          userId,
          data.user.email,
          'miner_stopped',
          {
            dashboardUrl,
            sessionsCount: sessionsData.length,
            totalTokens: sessionsData.reduce((sum, s) => sum + s.tokensEarned, 0)
          }
        );

        // Send email
        const result = await sendMinerStoppedEmail(
          data.user.email,
          data.user.name,
          sessionsData,
          dashboardUrl
        );

        if (result.success) {
          await emailLog.markAsSent();
          emailsSent++;
          console.log(`[Miner Stopped Emails] Sent to ${data.user.email} (${sessionsData.length} sessions)`);
        } else {
          await emailLog.markAsFailed(result.error);
          emailsFailed++;
          console.error(`[Miner Stopped Emails] Failed to send to ${data.user.email}:`, result.error);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`[Miner Stopped Emails] Error processing user ${userId}:`, error.message);
      }
    }

    console.log(`[Miner Stopped Emails] Completed - Sent: ${emailsSent}, Failed: ${emailsFailed}`);

    return {
      sent: emailsSent,
      failed: emailsFailed,
      total: Object.keys(sessionsByUser).length
    };
  } catch (error) {
    console.error('[Miner Stopped Emails] Fatal error:', error);
    throw error;
  }
};
