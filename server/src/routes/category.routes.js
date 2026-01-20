import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// All routes are protected and restricted to admin/platform_admin
// Adjust roles as per existing auth middleware capability
// Assuming 'platform_admin' is the key role based on dashboard analysis
router.use(protect);
router.use(authorize('platform_admin', 'admin'));

router.route('/')
  .post(createCategory)
  .get(getAllCategories);

router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
