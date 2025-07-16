import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Calendar, Eye } from 'lucide-react';

// Mock data
const mockPages = [
  {
    id: '1',
    title: 'Tentang Saya',
    url: 'about',
    status: 'published',
    published: '2024-01-01',
    views: 890,
  },
  {
    id: '2',
    title: 'Kontak',
    url: 'contact',
    status: 'published',
    published: '2024-01-01',
    views: 456,
  },
  {
    id: '3',
    title: 'Kebijakan Privasi',
    url: 'privacy-policy',
    status: 'draft',
    published: null,
    views: 0,
  },
  {
    id: '4',
    title: 'Syarat dan Ketentuan',
    url: 'terms-conditions',
    status: 'published',
    published: '2024-01-05',
    views: 234,
  },
];

const Pages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPages = mockPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300';
      case 'draft':
        return 'bg-gray-500/20 text-gray-300';
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
          <h1 className="text-3xl font-bold gradient-text">Halaman</h1>
          <p className="text-white/60 mt-2">Kelola halaman statis blog Anda</p>
        </div>
        <button className="glass-button px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 mt-4 sm:mt-0">
          <Plus className="w-4 h-4" />
          <span>Buat Halaman</span>
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
              placeholder="Cari halaman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-button w-full pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-button px-4 py-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all" className="bg-gray-800">Semua Status</option>
            <option value="published" className="bg-gray-800">Published</option>
            <option value="draft" className="bg-gray-800">Draft</option>
          </select>
        </div>
      </motion.div>

      {/* Pages Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{page.title}</h3>
                <p className="text-white/60 text-sm">/{page.url}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(page.status)}`}>
                {page.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {page.published ? new Date(page.published).toLocaleDateString('id-ID') : 'Belum dipublikasi'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{page.views}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                <Edit className="w-4 h-4 text-white/60" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Tidak ada halaman ditemukan</h3>
          <p className="text-white/60">Coba ubah filter atau buat halaman baru</p>
        </motion.div>
      )}
    </div>
  );
};

export default Pages;