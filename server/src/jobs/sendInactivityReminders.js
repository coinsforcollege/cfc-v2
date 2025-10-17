import MiningSession from '../models/Mining.js';
import User from '../models/User.js';
import EmailLog from '../models/EmailLog.js';
import { sendInactivityReminderEmail } from '../utils/emailService.js';

export const sendInactivityReminders = async () => {
  const now = new Date();

  try {
    console.log(`[Inactivity Reminders] Starting job at ${now.toISOString()}`);

    // Find all students
    const students = await User.find({
      role: 'student',
      isActive: true
    }).select('_id name email');

    if (students.length === 0) {
      console.log('[Inactivity Reminders] No students found');
      return { sent: 0 };
    }

    console.log(`[Inactivity Reminders] Checking ${students.length} students`);

    let emailsSent = 0;
    let emailsFailed = 0;
    let skippedCount = 0;

    for (const student of students) {
      try {
        // Check if student has any active mining sessions
        const activeSessions = await MiningSession.find({
          student: student._id,
          isActive: true,
          endTime: { $gt: now }
        });

        // If student has active sessions, skip
        if (activeSessions.length > 0) {
          continue;
        }

        // Find the most recent mining session (active or inactive)
        const lastSession = await MiningSession.findOne({
          student: student._id
        }).sort({ endTime: -1 });

        // If no session found at all, this student never mined, skip
        if (!lastSession) {
          continue;
        }

        // Calculate time since last session ended
        const timeSinceLastSession = now - lastSession.endTime;
        const hoursSinceLastSession = timeSinceLastSession / (1000 * 60 * 60);
        const daysSinceLastSession = hoursSinceLastSession / 24;

        // Determine which email to send based on inactivity duration
        let emailType = null;
        let duration = null;

        if (hoursSinceLastSession >= 12 && hoursSinceLastSession < 24) {
          // 12 hours inactive
          emailType = 'inactivity_12h';
          duration = '12h';
        } else if (daysSinceLastSession >= 3 && daysSinceLastSession < 4) {
          // 3 days inactive
          emailType = 'inactivity_3d';
          duration = '3d';
        } else if (daysSinceLastSession >= 7 && daysSinceLastSession < 8) {
          // 1 week inactive
          emailType = 'inactivity_1w';
          duration = '1w';
        } else if (daysSinceLastSession >= 14) {
          // Check if it's been 7 days since last weekly reminder
          const lastWeeklyEmail = await EmailLog.findOne({
            recipient: student._id,
            emailType: 'inactivity_weekly',
            status: 'sent'
          }).sort({ sentAt: -1 });

          if (lastWeeklyEmail) {
            const daysSinceLastEmail = (now - lastWeeklyEmail.sentAt) / (1000 * 60 * 60 * 24);
            if (daysSinceLastEmail >= 7) {
              // Send weekly reminder
              emailType = 'inactivity_weekly';
              duration = 'weekly';
            }
          } else {
            // First weekly reminder (2 weeks+ inactive)
            emailType = 'inactivity_weekly';
            duration = 'weekly';
          }
        }

        // If no email type determined, skip this student
        if (!emailType || !duration) {
          continue;
        }

        // Check if we already sent this specific type of email
        const alreadySent = await EmailLog.wasRecentlySent(student._id, emailType, 24);
        if (alreadySent) {
          skippedCount++;
          continue;
        }

        // Create dashboard URL
        const dashboardUrl = `${process.env.CLIENT_URL}/student/dashboard`;

        // Log email attempt
        const emailLog = await EmailLog.logEmail(
          student._id,
          student.email,
          emailType,
          {
            dashboardUrl,
            inactiveDuration: duration,
            daysSinceLastSession: daysSinceLastSession.toFixed(1)
          }
        );

        // Send email
        const result = await sendInactivityReminderEmail(
          student.email,
          student.name,
          duration,
          dashboardUrl
        );

        if (result.success) {
          await emailLog.markAsSent();
          emailsSent++;
          console.log(`[Inactivity Reminders] Sent ${duration} reminder to ${student.email} (inactive ${daysSinceLastSession.toFixed(1)} days)`);
        } else {
          await emailLog.markAsFailed(result.error);
          emailsFailed++;
          console.error(`[Inactivity Reminders] Failed to send to ${student.email}:`, result.error);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`[Inactivity Reminders] Error processing student ${student._id}:`, error.message);
      }
    }

    console.log(`[Inactivity Reminders] Completed - Sent: ${emailsSent}, Failed: ${emailsFailed}, Skipped: ${skippedCount}`);

    return {
      sent: emailsSent,
      failed: emailsFailed,
      skipped: skippedCount,
      total: students.length
    };
  } catch (error) {
    console.error('[Inactivity Reminders] Fatal error:', error);
    throw error;
  }
};
