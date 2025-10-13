import axios from 'axios';

console.log('📧 EmailService loading, env check:', {
  ZEPTOMAIL_API_KEY: !!process.env.ZEPTOMAIL_API_KEY,
  keyLength: process.env.ZEPTOMAIL_API_KEY?.length
});

const ZEPTOMAIL_API_URL = process.env.ZEPTOMAIL_API_URL || 'https://api.zeptomail.com/v1.1/email';
const ZEPTOMAIL_API_KEY = process.env.ZEPTOMAIL_API_KEY;
const FROM_EMAIL = process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@coinsforcollege.org';
const FROM_NAME = process.env.ZEPTOMAIL_FROM_NAME || 'Coins For College';

export const sendOTPEmail = async (toEmail, toName, otp) => {
  try {
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
        subject: 'Verify Your Email - Coins For College',
        htmlbody: emailBody
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
