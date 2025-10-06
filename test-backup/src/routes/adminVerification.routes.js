import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getPendingVerifications,
  verifyAdmin,
  getAdminVerificationDetails,
  getVerificationStats
} from '../controllers/adminVerification.controllers.js';
import { protect, authorize } from '../middlewares/auth.middlewares.js';
import validate from '../middlewares/validation.js';

const router = Router();

// Validation rules
const verifyAdminValidation = [
  body('approved')
    .isBoolean()
    .withMessage('Approved field must be a boolean'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot be more than 500 characters')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// All routes require platform admin access
router.use(protect);
router.use(authorize('platform_admin'));

// Admin verification routes
router.get('/pending-verifications', paginationValidation, validate, getPendingVerifications);
router.post('/verify-admin/:userId', verifyAdminValidation, validate, verifyAdmin);
router.get('/verification/:userId', getAdminVerificationDetails);
router.get('/verification-stats', getVerificationStats);

export default router;
