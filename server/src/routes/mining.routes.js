import express from 'express';
import {
  startMining,
  stopMining,
  getMiningStatus,
  getMiningStatusForCollege,
  autoStopExpiredSessions
} from '../controllers/mining.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and student role
router.use(protect);

// Mining operations (students only)
router.post('/start/:collegeId', authorize('student'), startMining);
router.post('/stop/:collegeId', authorize('student'), stopMining);
router.get('/status', authorize('student'), getMiningStatus);
router.get('/status/:collegeId', authorize('student'), getMiningStatusForCollege);

// Auto-stop expired sessions (can be called by cron or admin)
router.post('/auto-stop', authorize('platform_admin'), autoStopExpiredSessions);

export default router;

