import React from 'react';
import { Grid, Container } from '@mui/material';
import CardProduct from '../components/CardProduct';

const ProductGrid = () => {
  const products = [
    {
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

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <CardProduct {...product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductGrid;