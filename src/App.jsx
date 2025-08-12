import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import { CartProvider } from './components/CartContext';
import { auth, getRedirectResult } from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';

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
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Main content component with all routes
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          console.log('Google Sign-In successful', { user });
          
          // Redirect to home page after successful sign-in
          navigate('/', { replace: true, state: { fromLogin: true } });
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
    
    handleRedirect();
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

  return (
    <div className="App">
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
          <Route path="/" element={
            <>
              <LandingPage />
              <AboutSection data-aos="fade-up" />
              <ImageSection data-aos="fade-up" data-aos-delay="100" />
              <ProductsSection data-aos="fade-up" data-aos-delay="200" />
              <GroundnutServices data-aos="fade-up" data-aos-delay="300" />
              <ContactSection data-aos="fade-up" data-aos-delay="400" />
            </>
          } />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
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
  // Handle redirect result when the app loads
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Google Sign-In redirect result:', result);
          // User is signed in, you can handle the result here
          // For example, you might want to update the UI or redirect
          // The user will be automatically signed in by Firebase
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
        // Handle any errors that occur during the redirect
      }
    };

    // Check if we're coming back from a redirect
    if (window.location.pathname === '/login' && window.location.hash === '') {
      handleRedirectResult();
    }
  }, []);

  return (
    <React.StrictMode>
      <Router>
        <CartProvider>
          <ScrollToTop />
          <AppContent />
        </CartProvider>
      </Router>
    </React.StrictMode>
  );
};

export default App;
