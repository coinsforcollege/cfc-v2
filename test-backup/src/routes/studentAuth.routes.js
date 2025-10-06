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
  body('college')
    .if((_, { req }) => !req.body.createNewCollege)
    .isMongoId()
    .withMessage('Please select a valid college'),
  body('graduationYear')
    .isInt({ min: 2024, max: 2030 })
    .withMessage('Please provide a valid graduation year (2024-2030)'),
];

// Step 3 Validation - Verification
const step3Validation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Session token is required'),
  body('emailCode')
    .matches(/^\d{6}$/)
    .withMessage('Email verification code must be 6 digits'),
  body('phoneCode')
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
];

// Student Registration Routes
router.post('/register/step1', step1Validation, validate, studentRegisterStep1);
router.post('/register/step2', step2Validation, validate, studentRegisterStep2);
router.post('/register/step3', step3Validation, validate, studentRegisterStep3);
router.post('/register/step4', step4Validation, validate, studentRegisterStep4);
router.post('/resend-codes', resendCodesValidation, validate, resendVerificationCodes);

export default router;