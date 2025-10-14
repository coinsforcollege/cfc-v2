import mongoose from 'mongoose';
import College from '../src/models/College.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixTokenPreferencesUtilities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Find all colleges - we need to use lean() to get raw documents
    // because Mongoose will fail when trying to hydrate corrupted documents
    const allColleges = await College.collection.find({}).toArray();
    console.log(`\n🔍 Found ${allColleges.length} colleges to check`);

    let corruptedCount = 0;
    let fixedCount = 0;
    let alreadyValidCount = 0;
    let errorCount = 0;

    for (const college of allColleges) {
      try {
        const collegeName = college.name || 'Unknown';
        
        // Check if tokenPreferences exists and has preferredUtilities
        if (college.tokenPreferences && college.tokenPreferences.preferredUtilities !== undefined) {
          const utilities = college.tokenPreferences.preferredUtilities;
          
          // Check if it's not an array (corrupted)
          if (!Array.isArray(utilities)) {
            corruptedCount++;
            console.log(`\n⚠️  Found corrupted data in: ${collegeName}`);
            console.log(`   Type: ${typeof utilities}`);
            console.log(`   Value: ${utilities}`);
            
            // Fix by converting to empty array
            await College.collection.updateOne(
              { _id: college._id },
              { $set: { 'tokenPreferences.preferredUtilities': [] } }
            );
            
            fixedCount++;
            console.log(`✓ Fixed: ${collegeName} - set preferredUtilities to []`);
          } else {
            alreadyValidCount++;
            console.log(`✓ ${collegeName} - preferredUtilities is valid (array with ${utilities.length} items)`);
          }
        } else {
          alreadyValidCount++;
          console.log(`✓ ${collegeName} - no tokenPreferences.preferredUtilities field`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing college: ${college.name || 'Unknown'}`, error.message);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   - Total colleges checked: ${allColleges.length}`);
    console.log(`   - Corrupted entries found: ${corruptedCount}`);
    console.log(`   - Successfully fixed: ${fixedCount}`);
    console.log(`   - Already valid: ${alreadyValidCount}`);
    console.log(`   - Errors encountered: ${errorCount}`);
    
    if (fixedCount > 0) {
      console.log('\n✅ Migration completed successfully! Corrupted data has been fixed.');
    } else {
      console.log('\n✅ No corrupted data found. All colleges are valid!');
    }
    
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run migration
fixTokenPreferencesUtilities();

