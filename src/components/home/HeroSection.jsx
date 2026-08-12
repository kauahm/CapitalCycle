import React from 'react';

/* =========================================================
   HERO SECTION — Capital Cycle
   Layout claro (cinza), headline gigante, nav em pílula,
   bloco de métrica à direita, social rail e scroll hint.
   ========================================================= */

const HERO_CSS = `
  .cch {
    --cch-ink: #14140f;
    --cch-muted: #57564f;
    --cch-soft: #6f6e66;
    --cch-orange: #ee6a12;
    --cch-orange-dark: #d95908;

    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    isolation: isolate;
    background-color: #cfcfcd;
    font-family: 'Helvetica Neue', Helvetica, 'Inter', Arial, sans-serif;
    color: var(--cch-ink);
    -webkit-font-smoothing: antialiased;
  }
  .cch *, .cch *::before, .cch *::after { box-sizing: border-box; }

  /* ---------- Fundo ---------- */
  .cch-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(60% 48% at 47% 42%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 72%),
      radial-gradient(125% 105% at 50% 44%, #d2d2cf 0%, #c8c8c5 42%, #bcbcb9 74%, #adadaa 100%);
  }
  .cch-bg::after {
    content: ''; position: absolute; inset: -20%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.22; mix-blend-mode: overlay;
  }
  .cch-hill {
    position: absolute; left: 50%; bottom: -2px; transform: translateX(-50%);
    width: min(1400px, 96vw); height: 230px; z-index: 0; pointer-events: none;
    opacity: 0.5;
  }

  /* ---------- Navbar ---------- */
  .cch-nav {
    position: relative; z-index: 20;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    padding: 1.9rem 2.5rem;
    max-width: 1720px; margin: 0 auto;
  }
  .cch-brand {
    display: inline-flex; align-items: center; gap: 0.7rem;
    text-decoration: none; color: var(--cch-ink);
    font-size: 1.35rem; font-weight: 500; letter-spacing: -0.015em;
    white-space: nowrap;
  }
  .cch-brand svg { display: block; }

  .cch-menu {
    display: flex; align-items: center; gap: 0.25rem;
    padding: 0.4rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(255,255,255,0.28);
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  }
  .cch-menu a, .cch-menu button {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.78rem 1.55rem;
    border: 0; background: transparent; cursor: pointer;
    font-family: inherit; font-size: 1.02rem; font-weight: 400;
    color: rgba(255,255,255,0.92); text-decoration: none;
    border-radius: 999px; white-space: nowrap;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .cch-menu a:hover, .cch-menu button:hover { background: rgba(255,255,255,0.18); color: #fff; }
  .cch-menu .is-active { background: rgba(255,255,255,0.26); color: #fff; }
  .cch-menu .cch-chevron { opacity: 0.85; }
  .cch-menu-divider { width: 1px; height: 26px; margin: 0 0.35rem; background: rgba(255,255,255,0.3); }

  .cch-login {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1.25rem 2.1rem;
    background: #0b0b09; color: #fff;
    font-family: inherit; font-size: 1rem; font-weight: 400;
    border: 0; border-radius: 14px; cursor: pointer; text-decoration: none;
    white-space: nowrap;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .cch-login:hover { background: #000; transform: translateY(-1px); }

  /* ---------- Conteúdo ---------- */
  .cch-inner {
    position: relative; z-index: 10;
    max-width: 1720px; margin: 0 auto;
    padding: 4.5rem 4rem 8rem 4.875rem;
    display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 3rem;
    min-height: calc(100vh - 112px);
  }

  .cch-left { display: flex; flex-direction: column; }
  .cch-index {
    font-size: 0.9rem; font-weight: 500; letter-spacing: 0.18em;
    color: var(--cch-muted); margin-bottom: 1.6rem;
  }
  .cch-title {
    margin: 0;
    font-size: clamp(3.5rem, 9vw, 10.5rem);
    line-height: 0.88;
    font-weight: 700;
    letter-spacing: -0.045em;
    text-transform: uppercase;
    color: #17171a;
  }
  .cch-title span { display: block; }
  .cch-lead {
    margin: 2.6rem 0 0;
    max-width: 34rem;
    font-size: 1.12rem; line-height: 1.5; font-weight: 400;
    color: #3d3c37;
  }
  .cch-ctas { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-top: 2.6rem; }
  .cch-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1.15rem 2.35rem; border: 0; border-radius: 12px;
    font-family: inherit; font-size: 1.05rem; font-weight: 400;
    cursor: pointer; text-decoration: none; white-space: nowrap;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .cch-btn-primary {
    background: linear-gradient(180deg, var(--cch-orange) 0%, var(--cch-orange-dark) 100%);
    color: #fff;
    box-shadow: 0 12px 28px rgba(217,89,8,0.28);
  }
  .cch-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(217,89,8,0.36); }
  .cch-btn-ghost {
    background: rgba(255,255,255,0.17); color: #fff;
    border: 1px solid rgba(255,255,255,0.22);
    -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  }
  .cch-btn-ghost:hover { background: rgba(255,255,255,0.26); transform: translateY(-2px); }

  /* ---------- Coluna direita ---------- */
  .cch-right {
    display: flex; flex-direction: column; align-items: flex-end;
    text-align: right; padding-top: 0.5rem;
  }
  .cch-stat { display: flex; align-items: baseline; gap: 0.75rem; }
  .cch-stat svg { align-self: center; flex: none; }
  .cch-stat-value {
    font-size: clamp(2.6rem, 4.2vw, 4.1rem);
    font-weight: 700; letter-spacing: -0.035em; line-height: 1; color: #17171a;
  }
  .cch-stat-label {
    font-size: clamp(1rem, 1.35vw, 1.35rem);
    font-weight: 400; letter-spacing: 0.01em; color: #4a4a44;
    text-transform: uppercase;
  }
  .cch-stat-text {
    margin: 1.1rem 0 0; max-width: 30rem;
    font-size: 1.05rem; line-height: 1.45; color: #3d3c37;
  }
  .cch-tagline {
    margin: auto 0 0; max-width: 24rem;
    font-size: 1.05rem; line-height: 1.45; color: #4a4a44;
  }

  /* ---------- Social rail ---------- */
  .cch-social {
    position: absolute; right: 4rem; top: 50%; transform: translateY(-50%);
    z-index: 15;
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
    padding: 0.5rem;
    border-radius: 18px;
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(255,255,255,0.24);
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  }
  .cch-social a {
    display: inline-flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 13px;
    color: #fff;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .cch-social a:hover { background: rgba(255,255,255,0.3); transform: translateY(-1px); }
  .cch-social a.is-active { background: rgba(255,255,255,0.26); }

  /* ---------- Scroll hint ---------- */
  .cch-scroll {
    position: absolute; left: 50%; bottom: 1.6rem; transform: translateX(-50%);
    z-index: 15;
    display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
    color: #4a4a44; text-align: center;
    font-size: 1rem; line-height: 1.35;
  }
  .cch-scroll span { display: block; }
  .cch-scroll-text { display: block; }
  .cch-mouse { animation: cch-float 2.4s ease-in-out infinite; }
  @keyframes cch-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 1180px) {
    .cch-menu a, .cch-menu button { padding: 0.65rem 0.85rem; font-size: 0.9rem; }
    .cch-social { right: 0.75rem; }
    .cch-inner { padding-right: 5.5rem; }
  }
  @media (max-width: 980px) {
    .cch-menu { display: none; }
    .cch-inner {
      grid-template-columns: 1fr; gap: 3.5rem;
      padding: 2.5rem 1.25rem 2.5rem;
    }
    .cch-right { align-items: flex-start; text-align: left; }
    .cch-tagline { margin-top: 2rem; }
    .cch-social {
      position: relative; top: auto; right: auto; transform: none;
      flex-direction: row; margin: 0 1.25rem; width: max-content;
    }
    .cch-scroll {
      position: relative; left: auto; bottom: auto; transform: none;
      margin: 3rem auto 2.5rem; width: max-content;
    }
  }
  @media (max-width: 560px) {
    .cch-nav { padding: 1rem 1.25rem; }
    .cch-brand { font-size: 1.1rem; }
    .cch-login { padding: 0.85rem 1.2rem; font-size: 0.9rem; }
    .cch-ctas { gap: 0.75rem; }
    .cch-btn { flex: 1 1 auto; padding: 1rem 1.2rem; font-size: 0.95rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch-mouse { animation: none; }
    .cch *, .cch *::before, .cch *::after { transition: none !important; }
  }
`;

