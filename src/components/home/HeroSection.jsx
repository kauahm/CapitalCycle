import React from 'react';

/* =========================================================
   HERO SECTION — Capital Cycle
   Layout claro (cinza), headline em 3 linhas com destaque
   roxo, menu em pílula, KPIs à direita e scroll hint.
   ========================================================= */

const HERO_CSS = `
  .cch {
    --cch-ink: #131316;
    --cch-body: #3c3c40;
    --cch-muted: #6d6d72;
    --cch-purple: #8b7cf6;
    --cch-purple-btn: #7c62f2;
    --cch-purple-btn-dark: #6b4ff0;

    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    isolation: isolate;
    background-color: #d8d8d8;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: var(--cch-ink);
    -webkit-font-smoothing: antialiased;
  }
  .cch *, .cch *::before, .cch *::after { box-sizing: border-box; }

  /* ---------- Fundo ---------- */
  .cch-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(90% 70% at 22% 8%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 65%),
      linear-gradient(155deg, #e4e4e4 0%, #dcdcdc 32%, #d2d2d2 66%, #c6c6c6 100%);
  }
  .cch-bg::after {
    content: ''; position: absolute; inset: -20%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.10; mix-blend-mode: overlay;
  }

  /* ---------- Navbar ---------- */
  .cch-nav {
    position: relative; z-index: 20;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    padding: 2.9rem 3.8rem 0;
    max-width: 1980px; margin: 0 auto;
  }

  .cch-menu {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.6rem;
    border-radius: 17px;
    background: rgba(0,0,0,0.13);
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .cch-menu a, .cch-menu button {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.7rem 2.1rem;
    border: 0; background: transparent; cursor: pointer;
    font-family: inherit; font-size: 1.09rem; font-weight: 700;
    color: rgba(255,255,255,0.78); text-decoration: none;
    border-radius: 11px; white-space: nowrap;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .cch-menu a:hover, .cch-menu button:hover { background: rgba(255,255,255,0.16); color: #fff; }
  .cch-menu .is-active { background: #38383b; color: #fff; }
  .cch-menu .is-active:hover { background: #38383b; }
  .cch-caret {
    width: 0; height: 0; margin-top: 2px;
    border-left: 4.5px solid transparent; border-right: 4.5px solid transparent;
    border-top: 5px solid currentColor;
  }

  .cch-login {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1.16rem 3.15rem;
    background: #0b0b0d; color: #fff;
    font-family: inherit; font-size: 1.09rem; font-weight: 700;
    border: 0; border-radius: 13px; cursor: pointer; text-decoration: none;
    white-space: nowrap;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .cch-login:hover { background: #000; transform: translateY(-1px); }

  /* ---------- Conteúdo ---------- */
  .cch-inner {
    position: relative; z-index: 10;
    max-width: 1980px; margin: 0 auto;
    padding: 8.5rem 3.8rem 7rem;
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 3rem;
  }

  .cch-left { display: flex; flex-direction: column; }
  .cch-title {
    margin: 0;
    font-size: clamp(3.2rem, 6.5vw, 9rem);
    line-height: 1.02;
    font-weight: 900;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: #131316;
  }
  .cch-title span { display: block; }
  .cch-title .cch-accent { color: var(--cch-purple); }

  .cch-lead {
    margin: 2.9rem 0 0;
    max-width: 28.6rem;
    font-size: 1.19rem; line-height: 1.55; font-weight: 400;
    color: var(--cch-body);
  }
  .cch-ctas { display: flex; flex-wrap: wrap; gap: 1.3rem; margin-top: 2.5rem; }
  .cch-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1.4rem 3.8rem; border: 0; border-radius: 13px;
    font-family: inherit; font-size: 1.09rem; font-weight: 700;
    cursor: pointer; text-decoration: none; white-space: nowrap;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .cch-btn-primary {
    background: linear-gradient(180deg, var(--cch-purple-btn) 0%, var(--cch-purple-btn-dark) 100%);
    color: #fff;
    box-shadow: 0 12px 28px rgba(108,79,240,0.26);
  }
  .cch-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(108,79,240,0.34); }
  .cch-btn-ghost {
    background: rgba(0,0,0,0.13); color: #fff;
    -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  }
  .cch-btn-ghost:hover { background: rgba(0,0,0,0.2); transform: translateY(-2px); }

  /* ---------- Coluna direita ---------- */
  .cch-right {
    display: flex; flex-direction: column; align-items: flex-end;
    text-align: right;
  }
  .cch-stat + .cch-stat { margin-top: 3.6rem; }
  .cch-stat-label {
    display: flex; align-items: center; justify-content: flex-end; gap: 0.55rem;
    font-size: 0.95rem; font-weight: 700; letter-spacing: 0.11em;
    text-transform: uppercase; color: #2c2c30;
  }
  .cch-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--cch-purple); flex: none;
  }
  .cch-stat-value {
    display: block; margin-top: 0.85rem;
    font-size: clamp(2.4rem, 3.6vw, 3.9rem);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: #131316;
  }
  .cch-tagline {
    margin: 4.2rem 0 0; max-width: 21rem;
    font-size: 1.06rem; line-height: 1.55; color: var(--cch-muted);
  }

  /* ---------- Scroll hint ---------- */
  .cch-scroll {
    position: absolute; left: 50%; bottom: 1.2rem; transform: translateX(-50%);
    z-index: 15;
    display: flex; flex-direction: column; align-items: center; gap: 0.9rem;
    color: #4d4d52; text-align: center;
    font-size: 1.06rem; line-height: 1.3;
  }
  .cch-mouse { animation: cch-float 2.4s ease-in-out infinite; }
  @keyframes cch-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 1280px) {
    .cch-nav { padding: 2rem 2rem 0; }
    .cch-inner { padding: 6rem 2rem 7rem; }
    .cch-menu a, .cch-menu button { padding: 0.75rem 1.1rem; font-size: 0.95rem; }
  }
  @media (max-width: 980px) {
    .cch-menu { display: none; }
    .cch-nav { justify-content: flex-end; }
    .cch-inner {
      grid-template-columns: 1fr; gap: 3.5rem;
      padding: 3.5rem 1.5rem 3rem;
    }
    .cch-right { align-items: flex-start; text-align: left; }
    .cch-stat-label { justify-content: flex-start; }
    .cch-scroll {
      position: relative; left: auto; bottom: auto; transform: none;
      margin: 1rem auto 2.5rem; width: max-content;
    }
  }
  @media (max-width: 560px) {
    .cch-nav { padding: 1.25rem 1.25rem 0; }
    .cch-login { padding: 0.95rem 1.4rem; font-size: 0.95rem; }
    .cch-lead { margin-top: 2.2rem; }
    .cch-ctas { gap: 0.75rem; margin-top: 2rem; }
    .cch-btn { flex: 1 1 auto; padding: 1.1rem 1.3rem; font-size: 0.98rem; }
    .cch-stat + .cch-stat { margin-top: 2.4rem; }
    .cch-tagline { margin-top: 2.6rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch-mouse { animation: none; }
    .cch *, .cch *::before, .cch *::after { transition: none !important; }
  }
`;

