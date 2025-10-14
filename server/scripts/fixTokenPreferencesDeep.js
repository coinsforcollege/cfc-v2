import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixTokenPreferencesDeep = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Access the raw collection (bypassing Mongoose schema)
    const collegesCollection = mongoose.connection.db.collection('colleges');
    
    // Find all colleges with raw MongoDB query
    const allColleges = await collegesCollection.find({}).toArray();
    console.log(`\n🔍 Found ${allColleges.length} colleges to check`);

    let corruptedCount = 0;
    let fixedCount = 0;
    let alreadyValidCount = 0;
    let errorCount = 0;

    for (const college of allColleges) {
      try {
        const collegeName = college.name || 'Unknown';
        let isCorrupted = false;
        const fixes = {};
        
        // Check if tokenPreferences exists
        if (college.tokenPreferences !== undefined && college.tokenPreferences !== null) {
          const tp = college.tokenPreferences;
          
          // Check if tokenPreferences itself is a string
          if (typeof tp === 'string') {
            console.log(`\n⚠️  CORRUPTED: ${collegeName}`);
            console.log(`   tokenPreferences is a string: "${tp.substring(0, 100)}..."`);
            isCorrupted = true;
            fixes.tokenPreferences = {
              name: '',
              ticker: '',
              maximumSupply: null,
              preferredIcon: null,
              preferredLaunchDate: null,
              preferredUtilities: [],
              needExchangeListing: true,
              allocationForEarlyMiners: null
            };
          } 
          // Check if tokenPreferences is an object
          else if (typeof tp === 'object') {
            // Check each field in tokenPreferences
            let fieldCorrupted = false;
            
            // Check preferredUtilities
            if (tp.preferredUtilities !== undefined && tp.preferredUtilities !== null) {
              if (typeof tp.preferredUtilities === 'string') {
                console.log(`\n⚠️  CORRUPTED: ${collegeName}`);
                console.log(`   preferredUtilities is a string: "${tp.preferredUtilities}"`);
                isCorrupted = true;
                fieldCorrupted = true;
                fixes['tokenPreferences.preferredUtilities'] = [];
              } else if (!Array.isArray(tp.preferredUtilities)) {
                console.log(`\n⚠️  CORRUPTED: ${collegeName}`);
                console.log(`   preferredUtilities is not an array: ${typeof tp.preferredUtilities}`);
                isCorrupted = true;
                fieldCorrupted = true;
                fixes['tokenPreferences.preferredUtilities'] = [];
              }
            }
            
            // Check other fields for string corruption
            const stringFields = ['name', 'ticker'];
            const numberFields = ['maximumSupply', 'allocationForEarlyMiners'];
            
            for (const field of stringFields) {
              if (tp[field] !== undefined && tp[field] !== null && typeof tp[field] === 'object' && !Array.isArray(tp[field])) {
                console.log(`\n⚠️  CORRUPTED: ${collegeName}`);
                console.log(`   tokenPreferences.${field} is an object instead of string`);
                isCorrupted = true;
                fieldCorrupted = true;
                fixes[`tokenPreferences.${field}`] = '';
              }
            }
            
            for (const field of numberFields) {
              if (tp[field] !== undefined && tp[field] !== null && typeof tp[field] !== 'number') {
                if (typeof tp[field] === 'string' && tp[field].includes('[object')) {
                  console.log(`\n⚠️  CORRUPTED: ${collegeName}`);
                  console.log(`   tokenPreferences.${field} is corrupted: "${tp[field]}"`);
                  isCorrupted = true;
                  fieldCorrupted = true;
                  fixes[`tokenPreferences.${field}`] = null;
                }
              }
            }
            
            if (!fieldCorrupted) {
              alreadyValidCount++;
              console.log(`✓ ${collegeName} - tokenPreferences is valid`);
            }
          }
          
          // Apply fixes if needed
          if (isCorrupted) {
            corruptedCount++;
            
            if (Object.keys(fixes).length > 0) {
              await collegesCollection.updateOne(
                { _id: college._id },
                { $set: fixes }
              );
              fixedCount++;
              console.log(`   ✓ FIXED: Applied fixes:`, Object.keys(fixes));
            }
          }
        } else {
          alreadyValidCount++;
          console.log(`✓ ${collegeName} - no tokenPreferences field`);
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
      console.log('⚠️  Please RESTART your backend server for changes to take effect!');
    } else if (corruptedCount > 0) {
      console.log('\n⚠️  Found corrupted data but could not fix automatically.');
      console.log('   Manual inspection may be required.');
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
fixTokenPreferencesDeep();

