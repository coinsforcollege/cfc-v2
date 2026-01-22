import apiClient from './apiClient';

export const platformAdminTaskApi = {
  // Categories
  createCategory: (data) => apiClient.post('/categories', data),
  getAllCategories: () => apiClient.get('/categories'),
  updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),

  // Tasks
  createTask: (formData) => apiClient.post('/tasks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllTasks: (params) => apiClient.get('/tasks', { params }),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  updateTask: (id, formData) => apiClient.put(`/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  bulkDeleteTasks: (ids) => apiClient.post('/tasks/bulk-delete', { ids }),
  duplicateTask: (id) => apiClient.post(`/tasks/${id}/duplicate`),

  // Task Reviews
  getReviewStats: () => apiClient.get('/task-reviews/stats'),
  getPendingSubmissions: (params) => apiClient.get('/task-reviews', { params }),
  getSubmissionById: (id) => apiClient.get(`/task-reviews/${id}`),
  approveSubmission: (id) => apiClient.put(`/task-reviews/${id}/approve`),
  rejectSubmission: (id, feedback) => apiClient.put(`/task-reviews/${id}/reject`, { feedback }),
};
