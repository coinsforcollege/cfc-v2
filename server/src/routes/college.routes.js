import express from 'express';
import {
  getAllColleges,
  getCollege,
  searchColleges
} from '../controllers/college.controller.js';

const router = express.Router();

// Public routes
router.get('/search', searchColleges);
router.get('/', getAllColleges);
router.get('/:id', getCollege);

export default router;

