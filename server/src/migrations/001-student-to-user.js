/**
 * Migration Script: Student to User Terminology
 *
 * This script migrates all "student" terminology to "user" terminology across the database:
 * - Changes role from 'student' to 'user' in users collection
 * - Renames studentProfile to userProfile
 * - Renames nested referredStudents to referredUsers
 * - Renames student field to user in miningsessions collection
 * - Renames student field to user in wallets collection
 * - Updates indexes
 *
 * IMPORTANT: Run this on a backup first! This is a one-way migration.
 *
 * Usage:
 *   node src/migrations/001-student-to-user.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('🚀 Starting migration: Student → User');
    console.log('📦 Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI);

    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // ===== STEP 1: Update Users Collection =====
    console.log('📝 Step 1: Updating users collection...');

    // Update role from 'student' to 'user'
    const roleUpdateResult = await db.collection('users').updateMany(
      { role: 'student' },
      { $set: { role: 'user' } }
    );
    console.log(`   ✓ Updated ${roleUpdateResult.modifiedCount} users with role 'student' → 'user'`);

    // Rename studentProfile to userProfile
    const profileRenameResult = await db.collection('users').updateMany(
      { studentProfile: { $exists: true } },
      { $rename: { studentProfile: 'userProfile' } }
    );
    console.log(`   ✓ Renamed studentProfile → userProfile for ${profileRenameResult.modifiedCount} users`);

    // Rename referredStudents to referredUsers within miningColleges array
    // MongoDB cannot use $rename on array elements, so we need to update the entire array
    const usersWithReferrals = await db.collection('users').find({
      'userProfile.miningColleges': { $exists: true }
    }).toArray();

    let referralUpdateCount = 0;
    for (const user of usersWithReferrals) {
      if (user.userProfile && user.userProfile.miningColleges) {
        let hasChanges = false;
        const updatedColleges = user.userProfile.miningColleges.map(college => {
          if (college.referredStudents) {
            hasChanges = true;
            // Rename referredStudents to referredUsers and also rename nested 'student' to 'user'
            const referredUsers = college.referredStudents.map(ref => ({
              user: ref.student,
              referredAt: ref.referredAt
            }));
            return {
              ...college,
              referredUsers,
              referredStudents: undefined // Remove old field
            };
          }
          return college;
        });

        if (hasChanges) {
          await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { 'userProfile.miningColleges': updatedColleges } }
          );
          referralUpdateCount++;
        }
      }
    }
    console.log(`   ✓ Renamed referredStudents → referredUsers for ${referralUpdateCount} users\n`);

    // ===== STEP 2: Update MiningSession Collection =====
    console.log('📝 Step 2: Updating miningsessions collection...');

    // Drop old indexes on 'student' field
    try {
      await db.collection('miningsessions').dropIndex('student_1_college_1_isActive_1');
      console.log('   ✓ Dropped index: student_1_college_1_isActive_1');
    } catch (e) {
      console.log('   ℹ Index student_1_college_1_isActive_1 not found (may not exist)');
    }

    try {
      await db.collection('miningsessions').dropIndex('student_1_isActive_1_endTime_1');
      console.log('   ✓ Dropped index: student_1_isActive_1_endTime_1');
    } catch (e) {
      console.log('   ℹ Index student_1_isActive_1_endTime_1 not found (may not exist)');
    }

    // Rename student field to user
    const miningSessionResult = await db.collection('miningsessions').updateMany(
      { student: { $exists: true } },
      { $rename: { student: 'user' } }
    );
    console.log(`   ✓ Renamed student → user for ${miningSessionResult.modifiedCount} mining sessions`);

    // Create new indexes on 'user' field
    await db.collection('miningsessions').createIndex({ user: 1, college: 1, isActive: 1 });
    console.log('   ✓ Created index: user_1_college_1_isActive_1');

    await db.collection('miningsessions').createIndex({ user: 1, isActive: 1, endTime: 1 });
    console.log('   ✓ Created index: user_1_isActive_1_endTime_1\n');

    // ===== STEP 3: Update Wallets Collection =====
    console.log('📝 Step 3: Updating wallets collection...');

    // Drop old unique index on student + college
    try {
      await db.collection('wallets').dropIndex('student_1_college_1');
      console.log('   ✓ Dropped unique index: student_1_college_1');
    } catch (e) {
      console.log('   ℹ Index student_1_college_1 not found (may not exist)');
    }

    // Rename student field to user
    const walletResult = await db.collection('wallets').updateMany(
      { student: { $exists: true } },
      { $rename: { student: 'user' } }
    );
    console.log(`   ✓ Renamed student → user for ${walletResult.modifiedCount} wallets`);

    // Create new unique index on user + college
    await db.collection('wallets').createIndex({ user: 1, college: 1 }, { unique: true });
    console.log('   ✓ Created unique index: user_1_college_1\n');

    // ===== STEP 4: Update Notifications Collection (if exists) =====
    console.log('📝 Step 4: Checking notifications collection...');

    const notificationResult = await db.collection('notifications').updateMany(
      { 'recipient': { $exists: true }, 'recipientRole': 'student' },
      { $set: { recipientRole: 'user' } }
    );
    console.log(`   ✓ Updated ${notificationResult.modifiedCount} notifications with recipientRole 'student' → 'user'\n`);

    // ===== STEP 5: Update AmbassadorApplications Collection =====
    console.log('📝 Step 5: Updating ambassadorapplications collection...');

    // Drop old index on 'student' field
    try {
      await db.collection('ambassadorapplications').dropIndex('student_1');
      console.log('   ✓ Dropped index: student_1');
    } catch (e) {
      console.log('   ℹ Index student_1 not found (may not exist)');
    }

    // Rename student field to user
    const ambassadorResult = await db.collection('ambassadorapplications').updateMany(
      { student: { $exists: true } },
      { $rename: { student: 'user' } }
    );
    console.log(`   ✓ Renamed student → user for ${ambassadorResult.modifiedCount} ambassador applications`);

    // Create new index on 'user' field
    await db.collection('ambassadorapplications').createIndex({ user: 1 });
    console.log('   ✓ Created index: user_1\n');

    // ===== STEP 6: Summary =====
    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users role updated: ${roleUpdateResult.modifiedCount}`);
    console.log(`   - User profiles renamed: ${profileRenameResult.modifiedCount}`);
    console.log(`   - Referral arrays renamed: ${referralUpdateCount}`);
    console.log(`   - Mining sessions updated: ${miningSessionResult.modifiedCount}`);
    console.log(`   - Wallets updated: ${walletResult.modifiedCount}`);
    console.log(`   - Notifications updated: ${notificationResult.modifiedCount}`);
    console.log(`   - Ambassador applications updated: ${ambassadorResult.modifiedCount}`);
    console.log('\n⚠️  IMPORTANT: All existing JWT tokens are now invalid. Users must re-login.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Disconnected from MongoDB');
  }
}

// Execute migration
runMigration();
