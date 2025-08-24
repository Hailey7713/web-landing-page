import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryPage.css';

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cash-on-delivery'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOrderNotification = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5001/api/orders/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderDetails: orderData }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      ...formData,
      orderNumber,
      orderDate: new Date().toLocaleString(),
    };
    
    try {
      // 1. First, send the order to your backend (you'll need to implement this)
      console.log('Order submitted:', orderData);
      
      // 2. Send SMS notification to owner
      const notificationSent = await sendOrderNotification(orderData);
      
      if (!notificationSent) {
        console.warn('Failed to send SMS notification, but order was still placed');
      }
      
      // 3. Navigate to success page
      navigate('/order-success', { 
        state: { 
          orderDetails: orderData,
          orderNumber,
          notificationSent
        } 
      });
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to place order. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <h1>Delivery Information</h1>
        <p className="delivery-note">Please fill in your delivery details to complete your order.</p>
        
        <form onSubmit={handleSubmit} className="delivery-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="Enter your complete delivery address"
              rows="3"
            ></textarea>
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-option">
              <input
                type="radio"
                id="cash-on-delivery"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={formData.paymentMethod === 'cash-on-delivery'}
                onChange={handleChange}
              />
              <label htmlFor="cash-on-delivery">Cash on Delivery (COD)</label>
              <p className="payment-note">Pay with cash upon delivery</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-back"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Back to Cart
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryPage;
