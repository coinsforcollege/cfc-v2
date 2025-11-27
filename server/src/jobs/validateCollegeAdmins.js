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
        
        college.admin = null;
        
        // Reset status if it implies having an admin
        if (college.status === 'Waitlist' || college.status === 'Building') {
          college.status = 'Unaffiliated';
        }
        
        await college.save();
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

