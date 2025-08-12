import React from 'react';
import './ImageSection.css';

const ImageSection = () => {
  return (
    <section className="image-section">
      <div className="image-container">
        <img 
          src="https://i.ibb.co/KpzvTsm8/groundnuts.jpg" 
          alt="Groundnuts"
          className="groundnut-image"
          loading="lazy"
        />
        <div className="image-overlay">
          <div className="overlay-content">
            <h2>Our Commitment to Quality</h2>
            <div className="quality-text">
              <p>At Blissfull Groundnuts, quality is our legacy. We handpick the finest groundnut seeds.</p>
              <p>Cold-press methods preserve natural flavor and nutrients. Clean, sustainable processes drive our production.</p>
              <p>Each seed reflects purity, taste, and health. Bliss in every bite—naturally wholesome.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSection;

