import { apiClient } from '../config/api';

export const articleService = {
  getArticles: async (page = 1, limit = 10, category = null, search = null, specifications = null) => {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      if (search) params.search = search;
      if (specifications) params.specifications = specifications;
      
      const response = await apiClient.get('/articles', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArticle: async (id) => {
    try {
      const response = await apiClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  searchArticles: async (query, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/articles/search', {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArticlesByIds: async (ids) => {
    try {
      const response = await apiClient.get('/articles', {
        params: { ids: ids.join(',') },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArticlesByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/articles', {
        params: { category, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArticlesBySpecifications: async (specifications, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/articles', {
        params: { specifications: specifications.join(','), page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 