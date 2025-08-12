import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { FaArrowLeft, FaShoppingCart, FaStar, FaHeart, FaShare, FaLeaf, FaSeedling, FaFire, FaWeight } from 'react-icons/fa';
import './ProductInfo.css';

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: 'Blissful Raw Groundnuts',
    description: 'Our premium raw groundnuts are carefully selected and packed to maintain their natural goodness. Perfect for snacking, cooking, or making your own peanut butter at home.',
    price: 150,
    originalPrice: 180,
    image: 'https://i.ibb.co/n4mgyXd/raw-peanut1.jpg',
    category: 'raw',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    benefits: [
      'Rich in protein and healthy fats',
      'High in antioxidants',
      'Good source of fiber',
      'Contains essential vitamins and minerals',
      'Promotes heart health'
    ],
    details: {
      weight: '500g',
      shelfLife: '6 months',
      origin: 'Gujarat, India',
      storage: 'Store in a cool, dry place',
      certification: 'FSSAI Certified',
    },
    images: [
      'https://i.ibb.co/n4mgyXd/raw-peanut1.jpg',
      'https://i.ibb.co/jvmDmDZc/peanut3.jpg',
      'https://i.ibb.co/QFHC7H1/peanut5.jpg'
    ]
  },
  // Add more products as needed
];

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Find the product by ID
  const product = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0];
  
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    // Optional: Show a success message or notification
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-info-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back to Products
      </button>
      
      <div className="product-details">
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.images?.[selectedImage] || product.image} alt={product.name} />
          </div>
          <div className="thumbnail-container">
            {(product.images || [product.image]).map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product.name} view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'filled' : ''} />
                ))}
              </div>
              <span>({product.reviews} reviews)</span>
            </div>
            {product.originalPrice && (
              <div className="price-container">
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            )}
            <div className="price">₹{product.price}</div>
            <p className="stock-status">
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-benefits">
            <h3>Health Benefits</h3>
            <ul>
              {product.benefits.map((benefit, index) => (
                <li key={index}>
                  <FaLeaf className="benefit-icon" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>
          </div>
          
          <div className="product-meta">
            <div className="meta-item">
              <FaWeight className="meta-icon" />
              <span>Weight: {product.details.weight}</span>
            </div>
            <div className="meta-item">
              <FaSeedling className="meta-icon" />
              <span>Origin: {product.details.origin}</span>
            </div>
            <div className="meta-item">
              <FaFire className="meta-icon" />
              <span>Shelf Life: {product.details.shelfLife}</span>
            </div>
          </div>
          
          <div className="share-section">
            <span>Share this product:</span>
            <div className="social-icons">
              <button className="share-button"><FaShare /> Share</button>
              <button className="wishlist-button"><FaHeart /> Add to Wishlist</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="product-tabs">
        <div className="tab active">Product Details</div>
        <div className="tab">Nutritional Information</div>
        <div className="tab">Reviews</div>
      </div>
      
      <div className="additional-info">
        <h3>Product Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Brand</span>
            <span className="detail-value">Blissful Groundnuts</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Category</span>
            <span className="detail-value">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Certification</span>
            <span className="detail-value">{product.details.certification}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Storage</span>
            <span className="detail-value">{product.details.storage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
