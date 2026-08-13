import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, BarChart3, Clock, ShieldCheck } from 'lucide-react';

import heroVideo from '../assets/video/hero-cartao.mp4';
import heroVideoLoop from '../assets/video/hero-cartao-loop.mp4';
import heroVideoPoster from '../assets/video/hero-cartao-poster.png';

/* =========================================================
   HOME — Capital Cycle
   Hero (vídeo do cartão) faz uma transição estilo "Apple"
   (scroll pinado, fade + slide) até a seção de Recursos.
   ========================================================= */

const PAGE_CSS = `
  .cch {
    --cch-ink: #131316;
    --cch-body: #3c3c40;
    --cch-muted: #6d6d72;
    --cch-purple: #8b7cf6;
    --cch-purple-btn: #7c62f2;
    --cch-purple-btn-dark: #6b4ff0;
    --cch-purple-rec: #5358ee;

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
    opacity: 1;
    transition: opacity 0.2s linear;
  }
  .cch-video-bg.cch-video-bg--loop {
    opacity: 0;
  }
  .cch-video-bg.cch-video-bg--loop.is-active {
    opacity: 1;
  }
  .cch-video-bg.cch-video-bg--hidden {
    opacity: 0;
  }
  .cch-scrim {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: linear-gradient(
      92deg,
      rgba(216,216,214,0.86) 0%,
      rgba(216,216,214,0.62) 20%,
      rgba(216,216,214,0.2) 40%,
      rgba(216,216,214,0.12) 60%,
      rgba(216,216,214,0.58) 80%,
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

  /* ---------- Conteúdo (Hero) ---------- */
  .cch-inner {
    position: relative; z-index: 10;
    max-width: 1980px; margin: 0 auto;
    padding: 7rem 3.2rem 2.5rem;
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

  /* ---------- Coluna direita (Hero) ---------- */
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

  /* ---------- Recursos (2ª seção) ---------- */
  .cch-recursos-layer {
    background: none;
  }
  .cch-layer-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-color: #f4f5f7;
  }
  .cch-rec-inner {
    position: relative; z-index: 10;
    max-width: 1980px; margin: 0 auto;
    min-height: calc(100vh - 6.5rem);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
    padding: 7rem 3.2rem 3.2rem;
  }
  .cch-rec-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--cch-purple-rec);
  }
  .cch-dot--rec { background: var(--cch-purple-rec); }
  .cch-rec-title {
    margin: 1.4rem 0 0;
    max-width: 46rem;
    font-size: clamp(2.8rem, 5.4vw, 7.4rem);
    line-height: 1.04;
    font-weight: 900;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: var(--cch-ink);
  }
  .cch-rec-title span { display: block; }
  .cch-rec-title .cch-accent-rec { color: var(--cch-purple-rec); }
  .cch-rec-lead {
    margin: 2rem 0 0;
    max-width: 34rem;
    font-size: 1.1rem; line-height: 1.52; font-weight: 400;
    color: var(--cch-body);
  }
  .cch-rec-cta {
    display: inline-flex; align-items: center; gap: 0.6rem;
    margin-top: 2.3rem;
    padding: 1.05rem 1.9rem 1.05rem 2.3rem;
    background: #0f1216; color: #fff;
    font-family: inherit; font-size: 0.98rem; font-weight: 700;
    border-radius: 999px; text-decoration: none; white-space: nowrap;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .cch-rec-cta:hover { background: #000; transform: translateY(-2px); }
  .cch-rec-arrow { width: 18px; height: 18px; flex: none; }

  /* ---------- Transição "Apple" (scroll pinado) ---------- */
  .cch-story {
    position: relative;
    height: 180vh;
  }
  .cch-pin {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  .cch-nav-wrap {
    position: absolute; top: 0; left: 0; right: 0; z-index: 30;
  }
  .cch-layers-viewport {
    position: absolute; inset: 0; z-index: 0;
  }
  .cch-layer {
    position: absolute; inset: 0;
    pointer-events: none;
  }
  .cch-hero-layer { z-index: 1; }
  .cch-recursos-layer { z-index: 2; }

  .cch-story.cch-story--static { height: auto; }
  .cch-story--static .cch-pin {
    position: static; height: auto;
  }
  .cch-story--static .cch-nav-wrap { position: relative; }
  .cch-story--static .cch-layers-viewport { position: static; }
  .cch-story--static .cch-layer {
    position: relative; inset: auto;
    min-height: 100vh;
    pointer-events: auto;
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 1280px) {
    .cch-nav { padding: 1.6rem 1.75rem 0; }
    .cch-inner { padding: 5.5rem 1.75rem 2rem; }
    .cch-menu a, .cch-menu button { padding: 0.55rem 1rem; font-size: 0.88rem; }
  }
  @media (max-width: 980px) {
    .cch-menu { display: none; }
    .cch-inner {
      grid-template-columns: 1fr; gap: 2.5rem;
      padding: 4.5rem 1.5rem 2.5rem;
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
    .cch-rec-inner { min-height: 0; padding: 5rem 1.5rem 3rem; }
  }
  @media (max-width: 560px) {
    .cch-nav { padding: 1.1rem 1.25rem 0; }
    .cch-login { padding: 0.7rem 1.3rem; font-size: 0.88rem; }
    .cch-lead { margin-top: 1.6rem; }
    .cch-ctas { gap: 0.75rem; margin-top: 1.6rem; }
    .cch-btn { flex: 1 1 auto; padding: 0.95rem 1.2rem; font-size: 0.92rem; }
    .cch-stat + .cch-stat { margin-top: 2rem; }
    .cch-rec-cta { padding: 0.9rem 1.6rem 0.9rem 2rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch-mouse { animation: none; }
    .cch *, .cch *::before, .cch *::after { transition: none !important; }
  }

  /* ---------- Recursos em destaque (cards) ---------- */
  .cch-feats {
    position: relative;
    background: #f4f5f7;
    padding: 6.5rem 3.2rem 8rem;
  }
  .cch-feats-inner {
    max-width: 74rem; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
  }
  .cch-feat-card {
    background: #fff;
    border-radius: 1.75rem;
    padding: 2.75rem;
    box-shadow: 0 24px 48px rgba(19,19,22,0.05);
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
    will-change: opacity, transform;
  }
  .cch-feat-card.is-in {
    opacity: 1;
    transform: translateY(0);
  }
  .cch-feat-card--dark {
    background: #0f1216;
  }
  .cch-feat-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 3.5rem; height: 3.5rem;
    border-radius: 1rem;
    background: rgba(83,88,238,0.12);
    color: #5358ee;
    margin-bottom: 1.9rem;
  }
  .cch-feat-card--dark .cch-feat-icon {
    background: #5358ee;
    color: #fff;
  }
  .cch-feat-title {
    margin: 0 0 0.9rem;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #131316;
  }
  .cch-feat-card--dark .cch-feat-title { color: #fff; }
  .cch-feat-desc {
    margin: 0;
    max-width: 30rem;
    font-size: 1.02rem;
    line-height: 1.56;
    color: #6d6d72;
  }
  .cch-feat-card--dark .cch-feat-desc { color: rgba(255,255,255,0.6); }

  @media (max-width: 1280px) {
    .cch-feats { padding: 5.5rem 1.75rem 6rem; }
  }
  @media (max-width: 900px) {
    .cch-feats-inner { grid-template-columns: 1fr; gap: 1.25rem; }
    .cch-feat-card { padding: 2.25rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch-feat-card {
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
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

function ArrowRightIcon() {
  return (
    <svg className="cch-rec-arrow" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- Cards de recursos em destaque ---------- */

const FEATURE_CARDS = [
  {
    title: 'Dashboard Financeiro',
    desc: 'Saldo consolidado de todas as contas com indicadores de fluxo em tempo real.',
    Icon: BarChart3,
  },
  {
    title: 'Transações Inteligentes',
    desc: 'Registre entradas e saídas com categorias, filtros avançados e histórico completo.',
    Icon: ArrowLeftRight,
  },
  {
    title: 'Ciclos de Investimento',
    desc: 'Metas de orçamento por período com progresso calculado automaticamente.',
    Icon: Clock,
  },
  {
    title: 'Capital Advisor',
    desc: 'Análise dos seus dados financeiros em linguagem natural, direto no aplicativo.',
    Icon: ShieldCheck,
    dark: true,
  },
];

/* ---------- Navegação (reutilizada no Hero e nos Recursos) ---------- */

function MainNav({ active = 'inicio' }) {
  return (
    <header className="cch-nav">
      <div className="cch-logo-slot" aria-hidden="true" />

      <div className="cch-nav-right">
        <nav className="cch-menu" aria-label="Navegação principal">
          <a href="#inicio" className={active === 'inicio' ? 'is-active' : undefined}>Início</a>
          <a href="#recursos" className={active === 'recursos' ? 'is-active' : undefined}>Recursos</a>
          <button type="button">Serviços <span className="cch-caret" aria-hidden="true" /></button>
          <a href="#capital-advisor">Capital Advisor</a>
          <a href="#planos">Planos</a>
        </nav>

        <a className="cch-login" href="/login">Entrar</a>
      </div>
    </header>
  );
}

/* ---------- Scroll pinado (progresso 0 → 1) ---------- */

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function useScrollStory(ref, enabled) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let rafId = null;
    let target = 0;
    let current = 0;

    const computeTarget = () => {
      const rect = el.getBoundingClientRect();
      const runway = el.offsetHeight - window.innerHeight;
      target = runway > 0 ? clamp01(-rect.top / runway) : 0;
    };

    const tick = () => {
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.0006) current = target;
      setProgress(current);
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => computeTarget();

    computeTarget();
    current = target;
    rafId = requestAnimationFrame(tick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref, enabled]);

  return enabled ? progress : 1;
}

function usePinnedStoryEnabled() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 981px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return enabled;
}

/* ---------- Revela ao entrar na viewport (uma única vez) ---------- */

function useRevealOnScroll(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ---------- Componente ---------- */

export default function HomePage() {
  const videoRef = useRef(null);
  const loopVideoRef = useRef(null);
  const storyRef = useRef(null);

  const pinnedEnabled = usePinnedStoryEnabled();
  const progress = useScrollStory(storyRef, pinnedEnabled);
  const [featsRef, featsInView] = useRevealOnScroll();

  useEffect(() => {
    const video = videoRef.current;
    const loopVideo = loopVideoRef.current;
    if (!video || !loopVideo) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleEnded = () => {
      const mid = loopVideo.duration ? loopVideo.duration / 2 : 0;
      loopVideo.currentTime = mid;
      loopVideo.play().catch(() => {});
      video.classList.add('cch-video-bg--hidden');
      loopVideo.classList.add('is-active');
    };

    const syncPlayback = () => {
      if (media.matches) {
        video.pause();
        loopVideo.pause();
      } else if (loopVideo.classList.contains('is-active')) {
        loopVideo.play().catch(() => {});
      } else {
        video.play().catch(() => {});
      }
    };

    syncPlayback();
    video.addEventListener('ended', handleEnded);
    media.addEventListener('change', syncPlayback);
    return () => {
      video.removeEventListener('ended', handleEnded);
      media.removeEventListener('change', syncPlayback);
    };
  }, []);

  /* Etapas escalonadas: 1) o texto/nav do Hero some, 2) o fundo troca
     de cinza para branco, 3) o conteúdo dos Recursos aparece por cima
     já num fundo quase branco — evita o efeito "cubo" de misturar tudo
     de uma vez. */
  const heroContentP = clamp01(progress / 0.45);
  const bgCrossP = clamp01((progress - 0.15) / 0.45);
  const recContentP = clamp01((progress - 0.5) / 0.5);

  const heroContentStyle = pinnedEnabled ? {
    opacity: 1 - heroContentP,
    transform: `translateY(${-heroContentP * 46}px)`,
    pointerEvents: heroContentP > 0.9 ? 'none' : 'auto',
  } : undefined;

  const recBgStyle = pinnedEnabled ? { opacity: bgCrossP } : undefined;

  const recContentStyle = pinnedEnabled ? {
    opacity: recContentP,
    transform: `translateY(${(1 - recContentP) * 36}px)`,
    pointerEvents: recContentP < 0.1 ? 'none' : 'auto',
  } : undefined;

  const activeNav = progress >= 0.5 ? 'recursos' : 'inicio';

  return (
    <>
      <style>{PAGE_CSS}</style>

      <div ref={storyRef} className={`cch-story ${pinnedEnabled ? '' : 'cch-story--static'}`}>
      <div className="cch-pin">
        <div className="cch-nav-wrap">
          <MainNav active={activeNav} />
        </div>

        <div className="cch-layers-viewport">
        <div className="cch cch-layer cch-hero-layer">
          <video
            ref={videoRef}
            className="cch-video-bg"
            src={heroVideo}
            poster={heroVideoPoster}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <video
            ref={loopVideoRef}
            className="cch-video-bg cch-video-bg--loop"
            src={heroVideoLoop}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="cch-scrim" aria-hidden="true" />

          <div className="cch-inner" id="inicio" style={heroContentStyle}>
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
                <a className="cch-btn cch-btn-ghost" href="/login">Já tenho conta</a>
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
            </div>
          </div>

          <div className="cch-scroll" style={heroContentStyle}>
            <MouseIcon />
            <span>Role para baixo</span>
          </div>
        </div>

        <div className="cch cch-layer cch-recursos-layer">
          <div className="cch-layer-bg" style={recBgStyle} aria-hidden="true" />

          <div className="cch-rec-inner" id="recursos" style={recContentStyle}>
            <span className="cch-rec-eyebrow">
              <span className="cch-dot cch-dot--rec" aria-hidden="true" />
              Recursos
            </span>

            <h2 className="cch-rec-title">
              <span>Gestão</span>
              <span className="cch-accent-rec">Que evolui com você</span>
            </h2>

            <p className="cch-rec-lead">
              Ferramentas profissionais para controle total do seu dinheiro — do
              lançamento individual à inteligência financeira por IA.
            </p>

            <a className="cch-rec-cta" href="#planos">
              Ver planos
              <ArrowRightIcon />
            </a>
          </div>
        </div>
        </div>
      </div>
      </div>

      <section className="cch-feats" ref={featsRef} aria-label="Recursos em destaque">
        <div className="cch-feats-inner">
          {FEATURE_CARDS.map(({ title, desc, Icon, dark }, i) => (
            <article
              key={title}
              className={`cch-feat-card${dark ? ' cch-feat-card--dark' : ''}${featsInView ? ' is-in' : ''}`}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <span className="cch-feat-icon" aria-hidden="true">
                <Icon size={26} strokeWidth={2.2} />
              </span>
              <h3 className="cch-feat-title">{title}</h3>
              <p className="cch-feat-desc">{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
