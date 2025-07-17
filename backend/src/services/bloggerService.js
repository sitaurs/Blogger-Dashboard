const { google } = require('googleapis');
const OAuthToken = require('../models/OAuthToken');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');

class BloggerService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.blogger = google.blogger({ version: 'v3', auth: this.oauth2Client });
    this.currentUserId = null;
  }

  // Set current user for operations
  setCurrentUser(userId) {
    this.currentUserId = userId;
  }

  async getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/blogger'];
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async exchangeCodeForTokens(code, userId) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      
      // Save tokens to database
      await OAuthToken.createOrUpdateToken(userId, tokens);
      
      console.log('✅ OAuth tokens saved successfully');
      return tokens;
    } catch (error) {
      console.error('❌ Token exchange failed:', error);
      throw new Error(`Token exchange failed: ${error.message}`);
    }
  }

  async refreshAccessToken(userId) {
    try {
      const tokenData = await OAuthToken.findActiveToken(userId);
      if (!tokenData) {
        throw new Error('No refresh token found. Please re-authorize.');
      }

      this.oauth2Client.setCredentials({
        refresh_token: tokenData.refreshToken
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);

      // Update token in database
      await tokenData.updateAccessToken(credentials.access_token, credentials.expiry_date);

      console.log('✅ Access token refreshed successfully');
      return credentials;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async ensureValidToken(userId = null) {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId) {
      throw new Error('No user ID provided for token validation');
    }

    try {
      const tokenData = await OAuthToken.findActiveToken(targetUserId);
      if (!tokenData) {
        throw new Error('No OAuth token found. Please run authorization first.');
      }

      // Check if token needs refresh
      if (tokenData.needsRefresh()) {
        console.log('🔄 Token needs refresh, refreshing...');
        await this.refreshAccessToken(targetUserId);
      } else {
        this.oauth2Client.setCredentials({
          access_token: tokenData.accessToken,
          refresh_token: tokenData.refreshToken
        });
      }

      return true;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      throw error;
    }
  }

  async getBlogs(userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.blogs.listByUser({ userId: 'self' });
      const blogs = response.data.items || [];
      
      // Save/update blogs in database
      const savedBlogs = [];
      for (const blog of blogs) {
        const savedBlog = await Blog.createOrUpdateBlog(targetUserId, blog);
        savedBlogs.push(savedBlog);
      }
      
      return savedBlogs;
    } catch (error) {
      console.error('❌ Failed to fetch blogs:', error);
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }
  }

  async getBlog(blogId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.blogs.get({ blogId });
      const blog = response.data;
      
      // Save/update blog in database
      const savedBlog = await Blog.createOrUpdateBlog(targetUserId, blog);
      return savedBlog;
    } catch (error) {
      console.error('❌ Failed to fetch blog:', error);
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  }

  async getPosts(blogId, options = {}, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const params = {
        blogId,
        maxResults: options.maxResults || 10,
        orderBy: options.orderBy || 'published',
        status: options.status || ['live', 'draft'],
        ...options
      };

      const response = await this.blogger.posts.list(params);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch posts:', error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  async getPost(blogId, postId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.posts.get({ blogId, postId });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch post:', error);
      throw new Error(`Failed to fetch post: ${error.message}`);
    }
  }

  async createPost(blogId, postData, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.posts.insert({
        blogId,
        requestBody: {
          title: postData.title,
          content: postData.content,
          labels: postData.labels || [],
          status: postData.isDraft ? 'DRAFT' : 'LIVE'
        }
      });
      
      console.log('✅ Post created successfully:', response.data.title);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async updatePost(blogId, postId, postData, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.posts.update({
        blogId,
        postId,
        requestBody: {
          title: postData.title,
          content: postData.content,
          labels: postData.labels || [],
          status: postData.isDraft ? 'DRAFT' : 'LIVE'
        }
      });
      
      console.log('✅ Post updated successfully:', response.data.title);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update post:', error);
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  async deletePost(blogId, postId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      await this.blogger.posts.delete({ blogId, postId });
      console.log('✅ Post deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete post:', error);
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  async getPages(blogId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.pages.list({ blogId });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch pages:', error);
      throw new Error(`Failed to fetch pages: ${error.message}`);
    }
  }

  async getPage(blogId, pageId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.pages.get({ blogId, pageId });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch page:', error);
      throw new Error(`Failed to fetch page: ${error.message}`);
    }
  }

  async createPage(blogId, pageData, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.pages.insert({
        blogId,
        requestBody: {
          title: pageData.title,
          content: pageData.content
        }
      });
      
      console.log('✅ Page created successfully:', response.data.title);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create page:', error);
      throw new Error(`Failed to create page: ${error.message}`);
    }
  }

  async updatePage(blogId, pageId, pageData, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.pages.update({
        blogId,
        pageId,
        requestBody: {
          title: pageData.title,
          content: pageData.content
        }
      });
      
      console.log('✅ Page updated successfully:', response.data.title);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update page:', error);
      throw new Error(`Failed to update page: ${error.message}`);
    }
  }

  async deletePage(blogId, pageId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      await this.blogger.pages.delete({ blogId, pageId });
      console.log('✅ Page deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete page:', error);
      throw new Error(`Failed to delete page: ${error.message}`);
    }
  }

  async getComments(blogId, postId = null, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const params = { blogId };
      if (postId) {
        params.postId = postId;
      }
      
      const response = await this.blogger.comments.list(params);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch comments:', error);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  async updateCommentStatus(blogId, postId, commentId, status, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      const response = await this.blogger.comments.approve({
        blogId,
        postId,
        commentId
      });
      
      console.log('✅ Comment status updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update comment status:', error);
      throw new Error(`Failed to update comment status: ${error.message}`);
    }
  }

  async deleteComment(blogId, postId, commentId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      await this.blogger.comments.delete({
        blogId,
        postId,
        commentId
      });
      
      console.log('✅ Comment deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete comment:', error);
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  async getPostStats(blogId, postId, userId = null) {
    const targetUserId = userId || this.currentUserId;
    await this.ensureValidToken(targetUserId);

    try {
      // Get post views from Blogger API (if available)
      const post = await this.getPost(blogId, postId, targetUserId);
      
      // Note: Blogger API doesn't provide detailed analytics
      // For real analytics, you'd need to integrate with Google Analytics
      return {
        views: post.replies?.totalItems || 0,
        comments: post.replies?.totalItems || 0,
        published: post.published,
        updated: post.updated
      };
    } catch (error) {
      console.error('❌ Failed to fetch post stats:', error);
      throw new Error(`Failed to fetch post stats: ${error.message}`);
    }
  }
}

module.exports = new BloggerService();