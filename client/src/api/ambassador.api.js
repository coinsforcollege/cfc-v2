import apiClient from './apiClient';

export const ambassadorApi = {
  // Submit application
  submitApplication: async (applicationData) => {
    const response = await apiClient.post('/ambassador/apply', applicationData);
    return response;
  },

  // Get student's own application
  getMyApplication: async () => {
    const response = await apiClient.get('/ambassador/my-application');
    return response;
  },

  // Platform Admin: Get all applications
  getAllApplications: async (params = {}) => {
    const response = await apiClient.get('/ambassador/applications', { params });
    return response;
  },

  // Platform Admin: Get single application
  getApplication: async (id) => {
    const response = await apiClient.get(`/ambassador/applications/${id}`);
    return response;
  },

  // Platform Admin: Update application status
  updateApplicationStatus: async (id, status, reviewNotes) => {
    const response = await apiClient.put(`/ambassador/applications/${id}/status`, {
      status,
      reviewNotes
    });
    return response;
  }
};

