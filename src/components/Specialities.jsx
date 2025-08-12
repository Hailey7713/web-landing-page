import React from 'react';
import './Specialities.css';

const Specialities = () => {
  const specialities = [
    {
      icon: '🌱',
      title: 'Premium Quality',
      description: 'Handpicked groundnuts from the finest farms, ensuring top-notch quality in every batch.'
    },
    {
      icon: '👨‍🌾',
      title: 'Direct from Farmers',
      description: 'Sourced directly from trusted farmers, supporting local agriculture and ensuring freshness.'
    },
    {
      icon: '🔍',
      title: 'Rigorous Testing',
      description: 'Each batch undergoes strict quality checks to maintain our high standards.'
    },
    {
      icon: '🌍',
      title: 'Eco-friendly',
      description: 'Environmentally conscious processing and packaging to minimize our ecological footprint.'
    },
    {
      icon: '⚡',
      title: 'Rich in Nutrients',
      description: 'Packed with essential nutrients, proteins, and healthy fats for a nutritious snack.'
    },
    {
      icon: '👨‍🍳',
      title: 'Expertly Crafted',
      title: 'Expertly Crafted',
      description: 'Prepared with traditional methods and modern hygiene standards for the perfect taste.'
    }
  ];

  return (
    <section id="specialities" className="specialities-section">
      <div className="container">
        <h2 className="section-title">Our Specialities</h2>
        <div className="specialities-grid">
          {specialities.map((item, index) => (
            <div key={index} className="speciality-card">
              <div className="speciality-icon">{item.icon}</div>
              <h3 className="speciality-title">{item.title}</h3>
              <p className="speciality-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialities;

