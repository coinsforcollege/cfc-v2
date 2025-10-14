import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const clearOrphanedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const deletedCollegeId = new mongoose.Types.ObjectId('68e81f395942bee99e778007');
    const usersCollection = mongoose.connection.db.collection('users');
    
    // Find all admins with the deleted college
    const orphanedAdmins = await usersCollection.find({ 
      managedCollege: deletedCollegeId 
    }).toArray();
    
    if (orphanedAdmins.length === 0) {
      console.log('✓ No orphaned admins found');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`Found ${orphanedAdmins.length} orphaned admin(s):\n`);
    
    for (const admin of orphanedAdmins) {
      console.log(`Clearing managedCollege for: ${admin.name} (${admin.email})`);
      
      const result = await usersCollection.updateOne(
        { _id: admin._id },
        { $set: { managedCollege: null } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`  ✅ Cleared successfully`);
      } else {
        console.log(`  ⚠️  No changes made`);
      }
    }
    
    console.log('\n✅ Done! The college admin can now select a college again.');
    console.log('They can either:');
    console.log('  1. Create "San Jose State University" fresh');
    console.log('  2. Select a different existing college');
    
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

clearOrphanedAdmin();

