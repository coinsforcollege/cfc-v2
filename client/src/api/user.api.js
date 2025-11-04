import apiClient from './apiClient';

export const userApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/user/dashboard'),
  
  // Wallet
  getWallet: () => apiClient.get('/user/wallet'),
  
  // Colleges
  addCollege: (data) => apiClient.post('/user/colleges/add', data),
  removeCollege: (collegeId) => apiClient.delete(`/user/colleges/${collegeId}`),
  setPrimaryCollege: (collegeId) => apiClient.post('/user/colleges/set-primary', { collegeId }),

  // Onboarding
  completeOnboarding: () => apiClient.post('/user/complete-onboarding'),
};

