import express from 'express';
import { body, query } from 'express-validator';
import {
  addCollege,
  getCollegeActivities,
  getCollegeById,
  getColleges,
  getCollegeStats,
  searchColleges
} from '../controllers/colleges.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';
import validate from '../middlewares/validation.js';

const router = express.Router();

// Validation rules
const searchValidation = [
  query('q').optional().trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('state').optional().trim(),
  query('type').optional().isIn(['public', 'private', 'community', 'technical', 'other']),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
];

const addCollegeValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('College name must be between 2 and 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City is required'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State is required'),
  body('type')
    .isIn(['public', 'private', 'community', 'technical', 'other'])
    .withMessage('Please select a valid college type'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
];

// Public routes
router.get('/', searchValidation, validate, getColleges);
router.get('/search', searchValidation, validate, searchColleges);
router.get('/:id', getCollegeById);
router.get('/:id/stats', getCollegeStats);
router.get('/:id/activities', getCollegeActivities);

// Protected routes
router.post('/', protect, addCollegeValidation, validate, addCollege);

export default router;
