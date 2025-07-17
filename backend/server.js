require('dotenv').config();

// Default to demo mode if APP_MODE is not set
if (!process.env.APP_MODE) {
  process.env.APP_MODE = 'demo';
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blogs');
const postRoutes = require('./src/routes/posts');
const pageRoutes = require('./src/routes/pages');
const commentRoutes = require('./src/routes/comments');
const statsRoutes = require('./src/routes/stats');
const contentRoutes = require('./src/routes/content');

// Import database connection
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  }
});
app.use('/api/admin/login', authLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Pusat Kendali Blogger API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log('🚀 Pusat Kendali Blogger Backend');
  console.log('🚀 ================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 Mode: ${process.env.APP_MODE}`);
  console.log(`🚀 API URL: http://localhost:${PORT}/api`);
  console.log('🚀 ================================');
  console.log('📋 Available endpoints:');
  console.log('   POST /api/admin/login');
  console.log('   GET  /api/admin/me');
  console.log('   GET  /api/blogs');
  console.log('   GET  /api/posts');
  console.log('   GET  /api/pages');
  console.log('   GET  /api/comments');
  console.log('   GET  /api/stats/overall');
  console.log('   GET  /api/content');
  console.log('   GET  /api/health');
  console.log('🚀 ================================');
  console.log('💡 Default login: admin / admin123');
  console.log('💡 Ready to control your Blogger!');
  console.log('🚀 ================================');
});

module.exports = app;