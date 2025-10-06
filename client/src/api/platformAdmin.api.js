import apiClient from './apiClient';

export const platformAdminApi = {
  // Stats
  getStats: () => apiClient.get('/platform-admin/stats'),
  
  // Students
  getAllStudents: (params) => apiClient.get('/platform-admin/students', { params }),
  getStudentDetails: (id) => apiClient.get(`/platform-admin/students/${id}`),
  
  // Colleges
  getAllColleges: (params) => apiClient.get('/platform-admin/colleges', { params }),
  getCollegeDetails: (id) => apiClient.get(`/platform-admin/colleges/${id}`),
  createCollege: (data) => apiClient.post('/platform-admin/colleges', data),
  updateCollege: (id, data) => apiClient.put(`/platform-admin/colleges/${id}`, data),
  deleteCollege: (id) => apiClient.delete(`/platform-admin/colleges/${id}`),
};

