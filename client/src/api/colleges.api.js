import apiClient from './apiClient';

export const collegesApi = {
  // Public endpoints
  getAll: (params) => apiClient.get('/colleges', { params }),
  getById: (id) => apiClient.get(`/colleges/${id}`),
  search: (query) => apiClient.get('/colleges/search', { params: { q: query } }),
  getGlobalStats: () => apiClient.get('/colleges/global-stats'),
  getMetadata: () => apiClient.get('/colleges/metadata'),
};

