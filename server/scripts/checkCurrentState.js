import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkCurrentState = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const collegeId = new mongoose.Types.ObjectId('68e81f395942bee99e778007');
    
    // Fetch raw from database RIGHT NOW
    const college = await mongoose.connection.db.collection('colleges').findOne({ _id: collegeId });
    
    console.log('=== CURRENT STATE IN DATABASE ===\n');
    console.log('College name:', college.name);
    console.log('\ntokenPreferences RAW VALUE:');
    console.log(college.tokenPreferences);
    console.log('\ntokenPreferences TYPE:', typeof college.tokenPreferences);
    console.log('\nRAW JSON STRING:', JSON.stringify(college.tokenPreferences));
    
    if (typeof college.tokenPreferences === 'string') {
      console.log('\n❌ STILL CORRUPTED - tokenPreferences is a STRING');
    } else if (typeof college.tokenPreferences === 'object' && college.tokenPreferences !== null) {
      console.log('\n✓ tokenPreferences is an object');
      console.log('preferredUtilities:', college.tokenPreferences.preferredUtilities);
      console.log('preferredUtilities type:', typeof college.tokenPreferences.preferredUtilities);
      console.log('Is array:', Array.isArray(college.tokenPreferences.preferredUtilities));
    } else {
      console.log('\n⚠️  tokenPreferences is:', college.tokenPreferences);
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

checkCurrentState();

