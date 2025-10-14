import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const forceFix = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Connection string:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

    // Access the raw collection
    const collegesCollection = mongoose.connection.db.collection('colleges');
    
    // Find the problematic college
    const collegeId = new mongoose.Types.ObjectId('68e81f395942bee99e778007');
    
    console.log('\n📍 BEFORE FIX:');
    let college = await collegesCollection.findOne({ _id: collegeId });
    console.log('College name:', college.name);
    console.log('tokenPreferences value:', college.tokenPreferences);
    console.log('tokenPreferences type:', typeof college.tokenPreferences);
    console.log('Raw JSON:', JSON.stringify(college.tokenPreferences));

    // Method 1: Unset the field completely first
    console.log('\n🔧 Step 1: Removing tokenPreferences field...');
    await collegesCollection.updateOne(
      { _id: collegeId },
      { $unset: { tokenPreferences: "" } }
    );
    
    // Verify unset
    college = await collegesCollection.findOne({ _id: collegeId });
    console.log('After unset - tokenPreferences:', college.tokenPreferences);

    // Method 2: Set it to a proper object
    console.log('\n🔧 Step 2: Setting proper tokenPreferences object...');
    const fixedTokenPreferences = {
      name: '',
      ticker: '',
      maximumSupply: null,
      preferredIcon: null,
      preferredLaunchDate: null,
      preferredUtilities: [],
      needExchangeListing: true,
      allocationForEarlyMiners: null
    };

    await collegesCollection.updateOne(
      { _id: collegeId },
      { $set: { tokenPreferences: fixedTokenPreferences } }
    );

    console.log('\n📍 AFTER FIX:');
    college = await collegesCollection.findOne({ _id: collegeId });
    console.log('College name:', college.name);
    console.log('tokenPreferences value:', college.tokenPreferences);
    console.log('tokenPreferences type:', typeof college.tokenPreferences);
    console.log('preferredUtilities:', college.tokenPreferences?.preferredUtilities);
    console.log('preferredUtilities is array:', Array.isArray(college.tokenPreferences?.preferredUtilities));

    // Try loading through Mongoose to verify
    console.log('\n🧪 Testing with Mongoose...');
    try {
      const College = mongoose.model('College', new mongoose.Schema({}, { strict: false }));
      const mongooseCollege = await College.findById(collegeId);
      console.log('✅ Successfully loaded through Mongoose!');
      console.log('Name:', mongooseCollege.name);
    } catch (err) {
      console.log('❌ Still failing through Mongoose:', err.message);
    }

    console.log('\n✅ Fix complete! Please RESTART your backend server.');
    
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the script
forceFix();

