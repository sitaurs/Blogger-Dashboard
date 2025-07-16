// Mock Admin model for demo purposes
// In production, use real Mongoose model

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
    if (username === process.env.ADMIN_USERNAME || username === 'admin') {
      return new Admin({
        id: '1',
        username: 'admin',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
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