/**
 * DeliveryPage Component
 * Handles the checkout process including address and payment details
 * Created: 2023-07-10
 * Last Updated: 2023-08-24 - Added order submission and validation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './DeliveryPage.css';

// TODO: Move validation to a separate utility file
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

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

  /**
   * Sends order notification to the server
   * @param {Object} orderData - The order details
   * @returns {Promise<boolean>} - Whether the notification was sent successfully
   */
  const sendOrderNotification = async (orderData) => {
    const NOTIFICATION_ENDPOINT = 'http://localhost:5001/api/orders/notify';
    
    // Add client-side timestamp
    const orderWithTimestamp = {
      ...orderData,
      clientTimestamp: new Date().toISOString()
    };

    try {
      console.log('Sending order notification...');
      const response = await fetch(NOTIFICATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ 
          orderDetails: orderWithTimestamp 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Notification response:', data);
      return data.success;
      
    } catch (error) {
      console.error('Failed to send notification:', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      // We'll still return true to continue with the order
      // even if notification fails
      return true;
    }
  };

  /**
   * Handles input changes and performs basic validation
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear previous error for this field if any
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Real-time validation for email
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
    }
    
    // Real-time validation for phone
    if (name === 'phone' && value && !validatePhone(value)) {
      setErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid 10-digit phone number'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      
      if (cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }
      
      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      // Create order object
      const order = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: cartItems,
        totalAmount: totalAmount,
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      // Send order notification
      const notificationSent = await sendOrderNotification(order);
      
      if (!notificationSent) {
        console.warn('Failed to send order notification');
      }
      
      // Generate order number with random 4 digits
      const random4Digits = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${random4Digits}-${Date.now().toString().slice(-4)}`;
      
      // Create order details object for storage
      const orderDetails = {
        orderNumber,
        items: cartItems,
        totalAmount,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'Successful'
      };
      
      // Save order to localStorage
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userOrders = JSON.parse(localStorage.getItem('userOrders') || '{}');
        if (!userOrders[currentUser.uid]) {
          userOrders[currentUser.uid] = [];
        }
        userOrders[currentUser.uid].push(orderDetails);
        localStorage.setItem('userOrders', JSON.stringify(userOrders));
      }
      
      // Clear cart after saving order
      localStorage.removeItem('cart');
      navigate('/order-success', {
        state: {
          orderDetails: {
            orderNumber,
            items: cartItems,
            totalAmount,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            paymentMethod: formData.paymentMethod,
            orderDate: new Date().toLocaleDateString()
          },
          notificationSent: true
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to place order. Please try again.'
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
          
          {errors.submit && <div className="form-error">{errors.submit}</div>}
        </form>
      </div>
    </div>
  );
};

export default DeliveryPage;
