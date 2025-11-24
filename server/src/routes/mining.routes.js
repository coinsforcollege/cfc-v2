import express from 'express';
import {
  startMining,
  startAllMining,
  stopMining,
  stopAllMining,
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
router.post('/start-all', protect, authorize('user'), startAllMining);
router.post('/stop/:collegeId', protect, authorize('user'), stopMining);
router.post('/stop-all', protect, authorize('user'), stopAllMining);
router.get('/status', authorize('user'), getMiningStatus);
router.get('/status/:collegeId', authorize('user'), getMiningStatusForCollege);

// Auto-stop expired sessions (can be called by cron or admin)
router.post('/auto-stop', authorize('platform_admin'), autoStopExpiredSessions);

export default router;

