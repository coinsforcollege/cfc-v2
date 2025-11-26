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

const fixSRCCAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    // Find SRCC college
    const srcc = await College.findOne({
      $or: [
        { name: { $regex: /^SRCC$/i } },
        { shortName: { $regex: /^SRCC$/i } }
      ]
    }).populate('admin');

    if (!srcc) {
      console.log('❌ SRCC college not found');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('📚 Found SRCC College:');
    console.log('  ID:', srcc._id);
    console.log('  Name:', srcc.name);
    console.log('  Status:', srcc.status);
    console.log('  Admin ID:', srcc.admin?._id || 'NONE');
    console.log('  Admin Name:', srcc.admin?.name || 'NONE');
    console.log('  Admin Role:', srcc.admin?.role || 'NONE');
    console.log('  Admin managedCollege:', srcc.admin?.managedCollege || 'NONE');
    console.log('');

    // Check if admin exists and if it's properly configured
    if (srcc.admin) {
      const admin = await User.findById(srcc.admin._id);
      
      console.log('🔍 Current Admin State:');
      console.log('  User ID:', admin._id);
      console.log('  User Role:', admin.role);
      console.log('  User managedCollege:', admin.managedCollege || 'NULL');
      console.log('');

      // If admin exists but role is wrong or managedCollege is null, fix it
      if (admin.role !== 'college_admin' || !admin.managedCollege || admin.managedCollege.toString() !== srcc._id.toString()) {
        console.log('⚠️  Data inconsistency detected!');
        console.log('  - College.admin points to user:', admin._id);
        console.log('  - But user.role is:', admin.role, '(should be college_admin)');
        console.log('  - And user.managedCollege is:', admin.managedCollege || 'NULL', '(should be SRCC)');
        console.log('');

        // Option 1: Clear the college's admin field (make it unclaimed)
        // Use direct MongoDB update to bypass validation (college has corrupted data)
        console.log('🔧 Fixing: Clearing college.admin field to make SRCC unclaimed...');
        const updateData = { admin: null };
        if (srcc.status === 'Waitlist' || srcc.status === 'Building') {
          updateData.status = 'Unaffiliated';
        }
        await College.updateOne(
          { _id: srcc._id },
          { $set: updateData }
        );
        console.log('✅ SRCC is now unclaimed and available for new admin registration');
        console.log('   New Status:', updateData.status || srcc.status);
      } else {
        console.log('✅ Admin is properly configured');
      }
    } else {
      console.log('✅ SRCC has no admin (already unclaimed)');
    }

    // Verify the fix
    console.log('\n🔍 Verification:');
    const updatedSRCC = await College.findById(srcc._id);
    console.log('  College Admin:', updatedSRCC.admin || 'NULL (unclaimed)');
    console.log('  College Status:', updatedSRCC.status);

    await mongoose.connection.close();
    console.log('\n✅ Fix completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

fixSRCCAdmin();

