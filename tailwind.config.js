/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores extraídas da referência do Dashboard
        background: '#070b14', // Fundo principal ultra-dark
        surface: '#101623',    // Cards e Sidebar
        surfaceLight: '#1a2234', // Hover de itens e inputs
        border: '#1e293b',     // Divisórias sutis
        
        primary: '#6366f1',    // Indigo vibrante (Botões e Ativos)
        success: '#10b981',    // Verde Esmeralda (Entradas/Metas batidas)
        danger: '#ef4444',     // Vermelho vibrante (Saídas/Acima do limite)
        warning: '#f59e0b',    // Laranja/Amarelo (Atenção/90% do limite)
        
        textMain: '#f8fafc',   // Branco acinzentado (Títulos)
        textSecondary: '#94a3b8' // Cinza (Subtítulos e descrições)
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Fonte limpa e moderna
      }
    },
  },
  plugins: [],
}