/* ---------- Ícones ---------- */

function LogoMark() {
  const s = 6.2;
  const cells = [
    [1, 0, '#f08a2e'],
    [2, 0, '#ee6a12'],
    [0, 1, '#f4a05a'],
    [1, 1, '#ee6a12'],
    [2, 1, '#d95908'],
    [1, 2, '#ee6a12'],
    [2, 2, '#f08a2e'],
    [3, 2, '#f4a05a'],
    [0, 3, '#f08a2e'],
    [2, 3, '#ee6a12'],
    [3, 3, '#d95908'],
  ];
  return (
    <svg width="30" height="30" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      {cells.map(([x, y, fill]) => (
        <rect key={`${x}-${y}`} x={x * s} y={y * s} width={s - 0.9} height={s - 0.9} rx="0.8" fill={fill} />
      ))}
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="cch-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M3 12h18" />
      <path d="M12 2.8c2.4 2.6 3.6 5.7 3.6 9.2S14.4 18.6 12 21.2C9.6 18.6 8.4 15.5 8.4 12S9.6 5.4 12 2.8Z" />
    </svg>
  );
}

function GrowthArrow() {
  return (
    <svg width="46" height="56" viewBox="0 0 46 56" aria-hidden="true" focusable="false">
      <g stroke="#17171a" strokeWidth="10.5" fill="none" strokeLinecap="butt" strokeLinejoin="miter">
        <path d="M23 55V11" />
        <path d="M7.5 25.5 23 9l15.5 16.5" />
      </g>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.6 22v-8.5h2.9l.5-3.4h-3.4V7.9c0-1 .3-1.7 1.7-1.7h1.8V3.2c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.5H8.1v3.4h2.9V22z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.7 2.5h3.3l-7.2 8.2L22.3 21.5h-6.6l-5.2-6.8-6 6.8H1.2l7.7-8.8L1.7 2.5h6.8l4.7 6.2zm-1.2 17h1.8L7.6 4.4H5.6z" />
    </svg>
  );
}

