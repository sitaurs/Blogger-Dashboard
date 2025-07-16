const bloggerService = require('../services/bloggerService');

const getBlogs = async (req, res) => {
  try {
    const blogs = await bloggerService.getBlogs();
    
    res.json({
      success: true,
      data: blogs
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

const getBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blogs = await bloggerService.getBlogs();
    const blog = blogs.find(b => b.id === blogId);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

module.exports = {
  getBlogs,
  getBlog
};