import { apiClient } from '../config/api';

export const paymentService = {
  createCheckout: async (items, metadata = {}) => {
    try {
      const response = await apiClient.post('/stripe/create-checkout', {
        items,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCartCheckout: async (cartItems, options = {}) => {
    try {
      // Transform cart items to the format expected by the API
      const lineItems = cartItems.map(item => {
        // More robust product ID detection
        const productId = item.productId || item.product?.id || item.articleId || item.id;
        
        console.log('Cart item for checkout:', {
          originalItem: item,
          mappedProductId: productId,
          quantity: item.quantity
        });
        
        return {
          productId,
          quantity: item.quantity || 1,
        };
      });

      console.log('Final line items for API:', lineItems);

      const payload = {
        lineItems,
        successUrl: options.successUrl || 'cynastore://checkout/success',
        cancelUrl: options.cancelUrl || 'cynastore://checkout/cancel',
        metadata: options.metadata || {},
      };

      console.log('Checkout payload:', payload);

      const response = await apiClient.post('/stripe/create-cart-checkout', payload);
      return response.data;
    } catch (error) {
      console.error('createCartCheckout error:', error);
      throw error.response?.data || error;
    }
  },

  createCompanyCheckout: async (companyId, cartItems, options = {}) => {
    try {
      // Transform cart items to the format expected by the API
      const lineItems = cartItems.map(item => ({
        productId: item.productId || item.product?.id || item.id,
        quantity: item.quantity || 1,
      }));

      const payload = {
        companyId,
        lineItems,
        successUrl: options.successUrl || 'cynastore://checkout/success',
        cancelUrl: options.cancelUrl || 'cynastore://checkout/cancel',
        metadata: options.metadata || {},
      };

      const response = await apiClient.post('/stripe/create-company-checkout', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createPortalSession: async () => {
    try {
      const response = await apiClient.post('/stripe/create-portal');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifySession: async (sessionId) => {
    try {
      const response = await apiClient.post('/stripe/verify-session', {
        sessionId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 