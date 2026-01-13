import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import EmailLog from '../src/models/EmailLog.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkEmailLog = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the user first to get ID
    const user = await User.findOne({ email: 'abcd@gmail.com' });
    if (!user) {
        console.log("User not found (weird, we just saw them).");
        process.exit(1);
    }
    
    console.log(`Checking logs for User ID: ${user._id}`);
    
    const logs = await EmailLog.find({ recipientEmail: 'abcd@gmail.com' });
    
    if (logs.length === 0) {
        console.log("❌ No EmailLogs found for this user.");
        console.log("-> Conclusion: This user was likely created MANUALLY in the database, skipping the API.");
    } else {
        console.log(`✅ Found ${logs.length} Email Logs:`);
        logs.forEach(log => {
            console.log(`- Type: ${log.emailType}, Status: ${log.status}, Date: ${log.createdAt}`);
        });
        console.log("-> Conclusion: Examples of failed emails might indicate API usage.");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

checkEmailLog();
