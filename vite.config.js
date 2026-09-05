import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages phục vụ trang ở đường dẫn con, không phải gốc tên miền
  base: '/mactan-thuytrang/',
})
