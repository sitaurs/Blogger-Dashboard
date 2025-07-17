import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Eye, Users, BarChart3, type LucideIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Mock data
const mockDailyStats = [
  { date: '1 Jan', views: 1200, visitors: 890, pageviews: 1500 },
  { date: '2 Jan', views: 1350, visitors: 950, pageviews: 1680 },
  { date: '3 Jan', views: 1100, visitors: 780, pageviews: 1320 },
  { date: '4 Jan', views: 1500, visitors: 1100, pageviews: 1850 },
  { date: '5 Jan', views: 1400, visitors: 1050, pageviews: 1720 },
  { date: '6 Jan', views: 1600, visitors: 1200, pageviews: 1950 },
  { date: '7 Jan', views: 1234, visitors: 890, pageviews: 1500 },
];

const mockWeeklyStats = [
  { week: 'Minggu 1', views: 8500, visitors: 6200, pageviews: 10400 },
  { week: 'Minggu 2', views: 9200, visitors: 6800, pageviews: 11600 },
  { week: 'Minggu 3', views: 7800, visitors: 5900, pageviews: 9500 },
  { week: 'Minggu 4', views: 10100, visitors: 7400, pageviews: 12800 },
];

const mockMonthlyStats = [
  { month: 'Jan', views: 35600, visitors: 26300, pageviews: 45300 },
  { month: 'Feb', views: 28900, visitors: 21200, pageviews: 36800 },
  { month: 'Mar', views: 42100, visitors: 31800, pageviews: 53400 },
  { month: 'Apr', views: 38700, visitors: 28900, pageviews: 48900 },
];

const mockLabelStats = [
  { name: 'React', value: 35, color: '#61DAFB' },
  { name: 'TypeScript', value: 25, color: '#3178C6' },
  { name: 'JavaScript', value: 20, color: '#F7DF1E' },
  { name: 'CSS', value: 15, color: '#1572B6' },
  { name: 'Other', value: 5, color: '#8B5CF6' },
];

const mockTopPosts = [
  { title: 'Getting Started with React', views: 3500 },
  { title: 'TypeScript Best Practices', views: 2800 },
  { title: 'CSS Grid Tutorial', views: 2400 },
  { title: 'JavaScript ES6 Features', views: 2100 },
  { title: 'Building Modern UIs', views: 1900 },
];

const Stats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getChartData = () => {
    switch (activeTab) {
      case 'weekly':
        return mockWeeklyStats;
      case 'monthly':
        return mockMonthlyStats;
      default:
        return mockDailyStats;
    }
  };

  const getDateKey = () => {
    switch (activeTab) {
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      default:
        return 'date';
    }
  };

  interface Tab {
    id: 'daily' | 'weekly' | 'monthly';
    label: string;
    icon: LucideIcon;
  }

  const tabs: Tab[] = [
    { id: 'daily', label: 'Harian', icon: Calendar },
    { id: 'weekly', label: 'Mingguan', icon: BarChart3 },
    { id: 'monthly', label: 'Bulanan', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text">Statistik</h1>
        <p className="text-white/60 mt-2">Analisis performa blog Anda</p>
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
                onClick={() => setActiveTab(tab.id)}
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

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="chart-container"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Traffic {tabs.find(tab => tab.id === activeTab)?.label}
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey={getDateKey()} stroke="rgba(255,255,255,0.6)" />
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
              name="Views"
            />
            <Line 
              type="monotone" 
              dataKey="visitors" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              name="Visitors"
            />
            <Line 
              type="monotone" 
              dataKey="pageviews" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Page Views"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Label Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Distribusi Label</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockLabelStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockLabelStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-container"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Postingan Terpopuler</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTopPosts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.6)" />
              <YAxis dataKey="title" type="category" stroke="rgba(255,255,255,0.6)" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="views" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">45,678</h3>
          <p className="text-white/60 mt-1">Total Views</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">12,345</h3>
          <p className="text-white/60 mt-1">Unique Visitors</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">+24%</h3>
          <p className="text-white/60 mt-1">Growth</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;