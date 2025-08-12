import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './ProductsPage.css';

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
    id: 5,
    name: 'Safe Harvest Pesticide-Free Roasted Groundnut (500g)',
    description: 'Natural & delicious',
    price: 123,
    image: 'https://i.ibb.co/QFHC7H1/peanut5.jpg',
    category: 'organic'
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
  },
  {
    id: 13,
    name: 'Unpolished Raw Peanut',
    description: 'Natural and unprocessed',
    price: 175,
    image: 'https://i.ibb.co/ccWJVF4/raw-peanut3.jpg',
    category: 'raw'
  }
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'roasted', name: 'Roasted Peanuts' },
  { id: 'organic', name: 'Organic Peanuts' },
  { id: 'raw', name: 'Raw Peanuts' },
  { id: 'oil', name: 'Peanut Oil' }
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1500);
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState('');

  // Filter products based on search, category, and price range
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter (show products with price less than or equal to selected price)
    result = result.filter(product => product.price <= priceRange);
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, products]);

  const handlePriceChange = (e) => {
    setPriceRange(parseInt(e.target.value, 10));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the useEffect hook
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotificationProduct(product.name);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

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
              {categories.map(category => (
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
          {filteredProducts.length > 0 ? (
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
                  <div className="product-buttons">
                    <button 
                      className="add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="product-info"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      aria-label={`View details for ${product.name}`}
                    >
                      <FaInfoCircle className="info-icon" />
                      Info
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

