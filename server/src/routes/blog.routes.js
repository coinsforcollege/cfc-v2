import express from 'express';
import * as blogController from '../controllers/blog.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPostBySlug);
router.get('/categories', blogController.getCategories);
router.get('/tags', blogController.getTags);
router.get('/authors', blogController.getAuthors);

// Comment routes
router.get('/posts/:slug/comments', blogController.getComments);
router.post('/posts/:slug/comments', blogController.createComment);

// Subscribe route
router.post('/subscribe', blogController.subscribe);

// Contact form route
router.post('/contact', blogController.contactSubmission);

// Admin routes - Protected (Platform Admin only)
router.get('/subscribers', protect, authorize('platform_admin'), blogController.getSubscribers);
router.delete('/subscribers/:id', protect, authorize('platform_admin'), blogController.deleteSubscriber);

export default router;
