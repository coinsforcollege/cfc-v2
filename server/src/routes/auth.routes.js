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
  resetPassword,
  changeEmail,
  requestAccountDeletion,
  cancelAccountDeletion
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
  verifyOTPForForgotPassword,
  sendOTPForEmailChange,
  verifyOTPForEmailChange,
  sendOTPForAccountDeletion,
  verifyOTPForAccountDeletion
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
router.post('/otp/send/email-change', protect, sendOTPForEmailChange);
router.post('/otp/verify/email-change', protect, verifyOTPForEmailChange);
router.post('/otp/send/account-deletion', protect, sendOTPForAccountDeletion);
router.post('/otp/verify/account-deletion', protect, verifyOTPForAccountDeletion);

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
router.put('/change-email', protect, changeEmail);
router.post('/request-account-deletion', protect, requestAccountDeletion);
router.post('/cancel-account-deletion', protect, cancelAccountDeletion);

export default router;

