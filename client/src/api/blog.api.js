import apiClient from './apiClient';

export const blogApi = {
  // Get all blog posts with filters
  getPosts: async (params = {}) => {
    const response = await apiClient.get('/blog/posts', { params });
    return response;
  },

  // Get single blog post by slug
  getPostBySlug: async (slug) => {
    const response = await apiClient.get(`/blog/posts/${slug}`);
    return response;
  },

  // Get categories
  getCategories: async () => {
    const response = await apiClient.get('/blog/categories');
    return response;
  },

  // Get tags
  getTags: async () => {
    const response = await apiClient.get('/blog/tags');
    return response;
  },

  // Get authors
  getAuthors: async () => {
    const response = await apiClient.get('/blog/authors');
    return response;
  },

  // Get comments for a post
  getComments: async (slug) => {
    const response = await apiClient.get(`/blog/posts/${slug}/comments`);
    return response;
  },

  // Create a comment
  createComment: async (slug, data) => {
    const response = await apiClient.post(`/blog/posts/${slug}/comments`, data);
    return response;
  },

  // Subscribe to newsletter
  subscribe: async (data) => {
    const response = await apiClient.post('/blog/subscribe', data);
    return response;
  },

  // Submit contact form
  submitContact: async (data) => {
    const response = await apiClient.post('/blog/contact', data);
    return response;
  }
};

