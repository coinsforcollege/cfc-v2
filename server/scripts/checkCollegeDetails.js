import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import College from '../src/models/College.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkCollege = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check college: 68e39038cc403a678b9ca0bc
    const collegeId = '68e39038cc403a678b9ca0bc';
    console.log(`Checking College ${collegeId} associated with user 'abc'...`);
    
    const college = await College.findById(collegeId);
    
    if (college) {
        console.log(`✅ College Found: ${college.name} (${college.country})`);
        console.log(`- Created By: ${college.createdBy}`);
        console.log(`- Created At: ${college.createdAt}`);
    } else {
        console.log(`❌ College ID ${collegeId} NOT FOUND. The user 'abc' is an ambassador for a ghost college.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

checkCollege();
