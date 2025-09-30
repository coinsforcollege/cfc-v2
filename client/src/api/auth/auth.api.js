import apiClient from "../apiClient";

const AUTH_BASE_URL = '/auth';

export const authApi = {
  // Common authentication
  login: (data) => apiClient.post(`${AUTH_BASE_URL}/login`, data),
  logout: () => apiClient.post(`${AUTH_BASE_URL}/logout`),
  getMe: () => apiClient.get(`${AUTH_BASE_URL}/me`),
  refreshToken: (data) => apiClient.post(`${AUTH_BASE_URL}/refresh-token`, data),
  
  // Password management
  forgotPassword: (data) => apiClient.post(`${AUTH_BASE_URL}/forgot-password`, data),
  resetPassword: (data) => apiClient.put(`${AUTH_BASE_URL}/reset-password`, data),
  updatePassword: (data) => apiClient.put(`${AUTH_BASE_URL}/update-password`, data),
  
  // Profile management
  updateDetails: (data) => apiClient.put(`${AUTH_BASE_URL}/update-details`, data),
  
  // Email and phone verification
  verifyEmail: (token) => apiClient.get(`${AUTH_BASE_URL}/verify-email/${token}`),
  verifyPhone: (data) => apiClient.post(`${AUTH_BASE_URL}/verify-phone`, data),
  resendVerification: (data) => apiClient.post(`${AUTH_BASE_URL}/resend-verification`, data),
};

