"use client"

import { useTheme } from "@mui/material/styles"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
} from "@mui/material"
import {
  ArrowUpward,
  People,
  CalendarToday,
  ArrowForward,
  MoreVert,
  Add,
  Settings,
  Visibility,
} from "@mui/icons-material"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { alpha } from "@mui/material/styles"
import React from "react"

const UserDashboardSection = () => {
  const theme = useTheme()

  // Sample data for users - replace with actual API data in production
  const recentUsers = [
    { id: 1, name: "Thomas Martin", email: "thomas@example.com", date: "2025-04-10", role: "client", status: "active" },
    {
      id: 2,
      name: "Camille Dubois",
      email: "camille@example.com",
      date: "2025-04-08",
      role: "client",
      status: "active",
    },
    {
      id: 3,
      name: "Marc Leroy",
      email: "marc@example.com",
      date: "2025-04-05",
      role: "product_manager",
      status: "inactive",
    },
    {
      id: 4,
      name: "Sophie Bernard",
      email: "sophie@example.com",
      date: "2025-04-01",
      role: "client",
      status: "active",
    },
    { id: 5, name: "Lucas Girard", email: "lucas@example.com", date: "2025-03-28", role: "client", status: "pending" },
  ]

  // User roles distribution data
  const userRolesData = [
    { name: "Clients", value: 75, color: "#2196f3" },
    { name: "Managers", value: 15, color: "#ff9800" },
    { name: "Admins", value: 10, color: "#f44336" },
  ]

  // User activity data
  const userActivityData = [
    { month: "Jan", registrations: 12, active: 10 },
    { month: "Feb", registrations: 19, active: 15 },
    { month: "Mar", registrations: 15, active: 12 },
    { month: "Apr", registrations: 25, active: 22 },
    { month: "May", registrations: 32, active: 28 },
    { month: "Jun", registrations: 30, active: 26 },
  ]

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

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50"
      case "inactive":
        return "#f44336"
      case "pending":
        return "#ff9800"
      default:
        return "#9e9e9e"
    }
  }

  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case "super_admin":
        return "Admin"
      case "product_manager":
        return "Manager"
      case "user_manager":
        return "User Manager"
      case "client":
        return "Client"
      default:
        return "Utilisateur"
    }
  }

    return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Gestion des Utilisateurs
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Users card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: "16px",
                height: "100%",
              width: "18rem",
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
                    bgcolor: alpha("#2196f3", 0.1),
                    color: "#2196f3",
                    width: 48,
                    height: 48,
                  }}
                >
                  <People />
                </Avatar>

                <Chip
                  size="small"
                  icon={<ArrowUpward fontSize="small" />}
                  label="+12%"
                  sx={{
                    backgroundColor: alpha("#4caf50", 0.1),
                    color: "#4caf50",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "#2196f3" }}>
                152
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1, fontWeight: 500 }}>
                Utilisateurs Inscrits
              </Typography>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Actifs
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    128
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Nouveaux (30j)
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    24
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Premium
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    45
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            {/* Decorative colored line at bottom */}
            <Box
              sx={{
                height: 4,
                width: "100%",
                backgroundColor: "#2196f3",
                position: "absolute",
                bottom: 0,
              }}
            />
          </Card>
        </Grid>

        {/* User roles distribution */}
        <Grid item xs={12} sm={6} md={8}>
          <Card
            elevation={2}
            sx={{
              borderRadius: "16px",
                height: "100%",
              width: "25rem",
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
              <Typography variant="h6" sx={{ mb: 2 }}>
                Distribution des Rôles
              </Typography>

              <Box sx={{ height: 220, display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRolesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userRolesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color}  />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Users List and User Activity Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
              <Typography variant="h6">Utilisateurs Récents</Typography>
              <Box>
                <IconButton size="small" sx={{ color: "white" }}>
                  <MoreVert fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "white", ml: 1 }} component="a" href="/users/add">
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {recentUsers.length > 0 ? (
              <List sx={{ p: 0 }}>
                {recentUsers.map((user, index) => (
                  <React.Fragment key={user.id}>
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
                          href={`/users/edit/${user.id}`}
                        >
                          <ArrowForward fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="subtitle2" fontWeight={500}>
                              {user.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={getRoleLabel(user.role)}
                              sx={{
                                ml: 1,
                                backgroundColor:
                                  user.role === "super_admin"
                                    ? alpha("#f44336", 0.1)
                                    : user.role === "product_manager" || user.role === "user_manager"
                                      ? alpha("#ff9800", 0.1)
                                      : alpha("#2196f3", 0.1),
                                color:
                                  user.role === "super_admin"
                                    ? "#f44336"
                                    : user.role === "product_manager" || user.role === "user_manager"
                                      ? "#ff9800"
                                      : "#2196f3",
                                height: 20,
                                "& .MuiChip-label": { px: 1, fontSize: "0.625rem" },
                              }}
                            />
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: getStatusColor(user.status),
                                ml: 1,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            {user.date && (
                              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                <CalendarToday fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                                <Typography variant="caption">Inscrit le {formatDate(user.date)}</Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentUsers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="textSecondary">Aucun utilisateur récent disponible.</Typography>
              </Box>
            )}

            {recentUsers.length > 0 && (
              <Box sx={{ p: 2, textAlign: "center", borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button startIcon={<Visibility />} component="a" href="/users" color="primary">
                  Voir tous les utilisateurs
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* User Activity Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: "16px", p: 0, overflow: "hidden", height: "100%" }}>
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
              <Typography variant="h6">Activité Utilisateurs</Typography>
              <IconButton size="small" sx={{ color: "white" }}>
                <Settings fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              <Box sx={{ height: 240, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="registrations" name="Inscriptions" fill="#2196f3" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="active" name="Actifs" fill="#4caf50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Résumé d'activité
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nouveaux utilisateurs (30j)
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    48
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Taux de conversion visiteurs
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    8.2%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Taux de rétention
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    67%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserDashboardSection
