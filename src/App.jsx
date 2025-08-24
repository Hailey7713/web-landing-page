import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { auth, getRedirectResult, GoogleAuthProvider } from './firebase';

// Import components with proper error handling
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const AboutSection = React.lazy(() => import('./components/AboutSection'));
const ImageSection = React.lazy(() => import('./components/ImageSection'));
const ProductsSection = React.lazy(() => import('./components/ProductsSection'));
const ProductsPage = React.lazy(() => import('./components/ProductsPage'));
const ProductInfo = React.lazy(() => import('./components/ProductInfo'));
const CartPage = React.lazy(() => import('./components/CartPage'));
const Login = React.lazy(() => import('./components/Login'));
const Profile = React.lazy(() => import('./components/Profile'));
const GroundnutServices = React.lazy(() => import('./components/GroundnutServices'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));
const DeliveryPage = React.lazy(() => import('./pages/DeliveryPage'));
const OrderSuccess = React.lazy(() => import('./components/OrderSuccess'));
const AdminOrders = React.lazy(() => import('./pages/AdminOrders'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}


// This component handles scrolling to hash fragments
const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, hash } = location;

  useEffect(() => {
    // Only run if we have a valid location object
    if (!location) return;
    
    // Create a safe copy of the hash to prevent potential reference issues
    const currentHash = hash || '';
    
    try {
      if (!currentHash) {
        // Scroll to top if no hash
        window.scrollTo(0, 0);
      } else {
        // Scroll to element with matching ID
        const id = currentHash.replace('#', '');
        const element = document.getElementById(id);
        
        // Use requestAnimationFrame for smoother scrolling
        const scrollToElement = () => {
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        };
        
        // Small delay to ensure the DOM is ready
        const timer = setTimeout(() => {
          requestAnimationFrame(scrollToElement);
        }, 50);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error in scroll handler:', error);
    }
  }, [pathname, hash, location]);

  return null;
};

// Main content component with all routes
const AppContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Handle Google Sign-In redirect result
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // The signed-in user info
          const user = result.user;
          console.log('Google Sign-In successful', { 
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
          
          // Use a simpler navigation without complex state
          navigate('/', { 
            replace: true,
            state: JSON.parse(JSON.stringify({ fromLogin: true })) // Ensure serializable state
          });
        }
      } catch (error) {
        console.error('Google Sign-In Redirect Error:', error);
        
        if (error.code) {
          console.error('Auth Error Details:', {
            code: error.code,
            message: error.message,
            email: error.customData?.email,
            credential: GoogleAuthProvider.credentialFromError?.(error) || 'Not available'
          });
        }
      }
    };
    
    // Only run this effect when the component mounts
    // and there's a redirect result to handle
    if (window.location.pathname === '/login' && !window.location.hash) {
      handleRedirect();
    }
  }, [navigate]);
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  // Check if user is authenticated using the user state
  const isAuthenticated = () => {
    return user !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Create a separate layout for the home page to avoid re-rendering everything
  const HomeLayout = () => (
    <>
      <LandingPage />
      <AboutSection data-aos="fade-up" />
      <ImageSection data-aos="fade-up" data-aos-delay="100" />
      <ProductsSection data-aos="fade-up" data-aos-delay="200" />
      <GroundnutServices data-aos="fade-up" data-aos-delay="300" />
      <ContactSection data-aos="fade-up" data-aos-delay="400" />
    </>
  );

  // Debug: Log when AppContent renders and user state
  console.log('AppContent rendering, user:', user);
  console.log('Current path:', window.location.pathname);
  console.log('Login route should render:', !(user && user.uid));

  return (
    <div className="App">
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomeLayout />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductInfo />} />
            <Route path="/cart" element={<CartPage />} />
            {/* Admin Routes */}
            <Route path="/admin/orders" element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route 
              path="/delivery" 
              element={
                <ProtectedRoute>
                  <DeliveryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={user && user.uid ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route 
              path="/order-success" 
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } 
            />
            {/* Add a catch-all route for 404 pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Main App component with providers
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AppContent />
            </Suspense>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
