import express from 'express';
import {
  getAllColleges,
  getCollege,
  searchColleges,
  getCollegeMetadata
} from '../controllers/college.controller.js';

const router = express.Router();

// Public routes
router.get('/metadata', getCollegeMetadata);
router.get('/search', searchColleges);
router.get('/', getAllColleges);
router.get('/:id', getCollege);

export default router;

