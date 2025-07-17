const bloggerService = require('../services/bloggerService');

const getStats = async (req, res) => {
  try {
    const { period } = req.params; // daily, weekly, monthly
    const { blogId } = req.query;
    
    // Set current user in service
    bloggerService.setCurrentUser(req.user.id);
    
    // Get user's blogs first if no blogId provided
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs(req.user.id);
      if (blogs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No blogs found for this user'
        });
      }
      targetBlogId = blogs[0].blogId;
    }

    // Note: Blogger API doesn't provide detailed analytics
    // For real analytics, you'd need to integrate with Google Analytics
    // This is a simplified implementation based on available data

    const postsResult = await bloggerService.getPosts(targetBlogId, {
      maxResults: 100,
      orderBy: 'published'
    }, req.user.id);
    
    const posts = postsResult.items || [];
    
    // Generate mock analytics data based on posts
    const statsData = generateStatsFromPosts(posts, period);

    res.json({
      success: true,
      data: {
        period,
        stats: statsData.stats,
        summary: statsData.summary
      },
      message: 'Statistics fetched successfully',
      note: 'Statistics are estimated based on available blog data. For detailed analytics, integrate with Google Analytics.'
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

const getOverallStats = async (req, res) => {
  try {
    const { blogId } = req.query;
    
    // Set current user in service
    bloggerService.setCurrentUser(req.user.id);
    
    // Get user's blogs first if no blogId provided
    let targetBlogId = blogId;
    if (!targetBlogId) {
      const blogs = await bloggerService.getBlogs(req.user.id);
      if (blogs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No blogs found for this user'
        });
      }
      targetBlogId = blogs[0].blogId;
    }

    // Fetch data from multiple endpoints
    const [postsResult, pagesResult, commentsResult] = await Promise.all([
      bloggerService.getPosts(targetBlogId, { maxResults: 100 }, req.user.id),
      bloggerService.getPages(targetBlogId, req.user.id),
      bloggerService.getComments(targetBlogId, null, req.user.id)
    ]);

    const posts = postsResult.items || [];
    const pages = pagesResult.items || [];
    const comments = commentsResult.items || [];

    // Calculate stats
    const publishedPosts = posts.filter(post => post.status === 'LIVE');
    const draftPosts = posts.filter(post => post.status === 'DRAFT');
    const pendingComments = comments.filter(comment => 
      comment.status && comment.status.toLowerCase() === 'pending'
    );

    // Calculate growth (simplified)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const recentPosts = posts.filter(post => 
      post.published && new Date(post.published) >= lastMonth
    );

    const growthRate = posts.length > 0 ? 
      Math.round((recentPosts.length / posts.length) * 100) : 0;

    const stats = {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      totalPages: pages.length,
      totalComments: comments.length,
      pendingComments: pendingComments.length,
      approvedComments: comments.filter(c => 
        c.status && c.status.toLowerCase() === 'live'
      ).length,
      growthRate: growthRate,
      // Note: Real view counts would come from Google Analytics
      estimatedViews: posts.length * 150, // Simplified estimation
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats,
      message: 'Overall statistics fetched successfully',
      note: 'View counts are estimated. For accurate analytics, integrate with Google Analytics.'
    });

  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overall statistics',
      error: error.message
    });
  }
};

// Helper function to generate stats from posts data
function generateStatsFromPosts(posts, period) {
  const now = new Date();
  const stats = [];
  const publishedPosts = posts.filter(post => post.status === 'LIVE');
  
  // Generate data based on period
  let dateRanges = [];
  let dateFormat = '';
  
  switch (period) {
    case 'daily':
      dateFormat = 'date';
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dateRanges.push({
          [dateFormat]: date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short' 
          }),
          date: date
        });
      }
      break;
      
    case 'weekly':
      dateFormat = 'week';
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        dateRanges.push({
          [dateFormat]: `Minggu ${4 - i}`,
          date: date
        });
      }
      break;
      
    case 'monthly':
      dateFormat = 'month';
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        dateRanges.push({
          [dateFormat]: date.toLocaleDateString('id-ID', { 
            month: 'short' 
          }),
          date: date
        });
      }
      break;
  }
  
  // Generate estimated data for each range
  dateRanges.forEach(range => {
    const postsInRange = publishedPosts.filter(post => {
      const postDate = new Date(post.published);
      return postDate <= range.date;
    });
    
    // Simplified estimation based on posts count
    const baseViews = postsInRange.length * 100;
    const variation = Math.random() * 200 - 100; // Random variation
    
    stats.push({
      [dateFormat]: range[dateFormat],
      views: Math.max(0, Math.round(baseViews + variation)),
      visitors: Math.max(0, Math.round((baseViews + variation) * 0.7)),
      pageviews: Math.max(0, Math.round((baseViews + variation) * 1.3))
    });
  });
  
  return {
    stats,
    summary: {
      totalViews: stats.reduce((sum, item) => sum + item.views, 0),
      totalVisitors: stats.reduce((sum, item) => sum + item.visitors, 0),
      totalPageviews: stats.reduce((sum, item) => sum + item.pageviews, 0),
      averageViews: Math.round(stats.reduce((sum, item) => sum + item.views, 0) / stats.length)
    }
  };
}

module.exports = {
  getStats,
  getOverallStats
};