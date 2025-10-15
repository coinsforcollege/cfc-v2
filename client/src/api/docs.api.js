import apiClient from './apiClient';

export const docsApi = {
  // Get all categories with article counts
  getCategories: async () => {
    const response = await apiClient.get('/docs/categories');
    return response;
  },

  // Get single category by slug with articles
  getCategoryBySlug: async (slug) => {
    const response = await apiClient.get(`/docs/categories/${slug}`);
    return response;
  },

  // Get single article by category slug and article slug
  getArticle: async (categorySlug, articleSlug) => {
    const response = await apiClient.get(`/docs/${categorySlug}/${articleSlug}`);
    return response;
  },

  // Get related articles
  getRelatedArticles: async (categorySlug, articleSlug, limit = 3) => {
    const response = await apiClient.get(`/docs/${categorySlug}/${articleSlug}/related`, {
      params: { limit }
    });
    return response;
  },

  // Search articles
  searchArticles: async (query) => {
    const response = await apiClient.get('/docs/search', {
      params: { q: query }
    });
    return response;
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    const response = await apiClient.get('/docs/featured');
    return response;
  }
};
