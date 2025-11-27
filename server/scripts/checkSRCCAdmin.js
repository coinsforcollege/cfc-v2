import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import College from '../src/models/College.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkSRCCAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const srcc = await College.findOne({
      $or: [
        { name: { $regex: /^SRCC$/i } },
        { shortName: { $regex: /^SRCC$/i } }
      ]
    });

    if (!srcc) {
      console.log('❌ SRCC not found');
      process.exit(1);
    }

    console.log('📚 SRCC College:');
    console.log('  ID:', srcc._id);
    console.log('  Name:', srcc.name);
    console.log('  Admin Field (raw):', srcc.admin);
    console.log('  Admin Field Type:', typeof srcc.admin);
    console.log('  Admin Field toString:', srcc.admin?.toString());
    console.log('');

    if (srcc.admin) {
      console.log('🔍 Checking if admin user exists...');
      const adminUser = await User.findById(srcc.admin);
      
      if (adminUser) {
        console.log('  ✅ Admin user EXISTS:');
        console.log('     ID:', adminUser._id);
        console.log('     Name:', adminUser.name);
        console.log('     Email:', adminUser.email);
        console.log('     Role:', adminUser.role);
        console.log('     Managed College:', adminUser.managedCollege);
        console.log('');
        
        if (adminUser.role !== 'college_admin' || !adminUser.managedCollege || adminUser.managedCollege.toString() !== srcc._id.toString()) {
          console.log('  ⚠️  Admin user is INVALID - clearing college.admin field...');
          await College.updateOne(
            { _id: srcc._id },
            { $set: { admin: null } }
          );
          console.log('  ✅ Cleared');
        } else {
          console.log('  ✅ Admin user is VALID');
        }
      } else {
        console.log('  ❌ Admin user DOES NOT EXIST (was deleted)');
        console.log('  🔧 Clearing college.admin field...');
        await College.updateOne(
          { _id: srcc._id },
          { $set: { admin: null } }
        );
        console.log('  ✅ Cleared');
      }
    } else {
      console.log('  ✅ No admin assigned (college is unclaimed)');
    }

    // Verify
    const updatedSRCC = await College.findById(srcc._id);
    console.log('\n🔍 Verification:');
    console.log('  Admin Field:', updatedSRCC.admin || 'NULL');

    await mongoose.connection.close();
    console.log('\n✅ Done');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

checkSRCCAdmin();


