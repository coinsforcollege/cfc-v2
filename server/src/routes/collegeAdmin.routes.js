import express from 'express';
import {
  getDashboard,
  updateCollegeDetails,
  updateTokenPreferences,
  addCollegeImages,
  viewCommunity
} from '../controllers/collegeAdmin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and college admin role
router.use(protect, authorize('college_admin'));

router.get('/dashboard', getDashboard);
router.put('/college/details', updateCollegeDetails);
router.put('/college/token-preferences', updateTokenPreferences);
router.post('/college/images', addCollegeImages);
router.get('/community', viewCommunity);

export default router;