function MouseIcon() {
  return (
    <svg className="cch-mouse" width="20" height="26" viewBox="0 0 20 26" fill="none"
      stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="1.5" y="1.5" width="17" height="23" rx="8.5" />
      <path d="M10 6.5v4" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Componente ---------- */

export default function HeroSection() {
  return (
    <section className="cch">
      <style>{HERO_CSS}</style>

      <div className="cch-bg" aria-hidden="true" />

      <svg className="cch-hill" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="cch-blur" x="-30%" y="-60%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <path
          filter="url(#cch-blur)"
          fill="rgba(255,255,255,0.62)"
          d="M-80 220V196c120 0 210-6 300-22 92-16 150-56 236-56 78 0 126 34 190 52 70 20 140 26 240 26 120 0 200 4 394 0v24z"
        />
      </svg>

      <header className="cch-nav">
        <a className="cch-brand" href="#inicio">
          <LogoMark />
          Capital Cycle
        </a>

        <nav className="cch-menu" aria-label="Navegação principal">
          <a href="#inicio" className="is-active">Início</a>
          <a href="#sobre">Sobre</a>
          <button type="button">Serviços <ChevronDown /></button>
          <a href="#precos">Preços</a>
          <a href="#solucoes">Soluções</a>
          <span className="cch-menu-divider" aria-hidden="true" />
          <button type="button"><GlobeIcon /> Português <ChevronDown /></button>
        </nav>

        <a className="cch-login" href="/login">Entrar / Cadastrar</a>
      </header>

      <div className="cch-inner" id="inicio">
        <div className="cch-left">
          <div className="cch-index">[ 1 / 8 ]</div>

          <h1 className="cch-title">
            <span>Capital</span>
            <span>Cycle</span>
          </h1>

          <p className="cch-lead">
            Criamos identidades de marca, campanhas e sites que impulsionam
            engajamento, conversões e crescimento sustentável.
          </p>

          <div className="cch-ctas">
            <a className="cch-btn cch-btn-primary" href="/cadastro">Começar agora</a>
            <a className="cch-btn cch-btn-ghost" href="#contato">Fale conosco</a>
          </div>
        </div>

        <div className="cch-right">
          <div className="cch-stat">
            <GrowthArrow />
            <span className="cch-stat-value">132%</span>
            <span className="cch-stat-label">de crescimento</span>
          </div>

          <p className="cch-stat-text">
            Nossos clientes veem crescimento mensurável de marca por meio de
            estratégias visuais e pensamento digital.
          </p>

          <p className="cch-tagline">
            Do primeiro passo de uma ideia ao reconhecimento mundial — somos
            parceiros de marcas ambiciosas.
          </p>
        </div>
      </div>

      <div className="cch-social">
        <a href="https://instagram.com" target="_blank" rel="noreferrer noopener"
          aria-label="Instagram" className="is-active"><InstagramIcon /></a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer noopener"
          aria-label="Facebook"><FacebookIcon /></a>
        <a href="https://x.com" target="_blank" rel="noreferrer noopener"
          aria-label="X"><XIcon /></a>
      </div>

      <div className="cch-scroll">
        <MouseIcon />
        <div className="cch-scroll-text">
          <span>Role para baixo</span>
          <span>para explorar mais</span>
        </div>
      </div>
    </section>
  );
}
