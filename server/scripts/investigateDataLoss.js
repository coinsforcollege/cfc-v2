import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import Wallet from '../src/models/Wallet.js';
import College from '../src/models/College.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const investigate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    console.log('🔍 Scanning for users with potential data loss...\n');

    const users = await User.find({ role: 'user' });
    
    let suspiciousUsers = [];

    for (const user of users) {
      const wallets = await Wallet.find({ user: user._id });
      const miningColleges = user.userProfile?.miningColleges || [];
      
      // Check 1: User has wallets for colleges they are NOT mining anymore
      // This implies they mined it in the past (or currently), but it's not in their active list.
      // If the user says they "deleted" them, they might mean removed from list.
      // But if they "lost tokens", maybe the wallet is gone too? 
      // The user says "now 5 of them are deleted".
      
      const walletCollegeIds = wallets.map(w => w.college?.toString()).filter(Boolean);
      const miningCollegeIds = miningColleges.map(mc => mc.college?.toString()).filter(Boolean);
      
      // Find colleges in Wallet but NOT in MiningColleges
      const missingFromMining = walletCollegeIds.filter(id => !miningCollegeIds.includes(id));
      
      // Check 2: Null colleges in mining list (college hard deleted)
      const nullColleges = miningColleges.filter(mc => !mc.college);
      
      if (missingFromMining.length > 0 || nullColleges.length > 0) {
        suspiciousUsers.push({
          id: user._id,
          name: user.name,
          email: user.email,
          miningCount: miningColleges.length,
          walletCount: wallets.length,
          missingFromMiningCount: missingFromMining.length,
          nullCollegesCount: nullColleges.length,
          missingCollegeIds: missingFromMining
        });
      }
    }

    if (suspiciousUsers.length > 0) {
      console.log(`Found ${suspiciousUsers.length} suspicious users:`);
      suspiciousUsers.forEach(u => {
        console.log(`\nUser: ${u.name} (${u.email})`);
        console.log(`- Active Mining Colleges: ${u.miningCount}`);
        console.log(`- Wallets Found: ${u.walletCount}`);
        console.log(`- Wallets without active mining: ${u.missingFromMiningCount}`);
        console.log(`- Broken College Refs (null): ${u.nullCollegesCount}`);
        if(u.missingFromMiningCount > 0) {
             console.log(`- IDs of colleges in wallet but not in mining list: ${u.missingCollegeIds.join(', ')}`);
        }
      });
    } else {
      console.log('No obvious mismatches found (Wallets > MiningColleges or null refs).');
    }

    // Also check if any colleges were recently deleted? 
    // We can't easily check hard deletions logs unless we have them.
    // But we can check if the "missingCollegeIds" exist in the College collection.
    
    if (suspiciousUsers.length > 0) {
        console.log('\n🔍 Verifying existence of "missing" colleges...');
        const allMissingIds = suspiciousUsers.flatMap(u => u.missingCollegeIds);
        const uniqueMissingIds = [...new Set(allMissingIds)];
        
        const existingColleges = await College.find({ _id: { $in: uniqueMissingIds } });
        const existingIds = existingColleges.map(c => c._id.toString());
        
        const permanentlyDeletedIds = uniqueMissingIds.filter(id => !existingIds.includes(id));
        
        if (permanentlyDeletedIds.length > 0) {
            console.log('\n🚨 CRITICAL: Some colleges referenced in Wallets do not exist in the College collection (Hard Deleted):');
            permanentlyDeletedIds.forEach(id => console.log(`- ${id}`));
        } else {
            console.log('\n✅ All referenced colleges still exist in the database (User just removed them from list, or they were hidden).');
        }
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

investigate();
