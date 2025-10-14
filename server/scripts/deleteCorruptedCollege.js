import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const deleteCorruptedCollege = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const collegeId = new mongoose.Types.ObjectId('68e81f395942bee99e778007');
    const collection = mongoose.connection.db.collection('colleges');
    
    // Get college info first
    const college = await collection.findOne({ _id: collegeId });
    console.log('Found college:', college.name);
    console.log('ID:', collegeId);
    
    console.log('\n🗑️  DELETING...');
    
    const result = await collection.deleteOne({ _id: collegeId });
    
    if (result.deletedCount > 0) {
      console.log('✅ Successfully deleted:', college.name);
      console.log('Deleted count:', result.deletedCount);
      
      // Verify it's gone
      const check = await collection.findOne({ _id: collegeId });
      if (!check) {
        console.log('✓ Verified - college is deleted from database');
      } else {
        console.log('⚠️  WARNING - college still exists somehow');
      }
    } else {
      console.log('❌ Failed to delete');
    }
    
    console.log('\n✅ Done! Restart your backend server.');
    
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

deleteCorruptedCollege();

