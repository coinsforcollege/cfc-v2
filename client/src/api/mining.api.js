import apiClient from './apiClient';

export const miningApi = {
  // Start/Stop mining
  // Start/Stop mining
  startMining: (collegeId) => apiClient.post(`/mining/start/${collegeId}`),
  startAllMining: () => apiClient.post('/mining/start-all'),
  stopMining: (collegeId) => apiClient.post(`/mining/stop/${collegeId}`),
  stopAllMining: () => apiClient.post('/mining/stop-all'),
  
  // Status
  getMiningStatus: () => apiClient.get('/mining/status'),
  getMiningStatusForCollege: (collegeId) => apiClient.get(`/mining/status/${collegeId}`),
};

