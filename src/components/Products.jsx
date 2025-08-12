import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider, Box, Typography } from '@mui/material';
import './Products.css';

// Mock product data - replace with actual API call
const mockProducts = [
  // Raw Groundnuts (15 items)
  { id: 1, name: 'Premium Raw Groundnut 1kg', price: 180, category: 'raw', image: 'https://images.unsplash.com/photo-1600009714860-01922c6a9d26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Organic Raw Groundnut 2kg', price: 450, category: 'raw', image: 'https://images.unsplash.com/photo-1600009714860-01922c6a9d26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Raw Groundnut 500g', price: 120, category: 'raw', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Raw Groundnut 5kg Bulk Pack', price: 899, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 5, name: 'Premium Raw Groundnut 250g', price: 100, category: 'raw', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 6, name: 'Raw Groundnut 1.5kg Pack', price: 300, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 7, name: 'Jumbo Raw Groundnut 3kg', price: 650, category: 'raw', image: 'https://images.unsplash.com/photo-1600009714860-01922c6a9d26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 8, name: 'Raw Groundnut 10kg Wholesale', price: 1450, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 9, name: 'Premium Raw Groundnut 750g', price: 150, category: 'raw', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 10, name: 'Raw Groundnut 2.5kg Family Pack', price: 500, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 11, name: 'Organic Raw Groundnut 500g', price: 140, category: 'raw', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 12, name: 'Raw Groundnut 7kg Bulk', price: 1100, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 13, name: 'Premium Raw Groundnut 5kg', price: 950, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 14, name: 'Raw Groundnut 3.5kg Pack', price: 750, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 15, name: 'Raw Groundnut 8kg Wholesale', price: 1300, category: 'raw', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  
  // Roasted Groundnuts (15 items)
  { id: 16, name: 'Roasted Groundnut 500g', price: 200, category: 'roasted', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 17, name: 'Premium Roasted Groundnut 2kg', price: 750, category: 'roasted', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 18, name: 'Premium Roasted Groundnut 5kg', price: 1499, category: 'roasted', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 19, name: 'Roasted Groundnut 1kg', price: 380, category: 'roasted', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 20, name: 'Roasted Groundnut 250g', price: 150, category: 'roasted', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 21, name: 'Premium Roasted Groundnut 3kg', price: 1100, category: 'roasted', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 22, name: 'Roasted Groundnut 750g', price: 280, category: 'roasted', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 23, name: 'Premium Roasted Groundnut 1.5kg', price: 550, category: 'roasted', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 24, name: 'Roasted Groundnut 4kg', price: 1250, category: 'roasted', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 25, name: 'Premium Roasted Groundnut 7kg', price: 1400, category: 'roasted', image: 'https://images.unsplash.com/photo-1584270354945-2d1d0a1d0e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 26, name: 'Roasted Groundnut 2.5kg', price: 850, category: 'roasted', image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: 27, name: 'Premium Roasted Groundnut 4.5kg', price: 1350, category: 'roasted', image: 'https://via.placeholder.com/150' },
  { id: 28, name: 'Roasted Groundnut 6kg', price: 1399, category: 'roasted', image: 'https://via.placeholder.com/150' },
  { id: 29, name: 'Premium Roasted Groundnut 800g', price: 400, category: 'roasted', image: 'https://via.placeholder.com/150' },
  { id: 30, name: 'Roasted Groundnut 3.5kg', price: 1150, category: 'roasted', image: 'https://via.placeholder.com/150' },
  
  // Flavored Groundnuts (15 items)
  { id: 31, name: 'Spicy Masala Groundnut 500g', price: 250, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 32, name: 'Chili Lime Groundnut 500g', price: 280, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 33, name: 'Honey Roasted Peanuts 1kg', price: 420, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 34, name: 'Salted Caramel Groundnut 750g', price: 350, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 35, name: 'Garlic & Herb Groundnut 1kg', price: 320, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 36, name: 'Peri Peri Spiced Groundnut 500g', price: 270, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 37, name: 'Cheese & Onion Groundnut 750g', price: 330, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 38, name: 'Sweet & Spicy Groundnut 1kg', price: 380, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 39, name: 'Schezwan Groundnut 500g', price: 260, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 40, name: 'Barbecue Flavored Groundnut 750g', price: 340, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 41, name: 'Lemon & Black Pepper Groundnut 500g', price: 290, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 42, name: 'Tomato Basil Groundnut 750g', price: 310, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 43, name: 'Tandoori Masala Groundnut 1kg', price: 400, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 44, name: 'Sour Cream & Onion Groundnut 500g', price: 300, category: 'flavored', image: 'https://via.placeholder.com/150' },
  { id: 45, name: 'Jalapeño Cheddar Groundnut 750g', price: 360, category: 'flavored', image: 'https://via.placeholder.com/150' }
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'raw', name: 'Raw Groundnut' },
  { id: 'roasted', name: 'Roasted Groundnut' },
  { id: 'flavored', name: 'Flavoured Groundnuts' },
];

// Function to generate image URL based on product ID and category
const getProductImage = (id, category) => {
  const baseUrl = 'https://source.unsplash.com/300x200/?';
  const categories = {
    raw: 'peanuts+raw',
    roasted: 'peanuts+roasted',
    flavored: 'peanuts+snack+flavored'
  };
  return `${baseUrl}${categories[category] || 'peanuts'}&sig=${id}`;
};

// Update product images with dynamic URLs
const productsWithImages = mockProducts.map(product => ({
  ...product,
  image: product.image || getProductImage(product.id, product.category)
}));

function Products() {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(productsWithImages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([100, 1500]);

  const handleAddToCart = (product) => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', product);
    alert(`${product.name} added to cart!`);
  };

  const handleProductInfo = (product) => {
    // TODO: Navigate to product details page or show modal
    console.log('Product info:', product);
    alert(`Product: ${product.name}\nPrice: ₹${product.price}\nCategory: ${product.category}`);
  };

  // Filter products based on search term, category, and price range
  useEffect(() => {
    let result = [...productsWithImages];
    
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
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, productsWithImages]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleInputChange = (index) => (event) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    const newValue = [...priceRange];
    newValue[index] = value === '' ? 0 : Math.min(Math.max(100, value), 1500);
    setPriceRange(newValue);
  };

  const handleBlur = (index) => () => {
    if (priceRange[index] < 100) {
      const newValue = [...priceRange];
      newValue[index] = 100;
      setPriceRange(newValue);
    } else if (priceRange[index] > 1500) {
      const newValue = [...priceRange];
      newValue[index] = 1500;
      setPriceRange(newValue);
    }
  };

  return (
    <div className="products-container">
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="category-filter">
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
        
        <div className="price-filter">
          <h3>Price Range (₹)</h3>
          <Box sx={{ width: '100%', padding: '0 10px' }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={100}
              max={1500}
              step={10}
              valueLabelFormat={(value) => `₹${value}`}
              sx={{
                color: '#4caf50',
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#4caf50',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <input
                type="number"
                value={priceRange[0]}
                onChange={handleInputChange(0)}
                onBlur={handleBlur(0)}
                min={100}
                max={priceRange[1] - 1}
                className="price-input"
                style={{ width: '80px' }}
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={handleInputChange(1)}
                onBlur={handleBlur(1)}
                min={priceRange[0] + 1}
                max={1500}
                className="price-input"
                style={{ width: '80px' }}
              />
            </Box>
          </Box>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
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
                    onClick={() => handleProductInfo(product)}
                  >
                    Product Info
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
  );
}

export default Products;

