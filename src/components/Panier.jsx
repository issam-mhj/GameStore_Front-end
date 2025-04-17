import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Stack,
  Paper,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LOCAL_STORAGE_CART_KEY = 'gameexpress-cart';

export default function Panier({ initialProducts = [], onClose, setCartItems }) {
  const [produits, setProduits] = useState(initialProducts);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { isAuthenticated, user } = useAuth();

  // Load cart items [local storage - db]
  useEffect(() => {
    const loadCartItems = async () => {
      if (isAuthenticated) {
        try {
          await fetchCartFromServer();
        } catch (error) {
          console.error("Error loading cart from server:", error);
        }
      } else {
        loadFromLocalStorage();
      }
    };
  }, [isAuthenticated]);

  // Merging
  useEffect(() => {
    if (isAuthenticated) {
      handleCartMerging();
    }
  }, [isAuthenticated]);

  // Update when initialProducts changes
  useEffect(() => {
    setProduits(initialProducts);
  }, [initialProducts]);

  // Save to local storage 
  useEffect(() => {
    if (!isAuthenticated && produits.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(produits));
    }
  }, [produits, isAuthenticated]);

  const fetchCartFromServer = async () => {
    try {
      const response = await api.get('/v2/cart/items');
      if (response.data && response.data.items) {
        console.log(response.data);
        const serverCart = response.data.items.map(item => ({
          id: item.product.product_id,
          nom: item.product.name,
          prix: item.product.price,
          quantite: item.quantity,
          image: item.image_url || '/api/placeholder/250/180'
        }));
        
        setProduits(serverCart);
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
        setProduits(parsedCart);
        setCartItems(parsedCart);
        return parsedCart;
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return [];
      }
    }
    return [];
  };

  const handleCartMerging = async () => {
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
        setProduits(mergedCart);
        setCartItems(mergedCart);
        
        // Clear local storage cart after successful merge
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
        
        showSnackbar("Votre panier local a été synchronisé avec votre compte", "success");
      }
    } catch (error) {
      console.error("Error during cart merging:", error);
      showSnackbar("Impossible de synchroniser votre panier", "error");
    }
  };

  const saveCartToServer = async (cartItems) => {
    if (!isAuthenticated) return;
    
    try {
      const cartData = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantite
      }));
      
      await api.post('/v2/cart/add', { items: cartData });
    } catch (error) {
      console.error("Error saving cart to server:", error);
      throw error;
    }
  };

  const totalArticles = produits.reduce((acc, p) => acc + p.quantite, 0);
  const sousTotal = produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);
  const tva = sousTotal * 0.2;
  const total = sousTotal + tva;

  const changerQuantite = async (id, delta) => {
    const updatedProducts = produits.map((p) =>
      p.id === id 
        ? { ...p, quantite: Math.max(1, p.quantite + delta) } 
        : p
    );
    setProduits(updatedProducts);
    setCartItems(updatedProducts);
    
    // Save to backend if authenticated
    if (isAuthenticated) {
      try {
        await saveCartToServer(updatedProducts);
      } catch (error) {
        showSnackbar("Impossible de mettre à jour le panier sur le serveur", "error");
      }
    }
  };

  const supprimerProduit = async (id) => {
    const updatedProducts = produits.filter(p => p.id !== id);
    setProduits(updatedProducts);
    setCartItems(updatedProducts);
    
    // Save to backend if authenticated
    if (isAuthenticated) {
      try {
        await saveCartToServer(updatedProducts);
      } catch (error) {
        showSnackbar("Impossible de supprimer le produit du panier sur le serveur", "error");
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper sx={{ width: 350, height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            <ShoppingCartCheckoutIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Votre panier ({totalArticles})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {produits.length === 0 ? (
          <Box textAlign="center" py={5}>
            <Typography color="text.secondary">Votre panier est vide</Typography>
          </Box>
        ) : (
          <>
            {produits.map((produit) => (
              <Box 
                key={produit.id} 
                mb={2}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: '#f0f0f0' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar 
                    src={produit.image} 
                    variant="rounded" 
                    sx={{ width: 64, height: 64 }} 
                  />
                  <Box flexGrow={1}>
                    <Typography fontWeight="bold">{produit.nom}</Typography>
                    <Typography color="primary.main" fontWeight="medium">
                      {/* {produit.prix.toFixed(2)}€ */}
                    </Typography>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <IconButton 
                        onClick={() => changerQuantite(produit.id, -1)}
                        size="small"
                        sx={{ backgroundColor: '#e0e0e0' }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography mx={1} fontWeight="medium">{produit.quantite}</Typography>
                      <IconButton 
                        onClick={() => changerQuantite(produit.id, 1)}
                        size="small"
                        sx={{ backgroundColor: '#e0e0e0' }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        onClick={() => supprimerProduit(produit.id)} 
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ px: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Sous-total</Typography>
                <Typography>{sousTotal.toFixed(2)}€</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>TVA (20%)</Typography>
                <Typography>{tva.toFixed(2)}€</Typography>
              </Box>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                mt={2}
                py={1}
                sx={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc' }}
              >
                <Typography fontWeight="bold">Total</Typography>
                <Typography fontWeight="bold" color="primary.main">{total.toFixed(2)}€</Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#0d1117', 
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1a2536'
                  }
                }}
                endIcon={<ShoppingCartCheckoutIcon />}
              >
                Passer la commande
              </Button>
            </Box>
          </>
        )}
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}