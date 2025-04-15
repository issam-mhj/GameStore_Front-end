import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  styled
} from '@mui/material';
import { Star } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  transition: 'transform 0.3s',
  height: '100%',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
  }
}));

const OfferBadge = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  width: 24,
  height: 24,
  position: 'absolute',
  right: 8,
  top: 8,
  zIndex: 1,
  fontSize: '0.7rem'
}));

const CardProduct = ({
  title = "HP Notebook",
  category = "Laptops",
  imageUrl = "/api/placeholder/250/180",
  originalPrice = "$1099",
  currentPrice = "$999",
  offerBadge = "x4",
  rating = 5,
  available = 6
}) => {
  return (
    <StyledCard>
      <Box p={1} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" fontWeight="medium">
          Today's Combo Offer
        </Typography>
        {offerBadge && <OfferBadge>{offerBadge}</OfferBadge>}
      </Box>
      
      <CardMedia
        component="img"
        sx={{ height: 120, objectFit: "contain", p: 1 }}
        image={imageUrl}
        alt={title}
      />
      
      <CardContent sx={{ p: 1, pt: 0 }}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">
            {category}
          </Typography>
          <Typography variant="caption" color="error.main" sx={{ textDecoration: 'line-through' }}>
            {originalPrice}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">{title}</Typography>
          <Typography variant="body2" fontWeight="medium">
            {currentPrice}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Available: <Box component="span" fontWeight="bold">{available}</Box>
          </Typography>
          <Box>
            {[...Array(rating)].map((_, i) => (
              <Star key={i} sx={{ fontSize: '0.8rem', color: 'orange' }} />
            ))}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CardProduct;