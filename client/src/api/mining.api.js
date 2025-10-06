import apiClient from './apiClient';

export const miningApi = {
  // Start/Stop mining
  startMining: (collegeId) => apiClient.post(`/mining/start/${collegeId}`),
  stopMining: (collegeId) => apiClient.post(`/mining/stop/${collegeId}`),
  
  // Status
  getMiningStatus: () => apiClient.get('/mining/status'),
  getMiningStatusForCollege: (collegeId) => apiClient.get(`/mining/status/${collegeId}`),
};

