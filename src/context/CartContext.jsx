import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();

const LOCAL_STORAGE_CART_KEY = 'gameexpress-cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Load cart items when component mounts or authentication changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      if (isAuthenticated) {
        try {
          // Load cart from database for authenticated users
          await fetchCartFromServer();
        } catch (error) {
          console.error('Error loading cart from database:', error);
          // Fall back to local storage if API fails
          loadFromLocalStorage();
        }
      } else {
        // Load cart from localStorage for guest users
        loadFromLocalStorage();
      }
      
      setLoading(false);
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Save cart items whenever they change
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Save to database for authenticated users
        saveCartToServer(cartItems)
          .catch(error => console.error('Error saving cart to database:', error));
      } else {
        // Save to localStorage for guest users
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
      }
    }
  }, [cartItems, isAuthenticated, loading]);

  const fetchCartFromServer = async () => {
    try {
      const response = await api.get('/v2/cart/items');
      if (response.data && response.data.items) {
        const serverCart = response.data.items.map(item => ({
          id: item.product.product_id,
          nom: item.product.name,
          prix: item.product.price,
          quantite: item.quantity,
          image: item.image_url || '/api/placeholder/250/180'
        }));
        
        setCartItems(serverCart);
        return serverCart;
      }
      return [];
    } catch (error) {
      console.error("Error fetching cart from server:", error);
      throw error;
    }
  };

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        return parsedCart;
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return [];
      }
    }
    return [];
  };

  const saveCartToServer = async (items) => {
    if (!isAuthenticated) return;
    
    try {
      const cartData = items.map(item => ({
        product_id: item.id,
        quantity: item.quantite
      }));
      
      await api.post('/v2/cart/add', { items: cartData });
    } catch (error) {
      console.error("Error saving cart to server:", error);
      throw error;
    }
  };

  // Function to merge carts when user logs in
  const mergeCartsOnLogin = async () => {
    try {
      // Get the local cart
      const localCart = loadFromLocalStorage();
      
      if (localCart.length === 0) return;
      
      // Get the server cart
      const serverCart = await fetchCartFromServer();
      
      // Merge the carts (only add items not already in server cart)
      const mergedCart = [...serverCart];
      let hasNewItems = false;
      
      localCart.forEach(localItem => {
        const existingItem = mergedCart.find(item => item.id === localItem.id);
        if (existingItem) {
          // Item exists, update quantity if local quantity is higher
          if (localItem.quantite > existingItem.quantite) {
            existingItem.quantite = localItem.quantite;
            hasNewItems = true;
          }
        } else {
          // Item doesn't exist, add it
          mergedCart.push(localItem);
          hasNewItems = true;
        }
      });
      
      if (hasNewItems) {
        // Save the merged cart to server
        await saveCartToServer(mergedCart);
        setCartItems(mergedCart);
        
        // Clear local storage cart after successful merge
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
        
        return { success: true, message: "Votre panier local a été synchronisé avec votre compte" };
      }
      
      return { success: true, message: "Aucun nouvel article à synchroniser" };
    } catch (error) {
      console.error("Error during cart merging:", error);
      return { success: false, message: "Impossible de synchroniser votre panier" };
    }
  };

  const addToCart = async (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          nom: product.title,
          prix: parseFloat(product.currentPrice?.replace('$', '')) || 0,
          quantite: 1,
          image: product.imageUrl
        }];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantite: Math.max(1, item.quantite + delta) }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    }
  };

  // Calculate total items and price
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      mergeCartsOnLogin,
      totalItems,
      totalPrice,
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);