import React, { useState } from 'react';
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
import { useCart } from '../context/CartContext';

// Helper function for consistent currency formatting
const formatCurrency = (amount, currency = '€') => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: currency === '€' ? 'EUR' : 'USD' 
  }).format(amount);
};

export default function Panier({ onClose }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const { isAuthenticated } = useAuth();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalItems,
    totalPrice,
    loading 
  } = useCart();

  const tva = totalPrice * 0.2;
  const total = totalPrice + tva;

  const handleChangeQuantity = (id, delta) => {
    updateQuantity(id, delta);
  };

  const handleRemoveProduct = (id) => {
    removeFromCart(id);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Paper sx={{ width: 350, height: '100%', overflow: 'auto' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>Chargement de votre panier...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: 350, height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            <ShoppingCartCheckoutIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Votre panier ({totalItems})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Box textAlign="center" py={5}>
            <Typography color="text.secondary">Votre panier est vide</Typography>
          </Box>
        ) : (
          <>
            {cartItems.map((product) => (
              <Box 
                key={product.id} 
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
                    src={product.image} 
                    variant="rounded" 
                    sx={{ width: 64, height: 64 }} 
                  />
                  <Box flexGrow={1}>
                    <Typography fontWeight="bold">{product.nom}</Typography>
                    <Typography color="primary.main" fontWeight="medium">
                      {formatCurrency(product.prix)}
                    </Typography>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <IconButton 
                        onClick={() => handleChangeQuantity(product.id, -1)}
                        size="small"
                        sx={{ backgroundColor: '#e0e0e0' }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography mx={1} fontWeight="medium">{product.quantite}</Typography>
                      <IconButton 
                        onClick={() => handleChangeQuantity(product.id, 1)}
                        size="small"
                        sx={{ backgroundColor: '#e0e0e0' }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        onClick={() => handleRemoveProduct(product.id)} 
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
                <Typography>{formatCurrency(totalPrice)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>TVA (20%)</Typography>
                <Typography>{formatCurrency(tva)}</Typography>
              </Box>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                mt={2}
                py={1}
                sx={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc' }}
              >
                <Typography fontWeight="bold">Total</Typography>
                <Typography fontWeight="bold" color="primary.main">{formatCurrency(total)}</Typography>
              </Box>

              <Stack direction="row" spacing={2} mt={4} mb={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ 
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
              </Stack>
              
              {!isAuthenticated && cartItems.length > 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Connectez-vous pour sauvegarder votre panier
                </Typography>
              )}
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