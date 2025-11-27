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

// Shared styles for consistency
const styles = {
  wrapperTable: 'width: 100%; background-color: #f3f4f6; padding: 20px 0;',
  containerTable: 'width: 600px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;',
  container: 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background-color: #ffffff; color: #333333;',
  header: 'text-align: center; padding: 40px 20px 20px;',
  content: 'padding: 0 20px 40px;',
  title: 'font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px;',
  text: 'font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;',
  button: 'display: block; width: 100%; text-align: center; padding: 16px 0; background-color: #7c3aed; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 30px 0;',
  footer: 'border-top: 1px solid #e5e7eb; padding: 30px 20px; text-align: center; color: #9ca3af; font-size: 12px; line-height: 1.5;',
  icon: 'width: 48px; height: 48px; margin-bottom: 20px; display: inline-block;',
  highlightBox: 'background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;'
};

export const sendOTPEmail = async (toEmail, toName, otp, language = 'en') => {
  const t = getEmailTranslations(language);
  
  const emailBody = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapperTable}">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${styles.containerTable}">
            <tr>
              <td style="${styles.container}">
                <div style="${styles.header}">
                  <img src="https://cdn-icons-png.flaticon.com/512/2716/2716205.png" alt="Security" style="${styles.icon}" />
                  <h1 style="${styles.title}">${t.otp.title}</h1>
                </div>

                <div style="${styles.content}">
                  <p style="${styles.text}">${t.otp.message}</p>

                  <div style="${styles.highlightBox}">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">${t.otp.otpLabel}</div>
                    <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #7c3aed;">${otp}</div>
                  </div>

                  <p style="${styles.text}; font-size: 14px; color: #6b7280;">${t.otp.validity}</p>
                </div>

                <div style="${styles.footer}">
                  <p style="margin: 0 0 10px;">${t.otp.footer}</p>
                  <p style="margin: 0;">${t.common.copyright}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return await sendEmail(toEmail, toName, t.otp.subject, emailBody);
};

export const sendWelcomeEmail = async (toEmail, toName, dashboardUrl, language = 'en') => {
  const t = getEmailTranslations(language);
  const gettingStartedItems = t.welcome.gettingStartedItems.map(item => 
    `<li style="margin-bottom: 10px; padding-left: 5px;">${item}</li>`
  ).join('');
  
  const emailBody = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapperTable}">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${styles.containerTable}">
            <tr>
              <td style="${styles.container}">
                <div style="${styles.header}">
                  <img src="https://cdn-icons-png.flaticon.com/512/3159/3159066.png" alt="Welcome" style="${styles.icon}" />
                  <h1 style="${styles.title}">${t.welcome.title}</h1>
                </div>

                <div style="${styles.content}">
                  <p style="${styles.text}">${t.welcome.greeting.replace('{{name}}', toName)}</p>
                  <p style="${styles.text}">${t.welcome.message}</p>

                  <a href="${dashboardUrl}" style="${styles.button}">${t.welcome.ctaButton}</a>

                  <div style="margin-top: 30px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 15px;">${t.welcome.gettingStarted}</h3>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.6; padding-left: 20px; margin: 0;">
                      ${gettingStartedItems}
                    </ul>
                  </div>
                  
                  <p style="${styles.text}; margin-top: 30px; font-size: 14px; color: #6b7280;">${t.welcome.helpText}</p>
                </div>

                <div style="${styles.footer}">
                  <p style="margin: 0;">${t.common.copyright}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return await sendEmail(toEmail, toName, t.welcome.subject, emailBody);
};

