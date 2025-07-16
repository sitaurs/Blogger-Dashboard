const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For demo purposes, we'll use a simple in-memory setup
    // In production, use real MongoDB connection
    console.log('📦 Database connection simulated (using mock data)');
    console.log('💡 To use real MongoDB, install MongoDB and update MONGODB_URI in .env');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;