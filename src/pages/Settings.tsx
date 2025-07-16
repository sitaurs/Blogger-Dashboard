import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Globe, User, Shield, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { currentBlog } = useBlog();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'blog' | 'oauth' | 'admin'>('blog');

  const tabs = [
    { id: 'blog', label: 'Blog Info', icon: Globe },
    { id: 'oauth', label: 'OAuth Status', icon: Shield },
    { id: 'admin', label: 'Admin', icon: User },
  ];

  const handleReauthorize = () => {
    // This would trigger the OAuth re-authorization process
    console.log('Starting OAuth re-authorization...');
    // In a real app, this would guide the user through the OAuth flow again
  };

  const handleChangePassword = () => {
    // This would open a password change modal
    console.log('Opening password change modal...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text">Pengaturan</h1>
        <p className="text-white/60 mt-2">Kelola konfigurasi aplikasi dan akun Anda</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/30 text-white'
                    : 'glass-button text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Informasi Blog</h2>
            
            {currentBlog ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Nama Blog
                    </label>
                    <input
                      type="text"
                      value={currentBlog.name}
                      readOnly
                      className="glass-button w-full px-4 py-3 text-white bg-white/5 cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      URL Blog
                    </label>
                    <input
                      type="text"
                      value={currentBlog.url}
                      readOnly
                      className="glass-button w-full px-4 py-3 text-white bg-white/5 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={currentBlog.description}
                    readOnly
                    rows={4}
                    className="glass-button w-full px-4 py-3 text-white bg-white/5 cursor-not-allowed resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        currentBlog.status === 'LIVE' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-white">{currentBlog.status}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Total Postingan
                    </label>
                    <span className="text-white text-lg font-semibold">
                      {currentBlog.posts?.totalItems || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-blue-200 font-medium">Info</p>
                      <p className="text-blue-200/80 text-sm mt-1">
                        Informasi blog ini diambil langsung dari Blogger API dan tidak dapat diubah melalui dashboard ini.
                        Untuk mengubah informasi blog, gunakan dashboard Blogger resmi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/60">
                <p>Tidak ada blog yang terhubung</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'oauth' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Status OAuth 2.0</h2>
            
            <div className="space-y-6">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-green-200 font-medium text-lg">Koneksi Aktif</h3>
                    <p className="text-green-200/80 mt-1">
                      Aplikasi berhasil terhubung dengan akun Google Anda dan dapat mengakses Blogger API.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-green-200/80 text-sm">Terhubung sebagai:</span>
                        <span className="text-green-200 font-medium">admin@example.com</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-200/80 text-sm">Status:</span>
                        <span className="text-green-200 font-medium">Aktif</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-200/80 text-sm">Last Refresh:</span>
                        <span className="text-green-200 font-medium">2 menit yang lalu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium text-lg">Aksi OAuth</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleReauthorize}
                    className="glass-button px-6 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Otorisasi Ulang</span>
                  </button>
                  <p className="text-white/60 text-sm">
                    Gunakan ini jika Anda mengalami masalah koneksi atau ingin mengganti akun Google yang terhubung.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-200 font-medium">Penting</p>
                    <p className="text-yellow-200/80 text-sm mt-1">
                      Proses otorisasi ulang akan memerlukan akses ke terminal server dan mengikuti langkah-langkah
                      yang dijelaskan dalam dokumentasi README.md.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Pengaturan Admin</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.username || 'admin'}
                    readOnly
                    className="glass-button w-full px-4 py-3 text-white bg-white/5 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value="Administrator"
                    readOnly
                    className="glass-button w-full px-4 py-3 text-white bg-white/5 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium text-lg">Keamanan</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleChangePassword}
                    className="glass-button px-6 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Ubah Password</span>
                  </button>
                  <p className="text-white/60 text-sm">
                    Ubah password untuk meningkatkan keamanan akun admin Anda.
                  </p>
                </div>
              </div>

              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-200 font-medium">Zona Bahaya</p>
                    <p className="text-red-200/80 text-sm mt-1">
                      Pengaturan admin hanya dapat diubah melalui database MongoDB atau file konfigurasi server.
                      Pastikan Anda memiliki akses ke server untuk melakukan perubahan ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;