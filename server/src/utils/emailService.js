import axios from 'axios';
import { getEmailTranslations, getDurationText } from './emailTranslations.js';

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

export const sendOTPEmail = async (toEmail, toName, otp, language = 'en') => {
  const t = getEmailTranslations(language);
  
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">${t.common.brandName}</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">${t.otp.title}</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${t.otp.message}
        </p>

        <div style="background: white; border: 2px dashed #8b5cf6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">${t.otp.otpLabel}</p>
          <h1 style="color: #8b5cf6; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
        </div>

        <p style="color: #718096; font-size: 14px; line-height: 1.6;">
          ${t.otp.validity}
        </p>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p>${t.otp.footer}</p>
        <p style="margin-top: 20px;">
          ${t.common.copyright}
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, t.otp.subject, emailBody);
};

export const sendWelcomeEmail = async (toEmail, toName, dashboardUrl, language = 'en') => {
  const t = getEmailTranslations(language);
  
  const gettingStartedItems = t.welcome.gettingStartedItems.map(item => `<li>${item}</li>`).join('');
  
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">${t.common.brandName}</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">${t.welcome.title}</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${t.welcome.greeting.replace('{{name}}', toName)}
        </p>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${t.welcome.message}
        </p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3748; margin-top: 0; font-size: 18px;">${t.welcome.gettingStarted}</h3>
          <ul style="color: #718096; font-size: 14px; line-height: 1.8; padding-left: 20px;">
            ${gettingStartedItems}
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            ${t.welcome.ctaButton}
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; line-height: 1.6;">
          ${t.welcome.helpText}
        </p>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p style="margin-top: 20px;">
          ${t.common.copyright}
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, t.welcome.subject, emailBody);
};

export const sendMinerStoppedEmail = async (toEmail, toName, sessionsData, dashboardUrl, language = 'en') => {
  const t = getEmailTranslations(language);
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
        <h1 style="color: #8b5cf6; margin: 0;">${t.common.brandName}</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">${t.minerStopped.title}</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${t.minerStopped.greeting.replace('{{name}}', toName)}
        </p>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${t.minerStopped.message}
        </p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 5px 0;">${t.minerStopped.totalTokensLabel}</p>
          <h1 style="color: #10b981; font-size: 42px; margin: 0; font-weight: bold;">${totalTokens.toFixed(2)}</h1>
          <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">in ${totalHours.toFixed(1)} hours</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);">
              <th style="padding: 12px; text-align: left; color: #2d3748; font-weight: 600;">${t.minerStopped.tableHeaders.college}</th>
              <th style="padding: 12px; text-align: center; color: #2d3748; font-weight: 600;">${t.minerStopped.tableHeaders.earned}</th>
              <th style="padding: 12px; text-align: center; color: #2d3748; font-weight: 600;">${t.minerStopped.tableHeaders.balance}</th>
              <th style="padding: 12px; text-align: center; color: #2d3748; font-weight: 600;">${t.minerStopped.tableHeaders.time}</th>
            </tr>
          </thead>
          <tbody>
            ${sessionRows}
          </tbody>
        </table>

        <p style="color: #718096; font-size: 16px; line-height: 1.6; margin-top: 25px;">
          ${t.minerStopped.encouragement}
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            ${t.minerStopped.ctaButton}
          </a>
        </div>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p style="margin-top: 20px;">
          ${t.common.copyright}
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, t.minerStopped.subject, emailBody);
};

export const sendInactivityReminderEmail = async (toEmail, toName, inactiveDuration, dashboardUrl, language = 'en') => {
  const t = getEmailTranslations(language);
  const durationText = getDurationText(inactiveDuration, language);
  const encouragementText = t.inactivityReminder.encouragement[inactiveDuration] || t.inactivityReminder.encouragement.default;
  
  const reasonsList = t.inactivityReminder.reasons.map(reason => `<li>${reason}</li>`).join('');

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b5cf6; margin: 0;">${t.common.brandName}</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-radius: 10px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin-top: 0;">${t.inactivityReminder.title.replace('{{name}}', toName)}</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          ${encouragementText}
        </p>

        <div style="background: white; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">⏰</div>
          <p style="color: #2d3748; font-size: 18px; margin: 0; font-weight: 600;">${t.inactivityReminder.noActiveMiners}</p>
          <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">${t.inactivityReminder.inactiveFor.replace('{{duration}}', durationText)}</p>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3748; margin-top: 0; font-size: 16px;">${t.inactivityReminder.whyStartMining}</h3>
          <ul style="color: #718096; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 10px 0 0 0;">
            ${reasonsList}
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            ${t.inactivityReminder.ctaButton}
          </a>
        </div>
      </div>

      <div style="text-align: center; color: #a0aec0; font-size: 12px;">
        <p style="margin-top: 20px;">
          ${t.common.copyright}
        </p>
      </div>
    </div>
  `;

  return await sendEmail(toEmail, toName, t.inactivityReminder.subject.replace('{{duration}}', durationText), emailBody);
};
