import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-portfolio-fullstack/',
  build: {
    outDir: '../dist', // Đẩy thư mục dist ra ngoài gốc để GitHub Pages đọc
    emptyOutDir: true
  }
})