import express from 'express';
import {
  addCollegeToMiningList,
  removeCollegeFromMiningList,
  getWallet,
  getDashboard,
  setPrimaryCollege,
  completeOnboarding
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication and user role
router.use(protect, authorize('user'));

router.get('/dashboard', getDashboard);
router.get('/wallet', getWallet);
router.post('/colleges/add', upload.single('logoFile'), addCollegeToMiningList);
router.post('/colleges/set-primary', setPrimaryCollege);
router.delete('/colleges/:collegeId', removeCollegeFromMiningList);
router.post('/complete-onboarding', completeOnboarding);

export default router;

