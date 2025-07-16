const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.APP_MODE === 'production') {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('📦 Connected to MongoDB');
    } else {
      // Demo mode uses mock data only
      console.log('📦 Database connection simulated (using mock data)');
      console.log('💡 To use real MongoDB, install MongoDB and update MONGODB_URI in .env');
    }
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;