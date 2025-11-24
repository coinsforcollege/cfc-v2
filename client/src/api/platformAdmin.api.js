import apiClient from './apiClient';

export const platformAdminApi = {
  // Stats
  getStats: () => apiClient.get('/platform-admin/stats'),

  // Users
  getAllStudents: (params) => apiClient.get('/platform-admin/users', { params }),
  getStudentDetails: (id) => apiClient.get(`/platform-admin/users/${id}`),
  updateStudent: (id, data) => apiClient.put(`/platform-admin/users/${id}`, data),
  deleteStudent: (id) => apiClient.delete(`/platform-admin/users/${id}`),
  resetStudentPassword: (id, data) => apiClient.put(`/platform-admin/users/${id}/reset-password`, data),
  addStudentBalance: (id, data) => apiClient.post(`/platform-admin/users/${id}/add-balance`, data),

  // College Admins
  getAllCollegeAdmins: (params) => apiClient.get('/platform-admin/college-admins', { params }),
  getCollegeAdminDetails: (id) => apiClient.get(`/platform-admin/college-admins/${id}`),
  updateCollegeAdmin: (id, data) => apiClient.put(`/platform-admin/college-admins/${id}`, data),
  deleteCollegeAdmin: (id) => apiClient.delete(`/platform-admin/college-admins/${id}`),
  resetCollegeAdminPassword: (id, data) => apiClient.put(`/platform-admin/college-admins/${id}/reset-password`, data),
  removeCollegeAdmin: (id) => apiClient.put(`/platform-admin/college-admins/${id}/remove`),
  assignCollegeAdmin: (id, data) => apiClient.put(`/platform-admin/users/${id}/assign-college-admin`, data),
  reassignCollegeAdmin: (adminId, newCollegeId) => apiClient.put(`/platform-admin/college-admins/${adminId}/reassign`, { newCollegeId }),

  // Colleges
  getAllColleges: (params) => apiClient.get('/platform-admin/colleges', { params }),
  getCollegeDetails: (id) => apiClient.get(`/platform-admin/colleges/${id}`),
  createCollege: (data) => apiClient.post('/platform-admin/colleges', data),
  updateCollege: (id, data) => apiClient.put(`/platform-admin/colleges/${id}`, data),
  deleteCollege: (id) => apiClient.delete(`/platform-admin/colleges/${id}`),
  bulkImportPreview: (formData) => apiClient.post('/platform-admin/colleges/bulk-import-preview', formData),
  bulkImportConfirm: (data) => apiClient.post('/platform-admin/colleges/bulk-import-confirm', data),

  // Earning Rates
  updateCollegeRates: (id, data) => apiClient.put(`/platform-admin/colleges/${id}/rates`, data),
  updateDefaultRates: (data) => apiClient.put('/platform-admin/default-rates', data),
};

