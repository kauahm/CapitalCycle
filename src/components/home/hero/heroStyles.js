/* =========================================================
   CSS da Hero.

   Segue o padrão já usado na landing (string injetada via <style>),
   para não introduzir um segundo jeito de estilizar a mesma página.
   Só o que é novo mora aqui — os tokens compartilhados (título, lead,
   botões, navbar) continuam no PAGE_CSS do HomePage.
   ========================================================= */

const HERO_CSS = `
  /* ---------- Palco 3D ---------- */
  .cchero-stage {
    position: absolute; inset: 0; z-index: 0;
    pointer-events: none;
    background-color: #d8d8d8;
  }

  .cchero-canvas, .cchero-fallback {
    position: absolute; inset: 0;
  }

  /* O canvas cobre o fallback SVG com um fade quando o chunk do
     three.js termina de carregar. Sem transição a troca vira um
     "pisca" no meio da headline. */
  .cchero-canvas {
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .cchero-canvas.is-ready { opacity: 1; }

  /* O canvas é transparente: sem esta saída, o SVG continuaria
     aparecendo por baixo e o usuário veria dois ciclos sobrepostos. */
  .cchero-fallback {
    opacity: 1;
    transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .cchero-stage.is-ready .cchero-fallback { opacity: 0; }

  .cchero-fallback {
    display: flex; align-items: center; justify-content: flex-end;
    padding-right: 6vw;
  }
  .cchero-fallback svg {
    width: min(52vw, 640px);
    height: auto;
    max-height: 82%;
    opacity: 0.92;
  }

  /* ---------- Scrim ----------
     Escurece as bordas o suficiente para a headline preta e o menu
     branco terem contraste, mantendo o miolo limpo para o ciclo. */
  .cchero-scrim {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(
      92deg,
      rgba(216,216,214,0.9) 0%,
      rgba(216,216,214,0.72) 22%,
      rgba(216,216,214,0.22) 44%,
      rgba(216,216,214,0.1) 62%,
      rgba(216,216,214,0.42) 82%,
      rgba(216,216,214,0.7) 100%
    );
  }
  .cchero-scrim::after {
    content: ''; position: absolute; inset: -20%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.08; mix-blend-mode: overlay;
  }

  /* ---------- Leitura das fases do ciclo ----------
     A "revelação de dados" da narrativa, em HTML acessível: a fase
     acesa aqui é a mesma que está acesa na fita 3D. */
  .cchero-phases {
    display: flex; flex-direction: column;
    width: 100%; max-width: 21rem;
    margin-left: auto;
  }
  .cchero-phases-title {
    margin: 0 0 1.35rem;
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #4d4d52;
    text-align: right;
  }

  .cchero-phase {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    gap: 0.7rem;
    padding: 0.72rem 0;
    border-top: 1px solid rgba(19,19,22,0.12);
    text-align: right;
    transition: opacity 0.45s ease;
    opacity: 0.42;
  }
  .cchero-phase:last-child { border-bottom: 1px solid rgba(19,19,22,0.12); }
  .cchero-phase.is-on { opacity: 1; }

  .cchero-phase-dot {
    grid-row: 1 / span 2;
    align-self: center;
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(19,19,22,0.22);
    transition: background 0.45s ease, box-shadow 0.45s ease;
  }
  .cchero-phase.is-on .cchero-phase-dot {
    background: var(--cch-purple, #8b7cf6);
    box-shadow: 0 0 0 4px rgba(139,124,246,0.18);
  }

  .cchero-phase-head {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 1rem;
  }
  .cchero-phase-label {
    font-size: 0.83rem; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: #2c2c30; white-space: nowrap;
  }
  .cchero-phase-value {
    font-size: 1.32rem; font-weight: 800;
    letter-spacing: -0.02em; color: #131316;
    white-space: nowrap;
  }

  /* A nota só existe para a fase ativa — quatro descrições visíveis ao
     mesmo tempo viram parágrafo, e a coluna deixa de ser um indicador. */
  .cchero-phase-note {
    grid-column: 2;
    margin: 0;
    font-size: 0.82rem; line-height: 1.4; color: #6d6d72;
    max-height: 0; opacity: 0; overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin 0.45s ease;
  }
  .cchero-phase.is-on .cchero-phase-note {
    max-height: 3.2rem; opacity: 1; margin-top: 0.35rem;
  }

  /* ---------- Dica de rolagem ---------- */
  .cchero-scroll {
    position: absolute; left: 50%; bottom: 1rem; transform: translateX(-50%);
    z-index: 15;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    color: #4d4d52; text-align: center;
    font-size: 0.9rem; line-height: 1.3;
  }
  .cchero-mouse { animation: cchero-float 2.4s ease-in-out infinite; }
  @keyframes cchero-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 980px) {
    /* Em coluna única o ciclo vira atmosfera: sobe para trás do texto,
       perde saturação e deixa de disputar a leitura. A narrativa das
       fases continua, agora na lista abaixo do CTA. */
    .cchero-fallback {
      justify-content: center; align-items: flex-start;
      padding: 3.5rem 0 0;
    }
    .cchero-fallback svg { width: 90vw; max-height: 46%; opacity: 0.5; }
    .cchero-canvas { opacity: 0; }
    .cchero-canvas.is-ready { opacity: 0.6; }
    .cchero-scrim {
      background: linear-gradient(
        180deg,
        rgba(216,216,214,0.66) 0%,
        rgba(216,216,214,0.82) 42%,
        rgba(216,216,214,0.94) 100%
      );
    }
    .cchero-scrim::after { opacity: 0.12; }

    .cchero-scroll {
      position: relative; left: auto; bottom: auto; transform: none;
      margin: 2rem auto 0; width: max-content;
    }
    .cchero-phases { max-width: none; margin-left: 0; }
    .cchero-phases-title { text-align: left; }
    .cchero-phase { text-align: left; }
  }

  @media (max-width: 560px) {
    .cchero-phase { padding: 0.6rem 0; gap: 0.6rem; }
    .cchero-phase-value { font-size: 1.15rem; }
    .cchero-phase-label { font-size: 0.76rem; }
    /* Numa tela estreita o par rótulo/valor não cabe lado a lado sem
       quebrar o número no meio. */
    .cchero-phase-head { flex-direction: column; gap: 0.15rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cchero-canvas, .cchero-phase, .cchero-phase-dot, .cchero-phase-note {
      transition: none !important;
    }
    .cchero-mouse { animation: none; }
    /* Sem movimento não há playhead: as quatro fases são mostradas de
       uma vez, todas legíveis. */
    .cchero-phase { opacity: 1; }
    .cchero-phase-note { max-height: 3.2rem; opacity: 1; margin-top: 0.35rem; }
  }
`;

export default HERO_CSS;
