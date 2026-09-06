import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftRight, BarChart3, Clock, ShieldCheck } from 'lucide-react';

import logoClara from '../assets/logo-topo.png';
import logoEscura from '../assets/logo-black.png';

import HeroSection from '../components/home/hero/HeroSection';
import ProdutoSection from '../components/home/ProdutoSection';
import CapitalAdvisorSection from '../components/home/CapitalAdvisorSection';
import PlanosSection from '../components/home/PlanosSection';

/* =========================================================
   HOME — Capital Cycle

   Só o hero tem pista de rolagem própria (o vídeo sincronizado
   ao scroll, em components/home/hero). Da seção de produto em
   diante as seções rolam normalmente, uma depois da outra, com
   âncora nativa e scroll-spy — não existe mais nenhum crossfade
   entre camadas empilhadas na mesma viewport.

   A navbar é entregue ao hero e vive dentro do pin dele, flutuando
   sobre o vídeo. Por isso usa o tema escuro: o fundo ali é o clipe
   quase preto, não o #f4f5f7 do resto da página.
   ========================================================= */

const PAGE_CSS = `
  .cch {
    --cch-ink: #131316;
    --cch-body: #3c3c40;
    --cch-muted: #6d6d72;
    --cch-purple-rec: #5358ee;

    position: relative;
    width: 100%;
    isolation: isolate;
    background-color: #f4f5f7;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: var(--cch-ink);
  }
  .cch *, .cch *::before, .cch *::after { box-sizing: border-box; }

  /* A navbar é fixa: sem isto a âncora pousa a seção debaixo dela. */
  .cch [id], .cch-feats { scroll-margin-top: 6rem; }

  /* Antialiasing suavizado afina o traço; em texto escuro sobre
     fundo claro isso deixa a leitura anêmica. Fica só no escuro. */
  .cch { -webkit-font-smoothing: auto; }
  .cch-nav--dark, .cch-feat-card--dark { -webkit-font-smoothing: antialiased; }

  .cch ::selection { background: rgba(83, 88, 238, 0.22); color: var(--cch-ink); }

  /* ---------- Navbar ----------
     Vive dentro do pin do hero, flutuando sobre o vídeo. A variante
     clara continua aqui porque as regras base são compartilhadas;
     na prática só a escura é usada hoje. */
  /* Fixa na página inteira, não presa ao hero. Ela morava dentro do
     pin do hero e sumia junto com ele — o visitante ficava sem
     navegação nenhuma da seção de produto até os Planos. */
  .cch-nav-wrap {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    transition: background 0.35s ease, box-shadow 0.35s ease,
                backdrop-filter 0.35s ease;
  }
  /* .cch pinta #f4f5f7; sobre o vídeo isso seria uma faixa clara.
     Dois nomes de classe para ganhar de .cch por especificidade,
     não por ordem no arquivo. */
  .cch.cch-nav-wrap { background: transparent; }

  /* Sobre as seções claras ela precisa de um chão próprio, senão o
     conteúdo passa por baixo e briga com os links. */
  .cch.cch-nav-wrap.is-clara {
    background: rgba(244, 245, 247, 0.78);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
    backdrop-filter: saturate(180%) blur(14px);
    box-shadow: 0 1px 0 rgba(15, 18, 22, 0.06);
  }

  .cch-nav {
    position: relative; z-index: 20;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    padding: 1.9rem 3.2rem 0;
    max-width: 1980px; margin: 0 auto;
  }

  .cch-logo {
    flex: none;
    display: inline-flex; align-items: center;
    height: 2.5rem;
  }
  .cch-logo img {
    height: 2.1rem; width: auto; display: block;
    object-fit: contain;
  }

  .cch-nav-right {
    display: flex; align-items: center; gap: 0.9rem;
    margin-left: auto;
  }

  .cch-menu {
    display: flex; align-items: center; gap: 0.3rem;
    padding: 0.45rem;
    border-radius: 14px;
    background: rgba(15, 18, 22, 0.05);
  }
  .cch-menu a {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.5rem;
    border: 0; background: transparent; cursor: pointer;
    font-family: inherit; font-size: 0.93rem; font-weight: 700;
    color: var(--cch-body); text-decoration: none;
    border-radius: 9px; white-space: nowrap;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .cch-menu a:hover { background: rgba(15, 18, 22, 0.07); color: var(--cch-ink); }
  .cch-menu .is-active { background: #0f1216; color: #fff; }
  .cch-menu .is-active:hover { background: #0f1216; color: #fff; }

  .cch-login {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.82rem 1.9rem;
    background: #0f1216; color: #fff;
    font-family: inherit; font-size: 0.93rem; font-weight: 700;
    border: 0; border-radius: 11px; cursor: pointer; text-decoration: none;
    white-space: nowrap;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .cch-login:hover { background: #000; transform: translateY(-1px); }
  .cch-login:active { transform: translateY(0) scale(0.985); }

  /* ---------- Navbar sobre o hero escuro ----------
     Botão preto sobre vídeo quase preto simplesmente desaparece:
     no escuro ele inverte. */
  .cch-nav--dark .cch-menu {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.10);
  }
  .cch-nav--dark .cch-menu a { color: rgba(255, 255, 255, 0.78); }
  .cch-nav--dark .cch-menu a:hover {
    background: rgba(255, 255, 255, 0.14); color: #fff;
  }
  .cch-nav--dark .cch-menu .is-active { background: #fff; color: #0f1216; }
  .cch-nav--dark .cch-menu .is-active:hover { background: #fff; color: #0f1216; }
  .cch-nav--dark .cch-login { background: #fff; color: #0f1216; }
  /* Um halo branco em volta de um botão branco não existe em nenhuma
     das referências; o que elas fazem é clarear de leve. */
  .cch-nav--dark .cch-login:hover { background: rgba(255, 255, 255, 0.88); }

  /* ---------- Recursos ---------- */
  .cch-recursos {
    position: relative;
    background: #f4f5f7;
  }
  .cch-recursos-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
  }
  .cch-rec-inner {
    position: relative; z-index: 10;
    max-width: 1980px; margin: 0 auto;
    min-height: calc(100vh - 6.5rem);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
    padding: 7rem 3.2rem 3.2rem;

    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1);
  }
  .cch-rec-inner.is-in { opacity: 1; transform: translateY(0); }

  .cch-rec-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--cch-purple-rec);
  }
  .cch-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--cch-purple-rec); flex: none;
  }
  .cch-rec-title {
    margin: 1.4rem 0 0;
    max-width: 56rem;
    font-size: clamp(2.8rem, 5.4vw, 7.4rem);
    line-height: 1.04;
    font-weight: 900;
    /* Zero, não negativo: apertar caixa alta fecha os contraformas. */
    letter-spacing: 0;
    text-transform: uppercase;
    text-wrap: balance;
    color: var(--cch-ink);
  }
  .cch-rec-title span { display: block; }
  .cch-rec-title .cch-accent-rec { color: var(--cch-purple-rec); }
  .cch-rec-lead {
    margin: 2rem 0 0;
    max-width: 34rem;
    font-size: 1.1rem; line-height: 1.52; font-weight: 400;
    text-wrap: pretty;
    color: var(--cch-body);
  }
  .cch-rec-cta {
    display: inline-flex; align-items: center; gap: 0.6rem;
    margin-top: 2.3rem;
    padding: 1.05rem 1.9rem 1.05rem 2.3rem;
    background: #0f1216; color: #fff;
    font-family: inherit; font-size: 0.98rem; font-weight: 700;
    border-radius: 999px; text-decoration: none; white-space: nowrap;
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                background 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cch-rec-cta:hover {
    background: #000; transform: translateY(-2px);
    transition-duration: 0.18s;
  }
  .cch-rec-cta:active { transform: translateY(0) scale(0.985); }
  .cch-rec-arrow {
    width: 18px; height: 18px; flex: none;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cch-rec-cta:hover .cch-rec-arrow { transform: translateX(4px); }

  /* ---------- Foco visível ----------
     Não havia nenhum estilo de foco na landing: quem navega por
     teclado dependia do anel padrão do navegador, que some sobre
     fundo escuro e não combina com nada. Um só sistema, na cor da
     marca no claro e branco no escuro, sempre com afastamento para
     não encostar na borda do próprio botão. */
  .cch a:focus-visible,
  .cch button:focus-visible {
    outline: 2px solid var(--cch-purple-rec);
    outline-offset: 3px;
    border-radius: 6px;
  }
  .cch-nav--dark a:focus-visible,
  .cch-nav--dark button:focus-visible {
    outline-color: #ffffff;
  }
  .cch-feat-card:focus-within {
    outline: 2px solid var(--cch-purple-rec);
    outline-offset: 3px;
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 1280px) {
    .cch-nav { padding: 1.6rem 1.75rem 0; }
    .cch-menu a { padding: 0.55rem 1rem; font-size: 0.88rem; }
  }
  @media (max-width: 980px) {
    .cch-menu { display: none; }
    .cch-rec-inner { min-height: 0; padding: 5rem 1.5rem 3rem; }
  }
  @media (max-width: 560px) {
    .cch-nav { padding: 1.1rem 1.25rem 0; }
    .cch-login { padding: 0.7rem 1.3rem; font-size: 0.88rem; }
    .cch-rec-cta { padding: 0.9rem 1.6rem 0.9rem 2rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch *, .cch *::before, .cch *::after { transition: none !important; }
    .cch-rec-inner { opacity: 1 !important; transform: none !important; }
  }

  /* ---------- Recursos em destaque (cards) ---------- */
  .cch-feats {
    position: relative;
    /* Alterna com o #f4f5f7 das vizinhas: cinco seções chapadas
       iguais em sequência apagam o ritmo vertical da página. */
    background: #ffffff;
    padding: clamp(5rem, 9vw, 11rem) 3.2rem;
  }
  .cch-feats-inner {
    max-width: 64rem; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    /* Antes o gutter (18px) era menor que o padding interno (30px)
       e os cards colavam uns nos outros. */
    gap: 1.75rem;
  }
  .cch-feat-card {
    background: #f7f7f9;
    border-radius: 1.25rem;
    padding: 2rem;
    /* Chapado, com fio de borda. A 5% de alpha a sombra anterior era
       fraca demais para ler como elevação e presente demais para ler
       como plano — o pior dos dois. A elevação fica reservada para o
       mockup do dashboard, que é o único elemento que flutua. */
    border: 1px solid rgba(19, 19, 22, 0.07);
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1),
                transform 0.55s cubic-bezier(0.16,1,0.3,1),
                border-color 0.3s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  /* Um card com sombra que não responde ao cursor lê como imagem. */
  .cch-feat-card.is-in:hover {
    border-color: rgba(83, 88, 238, 0.28);
    box-shadow: 0 2px 4px rgba(19,19,22,0.04), 0 12px 28px rgba(19,19,22,0.07);
  }
  .cch-feat-card.is-in {
    opacity: 1;
    transform: translateY(0);
  }
  /* Superfície escura com luz encenada: brilho radial atrás do
     conteúdo e um fio de aresta no topo. Um fill preto chapado é o
     que mais denuncia superfície não trabalhada. */
  .cch-feat-card--dark {
    background:
      radial-gradient(120% 90% at 30% -10%, rgba(83,88,238,0.16), transparent 62%),
      linear-gradient(180deg, #171b22 0%, #0f1216 62%);
    border-color: rgba(255, 255, 255, 0.07);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
  }
  .cch-feat-card--dark.is-in:hover {
    border-color: rgba(83, 88, 238, 0.45);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 34px rgba(0,0,0,0.22);
  }
  .cch-feat-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 2.75rem; height: 2.75rem;
    border-radius: 0.8rem;
    background: rgba(83,88,238,0.12);
    color: #5358ee;
    margin-bottom: 1.25rem;
  }
  .cch-feat-icon svg { width: 1.15rem; height: 1.15rem; }
  .cch-feat-card--dark .cch-feat-icon {
    background: #5358ee;
    color: #fff;
  }
  .cch-feat-title {
    margin: 0 0 0.55rem;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #131316;
  }
  .cch-feat-card--dark .cch-feat-title { color: #fff; }
  .cch-feat-desc {
    margin: 0;
    max-width: 24rem;
    font-size: 0.88rem;
    line-height: 1.5;
    color: #6d6d72;
  }
  .cch-feat-card--dark .cch-feat-desc { color: rgba(255,255,255,0.6); }

  @media (max-width: 1280px) {
    .cch-feats { padding: 4.5rem 1.75rem 5rem; }
  }
  @media (max-width: 900px) {
    .cch-feats-inner { grid-template-columns: 1fr; gap: 1rem; }
    .cch-feat-card { padding: 1.75rem; }
    .cch-feats { padding-left: 1.5rem; padding-right: 1.5rem; }
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

/* ---------- Navegação ---------- */

const NAV_LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'capital-advisor', label: 'Capital Advisor' },
  { id: 'planos', label: 'Planos' },
];

const NAV_IDS = NAV_LINKS.map((link) => link.id);

function MainNav({ active = 'inicio', onNavigate, onDark = false }) {
  return (
    <header className={`cch-nav${onDark ? ' cch-nav--dark' : ''}`}>
      <a className="cch-logo" href="#inicio" onClick={(e) => { e.preventDefault(); onNavigate('inicio'); }}>
        <img src={onDark ? logoClara : logoEscura} alt="Capital Cycle" />
      </a>

      <div className="cch-nav-right">
        <nav className="cch-menu" aria-label="Navegação principal">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'is-active' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* `from: 'home'` liga a transição de encolhimento do Login.
            Sem esse state (URL digitada direto) a página abre estática. */}
        <Link className="cch-login" to="/login" state={{ from: 'home' }}>Entrar</Link>
      </div>
    </header>
  );
}

/* ---------- Item de menu ativo ----------
   Com as seções rolando normalmente, basta olhar qual delas já
   cruzou a linha de leitura (35% da viewport). A versão anterior
   deduzia isso do progresso do scroll pinado, que não existe mais. */

function useSecaoAtiva(ids) {
  const [ativa, setAtiva] = useState(ids[0]);

  useEffect(() => {
    let frame = null;

    const medir = () => {
      frame = null;
      const linha = window.scrollY + window.innerHeight * 0.35;
      let atual = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= linha) atual = id;
      });
      setAtiva(atual);
    };

    const aoRolar = () => {
      if (frame === null) frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return ativa;
}

/* ---------- Tema da navbar ----------
   Escura enquanto o hero (quase preto) ainda cobre a faixa do topo;
   clara da seção de produto em diante. O limiar é a altura da
   própria navbar: o tema vira exatamente quando ela deixa de ter
   vídeo atrás. */

const ALTURA_NAV = 84;

function useNavEscura() {
  const [escura, setEscura] = useState(true);

  useEffect(() => {
    let frame = null;

    const medir = () => {
      frame = null;
      const hero = document.getElementById('inicio');
      if (!hero) return;
      setEscura(hero.getBoundingClientRect().bottom > ALTURA_NAV);
    };

    const aoRolar = () => {
      if (frame === null) frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return escura;
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

/* Mesma curva padronizada no resto do projeto */
const EASE = [0.16, 1, 0.3, 1];

/* ---------- Componente ---------- */

export default function HomePage() {
  const [featsRef, featsInView] = useRevealOnScroll();
  const [recRef, recInView] = useRevealOnScroll(0.12);
  const activeNav = useSecaoAtiva(NAV_IDS);
  const navEscura = useNavEscura();

  const scrollToSection = useCallback((id) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior });
  }, []);

  // Chegando pela animação de voltar do Login, a tela já está coberta de
  // preto: aqui ela é revelada com um fade, em vez de a Home aparecer
  // num corte seco.
  const location = useLocation();
  const [revealing, setRevealing] = useState(() => location.state?.from === 'login');

  // A Home precisa abrir no topo — é o que garante que o número do hero
  // seja visto parado antes de assentar, e não já no meio da rolagem.
  useEffect(() => {
    const anterior = window.history.scrollRestoration;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = anterior;
      }
    };
  }, []);

  return (
    <>
      <style>{PAGE_CSS}</style>

      {revealing && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60] bg-[#05070e]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onAnimationComplete={() => setRevealing(false)}
          aria-hidden="true"
        />
      )}

      <div className={`cch cch-nav-wrap${navEscura ? '' : ' is-clara'}`}>
        <MainNav active={activeNav} onNavigate={scrollToSection} onDark={navEscura} />
      </div>

      <div className="cch">
        <HeroSection />

        <ProdutoSection />

        {/* Sem atmosfera decorativa: as manchas de gradiente índigo e
            os números flutuantes de marca d'água saíram daqui e das
            outras seções. Eram exatamente os dois clichês que o
            projeto tinha decidido não usar, e o fundo chapado é o que
            as referências mais contidas fazem. */}
        <section className="cch-recursos" id="recursos">
          <div className={`cch-rec-inner${recInView ? ' is-in' : ''}`} ref={recRef}>
            <span className="cch-rec-eyebrow">
              <span className="cch-dot" aria-hidden="true" />
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

            <a
              className="cch-rec-cta"
              href="#planos"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('planos');
              }}
            >
              Ver planos
              <ArrowRightIcon />
            </a>
          </div>
        </section>
      </div>

      <section className="cch-feats" ref={featsRef} aria-label="Recursos em destaque">
        <div className="cch-feats-inner">
          {FEATURE_CARDS.map(({ title, desc, Icon, dark }, i) => (
            <article
              key={title}
              className={`cch-feat-card${dark ? ' cch-feat-card--dark' : ''}${featsInView ? ' is-in' : ''}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="cch-feat-icon" aria-hidden="true">
                <Icon size={19} strokeWidth={2.2} />
              </span>
              <h3 className="cch-feat-title">{title}</h3>
              <p className="cch-feat-desc">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <CapitalAdvisorSection />

      <PlanosSection />
    </>
  );
}
