import mongoose from 'mongoose';
import College from '../src/models/College.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const testActualModel = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const collegeId = '68e81f395942bee99e778007';
    
    console.log('\n🧪 Testing with ACTUAL College model...\n');
    
    // First check raw data
    const raw = await mongoose.connection.db.collection('colleges').findOne({ _id: new mongoose.Types.ObjectId(collegeId) });
    console.log('Raw tokenPreferences type:', typeof raw.tokenPreferences);
    console.log('Raw preferredUtilities:', raw.tokenPreferences?.preferredUtilities);
    console.log('Is array:', Array.isArray(raw.tokenPreferences?.preferredUtilities));
    
    console.log('\nNow loading with College model...');
    
    try {
      const college = await College.findById(collegeId).lean();
      console.log('✅ Loaded successfully with lean()');
      console.log('Name:', college.name);
    } catch (err) {
      console.log('❌ Failed with lean():', err.message);
    }

    try {
      const college = await College.findById(collegeId);
      console.log('✅ Loaded successfully without lean()');
      console.log('Name:', college.name);
    } catch (err) {
      console.log('❌ Failed without lean():', err.message);
      console.log('\nFull error stack:', err.stack);
    }
    
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

testActualModel();

