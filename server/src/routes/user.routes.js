import express from 'express';
import {
  addCollegeToMiningList,
  removeCollegeFromMiningList,
  getWallet,
  getDashboard,
  setPrimaryCollege,
  completeOnboarding,
  followCollege,
  unfollowCollege,
  expressInterest,
  removeInterest,
  getFollowedColleges,
  getInterestedColleges,
  getCollegeStatus
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication and user/student role
router.use(protect, authorize('user', 'student'));

router.get('/dashboard', getDashboard);
router.get('/wallet', getWallet);
router.post('/colleges/add', upload.single('logoFile'), addCollegeToMiningList);
router.post('/colleges/set-primary', setPrimaryCollege);
router.delete('/colleges/:collegeId', removeCollegeFromMiningList);
router.post('/complete-onboarding', completeOnboarding);

// Student college interactions (follow/interest)
router.get('/colleges/followed', getFollowedColleges);
router.post('/colleges/follow', followCollege);
router.delete('/colleges/follow/:collegeId', unfollowCollege);
router.get('/colleges/interested', getInterestedColleges);
router.post('/colleges/interested', expressInterest);
router.delete('/colleges/interested/:collegeId', removeInterest);
router.get('/colleges/:collegeId/status', getCollegeStatus);

export default router;

