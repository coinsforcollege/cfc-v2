import twilio from 'twilio';

// Initialize Twilio client
let twilioClient = null;

if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
}

const sendSMS = async (options) => {
  if (!twilioClient) {
    console.log('Twilio not configured, SMS not sent:', options.message);
    return { success: false, message: 'SMS service not configured' };
  }

  try {
    const message = await twilioClient.messages.create({
      body: options.message,
      from: process.env.TWILIO_PHONE,
      to: options.phone
    });

    console.log('SMS sent:', message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    throw error;
  }
};

export default sendSMS;
