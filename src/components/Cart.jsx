import React from 'react';
import { useCart } from './CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount,
    clearCart 
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Navigate to checkout page (to be implemented)
    console.log('Proceeding to checkout');
    // navigate('/checkout');
  };

  if (cartCount === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products yet.</p>
        <button 
          className="continue-shopping-btn"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
        <button 
          className="clear-cart-btn"
          onClick={clearCart}
          disabled={cartCount === 0}
        >
          <FaTrash /> Clear Cart
        </button>
      </div>
      
      <div className="cart-items">
        {cart.map((item) => (
          <div key={`${item.id}-${item.quantity}`} className="cart-item">
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">₹{item.price.toFixed(2)}</p>
              
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </button>
                <span className="quantity">{item.quantity || 1}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>
              </div>
              
              <p className="item-total">
                Total: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
            
            <button 
              className="remove-item-btn"
              onClick={() => removeFromCart(item.id)}
              aria-label="Remove item"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="subtotal">
          <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
          <span className="amount">₹{cartTotal.toFixed(2)}</span>
        </div>
        <p className="shipping-info">Shipping & taxes calculated at checkout</p>
        <button 
          className="checkout-btn"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
        <button 
          className="continue-shopping-btn"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;

