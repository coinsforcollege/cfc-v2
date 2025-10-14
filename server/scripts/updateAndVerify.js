import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateAndVerify = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      writeConcern: { w: 'majority', j: true }
    });
    console.log('📦 Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);

    const collegeId = new mongoose.Types.ObjectId('68e81f395942bee99e778007');
    const collection = mongoose.connection.db.collection('colleges');
    
    console.log('\n=== BEFORE UPDATE ===');
    let college = await collection.findOne({ _id: collegeId });
    console.log('tokenPreferences:', JSON.stringify(college.tokenPreferences));
    console.log('Type:', typeof college.tokenPreferences);
    
    console.log('\n🔧 Updating with writeConcern...');
    
    // Delete the field
    const deleteResult = await collection.updateOne(
      { _id: collegeId },
      { $unset: { tokenPreferences: "" } },
      { writeConcern: { w: 'majority', j: true } }
    );
    console.log('Delete result:', deleteResult);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n=== AFTER DELETE (checking) ===');
    college = await collection.findOne({ _id: collegeId });
    console.log('tokenPreferences:', college.tokenPreferences);
    
    // Set new value
    const fixedData = {
      name: '',
      ticker: '',
      maximumSupply: null,
      preferredIcon: null,
      preferredLaunchDate: null,
      preferredUtilities: [],
      needExchangeListing: true,
      allocationForEarlyMiners: null
    };
    
    const updateResult = await collection.updateOne(
      { _id: collegeId },
      { $set: { tokenPreferences: fixedData } },
      { writeConcern: { w: 'majority', j: true } }
    );
    console.log('\nUpdate result:', updateResult);
    
    // Wait again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n=== AFTER UPDATE (checking immediately) ===');
    college = await collection.findOne({ _id: collegeId });
    console.log('tokenPreferences:', JSON.stringify(college.tokenPreferences));
    console.log('Type:', typeof college.tokenPreferences);
    console.log('preferredUtilities is array:', Array.isArray(college.tokenPreferences?.preferredUtilities));
    
    // Check one more time after another delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n=== FINAL CHECK (after 2 second delay) ===');
    college = await collection.findOne({ _id: collegeId });
    console.log('tokenPreferences:', JSON.stringify(college.tokenPreferences));
    console.log('Type:', typeof college.tokenPreferences);
    
    if (typeof college.tokenPreferences === 'string') {
      console.log('\n❌❌❌ STILL A STRING - SOMETHING IS VERY WRONG');
    } else {
      console.log('\n✅ SUCCESS - It\'s now an object!');
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

updateAndVerify();

