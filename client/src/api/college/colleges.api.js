import apiClient from "../apiClient";

const COLLEGES_BASE_URL = '/colleges';

export const collegesApi = {
  // College search and listing
  searchColleges: (params) => apiClient.get(`${COLLEGES_BASE_URL}/search`, { params }),
  getColleges: (params) => apiClient.get(`${COLLEGES_BASE_URL}`, { params }),
  getCollegeById: (id) => apiClient.get(`${COLLEGES_BASE_URL}/${id}`),
  getCollegeBySlug: (slug) => apiClient.get(`${COLLEGES_BASE_URL}/slug/${slug}`),
  
  // College statistics
  getCollegeStats: (id) => apiClient.get(`${COLLEGES_BASE_URL}/${id}/stats`),
  getTopColleges: (params) => apiClient.get(`${COLLEGES_BASE_URL}/top`, { params }),
  
  // Public college information
  getCollegePublicInfo: (id) => apiClient.get(`${COLLEGES_BASE_URL}/${id}/public`),
  getCollegeStudents: (id, params) => apiClient.get(`${COLLEGES_BASE_URL}/${id}/students`, { params }),
  addCollege: (data) => apiClient.post(`${COLLEGES_BASE_URL}`, data),
};

