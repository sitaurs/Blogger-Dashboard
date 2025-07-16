// Mock OAuth Token model for demo purposes
// In production, use real Mongoose model

class OAuthToken {
  constructor(data) {
    this.id = data.id || '1';
    this.refreshToken = data.refreshToken;
    this.accessToken = data.accessToken;
    this.expiresAt = data.expiresAt;
    this.scope = data.scope;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findOne() {
    // Mock token for demo
    return new OAuthToken({
      id: '1',
      refreshToken: 'mock_refresh_token',
      accessToken: 'mock_access_token',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      scope: 'https://www.googleapis.com/auth/blogger'
    });
  }

  static async create(data) {
    console.log('💾 OAuth token would be saved to database:', data);
    return new OAuthToken(data);
  }

  async save() {
    this.updatedAt = new Date();
    console.log('💾 OAuth token updated');
    return this;
  }
}

module.exports = OAuthToken;