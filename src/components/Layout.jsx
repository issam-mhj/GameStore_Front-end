import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorNav, setAnchorNav] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);

  const handleOpenNav = (e) => setAnchorNav(e.currentTarget);
  const handleCloseNav = () => setAnchorNav(null);
  const handleOpenUser = (e) => setAnchorUser(e.currentTarget);
  const handleCloseUser = () => setAnchorUser(null);

  const navLinks = [
    { label: 'Produits', to: '/products' },
    { label: 'Catégories', to: '/categories' },
    { label: 'Offres', to: '/offers' },
  ];

  if (user?.roles?.some(r => ['super_admin', 'product_manager', 'user_manager'].includes(r))) {
    navLinks.push({ label: 'Commandes', to: '/commandes' });
    navLinks.push({ label: 'Manage Procuts', to: '/manageProducts' });
  }
  if (user?.roles?.includes('super_admin')) {
    navLinks.push({ label: 'Users', to: '/users' });
    navLinks.push({ label: 'Roles', to: '/roles' });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#0d1117' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Typography
              component={Link}
              to="/"
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                color: 'inherit',
                textDecoration: 'none',
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
              }}
            >
              E-COMMERCE
            </Typography>

            {/* Mobile nav */}
            {isMobile && (
              <>
                <IconButton color="inherit" onClick={handleOpenNav}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorNav}
                  open={Boolean(anchorNav)}
                  onClose={handleCloseNav}
                  keepMounted
                >
                  {navLinks.map(item => (
                    <MenuItem
                      key={item.label}
                      component={Link}
                      to={item.to}
                      onClick={handleCloseNav}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {/* Desktop logo & nav */}
            {!isMobile && (
              <>
                <Typography
                  component={Link}
                  to="/"
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    color: 'inherit',
                    textDecoration: 'none',
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                  }}
                >
                  E-COMMERCE
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  {navLinks.map(item => (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.to}
                      sx={{ color: 'white' }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              </>
            )}

            {/* Cart & user */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                sx={{ mr: 1 }}
              >
                <ShoppingCartIcon />
              </IconButton>

              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {user.username?.[0]?.toUpperCase() || (
                          <AccountCircleIcon />
                        )}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorUser}
                    open={Boolean(anchorUser)}
                    onClose={handleCloseUser}
                    sx={{ mt: '45px' }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleCloseUser}
                    >
                      Profil
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/orders"
                      onClick={handleCloseUser}
                    >
                      Commandes
                    </MenuItem>
                    {(user.roles.includes('super_admin') ||
                      user.roles.includes('product_manager')) && (
                      <MenuItem
                        component={Link}
                        to="/dashboard"
                        onClick={handleCloseUser}
                      >
                        Dashboard
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        logout();
                        handleCloseUser();
                      }}
                    >
                      Déconnexion
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                  >
                    Connexion
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    sx={{
                      ml: 1,
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.8)',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Inscription
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ py: 3, backgroundColor: '#f8f9fa', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} E-COMMERCE. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
