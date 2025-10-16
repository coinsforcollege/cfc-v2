import mongoose from 'mongoose';
import College from '../src/models/College.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const normalizeCountryNames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const allColleges = await College.find({});
    console.log(`\n🔍 Found ${allColleges.length} colleges total`);

    const usVariations = [
      'USA',
      'Usa',
      'usa',
      'US',
      'us',
      'U.S.A.',
      'U.S.',
      'u.s.a.',
      'u.s.',
      'United States of America',
      'united states of america',
      'UnitedStates',
      'unitedstates',
      'united states',
      'UNITED STATES',
      'United states',
      'united States'
    ];

    const ukVariations = [
      'UK',
      'uk',
      'U.K.',
      'u.k.',
      'GB',
      'gb',
      'G.B.',
      'g.b.',
      'Great Britain',
      'great britain',
      'Britain',
      'britain',
      'United Kingdom of Great Britain and Northern Ireland',
      'United Kingdom of Great Britain and Northern Ireland (the)',
      'united kingdom',
      'UNITED KINGDOM'
    ];

    let updatedCount = 0;
    let alreadyCorrectCount = 0;
    const updatedColleges = [];

    for (const college of allColleges) {
      if (!college.country) {
        console.log(`⚠️  ${college.name} - has no country field`);
        continue;
      }

      if (college.country === 'United States' || college.country === 'United Kingdom') {
        alreadyCorrectCount++;
        continue;
      }

      if (usVariations.includes(college.country)) {
        await College.findByIdAndUpdate(college._id, { country: 'United States' });
        updatedCount++;
        updatedColleges.push({
          name: college.name,
          oldCountry: college.country,
          newCountry: 'United States'
        });
        console.log(`✓ ${college.name} - updated from "${college.country}" to "United States"`);
      } else if (ukVariations.includes(college.country)) {
        await College.findByIdAndUpdate(college._id, { country: 'United Kingdom' });
        updatedCount++;
        updatedColleges.push({
          name: college.name,
          oldCountry: college.country,
          newCountry: 'United Kingdom'
        });
        console.log(`✓ ${college.name} - updated from "${college.country}" to "United Kingdom"`);
      }
    }

    console.log('\n📊 Normalization Summary:');
    console.log(`   - Total updated: ${updatedCount}`);
    console.log(`   - Already correct: ${alreadyCorrectCount}`);
    console.log(`   - Total processed: ${allColleges.length}`);

    if (updatedColleges.length > 0) {
      console.log('\n📝 Updated colleges:');
      updatedColleges.forEach(({ name, oldCountry, newCountry }) => {
        console.log(`   - ${name}: "${oldCountry}" → "${newCountry}"`);
      });
    }

    const uniqueCountries = await College.distinct('country');
    console.log('\n🌍 All unique countries in database:');
    uniqueCountries.forEach(country => {
      console.log(`   - ${country}`);
    });

    console.log('\n✅ Normalization completed successfully!');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Normalization failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

normalizeCountryNames();
