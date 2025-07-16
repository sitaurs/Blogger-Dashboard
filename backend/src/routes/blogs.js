const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getBlogs, getBlog } = require('../controllers/blogController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/blogs
router.get('/', getBlogs);

// GET /api/blogs/:blogId
router.get('/:blogId', getBlog);

module.exports = router;