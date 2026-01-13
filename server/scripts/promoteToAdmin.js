import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const email = process.argv[2];
const role = process.argv[3] || 'platform_admin';

if (!email) {
  console.log('Usage: node scripts/promoteToAdmin.js <email> [role]');
  console.log('Roles: platform_admin (default), college_admin');
  process.exit(1);
}

const promoteToAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email ${email} not found.`);
      console.log('Please register a user via the application first.');
      await mongoose.connection.close();
      process.exit(1);
    }

    user.role = role;
    await user.save();

    console.log(`✅ User ${user.name} (${user.email}) promoted to ${role}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

promoteToAdmin();
