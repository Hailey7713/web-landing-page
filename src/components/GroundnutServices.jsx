import React from 'react';
import './GroundnutServices.css';

const GroundnutServices = () => {
  return (
    <section id="services" className="services-section" data-aos="fade-up" data-aos-delay="300">
      <div className="container">
        <h2 className="section-title">Our Groundnut Services</h2>
        
        <div className="services-intro">
          <p>We provide comprehensive groundnut solutions tailored to meet your needs. Our services include:</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-seedling"></i>
            </div>
            <h3 className="service-title">Premium Quality Groundnut Supply</h3>
            <p className="service-description">
              We source and supply the finest quality groundnuts, ensuring they meet the highest standards of taste and nutrition.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3 className="service-title">Bulk Supply & Distribution</h3>
            <p className="service-description">
              Reliable bulk supply of groundnuts for businesses, retailers, and wholesalers with flexible delivery options.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-industry"></i>
            </div>
            <h3 className="service-title">Custom Processing</h3>
            <p className="service-description">
              Customized groundnut processing including cleaning, roasting, salting, and packaging as per your requirements.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-boxes"></i>
            </div>
            <h3 className="service-title">Private Label Packaging</h3>
            <p className="service-description">
              Create your own brand with our private label packaging services, customized to your specifications.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-globe-americas"></i>
            </div>
            <h3 className="service-title">Export Services</h3>
            <p className="service-description">
              International export services with all necessary certifications and documentation for smooth global trade.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <h3 className="service-title">Consultation</h3>
            <p className="service-description">
              Expert consultation on groundnut cultivation, processing, and business development in the groundnut industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroundnutServices;
