import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import AmbassadorApplication from '../src/models/AmbassadorApplication.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAmbassador = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check the reviewer
    const reviewerId = '69542fe32af44692ef644b0a';
    const reviewer = await User.findById(reviewerId);
    
    console.log("Checking Ambassador Application for User 'abc'...");
    
    if (reviewer) {
        console.log(`✅ Reviewer Found: ${reviewer.name} (${reviewer.email}), Role: ${reviewer.role}`);
    } else {
        console.log(`❌ Reviewer ID ${reviewerId} NOT FOUND. This application was approved by a ghost user?`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

checkAmbassador();
