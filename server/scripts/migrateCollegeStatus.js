import mongoose from 'mongoose';
import College from '../src/models/College.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateCollegeStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Find all colleges
    const allColleges = await College.find({});
    console.log(`\n🔍 Found ${allColleges.length} colleges to migrate`);

    let withAdminCount = 0;
    let withoutAdminCount = 0;
    let alreadyMigratedCount = 0;

    for (const college of allColleges) {
      // Skip if status is already set to something other than default
      if (college.status && college.status !== 'Unaffiliated') {
        alreadyMigratedCount++;
        console.log(`✓ ${college.name} - already has status: ${college.status}`);
        continue;
      }

      // Determine new status based on whether admin exists
      if (college.admin) {
        await College.findByIdAndUpdate(college._id, { status: 'Waitlist' });
        withAdminCount++;
        console.log(`✓ ${college.name} - set to Waitlist (has admin)`);
      } else {
        await College.findByIdAndUpdate(college._id, { status: 'Unaffiliated' });
        withoutAdminCount++;
        console.log(`✓ ${college.name} - set to Unaffiliated (no admin)`);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   - Colleges with admin (→ Waitlist): ${withAdminCount}`);
    console.log(`   - Colleges without admin (→ Unaffiliated): ${withoutAdminCount}`);
    console.log(`   - Already migrated: ${alreadyMigratedCount}`);
    console.log(`   - Total: ${allColleges.length}`);
    
    console.log('\n✅ Migration completed successfully!');
    
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run migration
migrateCollegeStatus();

