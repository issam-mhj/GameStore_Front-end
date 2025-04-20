import api from './axios';

const LOCAL_STORAGE_CART_KEY = 'gameexpress-cart';

// Cart operations
// API calls 
// LocalStorage
export const cartService = {



    // Load from db
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

  //Load from local storage
  loadFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  },

//Save to local storage
  saveToLocalStorage(items) {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  },
//Clear from local 
  clearLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
  },

 //add / update from db
  async addOrUpdateItemOnServer(item) {
    try {
      const response = await api.post('/v2/cart/add', { 
        product_id: item.id,
        quantity: item.quantite
      });
      return response;
    } catch (error) {
      console.error("Error adding item to server cart:", error);
      throw error;
    }
  },


  async saveToServer(items) {
    try {
      if (!items.length) return null;
      
      const promises = items.map(item => 
        this.addOrUpdateItemOnServer(item)
      );
      
      const responses = await Promise.all(promises);
      return responses[responses.length - 1];
    } catch (error) {
      console.error("Error saving cart to server:", error);
      throw error;
    }
  },
  
//remove item
  async removeItemFromServer(productId) {
    try {
      const response = await api.delete(`/v2/cart/remove/${productId}`);
      return response;
    } catch (error) {
      console.error(`Error removing item ${productId} from server cart:`, error);
      throw error;
    }
  },
  
//clear cart
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