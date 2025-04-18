import React, { useState, useEffect } from 'react';
import { Grid, Container, Drawer, Box, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardProduct from '../components/CardProduct';
import Panier from '../components/Panier';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LOCAL_STORAGE_CART_KEY = 'gameexpress-cart';

const ProductGrid = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useAuth();

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  // Load cart items 
  useEffect(() => {
    if (isAuthenticated) {
      // Load Cart Items from the db
      fetchCartFromServer();
    } else {
      // Load Cart Items from local storage
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
        }
      }
    }
  }, [isAuthenticated]);

  // Save to local storage
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const fetchCartFromServer = async () => {
    try {
      const response = await api.get('/v2/cart/items');
      if (response.data) {
        // console.log(response.data);
        const serverCart = response.data.items.map(item => ({
          id: item.product_id,
          nom: item.product.name,
          prix: item.product.price,
          quantite: item.quantity,
          image: item.product.images[0]|| '/api/placeholder/250/180'
        }));
        setCartItems(serverCart);
      }
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    }
  };

  const products = [
    {
      id: 1,
      title: "HP Notebook",
      category: "Laptops",
      imageUrl: "/api/placeholder/250/180",
      originalPrice: "$1099",
      currentPrice: "$999",
      offerBadge: "x4",
      rating: 5,
      available: 6
    },
    {
      id: 2,
      title: "MacBook Pro",
      category: "Laptops",
      imageUrl: "/api/placeholder/250/180",
      originalPrice: "$1999",
      currentPrice: "$1799",
      offerBadge: "x2",
      rating: 4,
      available: 3
    },
    {
      id: 3,
      title: "Dell XPS",
      category: "Laptops",
      imageUrl: "/api/placeholder/250/180",
      originalPrice: "$1299",
      currentPrice: "$1199",
      offerBadge: "x3",
      rating: 5,
      available: 8
    },
    {
      id: 4,
      title: "Lenovo ThinkPad",
      category: "Laptops",
      imageUrl: "/api/placeholder/250/180",
      originalPrice: "$999",
      currentPrice: "$899",
      offerBadge: "x5",
      rating: 4,
      available: 10
    },
    {
      id: 5,
      title: "Surface Pro",
      category: "Laptops",
      imageUrl: "/api/placeholder/250/180",
      originalPrice: "$1499",
      currentPrice: "$1299",
      offerBadge: "x3",
      rating: 5,
      available: 5
    }
  ];

  // Function to add product to cart
  const addToCart = async (product) => {
    const updatedItems = [...cartItems];
    const existingItem = updatedItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantite += 1;
    } else {
      updatedItems.push({
        id: product.id,
        nom: product.title,
        prix: parseFloat(product.currentPrice.replace('$', '')),
        quantite: 1,
        image: product.imageUrl
      });
    }
    
    setCartItems(updatedItems);
    
  
    if (isAuthenticated) {
      try {
        const cartData = updatedItems.map(item => ({
          product_id: item.id,
          quantity: item.quantite
        }));
        
        await api.post('/v2/cart/add', { items: cartData });
      } catch (error) {
        console.error("Error updating cart on server:", error);
      }
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <Container maxWidth="xl" sx={{ position: 'relative', py: 4 }}>
      {/* Shopping Cart Icon */}
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

      {/* Shopping Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={toggleCart}
      >
        <Panier 
          initialProducts={cartItems}
          onClose={toggleCart}
          setCartItems={setCartItems}
        />
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