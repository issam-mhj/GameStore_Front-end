import React, { useState } from 'react';
import { Grid, Container, Drawer, Box, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardProduct from '../components/CardProduct';
import Panier from '../components/PanierSideBar';

const ProductGrid = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
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
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? {...item, quantite: item.quantite + 1} 
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          nom: product.title,
          prix: parseFloat(product.currentPrice.replace('$', '')),
          quantite: 1,
          image: product.imageUrl
        }];
      }
    });
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

      {/* Products Grid */}
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