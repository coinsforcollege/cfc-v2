import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkCollegeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    const collegeId = '68e81f395942bee99e778007';
    
    // Check if the college still exists
    const college = await mongoose.connection.db.collection('colleges').findOne({ 
      _id: new mongoose.Types.ObjectId(collegeId) 
    });
    
    if (college) {
      console.log('✓ College still exists:', college.name);
      console.log('Admin field:', college.admin);
    } else {
      console.log('✓ College has been deleted');
    }
    
    // Check if any user has this as managedCollege
    const users = await mongoose.connection.db.collection('users').find({ 
      managedCollege: new mongoose.Types.ObjectId(collegeId) 
    }).toArray();
    
    if (users.length > 0) {
      console.log('\n⚠️  WARNING: Found college admins managing this deleted college:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email})`);
        console.log(`    Role: ${user.role}`);
        console.log(`    User ID: ${user._id}`);
      });
      console.log('\nThese admins will need to be reassigned or have their managedCollege field cleared.');
    } else {
      console.log('\n✓ No college admins were managing this college');
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

checkCollegeAdmin();

