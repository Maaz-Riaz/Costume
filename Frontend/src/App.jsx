import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function CustomerSurface() {
  const location = useLocation();

  useEffect(() => {
    const root = document.querySelector('.route-surface');
    if (!root) return undefined;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const observeRevealElements = () => {
      root.querySelectorAll('.scroll-reveal:not(.is-visible)').forEach((element) => {
        revealObserver.observe(element);
      });
    };

    observeRevealElements();
    const contentObserver = new MutationObserver(observeRevealElements);
    contentObserver.observe(root, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      contentObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="route-surface">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col bg-light">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/*"
            element={
              <CustomerSurface />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
