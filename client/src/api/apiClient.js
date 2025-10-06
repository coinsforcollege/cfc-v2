import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
  headers: {
    'Content-Type': "application/json"
  }
});

// Interceptor to add an Authorization header with a Bearer token (if available) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
}, (error) => {
  return Promise.reject(error)
})

// TODO: Implement refresh token logic
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Just log errors, let TanStack Query handle them
    console.error('API Error:', error);
    
    // Only handle auth errors globally
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('authToken');
    //   window.location.href = '/login';
    // }

    const status = error.response?.status || error.status || 500;

    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const errors = error.response?.data?.errors || error.errors || [];
    
    return Promise.reject({ status, message, errors, originalError: error });
  }
);

export default apiClient;