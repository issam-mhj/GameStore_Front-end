import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../api/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState({
    syncing: false,
    lastSynced: null,
    error: null,
  });
  
  // Auth context
  const { isAuthenticated, user } = useAuth();


  
  // cart load
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let loadedCart = [];
        
        if (isAuthenticated) {
          try {
            loadedCart = await cartService.fetchFromServer();
          } catch (error) {
            console.error('Error loading cart from server:', error);
            setError('Error loading cart from server. Falling back to local storage.');
            loadedCart = cartService.loadFromLocalStorage();
          }
        } else {
          loadedCart = cartService.loadFromLocalStorage();
        }
        
        setCartItems(loadedCart);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setError('Failed to load your cart. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [isAuthenticated, user]);


  
  // Save cart items whenever they change
  useEffect(() => {
    if (loading) return;
    
    const syncCart = async () => {
      try {
        setSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
        
        if (isAuthenticated) {
          await cartService.saveToServer(cartItems);
        } else {
          cartService.saveToLocalStorage(cartItems);
        }
        
        setSyncStatus(prev => ({ 
          ...prev, 
          syncing: false,
          lastSynced: new Date()
        }));
      } catch (err) {
        console.error('Error syncing cart:', err);
        setSyncStatus(prev => ({ 
          ...prev, 
          syncing: false, 
          error: 'Failed to sync your cart changes.'
        }));
      }
    };
    
    syncCart();
  }, [cartItems, isAuthenticated, loading]);

 
  

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product object', product);
      return;
    }
    
    if (quantity <= 0) {
      console.error('Invalid quantity', quantity);
      return;
    }
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Product already in cart - update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantite: newItems[existingItemIndex].quantite + quantity
        };
        return newItems;
      } else {
        // Product not in cart - add new item
        return [...prevItems, {
          id: product.id,
          nom: product.title || product.name || product.nom,
          prix: parseFloat(product.currentPrice?.replace('$', '')) || 
                parseFloat(product.price || 0) || 
                product.prix || 0,
          quantite: quantity,
          image: product.imageUrl || product.image || '/api/placeholder/250/180'
        }];
      }
    });
  }, []);


  const updateQuantity = useCallback((productId, quantityOrOptions) => {
    if (!productId) return;
    
    const options = typeof quantityOrOptions === 'object' 
      ? quantityOrOptions 
      : { delta: quantityOrOptions };
    
    const { delta, quantity, absolute = false, removeIfZero = true } = options;

    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
      if (itemIndex === -1) return prevItems;

      const newItems = [...prevItems];
      const currentItem = newItems[itemIndex];
      
      // Calculate new quantity based on parameters
      let newQuantity = absolute ? quantity : currentItem.quantite + (delta || 0);
      
      // Apply minimum quantity limit
      if (newQuantity <= 0) {
        return removeIfZero 
          ? newItems.filter(item => item.id !== productId) 
          : newItems.map(item => 
              item.id === productId ? { ...item, quantite: 1 } : item
            );
      }
      
      // Update the item with new quantity
      newItems[itemIndex] = {
        ...currentItem,
        quantite: newQuantity
      };
      
      return newItems;
    });
  }, []);


  const removeFromCart = useCallback(async (productId) => {
    if (!productId) return;
    
    // Remove from local state
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    if (isAuthenticated) {
      try {
        await cartService.removeItemFromServer(productId);
      } catch (error) {
        console.error(`Failed to remove product ${productId} from server:`, error);
      }
    }
  }, [isAuthenticated]);


  const clearCart = useCallback(async () => {
    // Clear local state first
    setCartItems([]);
    
    // Handle persistence based on auth state
    if (!isAuthenticated) {
      cartService.clearLocalStorage();
    } else {
      try {
        await cartService.clearServerCart();
      } catch (error) {
        console.error('Failed to clear server cart:', error);
      }
    }
  }, [isAuthenticated]);

  const mergeCartsOnLogin = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load both carts
      const localCart = cartService.loadFromLocalStorage();
      if (localCart.length === 0) {
        setLoading(false);
        return { success: true, message: "No local cart items found to sync" };
      }
      
      const serverCart = await cartService.fetchFromServer();
      
      // Merge with conflict resolution strategy: take max quantity
      const mergedCart = [...serverCart];
      let hasNewItems = false;
      
      localCart.forEach(localItem => {
        const existingItemIndex = mergedCart.findIndex(item => item.id === localItem.id);
        
        if (existingItemIndex >= 0) {
          // Conflict resolution: take max quantity
          if (localItem.quantite > mergedCart[existingItemIndex].quantite) {
            mergedCart[existingItemIndex].quantite = localItem.quantite;
            hasNewItems = true;
          }
        } else {
          // New item from local cart
          mergedCart.push(localItem);
          hasNewItems = true;
        }
      });
      
      // If we have changes to apply
      if (hasNewItems) {
        // Update state and sync
        setCartItems(mergedCart);
        await cartService.saveToServer(mergedCart);
        
        // Clear local storage as it's now synced
        cartService.clearLocalStorage();
        
        setLoading(false);
        return { success: true, message: "Your shopping cart has been synchronized with your account" };
      }
      
      setLoading(false);
      return { success: true, message: "No new items to synchronize" };
    } catch (error) {
      console.error("Error during cart merging:", error);
      setLoading(false);
      return { 
        success: false, 
        message: "Could not synchronize your cart. Please try again later." 
      };
    }
  }, []);


  
  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  const contextValue = {

    cartItems,
    loading,
    error,
    syncStatus,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    
 
    mergeCartsOnLogin,
    
   
    totalItems,
    totalPrice,
 
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);