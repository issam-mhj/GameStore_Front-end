import { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Button, TextField, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Dialog, DialogActions, DialogContent, 
  DialogTitle, CircularProgress, Snackbar, Alert, FormControl,
  InputLabel, FormHelperText, Grid, Card, CardMedia, CardActions, Switch,
  FormControlLabel, Tabs, Tab, Chip, InputAdornment
} from '@mui/material';
import { 
  Add, Edit, Delete, Close, Image, AddPhotoAlternate, 
  StarBorder, Star, CloudUpload
} from '@mui/icons-material';
import api from '../api/axios';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [productImages, setProductImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    status: 'available',
    category_id: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      console.log(response.data.products_list);
      setProducts(response.data.products_list || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showSnackbar('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('v1/admin/categories');      
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showSnackbar('Failed to load categories', 'error');
    }
  };

  const fetchProductImages = async (productId) => {
    try {
      const response = await api.get(`products/${productId}/images`);
      setProductImages(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch product images:', error);
      showSnackbar('Failed to load product images', 'error');
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        status: product.status || 'available',
        category_id: product.category_id || ''
      });
      setSelectedProduct(product);
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '',
        status: 'available',
        category_id: ''
      });
      setSelectedProduct(null);
      setIsEditing(false);
    }
    setCurrentTab(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setImageFiles([]);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenImageDialog = (product) => {
    setSelectedProduct(product);
    fetchProductImages(product.id);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setProductImages([]);
    setImageFiles([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name') {
      setFormData(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: checked ? 'available' : 'unavailable' 
    }));
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await api.put(`/products/images/${imageId}/set-primary`);
      fetchProductImages(selectedProduct.id);
      showSnackbar('Primary image updated successfully');
    } catch (error) {
      console.error('Error setting primary image:', error);
      showSnackbar('Failed to update primary image', 'error');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/products/images/${imageId}`);
      fetchProductImages(selectedProduct.id);
      showSnackbar('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      showSnackbar('Failed to delete image', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUploadImages = async (prodId = selectedProduct?.id) => {
    if (!imageFiles.length || !prodId) return;
    
    setUploadingImages(true);
    const uploadFormData = new FormData();
    
    imageFiles.forEach(file => {
      uploadFormData.append('images[]', file);
    });
    
    try {
      await api.post(`/products/${prodId}/images`, uploadFormData, {
        
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log();
      
      showSnackbar('Images uploaded successfully');
      setImageFiles([]);
      if(selectedProduct) fetchProductImages(prodId);
    } catch (error) {
      console.error('Error uploading images:', error);
      showSnackbar('Failed to upload images', 'error');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await api.put(`/products/${selectedProduct.id}`, formData);
        showSnackbar('Product updated successfully');
      } else {
        const response = await api.post('/products', formData);
        console.log(response);
        showSnackbar('Product created successfully');
        const newProduct = response.data.product;
        setSelectedProduct(newProduct);
        if(imageFiles.length) {
          await handleUploadImages(newProduct.id);
        }
      }
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar(
        `Failed to ${isEditing ? 'update' : 'create'} product: ${error.response?.data?.message || error.message}`, 
        'error'
      );
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${selectedProduct.id}`);
      showSnackbar('Product deleted successfully');
      handleCloseDeleteDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar(
        `Failed to delete product: ${error.response?.data?.message || error.message}`, 
        'error'
      );
      handleCloseDeleteDialog();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const getProductMainImage = (product) => {
    if (product.main_image) {
      return product.main_image;
    }
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box
                      component="img"
                      sx={{
                        height: 60,
                        width: 60,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                      src={getProductMainImage(product)}
                      alt={product.name}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{getCategoryName(product.category_id)}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.status} 
                      color={product.status === 'available' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="info" 
                      onClick={() => handleOpenImageDialog(product)}
                      aria-label="manage images"
                    >
                      <Image />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(product)}
                      aria-label="edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(product)}
                      aria-label="delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Product' : 'Add New Product'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Only one tab is used now.
              When editing, you can still use the Images tab (for example, if you want to manage existing images).
              When adding a product, the file input for images is now placed at the bottom of the Basic Info section. */}
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="product tabs">
            <Tab label="Basic Info" />
            {isEditing && <Tab label="Images" />}
          </Tabs>
          
          {currentTab === 0 && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    name="name"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="slug"
                    label="Slug"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.slug}
                    onChange={handleInputChange}
                    helperText="Used in URLs (lowercase letters, numbers, and hyphens only)"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={formData.price}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">MAD</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="stock"
                    label="Stock"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      name="category_id"
                      value={formData.category_id}
                      label="Category"
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="">
                        <em>Select a category</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Select product category</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.status === 'available'}
                        onChange={handleSwitchChange}
                        name="status"
                        color="primary"
                      />
                    }
                    label={`Status: ${formData.status === 'available' ? 'Available' : 'Unavailable'}`}
                  />
                </Grid>
                {/* 
                  --- New file upload input for new products ---
                  This input will appear only when adding a product (i.e. not editing)
                */}
                {!isEditing && (
                  <Grid item xs={12}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AddPhotoAlternate />}
                    >
                      Select Product Images
                      <VisuallyHiddenInput 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleFileChange} 
                      />
                    </Button>
                    {imageFiles.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {imageFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => removeFile(index)}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {currentTab === 1 && isEditing && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Current Images
              </Typography>
              
              {productImages.length > 0 ? (
                <Grid container spacing={2}>
                  {productImages.map((image) => (
                    <Grid item xs={6} sm={4} md={3} key={image.id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={image.image_url}
                          alt={`Product image ${image.id}`}
                        />
                        <CardActions>
                          <IconButton 
                            size="small" 
                            color={image.is_primary ? "primary" : "default"}
                            onClick={() => handleSetPrimary(image.id)}
                            disabled={image.is_primary}
                          >
                            {image.is_primary ? <Star /> : <StarBorder />}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <Delete />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No images uploaded yet
                </Typography>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload New Images
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternate />}
                  >
                    Select Images
                    <VisuallyHiddenInput 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange} 
                    />
                  </Button>
                  
                  {imageFiles.length > 0 && (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Selected files:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {imageFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => removeFile(index)}
                            size="small"
                          />
                        ))}
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUpload />}
                        onClick={handleUploadImages}
                        sx={{ mt: 2 }}
                        disabled={uploadingImages}
                      >
                        {uploadingImages ? 'Uploading...' : 'Upload Images'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {currentTab === 0 && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={!formData.name || !formData.slug || !formData.price || !formData.category_id}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Manage Images Dialog (Separate from edit dialog) */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Manage Images - {selectedProduct?.name}
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Current Images
          </Typography>
          
          {productImages.length > 0 ? (
            <Grid container spacing={2}>
              {productImages.map((image) => (
                <Grid item xs={6} sm={4} md={3} key={image.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.image_url}
                      alt={`Product image ${image.id}`}
                    />
                    <CardActions>
                      <IconButton 
                        size="small" 
                        color={image.is_primary ? "primary" : "default"}
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={image.is_primary}
                      >
                        {image.is_primary ? <Star /> : <StarBorder />}
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No images uploaded yet
            </Typography>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload New Images
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<AddPhotoAlternate />}
              >
                Select Images
                <VisuallyHiddenInput 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange} 
                />
              </Button>
              
              {imageFiles.length > 0 && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Selected files:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {imageFiles.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeFile(index)}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUpload />}
                    onClick={handleUploadImages}
                    sx={{ mt: 2 }}
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{selectedProduct?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;
