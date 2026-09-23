/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ------------------------------------------------------------------
         Paleta do painel — amostrada de `referencia/dashboard.PNG`

         Os valores nao foram escolhidos no olho: a referencia foi lida
         pixel a pixel (fundo, cards, divisorias, violeta do item ativo e
         do avatar) e os hex abaixo sao exatamente os que saem dela. A
         paleta anterior era visivelmente mais clara e mais azulada
         (#070b14 de fundo, #101623 de card, #1e293b de divisoria).

         Este e o unico lugar onde essas cores existem: as paginas usam os
         nomes, nunca os hex. E o que permite reskinar as sete telas do
         painel sem sete copias do mesmo CSS.
         ------------------------------------------------------------------ */
      colors: {
        app: '#03060d',          // fundo da area principal e da topbar
        sidebar: '#040810',      // fundo da sidebar, um degrau acima do app
        surface: '#070b14',      // cards e superficies elevadas
        surfaceLight: '#0d1424', // hover de item e campos
        hairline: '#181b1f',     // divisorias e bordas de card

        primary: '#5b5fef',      // item ativo, avatar, links de acao
        success: '#4ade80',      // entradas, metas, variacao positiva
        danger: '#ef4444',       // saidas, acima do limite
        warning: '#f59e0b',      // atencao

        textMain: '#ffffff',     // titulos e valores
        textSecondary: '#8b8f95', // rotulos, descricoes, nav inativa

        // Mantidos por compatibilidade com telas que ainda os referenciam.
        background: '#03060d',
        border: '#181b1f',
      },

      /* Geometria do painel, tambem medida na referencia (1901x1080) e
         convertida para a escala de 1440: sidebar 358 -> 272, topbar
         117 -> 88. */
      spacing: {
        sidebar: '17rem',   // 272px
        topbar: '5.5rem',   // 88px
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Fonte limpa e moderna
        // Só para as telas de acesso (login, cadastro, termos, privacidade).
        // Não substitui a fonte global: o painel segue em Inter, fiel ao PDF.
        plex: ['"IBM Plex Sans"', '"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}