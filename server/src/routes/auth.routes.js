import express from 'express';
import {
  registerStudent,
  registerCollegeAdmin,
  login,
  getMe,
  logout
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register/student', registerStudent);
router.post('/register/college', registerCollegeAdmin);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;

