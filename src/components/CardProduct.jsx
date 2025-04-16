import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  styled,
  Button,
  Chip,
  Rating
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  transition: 'all 0.3s ease',
  height: '100%',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 10px 20px rgba(0,0,0,0.15)'
  }
}));

const OfferBadge = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  width: 36,
  height: 36,
  position: 'absolute',
  right: -10,
  top: -10,
  zIndex: 1,
  fontSize: '0.8rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: -15,
  left: '50%',
  transform: 'translateX(-50%)',
  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
  opacity: 0,
  transition: 'all 0.3s ease',
  backgroundColor: '#0d1117',
  '&:hover': {
    backgroundColor: '#1a2536',
  }
}));

const StyledCardWrapper = styled(Box)({
  position: 'relative',
  '&:hover': {
    '& .add-to-cart-btn': {
      opacity: 1,
      bottom: -15
    }
  }
});

const CardProduct = ({
  id,
  title = "HP Notebook",
  category = "Laptops",
  imageUrl = "/api/placeholder/250/180",
  originalPrice = "$1099",
  currentPrice = "$999",
  offerBadge = "x4",
  rating = 5,
  available = 6,
  onAddToCart
}) => {
  return (
    <StyledCardWrapper>
      <StyledCard>
        {offerBadge && (
          <OfferBadge>
            {offerBadge}
          </OfferBadge>
        )}
        
        <Box sx={{ p: 2, pb: 0 }}>
          <Chip 
            label="Today's Offer" 
            size="small" 
            sx={{ 
              backgroundColor: '#f3f4f6', 
              fontSize: '0.7rem',
              mb: 1
            }} 
          />
          
          <CardMedia
            component="img"
            sx={{ 
              height: 140, 
              objectFit: "contain",
              borderRadius: 1,
              mb: 1,
              backgroundColor: '#f8f9fa'
            }}
            image={imageUrl}
            alt={title}
          />
        </Box>
        
        <CardContent sx={{ p: 2, pt: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              {category}
            </Typography>
            <Typography variant="caption" color="error.main" sx={{ textDecoration: 'line-through' }}>
              {originalPrice}
            </Typography>
          </Box>

          <Typography variant="body1" fontWeight="medium" gutterBottom noWrap>
            {title}
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {currentPrice}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Box>
              <Rating value={rating} readOnly size="small" />
            </Box>
            <Chip 
              label={`${available} en stock`} 
              size="small" 
              color={available > 5 ? "success" : "warning"}
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
        </CardContent>
      </StyledCard>
      
      <StyledButton 
        variant="contained" 
        size="small"
        onClick={onAddToCart}
        className="add-to-cart-btn"
        startIcon={<AddShoppingCartIcon />}
      >
        Ajouter
      </StyledButton>
    </StyledCardWrapper>
  );
};

export default CardProduct;