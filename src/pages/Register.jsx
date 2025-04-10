import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Paper, 
  Divider,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    if (userData.password !== userData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    
    const result = await register(userData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            GAMEEXPRESS
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join our gaming community and discover amazing games
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={userData.name}
            onChange={handleChange}
            variant="outlined"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={userData.email}
            onChange={handleChange}
            variant="outlined"
            type="email"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
            value={userData.password}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password_confirmation"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="password_confirmation"
            autoComplete="new-password"
            value={userData.password_confirmation}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                name="agreeToTerms"
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the Terms of Service and Privacy Policy
              </Typography>
            }
            sx={{ mt: 2 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={!agreeToTerms}
          >
            CREATE ACCOUNT
          </Button>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Grid container>
            <Grid item xs>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: 'primary' }}>
                  <Button color="primary" variant="text" sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto' }}>
                    Sign In
                  </Button>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;