module.exports = {
  apps: [
    {
      name: 'blog-cms-backend',
      cwd: 'backend',
      script: 'server.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        APP_MODE: 'production'
      }
    },
    {
      name: 'blog-cms-frontend',
      script: 'npm',
      args: 'run preview -- --port 5173',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
