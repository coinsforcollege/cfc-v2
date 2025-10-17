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
      .populate('student', 'name email')
      .populate('college', 'name')
      .sort({ student: 1, endTime: -1 });

    if (recentlyStoppedSessions.length === 0) {
      console.log('[Miner Stopped Emails] No recently stopped sessions found');
      return { sent: 0 };
    }

    console.log(`[Miner Stopped Emails] Found ${recentlyStoppedSessions.length} recently stopped sessions`);

    // Group sessions by student
    const sessionsByStudent = {};
    for (const session of recentlyStoppedSessions) {
      const studentId = session.student._id.toString();
      if (!sessionsByStudent[studentId]) {
        sessionsByStudent[studentId] = {
          student: session.student,
          sessions: []
        };
      }
      sessionsByStudent[studentId].sessions.push(session);
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    // Process each student
    for (const [studentId, data] of Object.entries(sessionsByStudent)) {
      try {
        // Check if we already sent this email recently (within 12 hours)
        const alreadySent = await EmailLog.wasRecentlySent(studentId, 'miner_stopped', 12);
        if (alreadySent) {
          console.log(`[Miner Stopped Emails] Already sent to student ${studentId} recently, skipping`);
          continue;
        }

        // Get wallet balances for each college
        const collegeIds = data.sessions.map(s => s.college._id);
        const wallets = await Wallet.find({
          student: studentId,
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
        const dashboardUrl = `${process.env.CLIENT_URL}/student/dashboard`;

        // Log email attempt
        const emailLog = await EmailLog.logEmail(
          studentId,
          data.student.email,
          'miner_stopped',
          {
            dashboardUrl,
            sessionsCount: sessionsData.length,
            totalTokens: sessionsData.reduce((sum, s) => sum + s.tokensEarned, 0)
          }
        );

        // Send email
        const result = await sendMinerStoppedEmail(
          data.student.email,
          data.student.name,
          sessionsData,
          dashboardUrl
        );

        if (result.success) {
          await emailLog.markAsSent();
          emailsSent++;
          console.log(`[Miner Stopped Emails] Sent to ${data.student.email} (${sessionsData.length} sessions)`);
        } else {
          await emailLog.markAsFailed(result.error);
          emailsFailed++;
          console.error(`[Miner Stopped Emails] Failed to send to ${data.student.email}:`, result.error);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`[Miner Stopped Emails] Error processing student ${studentId}:`, error.message);
      }
    }

    console.log(`[Miner Stopped Emails] Completed - Sent: ${emailsSent}, Failed: ${emailsFailed}`);

    return {
      sent: emailsSent,
      failed: emailsFailed,
      total: Object.keys(sessionsByStudent).length
    };
  } catch (error) {
    console.error('[Miner Stopped Emails] Fatal error:', error);
    throw error;
  }
};
