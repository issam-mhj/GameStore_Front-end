import React from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  Divider, 
  Paper 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const gameCategories = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Indie', 'VR'];
  const featuredGames = [
    { id: 1, title: 'Game Title 1' },
    { id: 2, title: 'Game Title 2' },
    { id: 3, title: 'Game Title 3' },
    { id: 4, title: 'Game Title 4' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {/* Store Name and Main CTA */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            GAMEEXPRESS
          </Typography>
          
          {!isAuthenticated && (
            <Box sx={{ my: 2 }}>
              <Button 
                variant="text" 
                component={Link} 
                to="/login" 
                sx={{ fontWeight: 'bold' }}
              >
                LOGIN/JOIN NOW
              </Button>
            </Box>
          )}
          
          <Typography variant="h5" component="h2" gutterBottom>
            Level Up Your Gaming Experience
          </Typography>
          <Typography variant="body1" gutterBottom>
            Discover the latest and greatest games across all platforms. From indie gems to AAA blockbusters, your next adventure awaits.
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={Link} 
              to="/games"
            >
              GET STARTED
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large" 
              component={Link} 
              to="/deals"
            >
              TODAY'S DEALS
            </Button>
          </Box>
        </Box>

        {/* Featured Games */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            FEATURED
          </Typography>
          <Grid container spacing={3}>
            {featuredGames.map(game => (
              <Grid item xs={12} sm={6} md={3} key={game.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{ 
                      pt: '56.25%', // 16:9 
                      backgroundColor: 'grey.200' 
                    }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      FEATURED
                    </Typography>
                    <Typography variant="h6" component="h3">
                      {game.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Categories */}
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {gameCategories.map(category => (
              <Chip 
                key={category}
                label={category}
                component={Link}
                to={`/category/${category.toLowerCase()}`}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Stats */}
        <Grid container spacing={3} sx={{ my: 4 }}>
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                2500+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Games Available
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                150K
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Gamers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                98%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Positive Reviews
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Support
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;