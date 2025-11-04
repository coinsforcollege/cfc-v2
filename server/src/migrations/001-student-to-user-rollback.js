/**
 * Rollback Script: User to Student Terminology
 *
 * This script rolls back the migration from "user" to "student" terminology.
 * Use only if the main migration needs to be reverted.
 *
 * IMPORTANT: This should only be run if you need to rollback the migration!
 *
 * Usage:
 *   node src/migrations/001-student-to-user-rollback.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function runRollback() {
  try {
    console.log('🔄 Starting rollback: User → Student');
    console.log('📦 Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI);

    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // ===== STEP 1: Rollback Users Collection =====
    console.log('📝 Step 1: Rolling back users collection...');

    // Update role from 'user' to 'student'
    const roleUpdateResult = await db.collection('users').updateMany(
      { role: 'user' },
      { $set: { role: 'student' } }
    );
    console.log(`   ✓ Updated ${roleUpdateResult.modifiedCount} users with role 'user' → 'student'`);

    // Rename userProfile to studentProfile
    const profileRenameResult = await db.collection('users').updateMany(
      { userProfile: { $exists: true } },
      { $rename: { userProfile: 'studentProfile' } }
    );
    console.log(`   ✓ Renamed userProfile → studentProfile for ${profileRenameResult.modifiedCount} users`);

    // Rename referredUsers to referredStudents within miningColleges array
    const usersWithReferrals = await db.collection('users').find({
      'studentProfile.miningColleges': { $exists: true }
    }).toArray();

    let referralUpdateCount = 0;
    for (const user of usersWithReferrals) {
      if (user.studentProfile && user.studentProfile.miningColleges) {
        for (let i = 0; i < user.studentProfile.miningColleges.length; i++) {
          if (user.studentProfile.miningColleges[i].referredUsers) {
            await db.collection('users').updateOne(
              { _id: user._id },
              {
                $rename: {
                  [`studentProfile.miningColleges.${i}.referredUsers`]: `studentProfile.miningColleges.${i}.referredStudents`
                }
              }
            );
            referralUpdateCount++;
          }
        }
      }
    }
    console.log(`   ✓ Renamed referredUsers → referredStudents for ${referralUpdateCount} college entries\n`);

    // ===== STEP 2: Rollback MiningSession Collection =====
    console.log('📝 Step 2: Rolling back miningsessions collection...');

    // Drop indexes on 'user' field
    try {
      await db.collection('miningsessions').dropIndex('user_1_college_1_isActive_1');
      console.log('   ✓ Dropped index: user_1_college_1_isActive_1');
    } catch (e) {
      console.log('   ℹ Index user_1_college_1_isActive_1 not found');
    }

    try {
      await db.collection('miningsessions').dropIndex('user_1_isActive_1_endTime_1');
      console.log('   ✓ Dropped index: user_1_isActive_1_endTime_1');
    } catch (e) {
      console.log('   ℹ Index user_1_isActive_1_endTime_1 not found');
    }

    // Rename user field to student
    const miningSessionResult = await db.collection('miningsessions').updateMany(
      { user: { $exists: true } },
      { $rename: { user: 'student' } }
    );
    console.log(`   ✓ Renamed user → student for ${miningSessionResult.modifiedCount} mining sessions`);

    // Create indexes on 'student' field
    await db.collection('miningsessions').createIndex({ student: 1, college: 1, isActive: 1 });
    console.log('   ✓ Created index: student_1_college_1_isActive_1');

    await db.collection('miningsessions').createIndex({ student: 1, isActive: 1, endTime: 1 });
    console.log('   ✓ Created index: student_1_isActive_1_endTime_1\n');

    // ===== STEP 3: Rollback Wallets Collection =====
    console.log('📝 Step 3: Rolling back wallets collection...');

    // Drop unique index on user + college
    try {
      await db.collection('wallets').dropIndex('user_1_college_1');
      console.log('   ✓ Dropped unique index: user_1_college_1');
    } catch (e) {
      console.log('   ℹ Index user_1_college_1 not found');
    }

    // Rename user field to student
    const walletResult = await db.collection('wallets').updateMany(
      { user: { $exists: true } },
      { $rename: { user: 'student' } }
    );
    console.log(`   ✓ Renamed user → student for ${walletResult.modifiedCount} wallets`);

    // Create unique index on student + college
    await db.collection('wallets').createIndex({ student: 1, college: 1 }, { unique: true });
    console.log('   ✓ Created unique index: student_1_college_1\n');

    // ===== STEP 4: Rollback Notifications Collection =====
    console.log('📝 Step 4: Rolling back notifications collection...');

    const notificationResult = await db.collection('notifications').updateMany(
      { 'recipientRole': 'user' },
      { $set: { recipientRole: 'student' } }
    );
    console.log(`   ✓ Updated ${notificationResult.modifiedCount} notifications with recipientRole 'user' → 'student'\n`);

    // ===== STEP 5: Summary =====
    console.log('✅ Rollback completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users role updated: ${roleUpdateResult.modifiedCount}`);
    console.log(`   - User profiles renamed: ${profileRenameResult.modifiedCount}`);
    console.log(`   - Referral arrays renamed: ${referralUpdateCount}`);
    console.log(`   - Mining sessions updated: ${miningSessionResult.modifiedCount}`);
    console.log(`   - Wallets updated: ${walletResult.modifiedCount}`);
    console.log(`   - Notifications updated: ${notificationResult.modifiedCount}`);
    console.log('\n⚠️  IMPORTANT: All existing JWT tokens are now invalid. Users must re-login.\n');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Disconnected from MongoDB');
  }
}

// Execute rollback
runRollback();
