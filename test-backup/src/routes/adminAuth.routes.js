import { Router } from 'express';
import { body } from 'express-validator';
import {
  adminRegisterStep1,
  adminRegisterStep2,
  adminRegisterStep3,
  adminRegisterStep4,
  completeAdminRegistration
} from '../controllers/adminAuth.controllers.js';
import { protect, requireVerification, validateCollegeEmail } from '../middlewares/auth.middlewares.js';
import validate from '../middlewares/validation.js';

const router = Router();

// Step 1 Validation - College Verification
const step1Validation = [
  body('workEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid work email'),
  body('position')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('collegeId')
    .if(body('createNewCollege').not().equals(true))
    .isMongoId()
    .withMessage('Please select a valid college'),
  body('createNewCollege')
    .optional()
    .isBoolean()
    .withMessage('createNewCollege must be a boolean'),
  
  // New college validation (only if creating new college)
  body('newCollegeData.name')
    .if(body('createNewCollege').equals(true))
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('College name must be between 2 and 200 characters'),
  body('newCollegeData.city')
    .if(body('createNewCollege').equals(true))
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City is required'),
  body('newCollegeData.state')
    .if(body('createNewCollege').equals(true))
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State is required'),
  body('newCollegeData.type')
    .if(body('createNewCollege').equals(true))
    .isIn(['public', 'private', 'community', 'technical', 'other'])
    .withMessage('Please select a valid college type'),
  body('newCollegeData.website')
    .if(body('createNewCollege').equals(true))
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
];

// Step 2 Validation - Personal Information
const step2Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('collegeId')
    .isMongoId()
    .withMessage('Valid college ID is required'),
  body('workEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid work email'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('workPhone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid work phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('position')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department cannot be more than 100 characters'),
  
  // Add role for email validation middleware
  body('role')
    .default('college_admin')
    .isIn(['college_admin'])
    .withMessage('Invalid role')
];

// Step 3 Validation - College Profile Setup
const step3Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('collegeId')
    .isMongoId()
    .withMessage('Valid college ID is required'),
  body('logo')
    .optional()
    .isString()
    .withMessage('Logo must be a valid string'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('establishedYear')
    .optional()
    .isInt({ min: 1600, max: new Date().getFullYear() })
    .withMessage('Please provide a valid establishment year'),
  body('enrollment.total')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total enrollment must be a positive number'),
  body('enrollment.undergraduate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Undergraduate enrollment must be a positive number'),
  body('enrollment.graduate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Graduate enrollment must be a positive number')
];

// Step 4 Validation - Token Configuration
const step4Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('collegeId')
    .isMongoId()
    .withMessage('Valid college ID is required'),
  body('skipTokenConfig')
    .optional()
    .isBoolean()
    .withMessage('skipTokenConfig must be a boolean'),
  
  // Token configuration validation (only if not skipping)
  body('tokenName')
    .if(body('skipTokenConfig').not().equals(true))
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Token name must be between 2 and 50 characters'),
  body('tokenSymbol')
    .if(body('skipTokenConfig').not().equals(true))
    .trim()
    .isLength({ min: 2, max: 10 })
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Token symbol must be 2-10 uppercase letters/numbers'),
  body('tokenDescription')
    .if(body('skipTokenConfig').not().equals(true))
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Token description cannot be more than 500 characters'),
  body('maxSupply')
    .if(body('skipTokenConfig').not().equals(true))
    .isInt({ min: 1000 })
    .withMessage('Max supply must be at least 1,000'),
  body('earnMethods')
    .if(body('skipTokenConfig').not().equals(true))
    .optional()
    .isArray()
    .withMessage('Earn methods must be an array'),
  body('spendMethods')
    .if(body('skipTokenConfig').not().equals(true))
    .optional()
    .isArray()
    .withMessage('Spend methods must be an array'),
  body('launchTimeline')
    .if(body('skipTokenConfig').not().equals(true))
    .optional()
    .isIn(['q1_2024', 'q2_2024', 'q3_2024', 'q4_2024', 'q1_2025', 'q2_2025', 'not_sure'])
    .withMessage('Please select a valid launch timeline')
];

// Complete registration validation
const completeValidation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('collegeId')
    .isMongoId()
    .withMessage('Valid college ID is required')
];

// Admin Registration Routes
router.post('/register/step1', step1Validation, validate, validateCollegeEmail, adminRegisterStep1);
router.post('/register/step2', step2Validation, validate, validateCollegeEmail, adminRegisterStep2);
router.post('/register/step3', protect, requireVerification, step3Validation, validate, adminRegisterStep3);
router.post('/register/step4', protect, requireVerification, step4Validation, validate, adminRegisterStep4);
router.post('/register/complete', protect, requireVerification, completeValidation, validate, completeAdminRegistration);

export default router;
