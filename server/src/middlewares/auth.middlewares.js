import jwt from 'jsonwebtoken';
import { User } from '../models/userModels.js';
import { College } from '../models/college.models.js';
import ApiError from '../utils/ApiError.js';
import { Activity } from '../models/activity.model.js';

// Protect routes - general authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies (if using cookies)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).populate('college', 'name logo slug');

    if (!user) {
      throw new ApiError(401, 'No user found with this token');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(401, 'Account has been deactivated');
    }

    // Check if user is suspended
    if (user.isSuspended) {
      throw new ApiError(401, 'Account has been suspended');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    throw new ApiError(401, 'Not authorized to access this route');
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    throw new ApiError(403, 'Please verify your email address first');
  }
  next();
};

// Check if college admin is verified
const requireAdminVerification = (req, res, next) => {
  if (req.user.role === 'college_admin' && !req.user.isAdminVerified) {
    throw new ApiError(403, 'Admin account pending verification');
  }
  next();
};

// Check if user owns the resource or is admin
const checkOwnership = (resourceField = 'user') => {
  return async (req, res, next) => {
    try {
      // Platform admins can access everything
      if (req.user.role === 'platform_admin') {
        return next();
      }

      // College admins can access their college's resources
      if (req.user.role === 'college_admin') {
        // Implementation depends on the specific resource
        // For now, allow college admins to access resources related to their college
        return next();
      }

      // Students can only access their own resources
      const resourceId = req.params.id;
      const Model = req.model; // This should be set by the route handler

      if (Model) {
        const resource = await Model.findById(resourceId);
        if (!resource) {
          throw new ApiError(404, 'Resource not found');
        }

        if (resource[resourceField].toString() !== req.user._id.toString()) {
          throw new ApiError(403, 'Not authorized to access this resource');
        }
      }

      next();
    } catch (error) {
      throw new ApiError(500, 'Error checking resource ownership');
    }
  };
};

// Rate limiting for sensitive operations
const rateLimitSensitive = (maxAttempts = 5, windowMinutes = 15) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `${req.ip}:${req.user ? req.user._id : 'anonymous'}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, firstAttempt: now });
      return next();
    }

    const userAttempts = attempts.get(key);

    // Reset if window has passed
    if (now - userAttempts.firstAttempt > windowMs) {
      attempts.set(key, { count: 1, firstAttempt: now });
      return next();
    }

    // Check if limit exceeded
    if (userAttempts.count >= maxAttempts) {
      throw new ApiError(429, `Too many attempts. Please try again in ${windowMinutes} minutes.`);
    }

    // Increment attempts
    userAttempts.count++;
    next();
  };
};

// Check mining eligibility
const checkMiningEligibility = async (req, res, next) => {
  try {
    const user = req.user;

    // Check if user has a college
    if (!user.college) {
      throw new ApiError(400, 'Please select a college first');
    }

    // Check if user can mine (time-based restriction)
    if (!user.canMine()) {
      const timeUntilNextMining = user.canMineAt - new Date();
      const hoursLeft = Math.ceil(timeUntilNextMining / (1000 * 60 * 60));
      throw new ApiError(400, `You can mine again in ${hoursLeft} hours`);
    }

    next();
  } catch (error) {
    throw new ApiError(500, 'Error checking mining eligibility');
  }
};

// Log user activity
const logActivity = (activityType) => {
  return async (req, res, next) => {
    try {
      // Update user's last activity
      if (req.user) {
        req.user.lastLogin = new Date();
        await req.user.save({ validateBeforeSave: false });

        // Log specific activity if needed
        if (activityType) {
          await Activity.createActivity({
            type: activityType,
            user: req.user._id,
            college: req.user.college,
            title: `User ${activityType}`,
            data: {
              ipAddress: req.ip,
              userAgent: req.get('User-Agent')
            }
          });
        }
      }
      next();
    } catch (error) {
      // Don't block the request if activity logging fails
      console.error('Activity logging error:', error);
      next();
    }
  };
};

// Validate college admin domain
const validateCollegeEmail = async (req, res, next) => {
  try {
    const { workEmail, collegeId, role } = req.body;

    // Only validate for college admins
    if (role !== 'college_admin' || !workEmail || !collegeId) {
      return next();
    }

    const college = await College.findById(collegeId);

    if (!college) {
      throw new ApiError(404, 'College not found');
    }

    // Extract domain from email
    const emailDomain = workEmail.split('@')[1];

    // College admins must use .edu email addresses
    if (!workEmail.endsWith('.edu')) {
      throw new ApiError(400, 'College admins must use a .edu email address');
    }

    // Check if email domain matches college domain (optional additional validation)
    if (college.website) {
      try {
        const collegeUrl = new URL(college.website);
        const collegeDomain = collegeUrl.hostname.replace('www.', '');
        const collegeBaseName = collegeDomain.split('.')[0];
        
        // Check if the edu domain contains the college name
        if (!emailDomain.toLowerCase().includes(collegeBaseName.toLowerCase())) {
          console.warn(`Email domain ${emailDomain} may not match college ${college.name}`);
          // Don't throw error, just warn - some colleges have different domain patterns
        }
      } catch (urlError) {
        // Invalid college website URL, skip domain matching
        console.warn('Invalid college website URL, skipping domain validation');
      }
    }

    next();
  } catch (error) {
    throw new ApiError(500, 'Error validating college email');
  }
};

// Check if user can perform action on college
const checkCollegeAccess = async (req, res, next) => {
  try {
    const collegeId = req.params.collegeId || req.body.collegeId || req.params.id;
    const user = req.user;

    // Platform admins can access all colleges
    if (user.role === 'platform_admin') {
      return next();
    }

    // College admins can only access their own college
    if (user.role === 'college_admin') {
      const college = await College.findById(collegeId);

      if (!college) {
        throw new ApiError(404, 'College not found');
      }

      if (college.admin.toString() !== user._id.toString()) {
        throw new ApiError(403, 'Not authorized to access this college');
      }
    }

    // Students can only access their own college
    if (user.role === 'student') {
      if (user.college.toString() !== collegeId) {
        throw new ApiError(403, 'Not authorized to access this college');
      }
    }

    next();
  } catch (error) {
    throw new ApiError(500, 'Error checking college access');
  }
};

// Export all functions as named exports
export {
  protect,
  authorize,
  requireVerification,
  requireAdminVerification,
  checkOwnership,
  rateLimitSensitive,
  checkMiningEligibility,
  logActivity,
  validateCollegeEmail,
  checkCollegeAccess
};
