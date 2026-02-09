import apiClient from './apiClient';

export const bridgeApi = {
  // Initiate OAuth link with Intuition Exchange
  initiateLink: () => apiClient.post('/bridge/initiate-link'),

  // Get current bridge link status
  getStatus: () => apiClient.get('/bridge/status'),

  // Unlink Exchange account
  unlink: () => apiClient.post('/bridge/unlink'),

  // Initiate migration of balances to Exchange
  initiateMigration: () => apiClient.post('/bridge/migrate/initiate'),

  // Get migration status
  getMigrationStatus: () => apiClient.get('/bridge/migrate/status'),
};
