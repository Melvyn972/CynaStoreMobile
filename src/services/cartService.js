import { apiClient } from '../config/api';

export const cartService = {
  getCart: async () => {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await apiClient.post('/cart', {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.patch('/cart', {
        cartItemId: itemId,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const response = await apiClient.delete('/cart', {
        data: {
          cartItemId: itemId,
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      const response = await apiClient.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 