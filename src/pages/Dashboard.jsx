import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart, People, BarChart } from '@mui/icons-material';
import api from '../api/axios';

const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_products: 0,
    total_categories: 0,
    total_users: 0,
    out_of_stock_products: 0,
    latest_products: []
  }); 
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    console.log("User data in Dashboard:", {
      user,
      hasRequiredRoles: user?.user?.roles?.some(role => 
        ['product_manager', 'super_admin'].includes(role.name)
      )
    });
  }, [user]);

  useEffect(() => {
      const fetchStatistics = async () => {
        setLoading(true);
        try {
          const { data } = await api.get('v1/admin/dashboard');
          console.log(data);
          setStatistics({
            total_products: data.data.total_products || 0,
            total_categories: data.data.total_categories || 0,
            total_users: data.data.total_users || 0,
            total_low_products_in_stock: data.data.total_low_products_in_stock || 0,
            latest_products: data.latest_products || []
          });
        } catch (error) {
          console.error('Failed to fetch dashboard statistics:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchStatistics();
    }, []);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
    // Format currency for revenue display
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MAD'
      }).format(amount);
    };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {user.user.user?.name} {user.roles[0].name}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Total Products
                </Typography>
                <ShoppingCart color="primary" />
              </Box>
              <Typography variant="h5">{statistics.total_products}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <People color="primary" />
              </Box>
              <Typography variant="h5">{statistics.total_users}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Total Categories
                </Typography>
                <BarChart color="primary" />
              </Box>
              <Typography variant="h5">{statistics.total_categories}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Out of Stock Products
                </Typography>
                <DashboardIcon color="primary" />
              </Box>
              <Typography variant="h5">{statistics.total_low_products_in_stock}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Latest Products
            </Typography>
            <Typography color="textSecondary">
              {statistics.latest_products.length > 0 ? (
                <ul>
                  {statistics.latest_products.map((product) => (
                    <li key={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No latest products available.</Typography>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;