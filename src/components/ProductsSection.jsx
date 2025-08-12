import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsSection.css';

const ProductsSection = () => {
  const navigate = useNavigate();
  
  const handleViewAllProducts = () => {
    navigate('/products');
  };
  return (
    <section id="products" className="products-section">
      <div className="container">
        <h2 className="section-title">Our Products</h2>
        <div className="specialities-intro">
          <h3>Our Specialities</h3>
          <p>Discover our premium selection of groundnuts, carefully sourced and prepared to bring you the best quality and taste experience.</p>
        </div>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-image-wrapper">
              <img 
                src="https://i.ibb.co/jYz6Tzn/raw-groundnut.jpg" 
                alt="Raw Groundnut" 
                className="product-image"
              />
            </div>
            <h3 className="product-title">Raw Groundnut</h3>
            <p className="product-description">
              Blissful Groundnuts, carefully selected and packed to maintain freshness and nutritional value.
            </p>
          </div>
          
          <div className="product-card">
            <div className="product-image-wrapper">
              <img 
                src="https://i.ibb.co/6RtmmTKq/roasted-groundnut.jpg" 
                alt="Roasted Groundnut" 
                className="product-image"
              />
            </div>
            <h3 className="product-title">Roasted Groundnut</h3>
            <p className="product-description">
              Delicious roasted groundnuts, perfectly seasoned and packed to preserve their rich, nutty flavor.
            </p>
          </div>

          <div className="product-card">
            <div className="product-image-wrapper">
              <img 
                src="https://i.ibb.co/xKDV5Gwx/flavoured-groundnut.jpg" 
                alt="Flavoured Groundnut" 
                className="product-image"
              />
            </div>
            <h3 className="product-title">Flavoured Groundnut</h3>
            <p className="product-description">
              Exquisite flavored groundnuts, available in a variety of delicious tastes to satisfy every palate.
            </p>
          </div>
          <div className="view-all-container">
            <button 
              className="view-all-button"
              onClick={handleViewAllProducts}
            >
              View All Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;

