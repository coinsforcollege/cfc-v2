import College from '../models/College.js';
import User from '../models/User.js';

export const validateCollegeAdmins = async () => {
  const now = new Date();
  console.log(`[Validation Job] Starting college admin validation at ${now.toISOString()}`);
  
  let fixedColleges = 0;
  let fixedUsers = 0;
  
  try {
    // 1. Validate College -> User links
    // Find all colleges that HAVE an admin
    const collegesWithAdmin = await College.find({ 
      admin: { $ne: null } 
    }).populate('admin'); // We need to check the admin user object

    for (const college of collegesWithAdmin) {
      let isValid = true;
      const adminUser = college.admin;

      // Check 1: Does admin user exist?
      if (!adminUser) {
        console.log(`[Validation Job] ⚠️ College "${college.name}" (${college._id}) has admin reference that does not exist.`);
        isValid = false;
      } 
      // Check 2: Is role correct?
      else if (adminUser.role !== 'college_admin') {
        console.log(`[Validation Job] ⚠️ College "${college.name}" admin "${adminUser.name}" has wrong role: ${adminUser.role}`);
        isValid = false;
      }
      // Check 3: Does user manage this college?
      else if (!adminUser.managedCollege || adminUser.managedCollege.toString() !== college._id.toString()) {
        console.log(`[Validation Job] ⚠️ College "${college.name}" admin "${adminUser.name}" manages different college: ${adminUser.managedCollege}`);
        isValid = false;
      }

      if (!isValid) {
        // Fix the college
        console.log(`[Validation Job] 🔧 Fixing college "${college.name}"...`);
        
        // Prepare update object
        const updateOps = {
            $set: {
                admin: null
            }
        };

        if (college.status === 'Waitlist' || college.status === 'Building') {
            updateOps.$set.status = 'Unaffiliated';
        }

        // Sanitize array fields: check raw value or just defensive set
        // Since we are here to fix, let's aggressively fix any empty string arrays
        // We use updateOne to bypass the validation error preventing the fix
        const arrayFields = ['images', 'accreditations', 'rankings', 'programs', 'highlights', 'facilities'];
        
        // Check raw document data if possible to see if repair is needed
        // But safely, we can just ensure they are arrays if they are "empty"
        // Actually, let's just use the fact that we are updating this doc anyway.
        // We'll read the raw value from ._doc if available, otherwise rely on Mongoose.
        // If Mongoose fails to cast, accessing it might be tricky. 
        // Let's assume they might be bad and try to set them to [] if they look fishy.
        
        arrayFields.forEach(field => {
             const value = college.get(field);
             // If value is not an array (e.g. it's a string, null, or undefined behaves unexpectedly)
             // or if we suspect it's the empty string causing issues.
             if (!Array.isArray(value)) {
                 console.log(`[Validation Job] 🔧 Fixing invalid array field "${field}" for college "${college.name}"`);
                 updateOps.$set[field] = [];
             }
        });

        // Force update to remove bad data
        await College.updateOne({ _id: college._id }, updateOps);
        
        // We don't increment fixedColleges here if we only fixed arrays, but this block is for invalid admin.
        // Wait, the block is `if (!isValid)`. 
        // If the ONLY issue was the invalid array, `isValid` would be true!
        // The current logic ONLY fixes arrays IF the admin link is also broken.
        // To fix arrays globally, we should check them independently.
        // BUT, for now, let's fix the crash in THIS block.
        
        // Note: If the college has valid admin but invalid arrays, this job won't fix it until next time?
        // No, `isValid` is false solely because of admin checks.
        // The error happens because we try to save() to fix the admin, but the bad arrays block us.
        // So `updateOne` is perfectly correct here to unblock the admin fix.
        
        fixedColleges++;
      }
    }

    // 2. Validate User -> College links
    // Find all users who ARE college admins
    const collegeAdmins = await User.find({ 
      role: 'college_admin' 
    }).populate('managedCollege');

    for (const user of collegeAdmins) {
      let isValid = true;
      const college = user.managedCollege;

      // Check 1: Does college exist?
      if (!college) {
        console.log(`[Validation Job] ⚠️ User "${user.name}" (${user._id}) is college_admin but manages no college.`);
        isValid = false;
      }
      // Check 2: Does college list this user as admin?
      // Note: We compare IDs. If college.admin is populated/object, get _id. If it's missing, it fails.
      else if (!college.admin || (college.admin._id || college.admin).toString() !== user._id.toString()) {
        console.log(`[Validation Job] ⚠️ User "${user.name}" manages "${college.name}" but college admin is: ${college.admin}`);
        isValid = false;
      }

      if (!isValid) {
        // Fix the user
        console.log(`[Validation Job] 🔧 Fixing user "${user.name}"...`);
        
        user.role = 'user';
        user.managedCollege = null;
        
        // Initialize userProfile if needed (defensive)
        if (!user.userProfile) {
            user.userProfile = {
                miningColleges: [],
                totalReferrals: 0
            };
        }
        
        await user.save();
        fixedUsers++;
      }
    }

    console.log(`[Validation Job] Completed. Fixed ${fixedColleges} colleges and ${fixedUsers} users.`);
    return { fixedColleges, fixedUsers };

  } catch (error) {
    console.error('[Validation Job] ❌ Error during validation:', error);
    throw error;
  }
};

