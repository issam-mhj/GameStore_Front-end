import React, { useState, useEffect } from 'react';
import { Grid, Container, Drawer, Box, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardProduct from '../components/CardProduct';
import Panier from '../components/Panier';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Use the global cart context instead of local state
  const { addToCart, totalItems } = useCart();

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        console.log(response.data);
         
        const formattedProducts = response.data.products_list.map(product => ({
          id: product.id,
          title: product.name || 'No Title',
          category: product.category || 'Uncategorized',
          imageUrl: product.images && product.images.length > 0
          ? "http://127.0.0.1:8000/storage/" + product.images[0].image_url
          : '/api/placeholder/250/180',
          originalPrice: product.price+88 || '$0',
          currentPrice: product.price || '$0',
          offerBadge: product.stock || '',
          rating: product.rating || 5,
          available: product.status || 0,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ position: 'relative', py: 4 }}>
      <Box sx={{ position: 'fixed', top: 80, right: 30, zIndex: 1100 }}>
        <Badge badgeContent={totalItems} color="primary">
          <IconButton
            onClick={toggleCart}
            sx={{
              backgroundColor: '#0d1117',
              color: 'white',
              '&:hover': { backgroundColor: '#1a2536' },
              boxShadow: 3
            }}
            size="large"
          >
            <ShoppingCartIcon />
          </IconButton>
        </Badge>
      </Box>

      <Drawer anchor="right" open={cartOpen} onClose={toggleCart}>
        <Panier onClose={toggleCart} />
      </Drawer>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.id}>
            <CardProduct
              {...product}
              onAddToCart={() => addToCart(product)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductGrid;