import express from 'express';
import {
  getPublicTasks,
  getPublicTaskById,
  getPublicCategories
} from '../controllers/studentTask.controller.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/categories', getPublicCategories);
router.get('/', getPublicTasks);
router.get('/:id', getPublicTaskById);

export default router;
