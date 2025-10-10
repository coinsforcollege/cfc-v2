import apiClient from './apiClient';

export const platformAdminApi = {
  // Stats
  getStats: () => apiClient.get('/platform-admin/stats'),

  // Students
  getAllStudents: (params) => apiClient.get('/platform-admin/students', { params }),
  getStudentDetails: (id) => apiClient.get(`/platform-admin/students/${id}`),
  updateStudent: (id, data) => apiClient.put(`/platform-admin/students/${id}`, data),
  deleteStudent: (id) => apiClient.delete(`/platform-admin/students/${id}`),
  resetStudentPassword: (id, data) => apiClient.put(`/platform-admin/students/${id}/reset-password`, data),
  addStudentBalance: (id, data) => apiClient.post(`/platform-admin/students/${id}/add-balance`, data),

  // Colleges
  getAllColleges: (params) => apiClient.get('/platform-admin/colleges', { params }),
  getCollegeDetails: (id) => apiClient.get(`/platform-admin/colleges/${id}`),
  createCollege: (data) => apiClient.post('/platform-admin/colleges', data),
  updateCollege: (id, data) => apiClient.put(`/platform-admin/colleges/${id}`, data),
  deleteCollege: (id) => apiClient.delete(`/platform-admin/colleges/${id}`),

  // Earning Rates
  updateCollegeRates: (id, data) => apiClient.put(`/platform-admin/colleges/${id}/rates`, data),
  updateDefaultRates: (data) => apiClient.put('/platform-admin/default-rates', data),
};

