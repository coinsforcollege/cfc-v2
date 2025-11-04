import express from 'express';
import {
  submitApplication,
  getMyApplication,
  getAllApplications,
  getApplication,
  updateApplicationStatus
} from '../controllers/ambassador.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// User routes
router.post('/apply', protect, authorize('user'), submitApplication);
router.get('/my-application', protect, authorize('user'), getMyApplication);

// Platform Admin routes
router.get('/applications', protect, authorize('platform_admin'), getAllApplications);
router.get('/applications/:id', protect, authorize('platform_admin'), getApplication);
router.put('/applications/:id/status', protect, authorize('platform_admin'), updateApplicationStatus);

export default router;

