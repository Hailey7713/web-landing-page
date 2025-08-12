import React, { useState } from 'react';

import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      // Here you would typically call your API
      // await contactAPI.sendMessage(formData);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({ 
        success: true, 
        message: 'Your message has been sent successfully! We\'ll get back to you soon.' 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to send message. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" data-aos="fade-up" data-aos-delay="400">
      <div className="container">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-subtitle">Have questions or want to know more about our services? We'd love to hear from you!</p>
        
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-content">
                <h3>Our Location</h3>
                <p>Hyderabad,Telangana,india</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="info-content">
                <h3>Phone Number</h3>
                <p>+1 (975)5375936</p>
                <p>+1 (970)3859286</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-content">
                <h3>Email Address</h3>
                <p>info@blissfullgroundnuts.com</p>
                <p>sales@blissfullgroundnuts.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="info-content">
                <h3>Working Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="contact-form-container">
            {submitStatus.message && (
              <div className={`form-message ${submitStatus.success ? 'success' : 'error'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone (Optional)"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Thank You Section */}
        <div className="thank-you-section" style={{
          marginTop: '80px',
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'var(--section-bg, #f9f9f9)',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px'
          }}>
            <h2 style={{
              fontSize: '2.2rem',
              color: 'var(--primary-color, #2c3e50)',
              marginBottom: '20px',
              fontWeight: '600'
            }}>Thank You for Visiting Blissfull Groundnuts!</h2>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-color, #333)',
              marginBottom: '20px'
            }}>
              We're thrilled you took the time to explore our premium selection of groundnuts and learn more about our passion for quality and taste. 
              Your interest in our products means the world to us!
            </p>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-color, #333)',
              marginBottom: '30px'
            }}>
              Whether you're here to stock up on your favorite snacks or discover new flavors, we're committed to providing you with 
              the finest groundnuts that are not only delicious but also packed with nutrition.
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              marginTop: '30px'
            }}>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                <i className="fas fa-arrow-up" style={{ fontSize: '0.9rem' }}></i>
                Back to Top
              </button>
              
              <button 
                onClick={() => window.location.href = '/products'}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#218838',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                <i className="fas fa-shopping-bag" style={{ fontSize: '0.9rem' }}></i>
                Shop Now
              </button>
            </div>
            
            <div style={{
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '1px solid var(--border-color, #eee)'
            }}>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted, #666)',
                marginBottom: '10px'
              }}>
                Stay connected with us on social media for the latest updates and offers
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginTop: '15px'
              }}>
                {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                  <a 
                    key={social}
                    href={`#${social}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--social-bg, #f0f0f0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-color, #2c3e50)',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      fontSize: '1.1rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#28a745';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'var(--social-bg, #f0f0f0)';
                      e.target.style.color = 'var(--primary-color, #2c3e50)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    aria-label={social.charAt(0).toUpperCase() + social.slice(1)}
                  >
                    <i className={`fab fa-${social}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
