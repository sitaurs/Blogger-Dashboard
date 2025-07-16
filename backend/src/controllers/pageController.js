const bloggerService = require('../services/bloggerService');

const getPages = async (req, res) => {
  try {
    const { blogId } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const result = await bloggerService.getPages(targetBlogId);
    const pages = result.items || [];

    res.json({
      success: true,
      data: pages
    });

  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages',
      error: error.message
    });
  }
};

const getPage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { blogId } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const result = await bloggerService.getPages(targetBlogId);
    const page = result.items.find(p => p.id === pageId);
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page',
      error: error.message
    });
  }
};

const createPage = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Mock page creation for demo
    const newPage = {
      id: Date.now().toString(),
      title,
      content,
      status: 'LIVE',
      published: new Date().toISOString(),
      updated: new Date().toISOString(),
      url: `https://example.blogspot.com/p/${title.toLowerCase().replace(/\s+/g, '-')}.html`
    };

    console.log('📄 Page created (mock):', newPage.title);

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: newPage
    });

  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create page',
      error: error.message
    });
  }
};

const updatePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { title, content } = req.body;
    
    // Mock page update for demo
    const updatedPage = {
      id: pageId,
      title,
      content,
      status: 'LIVE',
      updated: new Date().toISOString()
    };

    console.log('✏️  Page updated (mock):', updatedPage.title);

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: updatedPage
    });

  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page',
      error: error.message
    });
  }
};

const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    
    console.log('🗑️  Page deleted (mock):', pageId);

    res.json({
      success: true,
      message: 'Page deleted successfully'
    });

  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete page',
      error: error.message
    });
  }
};

module.exports = {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage
};