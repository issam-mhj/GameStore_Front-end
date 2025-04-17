import React, { useState, useEffect } from 'react';
import { Grid, Container, Drawer, Box, IconButton, Badge, Typography, Alert } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardProduct from '../components/CardProduct';
import Panier from '../components/Panier';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LOCAL_STORAGE_CART_KEY = 'gameexpress-cart';

// Mock data to use if API fails
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Sample Game 1',
    category: 'Adventure',
    imageUrl: '/api/placeholder/250/180',
    originalPrice: 59.99,
    currentPrice: 49.99,
    offerBadge: 'In Stock',
    rating: 4.5,
    available: 1
  },
  {
    id: 2,
    title: 'Sample Game 2',
    category: 'Action',
    imageUrl: '/api/placeholder/250/180',
    originalPrice: 69.99,
    currentPrice: 59.99,
    offerBadge: 'In Stock',
    rating: 5,
    available: 1
  },
  {
    id: 3,
    title: 'Sample Game 3',
    category: 'RPG',
    imageUrl: '/api/placeholder/250/180',
    originalPrice: 49.99,
    currentPrice: 39.99,
    offerBadge: 'Last Items',
    rating: 4,
    available: 1
  },
];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try with the /products endpoint
        const response = await api.get('/products');
        console.log('API Response:', response.data);
         
        if (response.data && response.data.products_list) {
          const formattedProducts = response.data.products_list.map(product => ({
            id: product.id,
            title: product.name || 'No Title',
            category: product.category || 'Uncategorized',
            imageUrl: product.images && product.images.length > 0
              ? "http://127.0.0.1:8000/storage/" + product.images[0].image_url
              : '/api/placeholder/250/180',
            originalPrice: product.price+99 || '$0',
            currentPrice: product.price || '$0',
            offerBadge: product.stock || '',
            rating: product.rating || 5,
            available: product.status || 0,
          }));
          setProducts(formattedProducts);
        } else {
          // If response format is unexpected, use mock data
          console.warn('Unexpected API response format. Using mock data.');
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        
        try {
          // Try alternative endpoint as fallback
          const altResponse = await api.get('/v2/products');
          if (altResponse.data && Array.isArray(altResponse.data.data)) {
            const formattedProducts = altResponse.data.data.map(product => ({
              id: product.id,
              title: product.name || 'No Title',
              category: product.category || 'Uncategorized',
              imageUrl: product.image_url || '/api/placeholder/250/180',
              originalPrice: product.original_price || product.price+99 || '$0',
              currentPrice: product.price || '$0',
              offerBadge: product.stock_status || '',
              rating: product.rating || 5,
              available: product.status || 0,
            }));
            setProducts(formattedProducts);
          } else {
            // If alternative endpoint also fails, use mock data
            setProducts(MOCK_PRODUCTS);
            setError("Failed to load products. Using sample data instead.");
          }
        } catch (fallbackError) {
          // Both endpoints failed, use mock data
          setProducts(MOCK_PRODUCTS);
          setError("Failed to load products. Using sample data instead.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  const addToCart = (product) => {
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
          prix: parseFloat(product.currentPrice?.replace ? product.currentPrice.replace('$', '') : product.currentPrice) || 0,
          quantite: 1,
          image: product.imageUrl
        }];
      }
    })
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);

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
        <Panier
          initialProducts={cartItems}
          onClose={toggleCart}
          setCartItems={setCartItems}
        />
      </Drawer>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading products...</Typography>
        </Box>
      ) : (
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
      )}
    </Container>
  );
};

export default ProductGrid;
