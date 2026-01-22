import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import {
  getPendingSubmissions,
  getSubmissionById,
  approveSubmission,
  rejectSubmission,
  getReviewStats
} from '../controllers/taskReview.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('platform_admin', 'admin'));

router.get('/stats', getReviewStats);
router.get('/', getPendingSubmissions);
router.get('/:id', getSubmissionById);
router.put('/:id/approve', approveSubmission);
router.put('/:id/reject', rejectSubmission);

export default router;
