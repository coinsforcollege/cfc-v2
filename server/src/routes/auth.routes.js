import express from 'express';
import {
  registerUser,
  registerStudent,
  registerCollegeAdmin,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
  changePasswordWithOTP,
  updateLanguagePreference,
  resetPassword
} from '../controllers/auth.controller.js';
import {
  sendOTPForUser,
  sendOTPForStudent,
  sendOTPForCollege,
  verifyOTP,
  resendOTP,
  sendOTPForPasswordChange,
  verifyOTPForPasswordChange,
  resendOTPForPasswordChange,
  sendOTPForForgotPassword,
  verifyOTPForForgotPassword
} from '../controllers/otp.controller.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// OTP routes (public)
router.post('/otp/send/user', sendOTPForUser);
router.post('/otp/send/student', sendOTPForStudent);
router.post('/otp/send/college', sendOTPForCollege);
router.post('/otp/verify', verifyOTP);
router.post('/otp/resend', resendOTP);
router.post('/otp/send/forgot-password', sendOTPForForgotPassword);
router.post('/otp/verify/forgot-password', verifyOTPForForgotPassword);

// OTP routes (protected)
router.post('/otp/send/password-change', protect, sendOTPForPasswordChange);
router.post('/otp/verify/password-change', protect, verifyOTPForPasswordChange);
router.post('/otp/resend/password-change', protect, resendOTPForPasswordChange);

// Public routes
router.post('/register/user', registerUser);
router.post('/register/student', registerStudent);
router.post('/register/college', upload.single('logoFile'), registerCollegeAdmin);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/change-password-with-otp', protect, changePasswordWithOTP);
router.put('/language', protect, updateLanguagePreference);

export default router;

