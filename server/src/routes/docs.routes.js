import express from 'express';
import * as docsController from '../controllers/docs.controller.js';

const router = express.Router();

// Public routes
router.get('/categories', docsController.getCategories);
router.get('/categories/:slug', docsController.getCategoryBySlug);
router.get('/search', docsController.searchArticles);
router.get('/featured', docsController.getFeaturedArticles);
router.get('/:categorySlug/:articleSlug/related', docsController.getRelatedArticles);
router.get('/:categorySlug/:articleSlug', docsController.getArticle);

export default router;
