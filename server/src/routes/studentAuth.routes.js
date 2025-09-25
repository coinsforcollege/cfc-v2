import { Router } from 'express';
import { body } from 'express-validator';
import {
  studentRegisterStep1,
  studentRegisterStep2,
  studentRegisterStep3,
  studentRegisterStep4,
  resendVerificationCodes
} from '../controllers/studentAuth.controllers.js';
import validate from '../middlewares/validation.js';

const router = Router();

// Step 1 Validation - Basic Information
const step1Validation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  body('termsAccepted')
    .custom(value => value === true || value === "true")
    .withMessage('You must accept the terms and conditions')
];

// Step 2 Validation - College Selection
const step2Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  body('collegeId')
    .if((value, { req }) => !req.body.createNewCollege)
    .isMongoId()
    .withMessage('Please select a valid college'),
  body('graduationYear')
    .isInt({ min: 2024, max: 2030 })
    .withMessage('Please provide a valid graduation year (2024-2030)'),
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

// Step 3 Validation - Verification
const step3Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('requestCodes')
    .optional()
    .isBoolean()
    .withMessage('requestCodes must be a boolean'),
  body('emailCode')
    .if(body('requestCodes').not().equals(true))
    .matches(/^\d{6}$/)
    .withMessage('Email verification code must be 6 digits'),
  body('phoneCode')
    .if(body('requestCodes').not().equals(true))
    .matches(/^\d{6}$/)
    .withMessage('Phone verification code must be 6 digits')
];

// Step 4 Validation - Referral (Optional)
const step4Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('userId')
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('referralCode')
    .optional()
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage('Referral code must be between 6 and 10 characters'),
  body('skipReferral')
    .optional()
    .isBoolean()
    .withMessage('skipReferral must be a boolean')
];

// Resend codes validation
const resendCodesValidation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
];

// Student Registration Routes
router.post('/register/step1', step1Validation, validate, studentRegisterStep1);
router.post('/register/step2', step2Validation, validate, studentRegisterStep2);
router.post('/register/step3', step3Validation, validate, studentRegisterStep3);
router.post('/register/step4', step4Validation, validate, studentRegisterStep4);
router.post('/resend-codes', resendCodesValidation, validate, resendVerificationCodes);

export default router;