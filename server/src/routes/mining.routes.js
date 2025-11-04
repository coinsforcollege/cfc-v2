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

// All routes require authentication and user role
router.use(protect);

// Mining operations (users only)
router.post('/start/:collegeId', authorize('user'), startMining);
router.post('/stop/:collegeId', authorize('user'), stopMining);
router.get('/status', authorize('user'), getMiningStatus);
router.get('/status/:collegeId', authorize('user'), getMiningStatusForCollege);

// Auto-stop expired sessions (can be called by cron or admin)
router.post('/auto-stop', authorize('platform_admin'), autoStopExpiredSessions);

export default router;

