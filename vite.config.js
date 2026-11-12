import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Divide os fornecedores em chunks estáveis: quando só o código do app
    // muda, o navegador reaproveita react/firebase/animações do cache.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          motion: ['framer-motion', 'gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['./vitest.setup.js'],
  },
});
