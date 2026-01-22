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
  duplicateTask: (id) => apiClient.post(`/tasks/${id}/duplicate`),
};
