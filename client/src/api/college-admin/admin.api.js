import apiClient from "../apiClient";

const AUTH_BASE_URL = '/auth/admin';

export const adminApi = {
  // Multi-step registration
  adminRegisterStep1: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step1`, data),
  adminRegisterStep2: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step2`, data),
  adminRegisterStep3: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step3`, data),
  adminRegisterStep4: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step4`, data),
  adminRegisterComplete: (data) => apiClient.post(`${AUTH_BASE_URL}/register/complete`, data),
  
  // Email verification
  adminVerifyEmail: (data) => apiClient.post(`${AUTH_BASE_URL}/verify-email`, data),
  verifyEmail: (data) => apiClient.post(`${AUTH_BASE_URL}/verify-email-code`, data),
  resendVerificationCode: (data) => apiClient.post(`${AUTH_BASE_URL}/resend-verification`, data),
}