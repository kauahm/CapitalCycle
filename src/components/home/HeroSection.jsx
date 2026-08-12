import React, { useEffect, useRef } from 'react';

import heroVideo from '../../assets/video/hero-cartao.mp4';
import heroVideoPoster from '../../assets/video/hero-cartao-poster.jpg';

/* =========================================================
   HERO SECTION — Capital Cycle
   Layout claro (cinza), headline em 3 linhas com destaque
   roxo, menu em pílula, KPIs à direita e scroll hint.
   Fundo em vídeo (cartão 3D) atrás de toda a tipografia.
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

  /* ---------- Fundo (vídeo) ---------- */
  .cch-video-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    width: 100%; height: 100%;
    object-fit: cover; object-position: center 45%;
    background: #d8d8d8;
  }
  .cch-scrim {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: linear-gradient(
      92deg,
      rgba(216,216,214,0.86) 0%,
      rgba(216,216,214,0.62) 26%,
      rgba(216,216,214,0.2) 46%,
      rgba(216,216,214,0.12) 64%,
      rgba(216,216,214,0.58) 82%,
      rgba(216,216,214,0.8) 100%
    );
  }
  .cch-scrim::after {
    content: ''; position: absolute; inset: -20%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.08; mix-blend-mode: overlay;
  }

  /* ---------- Navbar ---------- */
  .cch-nav {
    position: relative; z-index: 20;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    padding: 1.9rem 3.2rem 0;
    max-width: 1980px; margin: 0 auto;
  }

  .cch-logo-slot {
    flex: none;
    /* Espaço reservado para a logo da marca */
    min-width: 3rem; min-height: 2.5rem;
  }

  .cch-nav-right {
    display: flex; align-items: center; gap: 0.9rem;
    margin-left: auto;
  }

  .cch-menu {
    display: flex; align-items: center; gap: 0.3rem;
    padding: 0.45rem;
    border-radius: 14px;
    background: rgba(0,0,0,0.13);
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .cch-menu a, .cch-menu button {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.5rem;
    border: 0; background: transparent; cursor: pointer;
    font-family: inherit; font-size: 0.93rem; font-weight: 700;
    color: rgba(255,255,255,0.78); text-decoration: none;
    border-radius: 9px; white-space: nowrap;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .cch-menu a:hover, .cch-menu button:hover { background: rgba(255,255,255,0.16); color: #fff; }
  .cch-menu .is-active { background: #38383b; color: #fff; }
  .cch-menu .is-active:hover { background: #38383b; }
  .cch-caret {
    width: 0; height: 0; margin-top: 2px;
    border-left: 4px solid transparent; border-right: 4px solid transparent;
    border-top: 4.5px solid currentColor;
  }

  .cch-login {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.82rem 1.9rem;
    background: #0b0b0d; color: #fff;
    font-family: inherit; font-size: 0.93rem; font-weight: 700;
    border: 0; border-radius: 11px; cursor: pointer; text-decoration: none;
    white-space: nowrap;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .cch-login:hover { background: #000; transform: translateY(-1px); }

  /* ---------- Conteúdo ---------- */
  .cch-inner {
    position: relative; z-index: 10;
    max-width: 1980px; margin: 0 auto;
    padding: 3.2rem 3.2rem 2.5rem;
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: center;
    gap: 3rem;
    min-height: calc(100vh - 6.5rem);
  }

  .cch-left { display: flex; flex-direction: column; }
  .cch-title {
    margin: 0;
    font-size: clamp(2.8rem, 5.4vw, 7.4rem);
    line-height: 1.04;
    font-weight: 900;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: #131316;
  }
  .cch-title span { display: block; }
  .cch-title .cch-accent { color: var(--cch-purple); }

  .cch-lead {
    margin: 2rem 0 0;
    max-width: 28.6rem;
    font-size: 1.1rem; line-height: 1.52; font-weight: 400;
    color: var(--cch-body);
  }
  .cch-ctas { display: flex; flex-wrap: wrap; gap: 1.1rem; margin-top: 2.1rem; }
  .cch-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1.05rem 2.6rem; border: 0; border-radius: 12px;
    font-family: inherit; font-size: 0.98rem; font-weight: 700;
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
  .cch-stat + .cch-stat { margin-top: 2.4rem; }
  .cch-stat-label {
    display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #2c2c30;
  }
  .cch-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--cch-purple); flex: none;
  }
  .cch-stat-value {
    display: block; margin-top: 0.6rem;
    font-size: clamp(1.9rem, 2.7vw, 3rem);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: #131316;
  }
  .cch-tagline {
    margin: 2.6rem 0 0; max-width: 21rem;
    font-size: 0.95rem; line-height: 1.5; color: var(--cch-muted);
  }

  /* ---------- Scroll hint ---------- */
  .cch-scroll {
    position: absolute; left: 50%; bottom: 1rem; transform: translateX(-50%);
    z-index: 15;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    color: #4d4d52; text-align: center;
    font-size: 0.9rem; line-height: 1.3;
  }
  .cch-mouse { animation: cch-float 2.4s ease-in-out infinite; }
  @keyframes cch-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 1280px) {
    .cch-nav { padding: 1.6rem 1.75rem 0; }
    .cch-inner { padding: 2.5rem 1.75rem 2rem; }
    .cch-menu a, .cch-menu button { padding: 0.55rem 1rem; font-size: 0.88rem; }
  }
  @media (max-width: 980px) {
    .cch-menu { display: none; }
    .cch-inner {
      grid-template-columns: 1fr; gap: 2.5rem;
      padding: 2.5rem 1.5rem 2.5rem;
      min-height: 0;
    }
    .cch-right { align-items: flex-start; text-align: left; }
    .cch-stat-label { justify-content: flex-start; }
    .cch-scroll {
      position: relative; left: auto; bottom: auto; transform: none;
      margin: 1rem auto 2rem; width: max-content;
    }
    /* Em coluna única o vídeo fica só como textura ambiente,
       sem "janela" central, para não brigar com o texto. */
    .cch-video-bg { opacity: 0.4; filter: blur(1px); }
    .cch-scrim { background: rgba(216,216,214,0.85); }
    .cch-scrim::after { opacity: 0.14; }
  }
  @media (max-width: 560px) {
    .cch-nav { padding: 1.1rem 1.25rem 0; }
    .cch-login { padding: 0.7rem 1.3rem; font-size: 0.88rem; }
    .cch-lead { margin-top: 1.6rem; }
    .cch-ctas { gap: 0.75rem; margin-top: 1.6rem; }
    .cch-btn { flex: 1 1 auto; padding: 0.95rem 1.2rem; font-size: 0.92rem; }
    .cch-stat + .cch-stat { margin-top: 2rem; }
    .cch-tagline { margin-top: 2rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch-mouse { animation: none; }
    .cch *, .cch *::before, .cch *::after { transition: none !important; }
  }
`;

/* ---------- Ícones ---------- */

function MouseIcon() {
  return (
    <svg className="cch-mouse" width="28" height="43" viewBox="0 0 38 58" fill="none"
      stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="1.5" y="1.5" width="35" height="55" rx="17.5" />
      <path d="M19 13v10" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Componente ---------- */

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (media.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    syncPlayback();
    media.addEventListener('change', syncPlayback);
    return () => media.removeEventListener('change', syncPlayback);
  }, []);

  return (
    <section className="cch">
      <style>{HERO_CSS}</style>

      <video
        ref={videoRef}
        className="cch-video-bg"
        src={heroVideo}
        poster={heroVideoPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="cch-scrim" aria-hidden="true" />

      <header className="cch-nav">
        <div className="cch-logo-slot" aria-hidden="true" />

        <div className="cch-nav-right">
          <nav className="cch-menu" aria-label="Navegação principal">
            <a href="#inicio" className="is-active">Início</a>
            <a href="#sobre">Sobre</a>
            <button type="button">Serviços <span className="cch-caret" aria-hidden="true" /></button>
            <a href="#capital-advisor">Capital Advisor</a>
            <a href="#planos">Planos</a>
          </nav>

          <a className="cch-login" href="/login">Entrar / Cadastrar</a>
        </div>
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
