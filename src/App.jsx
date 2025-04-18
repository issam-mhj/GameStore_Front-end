import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductGrid from './pages/ProductLists';

function App() {
  return (
    <Router>
      <AuthProvider>
<CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route element={<AuthRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute roles={["product_manager", "super_admin"]} />
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="category" element={<Categories />} />
              <Route path="manageProducts" element={<Products />} />
            </Route>

            <Route
              element={<ProtectedRoute roles={["client", "super_admin"]} />}
            >
              <Route path="products" element={<ProductGrid />} />
            </Route>
          </Route>
          <Route path="*" element={<div>404</div>} />
        </Routes>
         
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
