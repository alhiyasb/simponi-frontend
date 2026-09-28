import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],

  server: {
    host: '0.0.0.0',

    allowedHosts: [
      '.ngrok-free.dev',
      '.ngrok.io'
    ],

    proxy: {
      '/api': {
        target: 'https://pulmonary-stained-catnip.ngrok-free.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})