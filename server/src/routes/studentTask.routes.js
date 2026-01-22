import express from 'express';
import { protect, optionalAuth } from '../middlewares/auth.js';
import submissionUpload from '../middlewares/submissionUpload.js';
import {
  getPublicTasks,
  getPublicTaskById,
  getPublicCategories,
  submitTask,
  getMySubmissions,
  getMyCompletedTasks,
  getTaskWithSubmissionStatus
} from '../controllers/studentTask.controller.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/categories', getPublicCategories);
// Optional auth - if user is logged in, exclude their completed/pending tasks
router.get('/', optionalAuth, getPublicTasks);

// Protected routes - must be before /:id wildcard
router.get('/my-submissions', protect, getMySubmissions);
router.get('/my-completed', protect, getMyCompletedTasks);

// Task-specific routes
router.get('/:id/status', protect, getTaskWithSubmissionStatus);
router.post('/:id/submit', protect, submissionUpload.array('files', 10), submitTask);

// Public task detail - wildcard must be last
router.get('/:id', getPublicTaskById);

export default router;
