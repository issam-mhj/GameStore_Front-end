import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const produitsInitiaux = [
  {
    id: 1,
    nom: 'Produit 1',
    prix: 29.99,
    quantite: 10,
    image: 'https://i.imgur.com/x4QHkKZ.jpeg',
  },
  {
    id: 2,
    nom: 'Produit 2',
    prix: 39.99,
    quantite: 5,
    image: 'https://i.imgur.com/U3p7kEM.jpeg',
  },
  {
    id: 3,
    nom: 'Produit 3',
    prix: 49.99,
    quantite: 8,
    image: 'https://i.imgur.com/XbPhklE.jpeg',
  },
];

export default function Panier() {
  const [produits, setProduits] = useState(produitsInitiaux);

  const totalArticles = produits.reduce((acc, p) => acc + p.quantite, 0);
  const sousTotal = produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);
  const tva = sousTotal * 0.2;
  const total = sousTotal + tva;

  const changerQuantite = (id, delta) => {
    setProduits((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantite: Math.max(0, p.quantite + delta) } : p
      )
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Votre panier ({totalArticles} articles)</Typography>
        <Button size="small">✕</Button>
      </Box>

      {produits.map((produit) => (
        <Box key={produit.id} mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={produit.image} variant="rounded" sx={{ width: 64, height: 64 }} />
            <Box flexGrow={1}>
              <Typography fontWeight="bold">{produit.nom}</Typography>
              <Typography color="text.secondary">
                {produit.prix.toFixed(2)}€
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => changerQuantite(produit.id, -1)}>
                <RemoveIcon />
              </IconButton>
              <Typography mx={1}>{produit.quantite}</Typography>
              <IconButton onClick={() => changerQuantite(produit.id, 1)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between">
        <Typography>Sous-total</Typography>
        <Typography>{sousTotal.toFixed(2)}€</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>TVA (20%)</Typography>
        <Typography>{tva.toFixed(2)}€</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography fontWeight="bold">Total</Typography>
        <Typography fontWeight="bold">{total.toFixed(2)}€</Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3, backgroundColor: '#0d1117', color: '#fff' }}
      >
        Passer la commande
      </Button>
    </Box>
  );
}
