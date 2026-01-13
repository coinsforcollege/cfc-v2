import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import AmbassadorApplication from '../src/models/AmbassadorApplication.js';
import Wallet from '../src/models/Wallet.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const email = 'abc@gmail.com';
    console.log(`🔍 Searching for user: ${email}...`);

    const user = await User.findOne({ email });

    if (user) {
      console.log('✅ User Found:');
      console.log(`- ID: ${user._id}`);
      console.log(`- Name: ${user.name}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Created At: ${user.createdAt}`);
      console.log(`- Updated At: ${user.updatedAt}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Is Active: ${user.isActive}`);
      
      // Check Ambassador Application
      const app = await AmbassadorApplication.findOne({ user: user._id });
      if (app) {
        console.log(`\n📋 Ambassador Application Found:`);
        console.log(`- Status: ${app.status}`);
        console.log(`- College ID: ${app.college}`);
        console.log(`- Submitted At: ${app.submittedAt}`);
      } else {
        console.log(`\n❌ No Ambassador Application found.`);
      }

      // Check Wallets
      const wallets = await Wallet.find({ user: user._id });
      console.log(`\n💰 Wallets Found: ${wallets.length}`);
      wallets.forEach(w => console.log(`- College: ${w.college}, Balance: ${w.balance}`));

    } else {
      console.log('❌ User not found.');
    }

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

checkUser();
