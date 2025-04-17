"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  useTheme,
  alpha,
  Chip,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  ShoppingCart,
  People,
  Category,
  WarningAmber,
  ArrowForward,
  CalendarToday,
  Visibility,
  ArrowUpward,
  TrendingDown,
  MoreVert,
  Add,
  Settings,
  Refresh,
  AttachMoney,
  FilterList,
  Download,
  Inventory,
  LocalShipping,
  CheckCircle,
  DonutLarge,
} from "@mui/icons-material"
import api from "../api/axios"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statistics, setStatistics] = useState({
    total_products: 0,
    total_categories: 0,
    total_users: 0,
    total_low_products_in_stock: 0,
    latest_products: [],
    total_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
  })

  const [anchorEl, setAnchorEl] = useState(null)
  const [timeRange, setTimeRange] = useState("month")
  const [chartMenuAnchor, setChartMenuAnchor] = useState(null)

  const { user } = useAuth()
  const theme = useTheme()

  // Sample data - in a real app, this would come from the API
  const chartData = [
    { name: "Jan", products: 20, revenue: 12000 },
    { name: "Feb", products: 30, revenue: 18000 },
    { name: "Mar", products: 25, revenue: 15000 },
    { name: "Apr", products: 40, revenue: 22000 },
    { name: "May", products: 55, revenue: 30000 },
    { name: "Jun", products: 48, revenue: 27000 },
  ]

  const orderStatusData = [
    { name: "Livré", value: 65, color: "#4caf50" },
    { name: "En cours", value: 25, color: "#2196f3" },
    { name: "En attente", value: 10, color: "#ff9800" },
  ]

  const topSellingCategories = [
    { category: "Jeux PS5", count: 42, percentage: 70 },
    { category: "Accessoires", count: 28, percentage: 55 },
    { category: "Jeux Xbox", count: 23, percentage: 45 },
    { category: "PC Gaming", count: 18, percentage: 35 },
  ]

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("v1/admin/dashboard")
      setStatistics({
        total_products: data.data?.total_products || 0,
        total_categories: data.data?.total_categories || 0,
        total_users: data.data?.total_users || 0,
        total_low_products_in_stock: data.data?.total_low_products_in_stock || 0,
        latest_products: data.latest_products || [],
        total_revenue: data.data?.total_revenue || 125000,
        total_orders: data.data?.total_orders || 156,
        pending_orders: data.data?.pending_orders || 23,
      })
    } catch (error) {
      console.error("Failed to fetch dashboard statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStatistics()
    setRefreshing(false)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleChartMenuOpen = (event) => {
    setChartMenuAnchor(event.currentTarget)
  }

  const handleChartMenuClose = () => {
    setChartMenuAnchor(null)
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
    handleChartMenuClose()
  }

  // Format currency for revenue display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Dashboard card data
  const dashboardCards = [
    {
      title: "Total Produits",
      value: statistics.total_products,
      icon: <ShoppingCart />,
      color: "#4caf50", // Green
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Utilisateurs",
      value: statistics.total_users,
      icon: <People />,
      color: "#2196f3", // Blue
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Catégories",
      value: statistics.total_categories,
      icon: <Category />,
      color: "#ff9800", // Orange
      trend: "=",
      trendUp: null,
    },
    {
      title: "Stock Faible",
      value: statistics.total_low_products_in_stock,
      icon: <WarningAmber />,
      color: "#f44336", // Red
      trend: "+2",
      trendUp: false,
    },
  ]

  // Additional dashboard cards
  const additionalCards = [
    {
      title: "Chiffre d'Affaires",
      value: formatCurrency(statistics.total_revenue),
      icon: <AttachMoney />,
      color: "#673ab7", // Purple
      trend: "+8.5%",
      trendUp: true,
    },
    {
      title: "Commandes Totales",
      value: statistics.total_orders,
      icon: <LocalShipping />,
      color: "#009688", // Teal
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Commandes en Attente",
      value: statistics.pending_orders,
      icon: <DonutLarge />,
      color: "#795548", // Brown
      trend: "-3%",
      trendUp: false,
    },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Welcome Header with actions */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="500">
                Tableau de Bord
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              {user?.user?.name || 'Admin'} • {
    user?.roles?.[0] === 'super_admin' ? 'Super Admin'
      : user?.roles?.[0] === 'product_manager' ? 'Gestionnaire de Produit'
      : user?.roles?.[0] === 'user_manager'  ? 'Gestionnaire des Clients'
      : 'Utilisateur'
  }              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleMenuOpen}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Exporter
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>Exporter en PDF</MenuItem>
                <MenuItem onClick={handleMenuClose}>Exporter en Excel</MenuItem>
                <MenuItem onClick={handleMenuClose}>Exporter en CSV</MenuItem>
              </Menu>

              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                {refreshing ? "Actualisation..." : "Actualiser"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-20px",
            right: "-20px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
            left: "35%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
            zIndex: 1,
          }}
        />
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={5} sx={{ mb: 4, width: "100%" }}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={2}
              sx={{
                borderRadius: "16px",
                height: "100%",
                width: "22rem",
                transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(card.color, 0.1),
                      color: card.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>

                  {card.trend && (
                    <Chip
                      size="small"
                      icon={
                        card.trendUp === null ? null : card.trendUp ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <TrendingDown fontSize="small" />
                        )
                      }
                      label={card.trend}
                      sx={{
                        backgroundColor:
                          card.trendUp === null
                            ? alpha("#9e9e9e", 0.1)
                            : card.trendUp
                              ? alpha("#4caf50", 0.1)
                              : alpha("#f44336", 0.1),
                        color: card.trendUp === null ? "#9e9e9e" : card.trendUp ? "#4caf50" : "#f44336",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: card.color }}>
                  {card.value}
                </Typography>
                <Typography color="textSecondary" sx={{ mt: 1, fontWeight: 500 }}>
                  {card.title}
                </Typography>
              </CardContent>

              {/* Decorative colored line at bottom */}
              <Box
                sx={{
                  height: 4,
                  width: "100%",
                  backgroundColor: card.color,
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Statistics Cards */}
      <Grid container spacing={5} sx={{ mb: 4, width: "100%" }}>
        {additionalCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={2}
              sx={{
                borderRadius: "16px",
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(card.color, 0.1),
                      color: card.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>

                  {card.trend && (
                    <Chip
                      size="small"
                      icon={card.trendUp ? <ArrowUpward fontSize="small" /> : <TrendingDown fontSize="small" />}
                      label={card.trend}
                      sx={{
                        backgroundColor: card.trendUp ? alpha("#4caf50", 0.1) : alpha("#f44336", 0.1),
                        color: card.trendUp ? "#4caf50" : "#f44336",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: card.color }}>
                  {card.value}
                </Typography>
                <Typography color="textSecondary" sx={{ mt: 1, fontWeight: 500 }}>
                  {card.title}
                </Typography>
              </CardContent>

              {/* Decorative colored line at bottom */}
              <Box
                sx={{
                  height: 4,
                  width: "100%",
                  backgroundColor: card.color,
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Content Sections */}
      <Grid container spacing={3} sx={{ width: "100%" }}>
        {/* Latest Products List */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ borderRadius: "16px", overflow: "hidden", mb: 3 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6">Derniers Produits</Typography>
              <Box>
                <IconButton size="small" sx={{ color: "white" }}>
                  <MoreVert fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "white", ml: 1 }} component="a" href="/manageProducts/add">
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {statistics.latest_products.length > 0 ? (
              <List sx={{ p: 0 }}>
                {statistics.latest_products.map((product, index) => (
                  <React.Fragment key={product.id || index}>
                    <ListItem
                      sx={{
                        px: 3,
                        py: 2,
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.light, 0.1),
                        },
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="view"
                          size="small"
                          component="a"
                          href={`/manageProducts/edit/${product.id}`}
                        >
                          <ArrowForward fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={product.image_url}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          {product.name?.charAt(0).toUpperCase() || "P"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={500}>
                            {product.name || "Product Name"}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                            <Typography variant="body2" color="primary" fontWeight={500}>
                              {formatCurrency(product.price || 0)}
                            </Typography>
                            {product.created_at && (
                              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                <CalendarToday fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                                <Typography variant="caption">{formatDate(product.created_at)}</Typography>
                              </Box>
                            )}
                            {product.stock !== undefined && (
                              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                <Inventory fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                                <Typography variant="caption">Stock: {product.stock}</Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < statistics.latest_products.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="textSecondary">Aucun produit récent disponible.</Typography>
              </Box>
            )}

            {statistics.latest_products.length > 0 && (
              <Box sx={{ p: 2, textAlign: "center", borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button startIcon={<Visibility />} component="a" href="/manageProducts" color="primary">
                  Voir tous les produits
                </Button>
              </Box>
            )}
          </Paper>

          {/* Top Selling Categories */}
          <Paper elevation={2} sx={{ borderRadius: "16px", overflow: "hidden" }}>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6">Catégories Populaires</Typography>
              <IconButton size="small" sx={{ color: "white" }} component="a" href="/manageCategories">
                <ArrowForward fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              {topSellingCategories.map((category, index) => (
                <Box key={index} sx={{ mb: index < topSellingCategories.length - 1 ? 3 : 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {category.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} produits
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={category.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {category.percentage}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Chart & Summary */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ borderRadius: "16px", p: 0, mb: 3, overflow: "hidden" }}>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Statistiques des Produits</Typography>
              <Box>
                <Tooltip title="Filtrer par période">
                  <IconButton size="small" sx={{ color: "white" }} onClick={handleChartMenuOpen}>
                    <FilterList fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={chartMenuAnchor} open={Boolean(chartMenuAnchor)} onClose={handleChartMenuClose}>
                  <MenuItem onClick={() => handleTimeRangeChange("week")}>Cette semaine</MenuItem>
                  <MenuItem onClick={() => handleTimeRangeChange("month")}>Ce mois</MenuItem>
                  <MenuItem onClick={() => handleTimeRangeChange("quarter")}>Ce trimestre</MenuItem>
                  <MenuItem onClick={() => handleTimeRangeChange("year")}>Cette année</MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* Chart Area */}
            <Box sx={{ height: 240, p: 2, pt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickCount={5} />
                  <RechartsTooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="products" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Divider />

            {/* Summary Section */}
            <Box sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                Résumé
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <DashboardIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {statistics.total_products} produits dans {statistics.total_categories} catégories
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WarningAmber color="error" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {statistics.total_low_products_in_stock} produits en stock faible
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {statistics.total_orders - statistics.pending_orders} commandes traitées
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Order Status Pie Chart */}
          <Paper elevation={2} sx={{ borderRadius: "16px", p: 0, overflow: "hidden" }}>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Statut des Commandes</Typography>
              <IconButton size="small" sx={{ color: "white" }}>
                <Settings fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ height: 300, width:500 , p:2, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <RechartsTooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
