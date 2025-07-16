// Mock Admin model for demo purposes
// In production, use real Mongoose model or a proper database

const bcrypt = require('bcryptjs');

// Determine admin credentials from environment with sensible defaults
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Hash the admin password once when the module is loaded
const HASHED_PASSWORD = bcrypt.hashSync(ADMIN_PASSWORD, 10);

class Admin {
  constructor(data) {
    this.id = data.id || '1';
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.createdAt = data.createdAt || new Date();
  }

  static async findByUsername(username) {
    // Mock admin user
    if (username === ADMIN_USERNAME || username === 'admin') {
      return new Admin({
        id: '1',
        username: ADMIN_USERNAME,
        password: HASHED_PASSWORD,
        email: 'admin@blogger-dashboard.com'
      });
    }
    return null;
  }

  static async create(data) {
    return new Admin(data);
  }
}

module.exports = Admin;
