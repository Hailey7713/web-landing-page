/**
 * ProductsPage Component
 * Displays a grid of products with filtering and search functionality
 * Created: 2023-06-15
 * Last Updated: 2023-08-24 - Added search and filter features
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { FaCheckCircle, FaInfoCircle, FaSearch, FaFilter } from 'react-icons/fa';
import './ProductsPage.css';

// TODO: Move product data to a separate JSON file or API
// TODO: Add loading states for better UX
// TODO: Implement infinite scroll for better performance with large product lists

// Product data with images
const mockProducts = [
  {
    id: 1,
    name: 'SHREGO Dark Roasted Whole Peanut Unsalted (360g)',
    description: 'Vacuum packed, skin removed. Great for snacking or grinding',
    price: 197,
    image: 'https://i.ibb.co/yMSWYVf/peanut1.jpg',
    category: 'roasted'
  },
  {
    id: 2,
    name: 'Bikano Roasted Peanuts - Salted (200g)',
    description: 'Crunchy and lightly salted',
    price: 50,
    image: 'https://i.ibb.co/4nPtnQ9h/peanut2.jpg',
    category: 'roasted'
  },
  {
    id: 3,
    name: 'Organic Tattva Whole Groundnuts (500g)',
    description: 'All-natural, premium quality',
    price: 151,
    image: 'https://i.ibb.co/jvmDmDZc/peanut3.jpg',
    category: 'organic'
  },
  {
    id: 4,
    name: 'SHREGO Khari Sing Roasted Salted Peanut (180g)',
    description: 'Traditionally roasted, vacuum packed',
    price: 95,
    image: 'https://i.ibb.co/qLZbxHYF/peanut4.jpg',
    category: 'roasted'
  },
  
  {
    id: 6,
    name: 'Jabsons Roasted Peanut Khari Sing with Skin (400g)',
    description: 'Jumbo Bharuchi peanuts',
    price: 171,
    image: 'https://i.ibb.co/BHPXYdMd/peanut6.jpg',
    category: 'roasted'
  },
  {
    id: 7,
    name: 'Veganic Roasted Groundnut With Shell (400g)',
    description: 'Bhuni Sabut Mungfali style',
    price: 209,
    image: 'https://i.ibb.co/mFHF0svK/peanut7.jpg',
    category: 'raw'
  },
  {
    id: 8,
    name: 'Raw Groundnut',
    description: 'Premium quality raw peanuts',
    price: 150,
    image: 'https://i.ibb.co/n4mgyXd/raw-peanut1.jpg',
    category: 'raw'
  },
  {
    id: 9,
    name: 'Organic Groundnuts',
    description: '100% organic and natural',
    price: 180,
    image: 'https://i.ibb.co/Z6RFzNrC/organic-peanut1.jpg',
    category: 'organic'
  },
  {
    id: 10,
    name: 'Groundnut Oil',
    description: 'Pure and healthy cooking oil',
    price: 250,
    image: 'https://i.ibb.co/3yVrYj9b/peanut-oil1.jpg',
    category: 'oil'
  },
  {
    id: 11,
    name: 'Organic Groundnut Oil',
    description: 'Cold-pressed organic oil',
    price: 299,
    image: 'https://i.ibb.co/PGHpQRwJ/organic-oil1.jpg',
    category: 'oil'
  },
  {
    id: 12,
    name: 'Raw Peanuts (1kg)',
    description: 'Premium quality raw peanuts',
    price: 199,
    image: 'https://i.ibb.co/gM5ZjKyp/raw-peanut2.jpg',
    category: 'raw'
  }
];

// Categories for filtering - could be moved to a config file
const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'roasted', name: 'Roasted Peanuts' },
  { id: 'organic', name: 'Organic Peanuts' },
  { id: 'raw', name: 'Raw Peanuts' },
  { id: 'oil', name: 'Peanut Oil' }
];

// Price range configuration
const PRICE_RANGE = {
  min: 50,
  max: 1000,
  step: 10
};

const ProductsPage = () => {
  // Hooks and state
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const notificationTimer = useRef(null);

  // Component state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(PRICE_RANGE.max);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([...mockProducts]);

  // Handle URL parameters for sharing filtered views
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    const price = params.get('maxPrice');

    if (category && PRODUCT_CATEGORIES.some(cat => cat.id === category)) {
      setSelectedCategory(category);
    }

    if (search) {
      setSearchTerm(search);
    }

    if (price && !isNaN(price)) {
      const priceNum = parseInt(price, 10);
      if (priceNum >= PRICE_RANGE.min && priceNum <= PRICE_RANGE.max) {
        setPriceRange(priceNum);
      }
    }
  }, [location.search]);

  // Filter products based on search, category, and price range
  useEffect(() => {
    setIsLoading(true);
    
    // Update URL with current filters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (priceRange < PRICE_RANGE.max) params.set('maxPrice', priceRange);
    
    // Update URL without page reload
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
    
    // Small delay to simulate loading (remove in production)
    const timer = setTimeout(() => {
      try {
        let result = [...mockProducts];
        
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          result = result.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
          );
        }
        
        // Apply category filter
        if (selectedCategory !== 'all') {
          result = result.filter(product => product.category === selectedCategory);
        }
        
        // Apply price range filter
        result = result.filter(product => product.price <= priceRange);
        
        // Sort by price (ascending)
        result.sort((a, b) => a.price - b.price);
        
        setFilteredProducts(result);
      } catch (error) {
        console.error('Error filtering products:', error);
        // Fallback to showing all products if there's an error
        setFilteredProducts([...mockProducts]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, priceRange]);

  const handlePriceChange = (e) => {
    setPriceRange(parseInt(e.target.value, 10));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the useEffect hook
  };

  /**
   * Handles adding a product to the cart
   * @param {Object} product - The product to add to cart
   */
  const handleAddToCart = useCallback((product) => {
    // Add to cart with quantity 1
    addToCart({
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString() // Track when item was added
    });

    // Show notification
    setNotificationProduct(product.name);
    setShowNotification(true);

    // Clear any existing timer
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    // Auto-hide notification after 3 seconds
    notificationTimer.current = setTimeout(() => {
      setShowNotification(false);
      setNotificationProduct('');
    }, 3000);

  }, [addToCart]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  // Animation for notification
  const notificationRef = useRef(null);

  useEffect(() => {
    if (showNotification && notificationRef.current) {
      const element = notificationRef.current;
      element.classList.remove('hide');
      element.classList.add('show');
      
      const timer = setTimeout(() => {
        element.classList.remove('show');
        element.classList.add('hide');
        
        // Reset notification state after animation completes
        setTimeout(() => {
          setShowNotification(false);
        }, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="products-page">
      {/* Notification */}
      {showNotification && (
        <div 
          ref={notificationRef} 
          className="notification"
          role="alert"
          aria-live="polite"
        >
          <FaCheckCircle className="notification-icon" />
          {`${notificationProduct} added to cart!`}
        </div>
      )}
      
      <div className="products-container">
        <div className="filters">
          {/* Search Bar */}
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
              </button>
            </form>
          </div>
          
          {/* Category Filter */}
          <div className="category-filter">
            <h3>Categories</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Range Filter */}
          <div className="price-filter">
            <h3>Price Range (up to ₹{priceRange})</h3>
            <div className="price-slider">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange}
                onChange={handlePriceChange}
                className="slider"
                aria-label="Maximum price filter"
              />
              <div className="price-labels">
                <span>₹0</span>
                <span>₹2000</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="products-grid">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card" 
                data-aos="fade-up"
                onClick={() => navigate(`/product/${product.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/product/${product.id}`);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="price">₹{product.price.toLocaleString()}</p>
                  <div className="product-actions">
                    <button 
                      className="add-to-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <span className="cart-icon">🛒</span> Add to Cart
                    </button>
                    <button 
                      className="buy-now"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                        navigate('/cart');
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No products found matching your criteria.</div>
          )}
        </div>
      </div>
      
      {/* Notification */}
      {showNotification && (
        <div className="notification">
          {notificationProduct} has been added to your cart!
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

