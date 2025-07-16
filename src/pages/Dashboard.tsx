import React from 'react';
import { motion } from 'framer-motion';
import { FileText, File, MessageCircle, Eye, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockStats = [
  { label: 'Total Postingan', value: '156', icon: FileText, color: 'from-blue-500 to-blue-600' },
  { label: 'Total Halaman', value: '12', icon: File, color: 'from-green-500 to-green-600' },
  { label: 'Komentar Pending', value: '8', icon: MessageCircle, color: 'from-yellow-500 to-yellow-600' },
  { label: 'Views Hari Ini', value: '1,234', icon: Eye, color: 'from-purple-500 to-purple-600' },
];

const mockChartData = [
  { date: '1 Jan', views: 1200 },
  { date: '2 Jan', views: 1350 },
  { date: '3 Jan', views: 1100 },
  { date: '4 Jan', views: 1500 },
  { date: '5 Jan', views: 1400 },
  { date: '6 Jan', views: 1600 },
  { date: '7 Jan', views: 1234 },
];

const mockRecentPosts = [
  { id: 1, title: 'Getting Started with React', status: 'published', views: 450 },
  { id: 2, title: 'Advanced TypeScript Tips', status: 'draft', views: 0 },
  { id: 3, title: 'Building Modern UIs', status: 'published', views: 320 },
  { id: 4, title: 'State Management Guide', status: 'published', views: 280 },
  { id: 5, title: 'Performance Optimization', status: 'draft', views: 0 },
];

const mockRecentComments = [
  { id: 1, author: 'John Doe', comment: 'Great article! Very helpful...', post: 'React Guide', status: 'approved' },
  { id: 2, author: 'Jane Smith', comment: 'Could you explain more about...', post: 'TypeScript Tips', status: 'pending' },
  { id: 3, author: 'Bob Johnson', comment: 'Thanks for sharing this...', post: 'UI Design', status: 'approved' },
  { id: 4, author: 'Alice Brown', comment: 'I have a question regarding...', post: 'Performance', status: 'pending' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-white/60 mt-2">Selamat datang di Pusat Kendali Blogger</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="chart-container"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Views dalam 7 Hari Terakhir</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Posts and Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">5 Postingan Terbaru</h2>
          <div className="space-y-3">
            {mockRecentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{post.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-white/60 text-xs">{post.views} views</span>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-white/40" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Komentar Terbaru</h2>
          <div className="space-y-3">
            {mockRecentComments.map((comment) => (
              <div key={comment.id} className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">{comment.author}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        comment.status === 'approved' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">{comment.comment}</p>
                    <p className="text-white/40 text-xs mt-1">on {comment.post}</p>
                  </div>
                  <MessageCircle className="w-4 h-4 text-white/40" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;