import apiClient from './apiClient';

export const authApi = {
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
};

