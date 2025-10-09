import express from 'express';
import {
  getDashboard,
  selectCollege,
  updateCollegeDetails,
  updateTokenPreferences,
  addCollegeImages,
  viewCommunity
} from '../controllers/collegeAdmin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication and college admin role
router.use(protect, authorize('college_admin'));

router.post('/select-college', upload.single('logoFile'), selectCollege);
router.get('/dashboard', getDashboard);
router.put('/college/details', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), updateCollegeDetails);
router.put('/college/token-preferences', updateTokenPreferences);
router.post('/college/images', addCollegeImages);
router.get('/community', viewCommunity);

export default router;

