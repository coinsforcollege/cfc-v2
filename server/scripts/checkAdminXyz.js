import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAdminXyz = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("🔍 Investigating 'xyz@gmail.com'...");
    
    const user = await User.findOne({ email: 'xyz@gmail.com' });
    
    if (user) {
      console.log('✅ User Found:');
      console.log(`- ID: ${user._id}`);
      console.log(`- Created At: ${user.createdAt}`);
      console.log(`- Role: ${user.role}`);
      // Check if password hash looks "standard" or if we can infer anything (we won't crack it, just look at structure)
      console.log(`- Password Hash starts with: ${user.password ? user.password.substring(0, 10) : 'NO PASSWORD'}`);
    } else {
        console.log("❌ User 'xyz@gmail.com' not found.");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

checkAdminXyz();
