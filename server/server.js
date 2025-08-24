require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const Contact = require('./models/Contact');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Express app
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    const isConnected = await connectDB();
    if (!isConnected) {
      throw new Error('Failed to connect to MongoDB');
    }

    console.log('\n🚀 Application initialized successfully!');
    console.log(`🌐 Server running on port ${process.env.PORT || 5001}`);
    console.log(`🔗 API available at http://localhost:${process.env.PORT || 5001}/api\n`);
    
    // Start listening for requests
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
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

// Send SMS Notification
const sendOrderNotification = async (orderDetails) => {
  try {
    const message = `
      🛒 New Order Received! 🛒
      
      Order #${orderDetails.orderNumber}
      
      👤 Customer Details:
      Name: ${orderDetails.fullName}
      Phone: ${orderDetails.phone}
      Email: ${orderDetails.email}
      
      🏠 Delivery Address:
      ${orderDetails.address}
      
      💰 Payment Method: Cash on Delivery
      
      Thank you for your order!
    `;

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.OWNER_PHONE_NUMBER
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

// API endpoint to send order notification
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
