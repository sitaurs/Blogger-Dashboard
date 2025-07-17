const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['LIVE', 'DELETED'],
    default: 'LIVE'
  },
  locale: {
    country: String,
    language: String,
    variant: String
  },
  posts: {
    totalItems: {
      type: Number,
      default: 0
    },
    selfLink: String
  },
  pages: {
    totalItems: {
      type: Number,
      default: 0
    },
    selfLink: String
  },
  published: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
blogSchema.index({ blogId: 1 });
blogSchema.index({ userId: 1 });
blogSchema.index({ status: 1 });

// Static method to find blogs by user
blogSchema.statics.findByUser = function(userId) {
  return this.find({ userId: userId, isActive: true });
};

// Static method to create or update blog
blogSchema.statics.createOrUpdateBlog = async function(userId, blogData) {
  const existingBlog = await this.findOne({ 
    blogId: blogData.id, 
    userId: userId 
  });
  
  if (existingBlog) {
    // Update existing blog
    existingBlog.name = blogData.name;
    existingBlog.description = blogData.description;
    existingBlog.url = blogData.url;
    existingBlog.status = blogData.status;
    existingBlog.locale = blogData.locale;
    existingBlog.posts = blogData.posts;
    existingBlog.pages = blogData.pages;
    existingBlog.updated = new Date(blogData.updated);
    existingBlog.lastSynced = new Date();
    
    await existingBlog.save();
    return existingBlog;
  } else {
    // Create new blog
    const newBlog = new this({
      blogId: blogData.id,
      name: blogData.name,
      description: blogData.description,
      url: blogData.url,
      status: blogData.status,
      locale: blogData.locale,
      posts: blogData.posts,
      pages: blogData.pages,
      published: new Date(blogData.published),
      updated: new Date(blogData.updated),
      userId: userId,
      lastSynced: new Date()
    });
    
    await newBlog.save();
    return newBlog;
  }
};

// Method to update sync time
blogSchema.methods.updateSyncTime = async function() {
  this.lastSynced = new Date();
  await this.save();
};

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;