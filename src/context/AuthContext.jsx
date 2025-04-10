import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check  user  auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const { data } = await api.get('/user');
          console.log(data);
          setUser(data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);


   // roles
   const hasRole = (requiredRoles) => {
    console.log("user");
    
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user?.roles) return false;
    return requiredRoles.some(role => user.roles.includes(role));
  };


  const login = async (credentials) => {
    try {
      const { data } = await api.post('/login', credentials);
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await api.post('/register', credentials);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Register failed:', error);
      return { success: false, message: error.response?.data?.message || 'Register failed' };
    }
  };


  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated,
      loading,
      hasRole,
      login,
      register,
      logout,
    }}
  >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);