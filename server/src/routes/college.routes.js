import express from 'express';
import {
  getAllColleges,
  getCollege,
  searchColleges,
  getCollegeMetadata,
  getGlobalStats,
  getFeaturedColleges
} from '../controllers/college.controller.js';

const router = express.Router();

// Public routes
router.get('/metadata', getCollegeMetadata);
router.get('/global-stats', getGlobalStats);
router.get('/featured', getFeaturedColleges);
router.get('/search', searchColleges);
router.get('/', getAllColleges);
router.get('/:id', getCollege);

export default router;

