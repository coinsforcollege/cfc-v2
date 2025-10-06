import express from 'express';
import {
  addCollegeToMiningList,
  removeCollegeFromMiningList,
  getWallet,
  getDashboard,
  setPrimaryCollege
} from '../controllers/student.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and student role
router.use(protect, authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/wallet', getWallet);
router.post('/colleges/add', addCollegeToMiningList);
router.post('/colleges/set-primary', setPrimaryCollege);
router.delete('/colleges/:collegeId', removeCollegeFromMiningList);

export default router;

