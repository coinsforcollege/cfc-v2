import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import College from '../src/models/College.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const querySRCC = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    // Search for SRCC (case insensitive)
    const colleges = await College.find({
      $or: [
        { name: { $regex: /SRCC/i } },
        { shortName: { $regex: /SRCC/i } }
      ]
    }).populate('admin', 'name email phone role').populate('createdBy', 'name email phone role');

    console.log(`Found ${colleges.length} college(s) matching SRCC:\n`);
    console.log('='.repeat(80));

    for (const college of colleges) {
      console.log('\n📚 COLLEGE INFORMATION:');
      console.log('-'.repeat(80));
      console.log('ID:', college._id);
      console.log('Name:', college.name);
      console.log('Short Name:', college.shortName || 'N/A');
      console.log('Status:', college.status);
      console.log('Country:', college.country);
      console.log('City:', college.city || 'N/A');
      console.log('Created At:', college.createdAt);
      console.log('Updated At:', college.updatedAt);

      console.log('\n👤 ADMIN INFORMATION:');
      console.log('-'.repeat(80));
      if (college.admin) {
        console.log('Admin ID:', college.admin._id);
        console.log('Admin Name:', college.admin.name);
        console.log('Admin Email:', college.admin.email);
        console.log('Admin Phone:', college.admin.phone);
        console.log('Admin Role:', college.admin.role);
        
        // Get full admin details
        const fullAdmin = await User.findById(college.admin._id).populate('managedCollege', 'name');
        console.log('Managed College:', fullAdmin.managedCollege?.name || 'N/A');
        console.log('Admin Is Active:', fullAdmin.isActive);
        console.log('Admin Created At:', fullAdmin.createdAt);
      } else {
        console.log('❌ NO ADMIN ASSIGNED (College is unclaimed)');
      }

      console.log('\n👤 CREATOR INFORMATION:');
      console.log('-'.repeat(80));
      if (college.createdBy) {
        console.log('Creator ID:', college.createdBy._id);
        console.log('Creator Name:', college.createdBy.name);
        console.log('Creator Email:', college.createdBy.email);
        console.log('Creator Phone:', college.createdBy.phone);
        console.log('Creator Role:', college.createdBy.role);
      } else {
        console.log('N/A (No creator info)');
      }

      // Get all users who are mining this college
      console.log('\n⛏️  MINERS INFORMATION:');
      console.log('-'.repeat(80));
      const miners = await User.find({
        'userProfile.miningColleges.college': college._id
      }).select('name email phone role userProfile.miningColleges createdAt');

      console.log(`Total Miners: ${miners.length}`);
      if (miners.length > 0) {
        console.log('\nMiners List:');
        miners.forEach((miner, index) => {
          const miningCollege = miner.userProfile.miningColleges.find(
            mc => mc.college.toString() === college._id.toString()
          );
          console.log(`\n  ${index + 1}. ${miner.name}`);
          console.log(`     Email: ${miner.email}`);
          console.log(`     Phone: ${miner.phone}`);
          console.log(`     Role: ${miner.role}`);
          console.log(`     Started Mining: ${miningCollege?.addedAt || 'N/A'}`);
          console.log(`     Referred Users: ${miningCollege?.referredUsers?.length || 0}`);
        });
      }

      // Get all college admins (users with role 'college_admin')
      console.log('\n🏫 ALL COLLEGE ADMINS:');
      console.log('-'.repeat(80));
      const allCollegeAdmins = await User.find({ role: 'college_admin' })
        .populate('managedCollege', 'name')
        .select('name email phone managedCollege isActive createdAt');

      console.log(`Total College Admins in System: ${allCollegeAdmins.length}`);
      allCollegeAdmins.forEach((admin, index) => {
        console.log(`\n  ${index + 1}. ${admin.name}`);
        console.log(`     Email: ${admin.email}`);
        console.log(`     Phone: ${admin.phone}`);
        console.log(`     Managed College: ${admin.managedCollege?.name || 'NONE'}`);
        console.log(`     Is Active: ${admin.isActive}`);
        console.log(`     Created At: ${admin.createdAt}`);
      });

      // Statistics
      console.log('\n📊 STATISTICS:');
      console.log('-'.repeat(80));
      console.log('Total Miners:', college.stats?.totalMiners || 0);
      console.log('Active Miners:', college.stats?.activeMiners || 0);
      console.log('Total Tokens Mined:', college.stats?.totalTokensMined || 0);

      console.log('\n' + '='.repeat(80));
    }

    await mongoose.connection.close();
    console.log('\n✅ Query completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

querySRCC();

