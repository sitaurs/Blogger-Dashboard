import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with React Development',
    status: 'published',
    published: '2024-01-15',
    views: 1250,
    comments: 8,
    labels: ['React', 'Tutorial', 'Beginner']
  },
  {
    id: '2',
    title: 'Advanced TypeScript Features You Should Know',
    status: 'draft',
    published: null,
    views: 0,
    comments: 0,
    labels: ['TypeScript', 'Advanced', 'Development']
  },
  {
    id: '3',
    title: 'Building Responsive UIs with Tailwind CSS',
    status: 'published',
    published: '2024-01-12',
    views: 890,
    comments: 12,
    labels: ['CSS', 'Tailwind', 'UI/UX']
  },
  {
    id: '4',
    title: 'State Management in Modern React Applications',
    status: 'scheduled',
    published: '2024-01-20',
    views: 0,
    comments: 0,
    labels: ['React', 'State Management', 'Redux']
  },
  {
    id: '5',
    title: 'Performance Optimization Techniques',
    status: 'published',
    published: '2024-01-10',
    views: 2100,
    comments: 25,
    labels: ['Performance', 'Optimization', 'Web']
  },
];

const Posts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300';
      case 'draft':
        return 'bg-gray-500/20 text-gray-300';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Postingan</h1>
          <p className="text-white/60 mt-2">Kelola semua postingan blog Anda</p>
        </div>
        <button className="glass-button px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 mt-4 sm:mt-0">
          <Plus className="w-4 h-4" />
          <span>Buat Postingan</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Cari postingan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-button w-full pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-white/60" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-button px-4 py-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all" className="bg-gray-800">Semua Status</option>
              <option value="published" className="bg-gray-800">Published</option>
              <option value="draft" className="bg-gray-800">Draft</option>
              <option value="scheduled" className="bg-gray-800">Scheduled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Posts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/80 font-medium py-3">Judul</th>
                <th className="text-left text-white/80 font-medium py-3">Status</th>
                <th className="text-left text-white/80 font-medium py-3">Tanggal</th>
                <th className="text-left text-white/80 font-medium py-3">Views</th>
                <th className="text-left text-white/80 font-medium py-3">Komentar</th>
                <th className="text-left text-white/80 font-medium py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div>
                      <h3 className="text-white font-medium">{post.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.labels.map((label) => (
                          <span key={label} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {post.published ? new Date(post.published).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2 text-white/60">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{post.views}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-white/60 text-sm">{post.comments}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="glass-button px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === index + 1
                    ? 'bg-purple-500 text-white'
                    : 'glass-button text-white hover:bg-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="glass-button px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Posts;