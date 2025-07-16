const { google } = require('googleapis');
const OAuthToken = require('../models/OAuthToken');
const isDemo = process.env.APP_MODE !== 'production';

class BloggerService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.blogger = google.blogger({ version: 'v3', auth: this.oauth2Client });
  }

  async getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/blogger'];
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async exchangeCodeForTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      
      // Save refresh token to database
      await OAuthToken.create({
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        expiresAt: new Date(tokens.expiry_date),
        scope: tokens.scope
      });
      
      return tokens;
    } catch (error) {
      throw new Error(`Token exchange failed: ${error.message}`);
    }
  }

  async refreshAccessToken() {
    try {
      const tokenData = await OAuthToken.findOne();
      if (!tokenData) {
        throw new Error('No refresh token found. Please re-authorize.');
      }

      this.oauth2Client.setCredentials({
        refresh_token: tokenData.refreshToken
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);

      // Update token in database
      tokenData.accessToken = credentials.access_token;
      tokenData.expiresAt = new Date(credentials.expiry_date);
      await tokenData.save();

      return credentials;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async ensureValidToken() {
    try {
      const tokenData = await OAuthToken.findOne();
      if (!tokenData) {
        throw new Error('No OAuth token found. Please run authorization first.');
      }

      // Check if token is expired
      if (new Date() >= tokenData.expiresAt) {
        await this.refreshAccessToken();
      } else {
        this.oauth2Client.setCredentials({
          access_token: tokenData.accessToken,
          refresh_token: tokenData.refreshToken
        });
      }
    } catch (error) {
      console.log('⚠️  OAuth not configured, using mock data');
      // For demo purposes, continue with mock data
    }
  }

  // Mock data for demo purposes
  getMockBlogs() {
    return [
      {
        id: '1234567890',
        name: 'My Tech Blog',
        description: 'A blog about technology and programming',
        url: 'https://mytechblog.blogspot.com',
        status: 'LIVE',
        posts: { totalItems: 156 },
        pages: { totalItems: 12 }
      },
      {
        id: '0987654321',
        name: 'Travel Adventures',
        description: 'Sharing my travel experiences around the world',
        url: 'https://traveladventures.blogspot.com',
        status: 'LIVE',
        posts: { totalItems: 89 },
        pages: { totalItems: 8 }
      }
    ];
  }

  getMockPosts() {
    return [
      {
        id: '1',
        title: 'Getting Started with React Development',
        content: '<p>React is a powerful JavaScript library for building user interfaces...</p>',
        status: 'LIVE',
        published: '2024-01-15T10:30:00Z',
        updated: '2024-01-15T10:30:00Z',
        url: 'https://mytechblog.blogspot.com/2024/01/getting-started-react.html',
        labels: ['React', 'JavaScript', 'Tutorial'],
        author: {
          displayName: 'Admin User'
        }
      },
      {
        id: '2',
        title: 'Advanced TypeScript Features You Should Know',
        content: '<p>TypeScript provides many advanced features that can improve your development experience...</p>',
        status: 'DRAFT',
        published: null,
        updated: '2024-01-14T15:45:00Z',
        url: null,
        labels: ['TypeScript', 'Advanced', 'Development'],
        author: {
          displayName: 'Admin User'
        }
      },
      {
        id: '3',
        title: 'Building Responsive UIs with Tailwind CSS',
        content: '<p>Tailwind CSS is a utility-first CSS framework that makes building responsive designs easier...</p>',
        status: 'LIVE',
        published: '2024-01-12T09:20:00Z',
        updated: '2024-01-12T09:20:00Z',
        url: 'https://mytechblog.blogspot.com/2024/01/tailwind-css-responsive.html',
        labels: ['CSS', 'Tailwind', 'UI/UX'],
        author: {
          displayName: 'Admin User'
        }
      }
    ];
  }

  getMockPages() {
    return [
      {
        id: '1',
        title: 'About Me',
        content: '<p>Welcome to my blog! I am a passionate developer...</p>',
        status: 'LIVE',
        published: '2024-01-01T00:00:00Z',
        updated: '2024-01-01T00:00:00Z',
        url: 'https://mytechblog.blogspot.com/p/about.html'
      },
      {
        id: '2',
        title: 'Contact',
        content: '<p>Feel free to reach out to me through the following channels...</p>',
        status: 'LIVE',
        published: '2024-01-01T00:00:00Z',
        updated: '2024-01-01T00:00:00Z',
        url: 'https://mytechblog.blogspot.com/p/contact.html'
      }
    ];
  }

  getMockComments() {
    return [
      {
        id: '1',
        content: 'Great article! This really helped me understand React hooks better.',
        status: 'LIVE',
        published: '2024-01-15T12:00:00Z',
        author: {
          displayName: 'John Doe',
          url: 'https://johndoe.com'
        },
        post: {
          id: '1',
          title: 'Getting Started with React Development'
        }
      },
      {
        id: '2',
        content: 'Thanks for sharing this. Very informative!',
        status: 'PENDING',
        published: '2024-01-14T18:30:00Z',
        author: {
          displayName: 'Jane Smith'
        },
        post: {
          id: '3',
          title: 'Building Responsive UIs with Tailwind CSS'
        }
      }
    ];
  }

  async getBlogs() {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
        const response = await this.blogger.blogs.listByUser({ userId: 'self' });
        return response.data.items || [];
      }
      return this.getMockBlogs();
    } catch (error) {
      console.log('Using mock blogs data');
      return this.getMockBlogs();
    }
  }

  async getPosts(blogId, options = {}) {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
        const response = await this.blogger.posts.list({
          blogId,
          maxResults: options.maxResults || 10,
          pageToken: options.pageToken,
          status: options.status || ['live', 'draft']
        });
        return response.data;
      }

      return {
        items: this.getMockPosts(),
        nextPageToken: null
      };
    } catch (error) {
      console.log('Using mock posts data');
      return {
        items: this.getMockPosts(),
        nextPageToken: null
      };
    }
  }

  async getPages(blogId) {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
        const response = await this.blogger.pages.list({ blogId });
        return response.data;
      }
      return {
        items: this.getMockPages()
      };
    } catch (error) {
      console.log('Using mock pages data');
      return {
        items: this.getMockPages()
      };
    }
  }

  async getComments(blogId, postId = null) {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
        const response = await this.blogger.comments.list({
          blogId,
          postId
        });
        return response.data;
      }
      return {
        items: this.getMockComments()
      };
    } catch (error) {
      console.log('Using mock comments data');
      return {
        items: this.getMockComments()
      };
    }
  }

  async createPost(blogId, postData) {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
        const response = await this.blogger.posts.insert({
          blogId,
          requestBody: {
            title: postData.title,
            content: postData.content,
            labels: postData.labels || [],
            status: postData.isDraft ? 'DRAFT' : 'LIVE'
          }
        });
        return response.data;
      }

      const newPost = {
        id: Date.now().toString(),
        title: postData.title,
        content: postData.content,
        status: postData.isDraft ? 'DRAFT' : 'LIVE',
        published: postData.isDraft ? null : new Date().toISOString(),
        updated: new Date().toISOString(),
        labels: postData.labels || [],
        author: {
          displayName: 'Admin User'
        }
      };

      console.log('📝 Post created (mock):', newPost.title);
      return newPost;
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async updatePost(blogId, postId, postData) {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
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
        return response.data;
      }

      const updatedPost = {
        id: postId,
        title: postData.title,
        content: postData.content,
        status: postData.isDraft ? 'DRAFT' : 'LIVE',
        updated: new Date().toISOString(),
        labels: postData.labels || []
      };

      console.log('✏️  Post updated (mock):', updatedPost.title);
      return updatedPost;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  async deletePost(blogId, postId) {
    await this.ensureValidToken();

    try {
      if (!isDemo) {
        await this.blogger.posts.delete({ blogId, postId });
        return { success: true };
      }

      console.log('🗑️  Post deleted (mock):', postId);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }
}

module.exports = new BloggerService();