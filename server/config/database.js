const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web_landing_page';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check your MONGODB_URI in the .env file');
    console.log('3. If using MongoDB Atlas, verify your IP is whitelisted');
    console.log('4. Check if another service is using port 27017');
    console.log('\nCommon solutions:');
    console.log('- Install MongoDB Community Server: https://www.mongodb.com/try/download/community');
    console.log('- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas/register');
    console.log('- For local development, you can use: mongod --version');
    return false;
  }
};

module.exports = {
  mongoose,
  connectDB
};
