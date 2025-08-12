import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { getAuth } from 'firebase/auth';
import { auth } from '../firebase';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Check for successful login redirect
  useEffect(() => {
    if (location.state?.fromLogin) {
      setShowSuccess(true);
      // Auto-hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        // Clear the location state to prevent showing the message again on refresh
        window.history.replaceState({}, document.title);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation functions
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      if (newMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    } catch (err) {
      console.error('Error setting dark mode:', err);
    }
  };

  // Apply dark mode on initial load
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        const darkMode = JSON.parse(savedMode);
        setIsDarkMode(darkMode);
        if (darkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
    } catch (err) {
      console.error('Error reading dark mode preference:', err);
    }
  }, []);

  return (
    <div className={`landing-page ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <p>Login successful! Welcome back!</p>
          <button onClick={() => setShowSuccess(false)} className="close-btn">×</button>
        </div>
      )}
      
      {/* Navigation */}
      <header className="header">
        <div className="container">
          <div className="logo">Blissfull Groundnuts</div>
          
          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
            <a href="#products" onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}>Products</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            {currentUser ? (
              <button 
                className="btn btn-profile" 
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                👤 Profile
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            )}
            <button 
              className="btn btn-cart" 
              onClick={() => navigate('/cart')}
            >
              Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            <button 
              className="theme-toggle" 
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
            <a href="#products" onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}>Products</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            {currentUser ? (
              <button 
                className="btn btn-block" 
                onClick={() => navigate('/profile')}
              >
                👤 My Profile
              </button>
            ) : (
              <button 
                className="btn btn-block" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            )}
            <button 
              className="btn btn-block" 
              onClick={() => navigate('/cart')}
            >
              View Cart ({cartCount})
            </button>
            <button 
              className="btn btn-block theme-toggle" 
              onClick={toggleDarkMode}
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Blissfull Groundnuts</h1>
            <p>Discover the finest selection of groundnuts, carefully sourced and packed to preserve their natural goodness.</p>
            <div className="cta-buttons" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="feature">
            <div className="feature-icon">🌱</div>
            <h3>100% Natural</h3>
            <p>No artificial additives or preservatives</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <h3>Premium Quality</h3>
            <p>Hand-selected for the best taste</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>On orders over ₹500</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2>Ready to try our premium groundnuts?</h2>
          <p>Join thousands of satisfied customers who trust our quality products.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
