import express from 'express';
import { chat, getSuggestions } from '../controllers/hugoChat.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require student authentication
router.use(protect, authorize('student'));

router.post('/', chat);
router.get('/suggestions', getSuggestions);

export default router;
