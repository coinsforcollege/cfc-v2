import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getCountries,
  getGradeLevels
} from '../controllers/student.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { uploadProfilePicture as uploadProfilePictureMiddleware } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/countries', getCountries);
router.get('/grade-levels', getGradeLevels);

// Protected routes - Student only
router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile-picture', uploadProfilePictureMiddleware.single('profilePicture'), uploadProfilePicture);
router.delete('/profile-picture', deleteProfilePicture);

export default router;
