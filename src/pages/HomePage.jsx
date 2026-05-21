import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, RefreshCcw, Landmark,
  Sparkles, Target, TrendingUp, Shield
} from 'lucide-react';

import logoImg from '../assets/logo-topo.png';


const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900&family=DM+Mono:wght@400;500&display=swap');

  .cc-home * { box-sizing: border-box; margin: 0; padding: 0; }
  .cc-home { font-family: 'DM Sans', sans-serif; background: #05070e; color: #fff; overflow-x: hidden; }

  /* Nav */
  .cc-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 68px;
    background: rgba(5,7,14,0.8); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cc-nav-logo {
    font-size: 1rem; font-weight: 800; letter-spacing: -0.01em;
    color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px;
  }
  .cc-nav-logo-sq {
    width: 30px; height: 30px; background: #6366f1;
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; line-height: 1;
  }

  .cc-nav-logo-img {
    height: 62px; /* Ajuste o tamanho da sua logo aqui */
    width: auto;
    display: block;
  }

  .cc-nav-links { display: flex; gap: 2.5rem; }
  .cc-nav-links a {
    font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.45);
    text-decoration: none; letter-spacing: 0.01em;
    transition: color 0.2s;
  }
  .cc-nav-links a:hover { color: #fff; }

  /* Container para os botões da direita */
  .cc-nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Botão Premium (Alto Contraste) */
  .cc-btn-premium {
    background: #ffffff; 
    color: #05070e; /* Texto escuro */
    padding: 0.6rem 1.6rem;
    border-radius: 8px; 
    font-weight: 700; 
    font-size: 0.85rem;
    text-decoration: none; 
    transition: all 0.3s ease;
    display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 14px rgba(255,255,255,0.1);
  }
  .cc-btn-premium:hover { 
    background: #f0f0f0; 
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(255,255,255,0.2);
  }

  /* Botão Ghost Premium */
  .cc-btn-ghost {
    background: transparent; 
    color: #ffffff;
    padding: 0.6rem 1.6rem; 
    border-radius: 8px; 
    font-weight: 500; 
    font-size: 0.85rem;
    text-decoration: none; 
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease; 
    display: inline-flex; align-items: center; gap: 6px;
  }
  .cc-btn-ghost:hover { 
    border-color: #ffffff; 
    background: rgba(255,255,255,0.05);
  }
  /* Hero */
  .cc-hero {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 2rem;
    padding: 9rem 3rem 5rem; max-width: 1400px; margin: 0 auto;
  }
  .cc-hero-headline {
    font-size: clamp(4rem, 7vw, 7.5rem);
    font-weight: 900; line-height: 0.92;
    letter-spacing: -0.04em; text-transform: uppercase;
  }
  .cc-hero-headline span { color: #6366f1; }

  .cc-hero-sub {
    font-size: 0.9rem; color: rgba(255,255,255,0.38); line-height: 1.7;
    max-width: 380px; margin: 1.75rem 0 2.25rem;
    font-weight: 400;
  }
  .cc-hero-ctas { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 3.5rem; }

  /* Progress bars */
  .cc-bars { display: flex; flex-direction: column; gap: 1rem; }
  .cc-bar-label {
    font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.35);
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.5rem;
  }
  .cc-bar-track {
    height: 3px; background: rgba(255,255,255,0.07); border-radius: 100px; overflow: hidden;
  }
  .cc-bar-fill {
    height: 100%; background: #6366f1; border-radius: 100px;
    transition: width 1.4s cubic-bezier(0.4,0,0.2,1);
  }
  .cc-bar-fill.emerald { background: #22d3a0; }

  /* 3D Cards Visual */
  .cc-cards-scene {
    position: relative; height: 480px;
    display: flex; align-items: center; justify-content: center;
  }
  .cc-card {
    position: absolute; width: 300px; height: 180px;
    border-radius: 20px; padding: 1.5rem;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .cc-card:hover { transform: var(--hover-transform) !important; }
  .cc-card-back {
    background: linear-gradient(135deg, #1c1f3a 0%, #2d2f6e 100%);
    border: 1px solid rgba(99,102,241,0.25);
    transform: rotate(-12deg) translateX(-40px) translateY(20px) perspective(800px) rotateY(12deg);
    --hover-transform: rotate(-8deg) translateX(-30px) translateY(10px) perspective(800px) rotateY(6deg);
    z-index: 1;
  }
  .cc-card-front {
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 60%, #3730a3 100%);
    border: 1px solid rgba(255,255,255,0.15);
    transform: rotate(-4deg) translateX(30px) translateY(-10px) perspective(800px) rotateY(-6deg);
    --hover-transform: rotate(-1deg) translateX(20px) translateY(-15px) perspective(800px) rotateY(-3deg);
    z-index: 2;
    box-shadow: 0 40px 80px rgba(99,102,241,0.35), 0 10px 30px rgba(0,0,0,0.5);
  }
  .cc-card-shadow {
    position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
    width: 260px; height: 30px; z-index: 0;
    background: radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%);
    filter: blur(8px);
  }
  .cc-card-chip {
    width: 34px; height: 26px; border-radius: 5px;
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
    border: 1px solid rgba(255,255,255,0.25);
  }
  .cc-card-chip-dark {
    background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.15));
    border: 1px solid rgba(99,102,241,0.3);
  }
  .cc-card-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem; letter-spacing: 0.18em; color: rgba(255,255,255,0.7);
  }
  .cc-card-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
  .cc-card-value { font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cc-card-logo {
    width: 36px; height: 22px; display: flex; align-items: center; gap: -4px;
  }
  .cc-card-logo span {
    width: 22px; height: 22px; border-radius: 50%; display: block;
  }
  .cc-card-logo-a { background: rgba(255,255,255,0.5); }
  .cc-card-logo-b { background: rgba(255,255,255,0.25); margin-left: -8px; }

  /* Stats */
  .cc-stats {
    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 1.5rem;
  }
  .cc-stat-item { text-align: left; }
  .cc-stat-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #6366f1;
    display: inline-block; margin-right: 6px; vertical-align: middle;
  }
  .cc-stat-dot.em { background: #22d3a0; }
  .cc-stat-micro { font-size: 0.65rem; color: rgba(255,255,255,0.3); letter-spacing: 0.08em; text-transform: uppercase; }
  .cc-stat-num {
    font-family: 'DM Mono', monospace; font-size: 2rem;
    font-weight: 500; letter-spacing: -0.04em; line-height: 1;
  }

  /* Marquee divider */
  .cc-marquee-wrap {
    overflow: hidden; border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 1.25rem 0; white-space: nowrap;
  }
  .cc-marquee-track {
    display: inline-flex; gap: 0;
    animation: marqueeScroll 24s linear infinite;
  }
  .cc-marquee-item {
    display: inline-flex; align-items: center; gap: 1.25rem;
    padding: 0 2.5rem; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.2);
  }
  .cc-marquee-item span { color: #6366f1; font-size: 1.1rem; }
  @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Section: GESTÃO */
  .cc-section-big { max-width: 1400px; margin: 0 auto; padding: 7rem 3rem; }
  .cc-section-eyebrow {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 10px;
  }
  .cc-section-eyebrow::before {
    content: ''; display: inline-block; width: 20px; height: 1px;
    background: rgba(255,255,255,0.25);
  }
  .cc-gestao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; margin-bottom: 5rem; }
  .cc-big-text {
    font-size: clamp(3rem, 5.5vw, 5.5rem); font-weight: 900;
    line-height: 0.93; letter-spacing: -0.04em; text-transform: uppercase;
  }
  .cc-gestao-right { padding-bottom: 0.5rem; }
  .cc-gestao-desc {
    font-size: 0.9rem; color: rgba(255,255,255,0.38); line-height: 1.75;
    margin-bottom: 2rem; max-width: 380px;
  }

  /* Feature cards */
  .cc-feat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
  .cc-feat-card {
    background: #05070e; padding: 2rem 1.5rem;
    transition: background 0.25s;
    cursor: default;
  }
  .cc-feat-card:hover { background: #0c101e; }
  .cc-feat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #6366f1; margin-bottom: 1.25rem;
  }
  .cc-feat-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.6rem; line-height: 1.3; }
  .cc-feat-desc { font-size: 0.78rem; color: rgba(255,255,255,0.3); line-height: 1.6; }

  /* Pricing */
  .cc-pricing-wrap { 
    padding: 7rem 3rem; 
    max-width: 1400px; 
    margin: 0 auto; 
    display: flex; /* Adicionado para facilitar o alinhamento */
    flex-direction: column; 
    align-items: center; /* Centraliza tudo dentro do wrap */
  }.cc-pricing-header {
    text-align: center;
    margin-bottom: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cc-plans-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 1px; 
    background: rgba(255,255,255,0.07); 
    border: 1px solid rgba(255,255,255,0.07); 
    border-radius: 20px; 
    overflow: hidden; 
    max-width: 820px; 
    margin: 0 auto; /* Isso garante que a grid fique no centro */
    width: 100%;
  }
  .cc-plan { background: #05070e; padding: 3rem; transition: background 0.25s; }
  .cc-plan:hover { background: #080b16; }
  .cc-plan.featured { background: #0f1128; }
  .cc-plan-tag {
    font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
    margin-bottom: 2rem; display: flex; align-items: center; gap: 8px;
  }
  .cc-plan-tag-badge {
    background: rgba(99,102,241,0.15); color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.25); border-radius: 100px;
    padding: 0.15rem 0.6rem; font-size: 0.6rem;
  }
  .cc-plan-price { margin-bottom: 0.5rem; display: flex; align-items: baseline; gap: 4px; }
  .cc-plan-currency { font-size: 1.25rem; font-weight: 700; color: rgba(255,255,255,0.4); margin-top: 8px; }
  .cc-plan-val {
    font-family: 'DM Mono', monospace; font-size: 5rem; font-weight: 500;
    letter-spacing: -0.05em; line-height: 1; color: #fff;
  }
  .cc-plan-period { font-size: 0.8rem; color: rgba(255,255,255,0.25); align-self: flex-end; margin-bottom: 8px; }
  .cc-plan-desc { font-size: 0.8rem; color: rgba(255,255,255,0.28); line-height: 1.6; margin-bottom: 2.5rem; }
  .cc-plan-cta {
    display: block; width: 100%; text-align: center;
    padding: 0.85rem 1.5rem; border-radius: 10px;
    font-weight: 700; font-size: 0.85rem; text-decoration: none;
    margin-bottom: 2.5rem; transition: opacity 0.2s, transform 0.2s;
  }
  .cc-plan-cta:hover { opacity: 0.85; transform: translateY(-2px); }
  .cc-cta-filled { background: #6366f1; color: #fff; }
  .cc-cta-outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); }
  .cc-plan-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0 0 2rem; }
  .cc-plan-feats { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
  .cc-plan-feats li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: rgba(255,255,255,0.38); }
  .cc-feat-check { color: #22d3a0; flex-shrink: 0; font-size: 0.8rem; margin-top: 1px; }

  /* Footer */
  .cc-footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 2.5rem 3rem; display: flex; justify-content: space-between; align-items: center;
    max-width: 1400px; margin: 0 auto;
  }
  .cc-footer-logo { font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.3); text-decoration: none; }
  .cc-footer-links { display: flex; gap: 2rem; }
  .cc-footer-links a { font-size: 0.75rem; color: rgba(255,255,255,0.2); text-decoration: none; transition: color 0.2s; }
  .cc-footer-links a:hover { color: rgba(255,255,255,0.5); }
  .cc-copy { font-size: 0.75rem; color: rgba(255,255,255,0.15); }

  /* Fade in */
  .cc-fadein { opacity: 0; transform: translateY(28px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .cc-fadein.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 1024px) {
    .cc-hero { grid-template-columns: 1fr; padding: 8rem 1.5rem 4rem; min-height: auto; gap: 4rem; }
    .cc-cards-scene { height: 320px; }
    .cc-card { width: 240px; height: 145px; }
    .cc-stats { position: relative; top: auto; right: auto; transform: none; flex-direction: row; justify-content: center; gap: 2.5rem; margin-top: 1.5rem; }
    .cc-gestao-grid { grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem; }
    .cc-feat-grid { grid-template-columns: 1fr 1fr; }
    .cc-plans-grid { grid-template-columns: 1fr; max-width: 420px; }
    .cc-nav-links { display: none; }
    .cc-footer { flex-direction: column; gap: 1.5rem; text-align: center; }
    .cc-footer-links { flex-wrap: wrap; justify-content: center; }
  }
  @media (max-width: 640px) {
    .cc-feat-grid { grid-template-columns: 1fr; }
    .cc-hero-headline { font-size: 3.5rem; }
    .cc-big-text { font-size: 3rem; }
    .cc-section-big, .cc-pricing-wrap { padding: 5rem 1.5rem; }
  }
`;

/* ─────────────────────────────────────────────
   COMPONENTES INTERNOS
───────────────────────────────────────────── */

function ProgressBar({ label, pct, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div>
      <div className="cc-bar-label">{label}</div>
      <div className="cc-bar-track">
        <div className={`cc-bar-fill${color === 'emerald' ? ' emerald' : ''}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function FloatingCards() {
  return (
    <div className="cc-cards-scene">
      {/* Card de trás */}
      <div className="cc-card cc-card-back">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="cc-card-chip cc-card-chip-dark" />
          <div style={{ textAlign: 'right' }}>
            <div className="cc-card-label">Ciclo Ativo</div>
            <div className="cc-card-value" style={{ fontSize: '0.85rem' }}>Maio 2026</div>
          </div>
        </div>
        <div>
          <div className="cc-card-num">•••• •••• •••• 2034</div>
          <div className="cc-card-label" style={{ marginTop: '4px' }}>Capital Cycle</div>
        </div>
      </div>

      {/* Card da frente */}
      <div className="cc-card cc-card-front">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="cc-card-chip" />
          <div className="cc-card-logo">
            <span className="cc-card-logo-a" />
            <span className="cc-card-logo-b" />
          </div>
        </div>
        <div>
          <div className="cc-card-label">Saldo Consolidado</div>
          <div className="cc-card-value">R$ 18.240,00</div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
            <div>
              <div className="cc-card-label">Entradas/mês</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#22d3a0', fontWeight: 600 }}>+R$ 6.800</div>
            </div>
            <div>
              <div className="cc-card-label">Saídas/mês</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#f87171', fontWeight: 600 }}>-R$ 2.340</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sombra de elevação */}
      <div className="cc-card-shadow" />
    </div>
  );
}

const FEATURES = [
  {
    icon: <BarChart3 size={20} />,
    title: 'Dashboard Financeiro',
    desc: 'Saldo consolidado de todas as contas com indicadores de fluxo em tempo real.'
  },
  {
    icon: <RefreshCcw size={20} />,
    title: 'Transações Inteligentes',
    desc: 'Registre entradas e saídas com categorias, filtros avançados e histórico completo.'
  },
  {
    icon: <Target size={20} />,
    title: 'Ciclos de Investimento',
    desc: 'Metas de orçamento por período com progresso calculado automaticamente.'
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Capital Advisor IA',
    desc: 'Análise dos seus dados financeiros em linguagem natural. Disponível 24/7.'
  },
];

const PLANS = [
  {
    name: 'Jovem',
    price: '24',
    desc: 'Para quem está começando a organizar as finanças com controle prático.',
    cta: 'Começar com o Jovem',
    ctaClass: 'cc-cta-outline',
    featured: false,
    feats: [
      'Dashboard financeiro completo',
      'Transações ilimitadas',
      'Até 3 contas bancárias',
      'Ciclos de investimento (2 ativos)',
      'Capital Advisor — 50 consultas/mês',
      'Sincronização em tempo real',
    ]
  },
  {
    name: 'Adulto',
    price: '46',
    desc: 'Controle avançado com IA ilimitada, múltiplas contas e relatórios completos.',
    cta: 'Começar com o Adulto',
    ctaClass: 'cc-cta-filled',
    featured: true,
    badge: 'Mais popular',
    feats: [
      'Tudo do plano Jovem',
      'Contas bancárias ilimitadas',
      'Ciclos de investimento ilimitados',
      'Capital Advisor — consultas ilimitadas',
      'Relatórios exportáveis PDF/CSV',
      'Análise comparativa de períodos',
      'Suporte prioritário',
    ]
  },
];

const MARQUEE_ITEMS = [
  'Dashboard em Tempo Real', 'Capital Advisor IA', 'Ciclos de Investimento',
  'Contas Bancárias', 'Análise de Fluxo', 'Transações Inteligentes',
  'Relatórios Automáticos', 'Segurança Firebase',
];

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function HomePage() {
  // Injeta CSS global
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-cc-home', '1');
    styleEl.textContent = GLOBAL_CSS;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  // Observer para fade-in ao scroll
  useEffect(() => {
    const els = document.querySelectorAll('.cc-fadein');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="cc-home">
      
      <nav className="cc-nav">
        {/* Nova Logo em Imagem */}
        <Link to="/" className="cc-nav-logo">
          <img src={logoImg} alt="CapitalCycle Logo" className="cc-nav-logo-img" />
        </Link>
        
        <div className="cc-nav-links">
          <a href="#recursos">Recursos</a>
          <a href="#advisor">Capital Advisor</a>
          <a href="#planos">Planos</a>
        </div>
        
        {/* Novos Botões (Login e Cadastro) */}
        <div className="cc-nav-actions">
          <Link to="/login" className="cc-btn-ghost">
            Login
          </Link>
          <Link to="/cadastro" className="cc-btn-premium">
            Cadastro <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="cc-hero">
        {/* Esquerda */}
        <div>
          <h1 className="cc-hero-headline">
            SUA<br />
            JORNADA<br />
            <span>FINANCEIRA</span>
          </h1>
          <p className="cc-hero-sub">
            Da primeira transação ao ciclo de investimento completo — controle total do seu capital com inteligência artificial integrada.
          </p>
          <div className="cc-hero-ctas">
            <a href="#planos" className="cc-btn-primary">
              Começar agora 
            </a>
            <Link to="/login" className="cc-btn-ghost">
              Já tenho conta
            </Link>
          </div>
          <div className="cc-bars">
            <ProgressBar label="Precisão do Capital Advisor" pct={95} />
            <ProgressBar label="Satisfação dos usuários" pct={88} color="emerald" />
          </div>
        </div>

        {/* Direita */}
        <div style={{ position: 'relative' }}>
          <FloatingCards />
          <div className="cc-stats">
            <div className="cc-stat-item">
              <div className="cc-stat-micro"><span className="cc-stat-dot" /> Fluxo Positivo</div>
              <div className="cc-stat-num">R$ 18k</div>
            </div>
            <div className="cc-stat-item">
              <div className="cc-stat-micro"><span className="cc-stat-dot em" /> Ciclos Ativos</div>
              <div className="cc-stat-num">4+</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="cc-marquee-wrap">
        <div className="cc-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="cc-marquee-item">
              <span>✦</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── GESTÃO SECTION ── */}
      <div id="recursos" className="cc-section-big">
        <div className="cc-gestao-grid cc-fadein">
          <div>
            <div className="cc-section-eyebrow">Recursos</div>
            <div className="cc-big-text">
              GESTÃO<br />QUE EVOLUI<br />COM VOCÊ
            </div>
          </div>
          <div className="cc-gestao-right">
            <p className="cc-gestao-desc">
              Ferramentas profissionais para controle total do seu dinheiro — do lançamento individual à inteligência financeira por IA.
            </p>
            <a href="#planos" className="cc-btn-primary">
              Ver planos <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="cc-feat-grid cc-fadein">
          {FEATURES.map((f, i) => (
            <div key={i} className="cc-feat-card">
              <div className="cc-feat-icon">{f.icon}</div>
              <div className="cc-feat-title">{f.title}</div>
              <div className="cc-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRICING ── */}
      <div id="planos" className="cc-pricing-wrap">
        <div className="cc-fadein" style={{ marginBottom: '4rem' }}>
          <div className="cc-section-eyebrow">Planos</div>
          <div className="cc-big-text">
            ESCOLHA<br />SEU PLANO
          </div>
        </div>

        <div className="cc-plans-grid cc-fadein">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`cc-plan${plan.featured ? ' featured' : ''}`}>
              <div className="cc-plan-tag">
                {plan.name}
                {plan.badge && <span className="cc-plan-tag-badge">{plan.badge}</span>}
              </div>
              <div className="cc-plan-price">
                <span className="cc-plan-currency">R$</span>
                <span className="cc-plan-val">{plan.price}</span>
                <span className="cc-plan-period">/mês</span>
              </div>
              <p className="cc-plan-desc">{plan.desc}</p>
              <a href="#" className={`cc-plan-cta ${plan.ctaClass}`}>
                {plan.cta}
              </a>
              <hr className="cc-plan-divider" />
              <ul className="cc-plan-feats">
                {plan.feats.map((feat, i) => (
                  <li key={i}>
                    <span className="cc-feat-check">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)' }}>
          Pagamento seguro · Cancele quando quiser · Sem fidelidade
        </p>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <footer className="cc-footer">
          
          <span className="cc-copy">© 2026 CapitalCycle  </span>
          <div className="cc-footer-links">
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
