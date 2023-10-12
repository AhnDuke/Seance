import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://192.168.0.16:3000',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
