import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkSecurity = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const suspiciousEmails = ['xyz@gmail.com', 'abc@gmail.com', 'abcd@gmail.com'];
    
    console.log(`🚨 Investigating Security Details for: ${suspiciousEmails.join(', ')}\n`);
    
    const users = await User.find({ email: { $in: suspiciousEmails } });
    
    users.forEach(user => {
        console.log(`User: ${user.email} (${user.role})`);
        console.log(`- ID: ${user._id}`);
        console.log(`- Created: ${user.createdAt}`);
        console.log(`- Last Login: ${user.lastLogin || 'NEVER'}`);
        console.log(`- Is Active: ${user.isActive}`);
        console.log('---');
    });

    // Check for any other users created on Dec 31
    const start = new Date('2025-12-30T00:00:00.000Z');
    const end = new Date('2026-01-01T23:59:59.999Z');
    
    const others = await User.find({
        createdAt: { $gte: start, $lte: end },
        email: { $nin: suspiciousEmails }
    });
    
    if (others.length > 0) {
        console.log(`\n⚠️ Found ${others.length} OTHER users created between Dec 30 - Jan 1:`);
        others.forEach(u => console.log(`- ${u.email} (${u.role})`));
    } else {
        console.log("\nNo other users created during this time window.");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

checkSecurity();
