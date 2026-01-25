import apiClient from './apiClient';

export const collegeAdminApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/college-admin/dashboard'),

  // College selection
  selectCollege: (formData) => apiClient.post('/college-admin/select-college', formData),

  // College management
  updateCollegeDetails: (data) => apiClient.put('/college-admin/college/details', data),
  updateTokenPreferences: (data) => apiClient.put('/college-admin/college/token-preferences', data),
  addImages: (images) => apiClient.post('/college-admin/college/images', { images }),

  // Community
  viewCommunity: () => apiClient.get('/college-admin/community'),

  // Leaderboard
  getLeaderboard: (search) => apiClient.get('/college-admin/leaderboard', { params: { search } }),

  // Student browsing
  getStudents: (params) => apiClient.get('/college-admin/students', { params }),
  getStudentDetails: (id) => apiClient.get(`/college-admin/students/${id}`),
  getStudentPointsHistory: (id, params) => apiClient.get(`/college-admin/students/${id}/points-history`, { params }),
  getStudentDocuments: (id) => apiClient.get(`/college-admin/students/${id}/documents`),

  // Offer management
  getLetterTemplate: () => apiClient.get('/college-admin/offers/letter-template'),
  getOffers: (params) => apiClient.get('/college-admin/offers', { params }),
  createOffer: (data) => apiClient.post('/college-admin/offers', data),
  getOfferDetails: (id) => apiClient.get(`/college-admin/offers/${id}`),
  updateOffer: (id, data) => apiClient.put(`/college-admin/offers/${id}`, data),
  deleteOffer: (id) => apiClient.delete(`/college-admin/offers/${id}`),
  getOfferResponses: (id, params) => apiClient.get(`/college-admin/offers/${id}/responses`, { params }),
};

