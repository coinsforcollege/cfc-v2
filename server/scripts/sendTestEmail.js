import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env FIRST
dotenv.config({ path: path.join(__dirname, '../.env') });

const sendTestEmail = async () => {
  try {
    // Dynamically import emailService AFTER env is loaded
    const { sendOTPEmail } = await import('../src/utils/emailService.js');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const testOTP = '123456';
    const result = await sendOTPEmail(
      'eyeclik@gmail.com',
      'Test User',
      testOTP,
      'en'
    );

    if (result.success) {
      console.log('✅ Email sent successfully to eyeclik@gmail.com');
    } else {
      console.error('❌ Failed to send email:', result.error);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

sendTestEmail();

