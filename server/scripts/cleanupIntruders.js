import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import AmbassadorApplication from '../src/models/AmbassadorApplication.js';
import Wallet from '../src/models/Wallet.js';
import MiningSession from '../src/models/Mining.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanupIntruders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const intruderEmails = ['xyz@gmail.com', 'abc@gmail.com', 'abcd@gmail.com'];
    
    // Find users first to get IDs
    const users = await User.find({ email: { $in: intruderEmails } });
    const userIds = users.map(u => u._id);
    
    if (userIds.length === 0) {
        console.log('Action not needed: No intruder accounts found.');
        process.exit(0);
    }
    
    console.log(`\n🚨 Found ${users.length} intruder accounts. Starting cleanup...`);

    // 1. Delete Ambassador Applications
    const deletedApps = await AmbassadorApplication.deleteMany({ 
        $or: [
            { user: { $in: userIds } },        // Applications BY them
            { reviewedBy: { $in: userIds } }   // Applications REVIEWED BY them
        ]
    });
    console.log(`- Deleted ${deletedApps.deletedCount} Ambassador Applications`);

    // 2. Delete Wallets
    const deletedWallets = await Wallet.deleteMany({ user: { $in: userIds } });
    console.log(`- Deleted ${deletedWallets.deletedCount} Wallets`);
    
    // 3. Delete Mining Sessions
    const deletedSessions = await MiningSession.deleteMany({ user: { $in: userIds } });
    console.log(`- Deleted ${deletedSessions.deletedCount} Mining Sessions`);

    // 4. Delete the Users
    const deletedUsers = await User.deleteMany({ _id: { $in: userIds } });
    console.log(`- Deleted ${deletedUsers.deletedCount} Users`);
    
    console.log('\n✅ Cleanup Complete.');

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

cleanupIntruders();
