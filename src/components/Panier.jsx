import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Stack,
  Paper,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export default function Panier({ initialProducts = [], onClose, setCartItems }) {
  const [produits, setProduits] = React.useState(initialProducts);

  // Update when initialProducts changes
  React.useEffect(() => {
    setProduits(initialProducts);
  }, [initialProducts]);

  const totalArticles = produits.reduce((acc, p) => acc + p.quantite, 0);
  const sousTotal = produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);
  const tva = sousTotal * 0.2;
  const total = sousTotal + tva;

  const changerQuantite = (id, delta) => {
    const updatedProducts = produits.map((p) =>
      p.id === id 
        ? { ...p, quantite: Math.max(1, p.quantite + delta) } 
        : p
    );
    setProduits(updatedProducts);
    setCartItems(updatedProducts);
  };

  const supprimerProduit = (id) => {
    const updatedProducts = produits.filter(p => p.id !== id);
    setProduits(updatedProducts);
    setCartItems(updatedProducts);
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
                      {produit.prix.toFixed(2)}€
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
    </Paper>
  );
}