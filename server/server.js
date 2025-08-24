require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./config/database');
const Contact = require('./models/Contact');
const { saveOrder, getOrders } = require('./utils/orderStorage');

// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parsing middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Initialize database and start server
const startServer = async () => {
  const PORT = process.env.PORT || 5001;
  
  try {
    // Connect to MongoDB
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('Failed to connect to MongoDB');
      process.exit(1);
    }
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🚀 Application initialized successfully!');
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api\n`);
    });
    
  } catch (error) {
    console.error('\n❌ Failed to start application:', error.message);
    console.log('\n💡 Try these troubleshooting steps:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check your MONGODB_URI in the .env file');
    console.log('3. If using MongoDB Atlas, verify your IP is whitelisted');
    console.log('4. Check if another service is using port 27017');
    
    // Exit with error code
    process.exit(1);
  }
};

// Order notification placeholder (previously used for Twilio)
const sendOrderNotification = async (orderDetails) => {
  console.log(`Order #${orderDetails.id} received from ${orderDetails.name} for $${orderDetails.totalAmount}`);
  return { success: true };
};

// API endpoint to save order and send notification
app.post('/api/orders', async (req, res) => {
  try {
    console.log('Received order request:', req.body);
    const orderData = req.body;
    
    // Save order to JSON file
    const { success, order, error } = saveOrder(orderData);
    
    if (!success) {
      console.error('Failed to save order:', error);
      return res.status(500).json({ success: false, error });
    }

    console.log('Order saved successfully:', order);
    
    // Send notification (optional)
    try {
      await sendOrderNotification(order);
      console.log('Notification sent successfully');
    } catch (notifError) {
      console.error('Error sending notification:', notifError);
      // Continue even if notification fails
    }
    
    res.status(201).json({ 
      success: true, 
      order: {
        ...order,
        id: order.id || `ORD-${Date.now()}`
      } 
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ success: false, error: 'Failed to process order' });
  }
});

// API endpoint to get all orders (for admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = getOrders();
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// API endpoint to send order notification (kept for backward compatibility)
app.post('/api/orders/notify', async (req, res) => {
  try {
    const { orderDetails } = req.body;
    
    if (!orderDetails) {
      return res.status(400).json({ success: false, error: 'Order details are required' });
    }
    
    const result = await sendOrderNotification(orderDetails);
    
    if (result.success) {
      res.json({ success: true, message: 'Notification sent successfully' });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error in order notification:', error);
    res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
});

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    database: 'MongoDB with Mongoose',
    status: 'Connected'
  });
});

// API endpoint to save contact form data
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Input validation is handled by Mongoose schema
    const newContact = new Contact({
      name,
      email,
      message: message || ''
    });

    // Save to MongoDB
    await newContact.save();
    
    return res.status(201).json({ 
      success: true,
      message: 'Message sent successfully!', 
      data: newContact 
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Error sending message', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start the server by calling startServer
startServer();
