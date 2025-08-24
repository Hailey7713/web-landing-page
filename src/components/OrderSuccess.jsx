import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag, FaHome, FaShoppingCart, FaTruck } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails, orderNumber, notificationSent } = location.state || {};

  // Function to estimate delivery date based on city
  const getEstimatedDeliveryDate = () => {
    if (!orderDetails?.address) return '3-5 business days';
    
    const today = new Date();
    const address = orderDetails.address.toLowerCase();
    let daysToAdd = 3; // Default delivery time
    
    // Check for major cities and adjust delivery time
    if (address.includes('mumbai') || address.includes('pune') || address.includes('delhi') || 
        address.includes('bangalore') || address.includes('hyderabad') || address.includes('chennai')) {
      daysToAdd = 2; // 2 days for metro cities
    } else if (address.includes('kolkata') || address.includes('ahmedabad') || address.includes('surat') || 
               address.includes('jaipur') || address.includes('lucknow')) {
      daysToAdd = 3; // 3 days for other major cities
    } else {
      daysToAdd = 5; // 5 days for other locations
    }
    
    // Add business days (excluding weekends)
    let count = 0;
    const deliveryDate = new Date(today);
    while (count < daysToAdd) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        count++;
      }
    }
    
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!orderDetails) {
    return (
      <div className="order-success-container">
        <div className="order-success-content">
          <h2>Order Not Found</h2>
          <p>We couldn't find your order details. Please check your order history or contact support.</p>
          <button 
            className="back-to-home-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-number">Order #{orderNumber}</p>
        
        <div className="order-details">
          <div className="detail-item">
            <FaShoppingBag className="detail-icon" />
            <span>Order Status: <strong>Confirmed</strong></span>
          </div>
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span>Order Date: {new Date().toLocaleDateString('en-IN')}</span>
          </div>
          <div className="detail-item">
            <FaTruck className="detail-icon" />
            <span>Estimated Delivery: <strong>{getEstimatedDeliveryDate()}</strong></span>
          </div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div>
              <div>Delivery Address:</div>
              <div><strong>{orderDetails.address}</strong></div>
            </div>
          </div>
          <div className="detail-item">
            <FaPhone className="detail-icon" />
            <span>Contact: {orderDetails.phone}</span>
          </div>
          <div className="detail-item">
            <FaEnvelope className="detail-icon" />
            <span>Email: {orderDetails.email}</span>
          </div>
        </div>
        
        {notificationSent === false && (
          <div className="notification-warning">
            Note: We couldn't send a confirmation to the store owner. Please call {orderDetails.phone} to confirm your order.
          </div>
        )}
        
        <div className="action-buttons">
          <button 
            className="action-btn home-btn"
            onClick={() => navigate('/')}
          >
            <FaHome /> Back to Home
          </button>
          <button 
            className="action-btn shop-btn"
            onClick={() => navigate('/products')}
          >
            <FaShoppingCart /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
