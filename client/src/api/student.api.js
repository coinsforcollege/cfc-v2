import apiClient from './apiClient';

export const studentApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/student/dashboard'),
  
  // Wallet
  getWallet: () => apiClient.get('/student/wallet'),
  
  // Colleges
  addCollege: (data) => apiClient.post('/student/colleges/add', data),
  removeCollege: (collegeId) => apiClient.delete(`/student/colleges/${collegeId}`),
  setPrimaryCollege: (collegeId) => apiClient.post('/student/colleges/set-primary', { collegeId }),
};

