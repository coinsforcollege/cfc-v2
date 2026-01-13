import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAdminXyzPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("🔍 Investigating PASSWORD for 'xyz@gmail.com'...");
    
    // We need to specifically select the password field because it's 'select: false' in the schema
    const user = await User.findOne({ email: 'xyz@gmail.com' }).select('+password');
    
    if (user) {
      console.log('✅ User Found.');
      console.log(`- Role: ${user.role}`);
      if (user.password) {
          console.log(`- Password hash exists (length ${user.password.length})`);
          console.log(`- Hash start: ${user.password.substring(0, 10)}... (appears valid bcrypt)`);
      } else {
          console.log(`❌ NO PASSWORD SET! (This confirms manual DB entry without validation)`);
      }
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

checkAdminXyzPassword();
