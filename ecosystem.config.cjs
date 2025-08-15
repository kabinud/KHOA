// PM2 Ecosystem Configuration for KenyaHOA Pro
module.exports = {
  apps: [
    {
      name: 'kenyahoa-pro',
      script: 'dev-server.js',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 5,
      restart_delay: 1000,
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}