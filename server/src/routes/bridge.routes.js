import express from 'express';
import {
  initiateLink,
  handleCallback,
  getLinkStatus,
  unlinkExchange,
  initiateMigration,
  getMigrationStatus,
  getCollegesForExchange,
  notifyExchangeCollegeUpdate
} from '../controllers/bridge.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public route - Exchange redirects here after authorization
router.get('/callback', handleCallback);

// Protected routes - user role only
router.post('/initiate-link', protect, authorize('user'), initiateLink);
router.get('/status', protect, authorize('user'), getLinkStatus);
router.post('/unlink', protect, authorize('user'), unlinkExchange);
router.post('/migrate/initiate', protect, authorize('user'), initiateMigration);
router.get('/migrate/status', protect, authorize('user'), getMigrationStatus);

// Server-to-server routes (X-Bridge-Secret auth, no user auth needed)
router.get('/colleges', getCollegesForExchange);
router.post('/colleges/notify', notifyExchangeCollegeUpdate);

export default router;
