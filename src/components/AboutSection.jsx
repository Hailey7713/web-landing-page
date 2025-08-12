import React, { useEffect, useRef } from 'react';
import './AboutSection.css';

const AboutSection = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;
        
        if (isVisible) {
          aboutRef.current.classList.add('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="about-section" ref={aboutRef}>
      <div className="about-content">
        <div className="about-text">
          <h2>KNOW US</h2>
          <div className="tagline">PREMIUM QUALITY | ECO-FRIENDLY</div>
          <blockquote>
            "At BLISSFULL GROUNDNUTS, we believe in bringing you the finest quality groundnuts 
            straight from our farms to your table. Our commitment to sustainable farming 
            practices ensures that every nut is not only delicious but also environmentally 
            responsible."
          </blockquote>
        </div>
        <div className="about-image">
          <img 
            src="https://i.ibb.co/B2nTvd8V/groundnuts.jpg" 
            alt="Freshly harvested groundnuts with roots"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

