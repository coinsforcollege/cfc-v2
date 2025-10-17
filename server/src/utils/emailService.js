import axios from 'axios';

console.log('📧 EmailService loading, env check:', {
  ZEPTOMAIL_API_KEY: !!process.env.ZEPTOMAIL_API_KEY,
  keyLength: process.env.ZEPTOMAIL_API_KEY?.length
});

const ZEPTOMAIL_API_URL = process.env.ZEPTOMAIL_API_URL || 'https://api.zeptomail.com/v1.1/email';
const ZEPTOMAIL_API_KEY = process.env.ZEPTOMAIL_API_KEY;
const FROM_EMAIL = process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@coinsforcollege.org';
const FROM_NAME = process.env.ZEPTOMAIL_FROM_NAME || 'Coins For College';

const sendEmail = async (toEmail, toName, subject, htmlBody) => {
  try {
    const response = await axios.post(
      ZEPTOMAIL_API_URL,
      {
        from: {
          address: FROM_EMAIL,
          name: FROM_NAME
        },
        to: [
          {
            email_address: {
              address: toEmail,
              name: toName
            }
          }
        ],
        subject,
        htmlbody: htmlBody
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Zoho-enczapikey ${ZEPTOMAIL_API_KEY}`
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Email sending error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const sendOTPEmail = async (toEmail, toName, otp) => {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">Coins For College</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">Email Verification</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:
        </p>

        <div style="background: white; border: 2px dashed #8b5cf6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">Your OTP Code</p>
          <h1 style="color: #8b5cf6; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
        </div>

        <p style="color: #718096; font-size: 14px; line-height: 1.6;">
          This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
        </p>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p>If you didn't request this verification, please ignore this email.</p>
        <p style="margin-top: 20px;">
          &copy; 2025 Coins For College. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, 'Verify Your Email - Coins For College', emailBody);
};

export const sendWelcomeEmail = async (toEmail, toName, dashboardUrl) => {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">Coins For College</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">Welcome to Coins For College!</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          Hi ${toName},
        </p>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          Congratulations on joining Coins For College! You're now part of a community helping students mine tokens for their favorite colleges.
        </p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3748; margin-top: 0; font-size: 18px;">Getting Started:</h3>
          <ul style="color: #718096; font-size: 14px; line-height: 1.8; padding-left: 20px;">
            <li>Add colleges to your mining list</li>
            <li>Start mining to earn tokens</li>
            <li>Share your referral code to earn bonuses</li>
            <li>Track your progress on your dashboard</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Go to Dashboard
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; line-height: 1.6;">
          Need help? Visit our help center or contact support anytime.
        </p>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p style="margin-top: 20px;">
          &copy; 2025 Coins For College. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, 'Welcome to Coins For College!', emailBody);
};

export const sendMinerStoppedEmail = async (toEmail, toName, sessionsData, dashboardUrl) => {
  const totalTokens = sessionsData.reduce((sum, s) => sum + s.tokensEarned, 0);
  const totalHours = sessionsData.reduce((sum, s) => sum + s.durationHours, 0);

  const sessionRows = sessionsData.map(session => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; color: #2d3748;">${session.collegeName}</td>
      <td style="padding: 12px; color: #10b981; font-weight: bold; text-align: center;">${session.tokensEarned.toFixed(2)}</td>
      <td style="padding: 12px; color: #718096; text-align: center;">${session.balance.toFixed(2)}</td>
      <td style="padding: 12px; color: #718096; text-align: center;">${session.durationHours.toFixed(1)}h</td>
    </tr>
  `).join('');

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">Coins For College</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">Mining Session Complete!</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          Hi ${toName},
        </p>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          Your 24-hour mining session has ended. Here's what you accomplished:
        </p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 5px 0;">Total Tokens Earned</p>
          <h1 style="color: #10b981; font-size: 42px; margin: 0; font-weight: bold;">${totalTokens.toFixed(2)}</h1>
          <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">in ${totalHours.toFixed(1)} hours</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);">
              <th style="padding: 12px; text-align: left; color: #2d3748; font-weight: 600;">College</th>
              <th style="padding: 12px; text-align: center; color: #2d3748; font-weight: 600;">Earned</th>
              <th style="padding: 12px; text-align: center; color: #2d3748; font-weight: 600;">Balance</th>
              <th style="padding: 12px; text-align: center; color: #2d3748; font-weight: 600;">Time</th>
            </tr>
          </thead>
          <tbody>
            ${sessionRows}
          </tbody>
        </table>

        <p style="color: #718096; font-size: 16px; line-height: 1.6; margin-top: 25px;">
          Ready to keep earning? Start a new mining session now!
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Start Mining Again
          </a>
        </div>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p style="margin-top: 20px;">
          &copy; 2025 Coins For College. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, 'Your Mining Session is Complete!', emailBody);
};

export const sendInactivityReminderEmail = async (toEmail, toName, inactiveDuration, dashboardUrl) => {
  let durationText = '';
  let encouragementText = '';

  if (inactiveDuration === '12h') {
    durationText = '12 hours';
    encouragementText = 'Your miners have been inactive for 12 hours. Don\'t miss out on earning tokens!';
  } else if (inactiveDuration === '3d') {
    durationText = '3 days';
    encouragementText = 'It\'s been 3 days since you last mined. Your colleges are waiting for you!';
  } else if (inactiveDuration === '1w') {
    durationText = '1 week';
    encouragementText = 'We miss you! It\'s been a week since your last mining session.';
  } else {
    durationText = 'a while';
    encouragementText = 'Come back and keep earning tokens for your favorite colleges!';
  }

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">Coins For College</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">We Miss You, ${toName}!</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${encouragementText}
        </p>

        <div style="background: white; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">⏰</div>
          <p style="color: #2d3748; font-size: 18px; margin: 0; font-weight: 600;">No Active Miners</p>
          <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">Inactive for ${durationText}</p>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3748; margin-top: 0; font-size: 16px;">Why Start Mining Again?</h3>
          <ul style="color: #718096; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 10px 0 0 0;">
            <li>Earn tokens for your favorite colleges</li>
            <li>Build your balance continuously</li>
            <li>Support your college community</li>
            <li>Climb the leaderboards</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Start Mining Now
          </a>
        </div>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p style="margin-top: 20px;">
          &copy; 2025 Coins For College. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, `Time to Start Mining Again! (Inactive ${durationText})`, emailBody);
};
