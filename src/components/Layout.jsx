// import React, { useState } from 'react';
// import { Outlet, Link } from 'react-router-dom';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Container,
//   Box,
//   IconButton,
//   Avatar,
//   Menu,
//   MenuItem,
//   Tooltip,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import MenuIcon from '@mui/icons-material/Menu';
// import { useAuth } from '../context/AuthContext';

// const Layout = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   const [anchorNav, setAnchorNav] = useState(null);
//   const [anchorUser, setAnchorUser] = useState(null);

//   const handleOpenNav = (e) => setAnchorNav(e.currentTarget);
//   const handleCloseNav = () => setAnchorNav(null);
//   const handleOpenUser = (e) => setAnchorUser(e.currentTarget);
//   const handleCloseUser = () => setAnchorUser(null);

//   const navLinks = [
//     { label: 'Produits', to: '/products' },
//     { label: 'Catégories', to: '/categories' },
//     { label: 'Offres', to: '/offers' },
//   ];

//   if (user?.roles?.some(r => ['super_admin', 'product_manager', 'user_manager'].includes(r))) {
//     navLinks.push({ label: 'Commandes', to: '/commandes' });
//     navLinks.push({ label: 'Manage Procuts', to: '/manageProducts' });
//     navLinks.push({ label: 'Dashboard', to: '/dashboard' });
//   }
//   if (user?.roles?.includes('super_admin')) {
//     navLinks.push({ label: 'Users', to: '/users' });
//     navLinks.push({ label: 'Roles', to: '/roles' });
//   }

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <AppBar position="sticky" sx={{ backgroundColor: '#0d1117' }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             {/* Logo */}
//             <Typography
//               component={Link}
//               to="/"
//               variant="h6"
//               noWrap
//               sx={{
//                 mr: 2,
//                 color: 'inherit',
//                 textDecoration: 'none',
//                 display: { xs: 'flex', md: 'none' },
//                 flexGrow: 1,
//                 fontWeight: 700,
//               }}
//             >
//               E-COMMERCE
//             </Typography>

//             {/* Mobile nav */}
//             {isMobile && (
//               <>
//                 <IconButton color="inherit" onClick={handleOpenNav}>
//                   <MenuIcon />
//                 </IconButton>
//                 <Menu
//                   anchorEl={anchorNav}
//                   open={Boolean(anchorNav)}
//                   onClose={handleCloseNav}
//                   keepMounted
//                 >
//                   {navLinks.map(item => (
//                     <MenuItem
//                       key={item.label}
//                       component={Link}
//                       to={item.to}
//                       onClick={handleCloseNav}
//                     >
//                       {item.label}
//                     </MenuItem>
//                   ))}
//                 </Menu>
//               </>
//             )}

//             {/* Desktop logo & nav */}
//             {!isMobile && (
//               <>
//                 <Typography
//                   component={Link}
//                   to="/"
//                   variant="h6"
//                   noWrap
//                   sx={{
//                     mr: 2,
//                     color: 'inherit',
//                     textDecoration: 'none',
//                     display: { xs: 'none', md: 'flex' },
//                     fontWeight: 700,
//                   }}
//                 >
//                   E-COMMERCE
//                 </Typography>
//                 <Box sx={{ flexGrow: 1 }}>
//                   {navLinks.map(item => (
//                     <Button
//                       key={item.label}
//                       component={Link}
//                       to={item.to}
//                       sx={{ color: 'white' }}
//                     >
//                       {item.label}
//                     </Button>
//                   ))}
//                 </Box>
//               </>
//             )}

//             {/* Cart & user */}
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <IconButton
//                 component={Link}
//                 to="/cart"
//                 color="inherit"
//                 sx={{ mr: 1 }}
//               >
//                 <ShoppingCartIcon />
//               </IconButton>

//               {isAuthenticated ? (
//                 <>
//                   <Tooltip title="Open settings">
//                     <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
//                       <Avatar sx={{ bgcolor: 'primary.main' }}>
//                         {user.username?.[0]?.toUpperCase() || (
//                           <AccountCircleIcon />
//                         )}
//                       </Avatar>
//                     </IconButton>
//                   </Tooltip>
//                   <Menu
//                     anchorEl={anchorUser}
//                     open={Boolean(anchorUser)}
//                     onClose={handleCloseUser}
//                     sx={{ mt: '45px' }}
//                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//                   >
//                     <MenuItem
//                       component={Link}
//                       to="/profile"
//                       onClick={handleCloseUser}
//                     >
//                       Profil
//                     </MenuItem>
//                     <MenuItem
//                       component={Link}
//                       to="/orders"
//                       onClick={handleCloseUser}
//                     >
//                       Commandes
//                     </MenuItem>
//                     {(user.roles.includes('super_admin') ||
//                       user.roles.includes('product_manager')) && (
//                       <MenuItem
//                         component={Link}
//                         to="/dashboard"
//                         onClick={handleCloseUser}
//                       >
//                         Dashboard
//                       </MenuItem>
//                     )}
//                     <MenuItem
//                       onClick={() => {
//                         logout();
//                         handleCloseUser();
//                       }}
//                     >
//                       Déconnexion
//                     </MenuItem>
//                   </Menu>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     component={Link}
//                     to="/login"
//                     color="inherit"
//                   >
//                     Connexion
//                   </Button>
//                   <Button
//                     component={Link}
//                     to="/register"
//                     variant="outlined"
//                     sx={{
//                       ml: 1,
//                       color: 'white',
//                       borderColor: 'white',
//                       '&:hover': {
//                         borderColor: 'rgba(255,255,255,0.8)',
//                         backgroundColor: 'rgba(255,255,255,0.1)',
//                       },
//                     }}
//                   >
//                     Inscription
//                   </Button>
//                 </>
//               )}
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <Box component="main" sx={{ flexGrow: 1 }}>
//         <Outlet />
//       </Box>

//       <Box component="footer" sx={{ py: 3, backgroundColor: '#f8f9fa', mt: 'auto' }}>
//         <Container maxWidth="lg">
//           <Typography variant="body2" color="text.secondary" align="center">
//             © {new Date().getFullYear()} E-COMMERCE. Tous droits réservés.
//           </Typography>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default Layout;




import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import {
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalOffer as LocalOfferIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material"
import { useAuth } from "../context/AuthContext"

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()
  const isDashboardPage = location.pathname.includes("/dashboard")

  const [anchorNav, setAnchorNav] = useState(null)
  const [anchorUser, setAnchorUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleOpenNav = (e) => setAnchorNav(e.currentTarget)
  const handleCloseNav = () => setAnchorNav(null)
  const handleOpenUser = (e) => setAnchorUser(e.currentTarget)
  const handleCloseUser = () => setAnchorUser(null)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  const navLinks = [
    { label: "Produits", to: "/products", icon: <ShoppingBagIcon /> },
    { label: "Catégories", to: "/categories", icon: <CategoryIcon /> },
    { label: "Offres", to: "/offers", icon: <LocalOfferIcon /> },
  ]

  const adminLinks = []

  if (user?.roles?.some((r) => ["super_admin", "product_manager", "user_manager"].includes(r))) {
    adminLinks.push({ label: "Commandes", to: "/commandes", icon: <ReceiptIcon /> })
    adminLinks.push({ label: "Manage Products", to: "/manageProducts", icon: <ShoppingBagIcon /> })
    adminLinks.push({ label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> })
  }

  if (user?.roles?.includes("super_admin")) {
    adminLinks.push({ label: "Users", to: "/users", icon: <PeopleIcon /> })
    adminLinks.push({ label: "Roles", to: "/roles", icon: <SettingsIcon /> })
  }

  // If we're on the dashboard page, render a simplified header
  if (isDashboardPage) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#0d1117",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
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
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                GAMEXPRESS
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              {/* User menu */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton component={Link} to="/cart" color="inherit" sx={{ mr: 1 }}>
                  <ShoppingCartIcon />
                </IconButton>

                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {user?.user?.user?.name?.[0]?.toUpperCase() || <AccountCircleIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorUser}
                  open={Boolean(anchorUser)}
                  onClose={handleCloseUser}
                  sx={{ mt: "45px" }}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleCloseUser}>
                    Profil
                  </MenuItem>
                  <MenuItem component={Link} to="/" onClick={handleCloseUser}>
                    Retour au site
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logout()
                      handleCloseUser()
                    }}
                  >
                    Déconnexion
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Dashboard layout with sidebar */}
        <Box sx={{ display: "flex", pt: "64px" }}>
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 240,
                boxSizing: "border-box",
                top: "64px",
                height: "calc(100% - 64px)",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <List sx={{ pt: 2 }}>
              {adminLinks.map((link) => (
                <ListItem
                  button
                  key={link.label}
                  component={Link}
                  to={link.to}
                  selected={location.pathname === link.to}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.12)",
                      },
                    },
                  }}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem button onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItem>
            </List>
          </Drawer>

          <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    )
  }

  // Regular layout for non-dashboard pages
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#0d1117" }}>
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
                color: "inherit",
                textDecoration: "none",
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
              }}
            >
              GAMEXPRESS
            </Typography>

            {/* Mobile nav */}
            {isMobile && (
              <>
                <IconButton color="inherit" onClick={handleOpenNav}>
                  <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorNav} open={Boolean(anchorNav)} onClose={handleCloseNav} keepMounted>
                  {navLinks.map((item) => (
                    <MenuItem key={item.label} component={Link} to={item.to} onClick={handleCloseNav}>
                      {item.label}
                    </MenuItem>
                  ))}
                  {adminLinks.length > 0 && <Divider />}
                  {adminLinks.map((item) => (
                    <MenuItem key={item.label} component={Link} to={item.to} onClick={handleCloseNav}>
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
                    color: "inherit",
                    textDecoration: "none",
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                  }}
                >
                  GAMEXPRESS
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  {navLinks.map((item) => (
                    <Button key={item.label} component={Link} to={item.to} sx={{ color: "white" }}>
                      {item.label}
                    </Button>
                  ))}

                  {adminLinks.length > 0 && (
                    <Button color="inherit" onClick={toggleDrawer} sx={{ ml: 2 }}>
                      Admin
                    </Button>
                  )}
                </Box>
              </>
            )}

            {/* Cart & user */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton component={Link} to="/cart" color="inherit" sx={{ mr: 1 }}>
                <ShoppingCartIcon />
              </IconButton>

              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {user?.user?.user?.name?.[0]?.toUpperCase() || <AccountCircleIcon />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorUser}
                    open={Boolean(anchorUser)}
                    onClose={handleCloseUser}
                    sx={{ mt: "45px" }}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleCloseUser}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profil
                    </MenuItem>
                    <MenuItem component={Link} to="/orders" onClick={handleCloseUser}>
                      <ListItemIcon>
                        <ReceiptIcon fontSize="small" />
                      </ListItemIcon>
                      Commandes
                    </MenuItem>
                    {(user?.roles?.includes("super_admin") || user?.roles?.includes("product_manager")) && (
                      <MenuItem component={Link} to="/dashboard" onClick={handleCloseUser}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        logout()
                        handleCloseUser()
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Déconnexion
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    Connexion
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    sx={{
                      ml: 1,
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.8)",
                        backgroundColor: "rgba(255,255,255,0.1)",
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

      {/* Admin drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          <List>
            <ListItem>
              <Typography variant="h6" color="primary">
                Admin Menu
              </Typography>
            </ListItem>
            <Divider />
            {adminLinks.map((item) => (
              <ListItem button key={item.label} component={Link} to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ py: 3, backgroundColor: "#f8f9fa", mt: "auto" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} GAMEXPRESS. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout