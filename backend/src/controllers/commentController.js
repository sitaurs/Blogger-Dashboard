const bloggerService = require('../services/bloggerService');

const getComments = async (req, res) => {
  try {
    const { blogId, postId, status } = req.query;
    
    // Use first blog if no blogId specified
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs();
      targetBlogId = blogs[0]?.id;
    }

    const result = await bloggerService.getComments(targetBlogId, postId);
    let comments = result.items || [];

    // Apply status filter if provided
    if (status && status !== 'all') {
      comments = comments.filter(comment => 
        comment.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Transform comments for frontend
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      author: comment.author?.displayName || 'Anonymous',
      email: comment.author?.email || 'no-email@example.com',
      content: comment.content,
      postTitle: comment.post?.title || 'Unknown Post',
      date: comment.published,
      status: comment.status.toLowerCase(),
      website: comment.author?.url || null
    }));

    res.json({
      success: true,
      data: transformedComments
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

const updateCommentStatus = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body; // 'approved', 'pending', 'spam'
    
    // Mock comment status update for demo
    console.log(`💬 Comment ${commentId} status changed to: ${status}`);

    res.json({
      success: true,
      message: `Comment ${status} successfully`
    });

  } catch (error) {
    console.error('Update comment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment status',
      error: error.message
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    console.log('🗑️  Comment deleted (mock):', commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

module.exports = {
  getComments,
  updateCommentStatus,
  deleteComment
};