import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-admin-index',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin/index.html';
          }
          next();
        });
      },
    },
  ],
})