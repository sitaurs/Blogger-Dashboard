const bloggerService = require('../services/bloggerService');

const getPosts = async (req, res) => {
  try {
    const { blogId } = req.query;
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const options = {
      maxResults: parseInt(limit),
      status: status ? [status] : ['live', 'draft']
    };

    const result = await bloggerService.getPosts(targetBlogId, options);
    let posts = result.items || [];

    // Apply search filter if provided
    if (search) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter if provided
    if (status) {
      posts = posts.filter(post => 
        post.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = posts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(posts.length / limit),
          totalItems: posts.length,
          hasNext: endIndex < posts.length,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { blogId } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const result = await bloggerService.getPosts(targetBlogId);
    const post = result.items.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, labels, isDraft = false } = req.body;
    const { blogId } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const postData = {
      title,
      content,
      labels: labels || [],
      isDraft
    };

    const newPost = await bloggerService.createPost(targetBlogId, postData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, labels, isDraft } = req.body;
    const { blogId } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const postData = {
      title,
      content,
      labels: labels || [],
      isDraft
    };

    const updatedPost = await bloggerService.updatePost(targetBlogId, postId, postData);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: error.message
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { blogId } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    await bloggerService.deletePost(targetBlogId, postId);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};