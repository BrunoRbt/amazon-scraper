// vite.config.js
export default {
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }