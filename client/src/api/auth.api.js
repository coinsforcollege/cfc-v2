import apiClient from './apiClient';

export const authApi = {
  // OTP
  sendOTPStudent: (data) => apiClient.post('/auth/otp/send/student', data),
  sendOTPCollege: (data) => apiClient.post('/auth/otp/send/college', data),
  verifyOTP: (data) => apiClient.post('/auth/otp/verify', data),
  resendOTP: (data) => apiClient.post('/auth/otp/resend', data),

  // OTP for password change
  sendOTPForPasswordChange: (data) => apiClient.post('/auth/otp/send/password-change', data),
  verifyOTPForPasswordChange: (data) => apiClient.post('/auth/otp/verify/password-change', data),
  resendOTPForPasswordChange: () => apiClient.post('/auth/otp/resend/password-change'),

  // Register
  registerStudent: (data) => apiClient.post('/auth/register/student', data),
  registerCollege: (data) => apiClient.post('/auth/register/college', data),

  // Login
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),

  // Current user
  getMe: () => apiClient.get('/auth/me'),

  // Update profile
  updateProfile: (data) => apiClient.put('/auth/profile', data),

  // Change password
  changePassword: (data) => apiClient.put('/auth/change-password', data),
  changePasswordWithOTP: (data) => apiClient.put('/auth/change-password-with-otp', data),

  // Language preference
  updateLanguagePreference: (language) => apiClient.put('/auth/language', { language }),
};

