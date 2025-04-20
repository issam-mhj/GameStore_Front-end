import api from './axios';

const LOCAL_STORAGE_CART_KEY = 'gameexpress-cart';

export const cartService = {
  async fetchFromServer() {
    try {
      const response = await api.get('/v2/cart/items');
      if (response.data && response.data.items) {
        return response.data.items.map(item => ({
          id: item.product_id,
          nom: item.product.name,
          prix: parseFloat(item.product.price),
          quantite: item.quantity,
          image: item.image_url || '/api/placeholder/250/180'
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching cart from server:", error);
      throw error;
    }
  },

  loadFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  },

  saveToLocalStorage(items) {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  },

  clearLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
  },

  async addOrUpdateItemOnServer(item) {
    try {
      // Use the appropriate endpoint and parameters to ensure quantities are treated as absolute values
      // Set replace=true to ensure the server replaces the quantity instead of adding to it
      const response = await api.post('/v2/cart/update', { 
        product_id: item.id,
        quantity: item.quantite,
        replace: true  // This tells the server to replace the quantity rather than add to it
      });
      return response;
    } catch (error) {
      // If the endpoint doesn't support the replace flag, try an alternative approach
      try {
        // First remove the item completely
        await this.removeItemFromServer(item.id);
        
        // Then add it with the new quantity
        const response = await api.post('/v2/cart/add', { 
          product_id: item.id,
          quantity: item.quantite
        });
        return response;
      } catch (secondError) {
        console.error("Error updating item in server cart:", secondError);
        throw secondError;
      }
    }
  },

  async saveToServer(items) {
    try {
      if (!items.length) return null;
      
      // Clear the cart first to ensure we're starting fresh
      await this.clearServerCart();
      
      // Now add each item with its correct quantity
      let lastResponse = null;
      
      for (const item of items) {
        lastResponse = await api.post('/v2/cart/add', { 
          product_id: item.id,
          quantity: item.quantite
        });
      }
      
      return lastResponse;
    } catch (error) {
      console.error("Error saving cart to server:", error);
      throw error;
    }
  },
  
  async removeItemFromServer(productId) {
    try {
      const response = await api.delete(`/v2/cart/remove/${productId}`);
      return response;
    } catch (error) {
      console.error(`Error removing item ${productId} from server cart:`, error);
      throw error;
    }
  },
  
  async clearServerCart() {
    try {
      const response = await api.post('/v2/cart/clear');
      return response;
    } catch (error) {
      console.error("Error clearing server cart:", error);
      throw error;
    }
  }
};