export const sendMinerStoppedEmail = async (toEmail, toName, sessionsData, dashboardUrl, language = 'en') => {
  const t = getEmailTranslations(language);
  const totalTokens = sessionsData.reduce((sum, s) => sum + s.tokensEarned, 0);
  const totalHours = sessionsData.reduce((sum, s) => sum + s.durationHours, 0);

  const sessionRows = sessionsData.map(session => `
    <tr style="border-bottom: 1px solid #f3f4f6;">
      <td style="padding: 16px 8px; color: #111827; font-weight: 500;">${session.collegeName}</td>
      <td style="padding: 16px 8px; color: #10b981; font-weight: 600; text-align: right;">+${session.tokensEarned.toFixed(2)}</td>
    </tr>
  `).join('');

  const emailBody = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapperTable}">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${styles.containerTable}">
            <tr>
              <td style="${styles.container}">
                <div style="${styles.header}">
                  <img src="https://cdn-icons-png.flaticon.com/512/2933/2933116.png" alt="Mining Complete" style="${styles.icon}" />
                  <h1 style="${styles.title}">${t.minerStopped.title}</h1>
                </div>

                <div style="${styles.content}">
                  <p style="${styles.text}">${t.minerStopped.greeting.replace('{{name}}', toName)}</p>
                  
                  <div style="${styles.highlightBox}">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${t.minerStopped.totalTokensLabel}</div>
                    <div style="font-size: 42px; font-weight: 700; color: #10b981;">${totalTokens.toFixed(2)}</div>
                    <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">in ${totalHours.toFixed(1)} hours</div>
                  </div>

                  <a href="${dashboardUrl}" style="${styles.button}">${t.minerStopped.ctaButton}</a>

                  <div style="margin-top: 30px;">
                     <table style="width: 100%; border-collapse: collapse;">
                       <thead>
                         <tr style="border-bottom: 2px solid #f3f4f6;">
                           <th style="padding: 10px 8px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">${t.minerStopped.tableHeaders.college}</th>
                           <th style="padding: 10px 8px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">${t.minerStopped.tableHeaders.earned}</th>
                         </tr>
                       </thead>
                       <tbody>
                         ${sessionRows}
                       </tbody>
                     </table>
                  </div>

                  <p style="${styles.text}; margin-top: 30px; text-align: center;">${t.minerStopped.encouragement}</p>
                </div>

                <div style="${styles.footer}">
                  <p style="margin: 0;">${t.common.copyright}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return await sendEmail(toEmail, toName, t.minerStopped.subject, emailBody);
};

export const sendInactivityReminderEmail = async (toEmail, toName, inactiveDuration, dashboardUrl, language = 'en') => {
  const t = getEmailTranslations(language);
  const durationText = getDurationText(inactiveDuration, language);
  const encouragementText = t.inactivityReminder.encouragement[inactiveDuration] || t.inactivityReminder.encouragement.default;
  
  const reasonsList = t.inactivityReminder.reasons.map(reason => 
    `<li style="margin-bottom: 10px; padding-left: 5px;">${reason}</li>`
  ).join('');

  const emailBody = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapperTable}">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${styles.containerTable}">
            <tr>
              <td style="${styles.container}">
                <div style="${styles.header}">
                  <img src="https://cdn-icons-png.flaticon.com/512/2972/2972531.png" alt="Miss You" style="${styles.icon}" />
                  <h1 style="${styles.title}">${t.inactivityReminder.title.replace('{{name}}', toName)}</h1>
                </div>

                <div style="${styles.content}">
                  <p style="${styles.text}">${encouragementText}</p>

                  <div style="${styles.highlightBox}; background-color: #fff1f2; border-color: #fecdd3;">
                    <div style="font-size: 18px; font-weight: 600; color: #be123c; margin-bottom: 5px;">${t.inactivityReminder.noActiveMiners}</div>
                    <div style="font-size: 14px; color: #9f1239;">${t.inactivityReminder.inactiveFor.replace('{{duration}}', durationText)}</div>
                  </div>

                  <a href="${dashboardUrl}" style="${styles.button}">${t.inactivityReminder.ctaButton}</a>

                  <div style="margin-top: 30px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 15px;">${t.inactivityReminder.whyStartMining}</h3>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.6; padding-left: 20px; margin: 0;">
                      ${reasonsList}
                    </ul>
                  </div>
                </div>

                <div style="${styles.footer}">
                  <p style="margin: 0;">${t.common.copyright}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return await sendEmail(toEmail, toName, t.inactivityReminder.subject.replace('{{duration}}', durationText), emailBody);
};

export const sendCollegeAdminRemovedEmail = async (toEmail, toName, collegeName, language = 'en') => {
  const t = getEmailTranslations(language);
  
  const emailBody = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapperTable}">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${styles.containerTable}">
            <tr>
              <td style="${styles.container}">
                <div style="${styles.header}">
                  <img src="https://cdn-icons-png.flaticon.com/512/1000/1000997.png" alt="Admin Update" style="${styles.icon}" />
                  <h1 style="${styles.title}">${t.collegeAdminRemoved.title}</h1>
                </div>

                <div style="${styles.content}">
                  <p style="${styles.text}">${t.collegeAdminRemoved.greeting.replace('{{name}}', toName)}</p>
                  <p style="${styles.text}">${t.collegeAdminRemoved.message.replace('{{collegeName}}', collegeName)}</p>
                  
                  <div style="${styles.highlightBox}; background-color: #fff7ed; border-color: #ffedd5;">
                    <p style="${styles.text}; margin: 0; color: #9a3412;">${t.collegeAdminRemoved.reason}</p>
                  </div>

                  <a href="mailto:${t.collegeAdminRemoved.supportEmail}" style="${styles.button}">${t.collegeAdminRemoved.ctaButton}</a>
                </div>

                <div style="${styles.footer}">
                  <p style="margin: 0;">${t.common.copyright}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return await sendEmail(toEmail, toName, t.collegeAdminRemoved.subject, emailBody);
};
