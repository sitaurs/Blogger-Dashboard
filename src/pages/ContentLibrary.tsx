import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Filter, Image, Video, File, Trash2, Copy, Eye, Calendar } from 'lucide-react';

// Mock data
const mockContent = [
  {
    id: '1',
    name: 'hero-image.jpg',
    type: 'image',
    size: '2.4 MB',
    uploaded: '2024-01-15T10:30:00Z',
    url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    usedIn: ['Getting Started with React', 'Advanced React Patterns']
  },
  {
    id: '2',
    name: 'tutorial-video.mp4',
    type: 'video',
    size: '15.6 MB',
    uploaded: '2024-01-14T15:45:00Z',
    url: '/videos/tutorial.mp4',
    usedIn: ['TypeScript Tutorial']
  },
  {
    id: '3',
    name: 'code-example.png',
    type: 'image',
    size: '890 KB',
    uploaded: '2024-01-13T09:20:00Z',
    url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    usedIn: ['JavaScript Best Practices']
  },
  {
    id: '4',
    name: 'documentation.pdf',
    type: 'document',
    size: '1.2 MB',
    uploaded: '2024-01-12T14:15:00Z',
    url: '/documents/doc.pdf',
    usedIn: []
  },
  {
    id: '5',
    name: 'ui-mockup.jpg',
    type: 'image',
    size: '3.1 MB',
    uploaded: '2024-01-11T11:00:00Z',
    url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    usedIn: ['UI Design Principles']
  },
  {
    id: '6',
    name: 'chart-data.csv',
    type: 'document',
    size: '45 KB',
    uploaded: '2024-01-10T16:30:00Z',
    url: '/data/chart.csv',
    usedIn: ['Data Visualization Guide']
  },
];

const ContentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'from-blue-500 to-blue-600';
      case 'video':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // You might want to show a toast notification here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Handle file upload logic here
      console.log('Files to upload:', files);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete files:', selectedFiles);
    setSelectedFiles([]);
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
          <h1 className="text-3xl font-bold gradient-text">Pustaka Konten</h1>
          <p className="text-white/60 mt-2">Kelola file media dan dokumen Anda</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="glass-button px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            >
              Hapus ({selectedFiles.length})
            </button>
          )}
          <label className="glass-button px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
          </label>
        </div>
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
              placeholder="Cari file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-button w-full pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/60" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="glass-button px-4 py-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all" className="bg-gray-800">Semua Tipe</option>
                <option value="image" className="bg-gray-800">Gambar</option>
                <option value="video" className="bg-gray-800">Video</option>
                <option value="document" className="bg-gray-800">Dokumen</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-500/30 text-white' : 'glass-button text-white/70'
                }`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-current rounded-sm" />
                  ))}
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-purple-500/30 text-white' : 'glass-button text-white/70'
                }`}
              >
                <div className="space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-4 h-0.5 bg-current rounded-sm" />
                  ))}
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 hover:shadow-2xl transition-all duration-300 ${
                selectedFiles.includes(item.id) ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(item.id)}
                  onChange={() => toggleFileSelection(item.id)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-400"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4 text-white/60" />
                  </button>
                  <button
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* File Preview */}
              <div className="mb-4">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className={`w-full h-32 bg-gradient-to-br ${getFileTypeColor(item.type)} rounded-lg flex items-center justify-center`}>
                    {getFileIcon(item.type)}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-white font-medium truncate mb-1">{item.name}</h3>
                <p className="text-white/60 text-sm mb-2">{item.size}</p>
                <div className="flex items-center space-x-2 text-white/60 text-xs mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(item.uploaded)}</span>
                </div>
                
                {item.usedIn.length > 0 && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">Digunakan dalam:</p>
                    <div className="space-y-1">
                      {item.usedIn.slice(0, 2).map((post) => (
                        <p key={post} className="text-white/80 text-xs truncate">
                          • {post}
                        </p>
                      ))}
                      {item.usedIn.length > 2 && (
                        <p className="text-white/60 text-xs">
                          +{item.usedIn.length - 2} lainnya
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
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
                  <th className="text-left text-white/80 font-medium py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredContent.length}
                      onChange={() => {
                        if (selectedFiles.length === filteredContent.length) {
                          setSelectedFiles([]);
                        } else {
                          setSelectedFiles(filteredContent.map(item => item.id));
                        }
                      }}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-400"
                    />
                  </th>
                  <th className="text-left text-white/80 font-medium py-3">Nama</th>
                  <th className="text-left text-white/80 font-medium py-3">Tipe</th>
                  <th className="text-left text-white/80 font-medium py-3">Ukuran</th>
                  <th className="text-left text-white/80 font-medium py-3">Tanggal Upload</th>
                  <th className="text-left text-white/80 font-medium py-3">Digunakan</th>
                  <th className="text-left text-white/80 font-medium py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(item.id)}
                        onChange={() => toggleFileSelection(item.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-400"
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${getFileTypeColor(item.type)} rounded-lg flex items-center justify-center`}>
                          {getFileIcon(item.type)}
                        </div>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-white/60 capitalize">{item.type}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-white/60">{item.size}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-white/60">{formatDate(item.uploaded)}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-white/60">{item.usedIn.length} postingan</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(item.url)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Belum ada file</h3>
          <p className="text-white/60 mb-4">Upload file pertama Anda untuk memulai</p>
          <label className="glass-button px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 cursor-pointer inline-flex">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
          </label>
        </motion.div>
      )}
    </div>
  );
};

export default ContentLibrary;