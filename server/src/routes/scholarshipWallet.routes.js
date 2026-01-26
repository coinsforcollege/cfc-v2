import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getMyWallet,
  getMyTransactions,
  getScholarshipAnalytics
} from '../controllers/scholarshipWallet.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/balance', getMyWallet);
router.get('/transactions', getMyTransactions);
router.get('/analytics', getScholarshipAnalytics);

export default router;
