import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixSanJoseCollege = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Access the raw collection
    const collegesCollection = mongoose.connection.db.collection('colleges');
    
    // Find the problematic college
    const collegeId = new mongoose.Types.ObjectId('68e81f395942bee99e778007');
    const college = await collegesCollection.findOne({ _id: collegeId });
    
    if (!college) {
      console.log('❌ College not found!');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`\n🔍 Found college: ${college.name}`);
    console.log(`Current tokenPreferences:`, college.tokenPreferences);
    console.log(`Type: ${typeof college.tokenPreferences}`);

    // Fix the tokenPreferences by replacing the string with a proper object
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

    console.log(`\n🔧 Applying fix...`);
    
    const result = await collegesCollection.updateOne(
      { _id: collegeId },
      { $set: { tokenPreferences: fixedTokenPreferences } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Successfully fixed ${college.name}!`);
      console.log(`New tokenPreferences:`, fixedTokenPreferences);
      
      // Verify the fix
      const verifyCollege = await collegesCollection.findOne({ _id: collegeId });
      console.log(`\n✓ Verification - tokenPreferences type:`, typeof verifyCollege.tokenPreferences);
      console.log(`✓ Verification - preferredUtilities type:`, typeof verifyCollege.tokenPreferences.preferredUtilities);
      console.log(`✓ Verification - preferredUtilities is array:`, Array.isArray(verifyCollege.tokenPreferences.preferredUtilities));
      
      console.log('\n✅ Fix complete! Please RESTART your backend server for changes to take effect.');
    } else {
      console.log('⚠️  No changes were made. The college might already be fixed.');
    }
    
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
fixSanJoseCollege();

