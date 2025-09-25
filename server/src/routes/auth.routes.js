import { Router } from 'express';
import { body } from 'express-validator';
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerification,
  resetPassword,
  updateDetails,
  updatePassword,
  verifyEmail,
  verifyPhone
} from '../controllers/auth.controllers.js';
import { protect, rateLimitSensitive } from '../middlewares/auth.middlewares.js';
import validate from '../middlewares/validation.js';

const router = Router();

// Validation rules (Deprecated endpoint - minimal validation)
const registerValidation = [
  body('role')
    .isIn(['student', 'college_admin'])
    .withMessage('Role must be either student or college_admin')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required')
];

const updateDetailsValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number')
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, rateLimitSensitive(5, 15), login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordValidation, validate, rateLimitSensitive(3, 60), forgotPassword);
router.put('/reset-password', resetPasswordValidation, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-phone', protect, verifyPhone);
router.post('/resend-verification', protect, rateLimitSensitive(3, 15), resendVerification);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetailsValidation, validate, updateDetails);
router.put('/update-password', protect, updatePasswordValidation, validate, updatePassword);

export default router;
