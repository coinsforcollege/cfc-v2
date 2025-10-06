import apiClient from './apiClient';

export const collegeAdminApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/college-admin/dashboard'),
  
  // College management
  updateCollegeDetails: (data) => apiClient.put('/college-admin/college/details', data),
  updateTokenPreferences: (data) => apiClient.put('/college-admin/college/token-preferences', data),
  addImages: (images) => apiClient.post('/college-admin/college/images', { images }),
  
  // Community
  viewCommunity: () => apiClient.get('/college-admin/community'),
};

