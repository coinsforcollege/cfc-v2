import express from 'express';
import * as blogController from '../controllers/blog.controller.js';

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

// Admin routes (TODO: protect with auth middleware)
router.get('/subscribers', blogController.getSubscribers);
router.delete('/subscribers/:id', blogController.deleteSubscriber);

export default router;
