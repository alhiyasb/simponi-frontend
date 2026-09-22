import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react()],
  plugins: [
    tailwindcss(),
    react()
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://pulmonary-stained-catnip.ngrok-free.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