/* ---------- Ícones ---------- */

function MouseIcon() {
  return (
    <svg className="cch-mouse" width="38" height="58" viewBox="0 0 38 58" fill="none"
      stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="1.5" y="1.5" width="35" height="55" rx="17.5" />
      <path d="M19 13v10" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Componente ---------- */

export default function HeroSection() {
  return (
    <section className="cch">
      <style>{HERO_CSS}</style>

      <div className="cch-bg" aria-hidden="true" />

      <header className="cch-nav">
        <nav className="cch-menu" aria-label="Navegação principal">
          <a href="#inicio" className="is-active">Início</a>
          <a href="#sobre">Sobre</a>
          <button type="button">Serviços <span className="cch-caret" aria-hidden="true" /></button>
          <a href="#capital-advisor">Capital Advisor</a>
          <a href="#planos">Planos</a>
        </nav>

        <a className="cch-login" href="/login">Entrar / Cadastrar</a>
      </header>

      <div className="cch-inner" id="inicio">
        <div className="cch-left">
          <h1 className="cch-title">
            <span>Sua</span>
            <span>Jornada</span>
            <span className="cch-accent">Financeira</span>
          </h1>

          <p className="cch-lead">
            Da primeira transação ao ciclo de investimento completo — controle
            total do seu capital com inteligência artificial integrada.
          </p>

          <div className="cch-ctas">
            <a className="cch-btn cch-btn-primary" href="/cadastro">Começar agora</a>
            <a className="cch-btn cch-btn-ghost" href="#contato">Fale conosco</a>
          </div>
        </div>

        <div className="cch-right">
          <div className="cch-stat">
            <span className="cch-stat-label">
              <span className="cch-dot" aria-hidden="true" />
              Fluxo positivo
            </span>
            <span className="cch-stat-value">R$ 18k</span>
          </div>

          <div className="cch-stat">
            <span className="cch-stat-label">Ciclos ativos</span>
            <span className="cch-stat-value">14+</span>
          </div>

          <p className="cch-tagline">
            Do primeiro passo de uma ideia ao reconhecimento mundial — somos
            parceiros de marcas ambiciosas.
          </p>
        </div>
      </div>

      <div className="cch-scroll">
        <MouseIcon />
        <span>Role para baixo</span>
      </div>
    </section>
  );
}
