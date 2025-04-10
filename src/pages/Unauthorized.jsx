// src/pages/Unauthorized.jsx
import { Typography, Container, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          403 - Unauthorized Access
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          You don't have permission to access this page
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{ mt: 3 }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;