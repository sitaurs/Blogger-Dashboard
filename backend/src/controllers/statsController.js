const getStats = async (req, res) => {
  try {
    const { period } = req.params; // daily, weekly, monthly
    
    // Mock statistics data for demo
    const mockStats = {
      daily: [
        { date: '2024-01-15', views: 1200, visitors: 890, pageviews: 1500 },
        { date: '2024-01-14', views: 1350, visitors: 950, pageviews: 1680 },
        { date: '2024-01-13', views: 1100, visitors: 780, pageviews: 1320 },
        { date: '2024-01-12', views: 1500, visitors: 1100, pageviews: 1850 },
        { date: '2024-01-11', views: 1400, visitors: 1050, pageviews: 1720 },
        { date: '2024-01-10', views: 1600, visitors: 1200, pageviews: 1950 },
        { date: '2024-01-09', views: 1234, visitors: 890, pageviews: 1500 }
      ],
      weekly: [
        { week: 'Week 1', views: 8500, visitors: 6200, pageviews: 10400 },
        { week: 'Week 2', views: 9200, visitors: 6800, pageviews: 11600 },
        { week: 'Week 3', views: 7800, visitors: 5900, pageviews: 9500 },
        { week: 'Week 4', views: 10100, visitors: 7400, pageviews: 12800 }
      ],
      monthly: [
        { month: 'Jan', views: 35600, visitors: 26300, pageviews: 45300 },
        { month: 'Feb', views: 28900, visitors: 21200, pageviews: 36800 },
        { month: 'Mar', views: 42100, visitors: 31800, pageviews: 53400 },
        { month: 'Apr', views: 38700, visitors: 28900, pageviews: 48900 }
      ]
    };

    const data = mockStats[period] || mockStats.daily;

    res.json({
      success: true,
      data: {
        period,
        stats: data,
        summary: {
          totalViews: data.reduce((sum, item) => sum + item.views, 0),
          totalVisitors: data.reduce((sum, item) => sum + item.visitors, 0),
          totalPageviews: data.reduce((sum, item) => sum + item.pageviews, 0),
          averageViews: Math.round(data.reduce((sum, item) => sum + item.views, 0) / data.length)
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

const getOverallStats = async (req, res) => {
  try {
    // Mock overall statistics for dashboard
    const stats = {
      totalPosts: 156,
      totalPages: 12,
      pendingComments: 8,
      todayViews: 1234,
      totalViews: 45678,
      uniqueVisitors: 12345,
      growthRate: 24
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overall statistics',
      error: error.message
    });
  }
};

module.exports = {
  getStats,
  getOverallStats
};