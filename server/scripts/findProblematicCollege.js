import mongoose from 'mongoose';
import College from '../src/models/College.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const findProblematicCollege = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Get raw college IDs first
    const collegesCollection = mongoose.connection.db.collection('colleges');
    const allCollegesRaw = await collegesCollection.find({}).toArray();
    
    console.log(`\n🔍 Testing ${allCollegesRaw.length} colleges with Mongoose...\n`);

    let successCount = 0;
    let failureCount = 0;
    const problematicColleges = [];

    for (const rawCollege of allCollegesRaw) {
      try {
        // Try to load the college through Mongoose (this will trigger the error if there is one)
        const college = await College.findById(rawCollege._id);
        
        if (college) {
          successCount++;
          console.log(`✓ ${college.name}`);
        } else {
          console.log(`⚠️  College not found: ${rawCollege.name}`);
        }
      } catch (error) {
        failureCount++;
        console.log(`\n❌ ERROR loading college: ${rawCollege.name}`);
        console.log(`   ID: ${rawCollege._id}`);
        console.log(`   Error: ${error.message}`);
        console.log(`   Stack: ${error.stack.split('\n')[0]}`);
        
        // Log the raw tokenPreferences data
        if (rawCollege.tokenPreferences) {
          console.log(`   Raw tokenPreferences:`, JSON.stringify(rawCollege.tokenPreferences, null, 2));
        }
        
        problematicColleges.push({
          id: rawCollege._id,
          name: rawCollege.name,
          error: error.message,
          tokenPreferences: rawCollege.tokenPreferences
        });
      }
    }

    console.log('\n\n📊 Summary:');
    console.log(`   - Successfully loaded: ${successCount}`);
    console.log(`   - Failed to load: ${failureCount}`);
    
    if (problematicColleges.length > 0) {
      console.log('\n\n🚨 PROBLEMATIC COLLEGES FOUND:');
      console.log('=====================================\n');
      
      for (const pc of problematicColleges) {
        console.log(`College: ${pc.name}`);
        console.log(`ID: ${pc.id}`);
        console.log(`Error: ${pc.error}`);
        console.log(`Token Preferences:`, JSON.stringify(pc.tokenPreferences, null, 2));
        console.log('\n---\n');
      }
      
      console.log('\n💡 To fix these colleges, we can delete and recreate them, or manually fix the corrupted fields.');
      console.log('\nWould you like me to create a script to delete these problematic colleges?');
    } else {
      console.log('\n✅ All colleges loaded successfully through Mongoose!');
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

// Run the script
findProblematicCollege();

