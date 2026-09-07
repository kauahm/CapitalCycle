import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import logoClara from '../assets/logo-topo.png';
import logoEscura from '../assets/logo-black.png';

import HeroSection from '../components/home/hero/HeroSection';
import ProdutoSection from '../components/home/ProdutoSection';
import CapitalAdvisorSection from '../components/home/CapitalAdvisorSection';
import PassagemSection from '../components/home/PassagemSection';
import PlanosSection from '../components/home/PlanosSection';
import RetornoSection from '../components/home/RetornoSection';

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

    /* ---------- Faixa de conteúdo ----------
       Prumada mestra da página: navbar, texto do Hero e ponta
       esquerda do circuito nascem todos em x = 0 desta faixa.
       É a coincidência dessas bordas que faz a página ler como
       sistema, e por isso a medida vive aqui e não em cada seção. */
    --cc-goteira: 20px;
    --cc-faixa: min(1120px, 100% - var(--cc-goteira) * 2);

    position: relative;
    width: 100%;
    isolation: isolate;
    background-color: #f4f5f7;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: var(--cch-ink);
  }
  .cch *, .cch *::before, .cch *::after { box-sizing: border-box; }

  /* A navbar é fixa: sem isto a âncora pousa a seção debaixo dela. */
  .cch [id] { scroll-margin-top: 6rem; }

  /* Antialiasing suavizado afina o traço; em texto escuro sobre
     fundo claro isso deixa a leitura anêmica. Fica só no escuro. */
  .cch { -webkit-font-smoothing: auto; }
  .cch-nav--dark { -webkit-font-smoothing: antialiased; }

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
  /* .cch pinta #f4f5f7; sobre uma seção escura isso seria uma faixa
     clara atravessando o topo. Dois nomes de classe para ganhar de
     .cch por especificidade, não por ordem no arquivo. */
  .cch.cch-nav-wrap { background: transparent; }

  /* Sobre as seções claras ela precisa de um chão próprio, senão o
     conteúdo passa por baixo e briga com os links. */
  .cch.cch-nav-wrap.is-clara {
    background: rgba(244, 245, 247, 0.78);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
    backdrop-filter: saturate(180%) blur(14px);
    box-shadow: 0 1px 0 rgba(15, 18, 22, 0.06);
  }

  /* A navbar ocupa a faixa, não a viewport: o logo cai exatamente
     na mesma prumada do texto do Hero e da ponta esquerda do
     circuito. Altura fixa de 72px, com centralização vertical
     real — antes o padding inferior era zero e a barra ficava
     pendurada. */
  .cch-nav {
    position: relative; z-index: 20;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    height: 72px;
    width: var(--cc-faixa);
    margin-inline: auto;
  }

  /* 32px e não os 20px da especificação: a marca é empilhada em
     duas linhas ("CAPITAL / CYCLE") dentro de uma elipse, então a
     altura útil de cada linha é ~28% do arquivo. A 20px cada linha
     ficava com 5px de altura de caixa.

     ---------- Alinhamento óptico ----------
     Os dois PNGs têm 703x355 e a tinta começa em x=95, y=55, com
     22px de folga embaixo. Encostar a CAIXA do arquivo na prumada
     deixava a marca 8,6px recuada em relação ao texto do Hero e à
     ponta do horizonte — a prumada mestra existia no código e não
     na tela.

     As compensações são frações da altura renderizada, não pixels
     soltos: 95/355 na horizontal e (55-22)/2/355 na vertical. Se a
     altura mudar, o alinhamento acompanha. A marca não foi
     redesenhada nem redimensionada. */
  .cch-logo {
    --cch-logo-alt: 32px;
    flex: none;
    display: inline-flex; align-items: center;
    overflow: visible;
  }
  .cch-logo img {
    height: var(--cch-logo-alt); width: auto; display: block;
    object-fit: contain;
    margin-left: calc(var(--cch-logo-alt) * -0.2676);
    margin-top: calc(var(--cch-logo-alt) * -0.0465);
  }

  .cch-nav-right {
    display: flex; align-items: center; gap: 24px;
    margin-left: auto;
  }

  /* Sem pílula de fundo e sem chip sólido no item ativo: eram dois
     retângulos escuros disputando o canto direito com o botão de
     entrar. O ativo agora é marcado por um fio de 1px na cor e na
     espessura do circuito — o indicador de navegação passa a ser
     um segmento do mesmo instrumento. */
  .cch-menu {
    display: flex; align-items: center; gap: 0.25rem;
    padding: 0;
    background: transparent;
  }
  .cch-menu a {
    position: relative;
    display: inline-flex; align-items: center;
    padding: 0.4rem 0.75rem;
    border: 0; background: transparent; cursor: pointer;
    font-family: inherit; font-size: 14px; font-weight: 500;
    color: var(--cch-body); text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s ease;
  }
  .cch-menu a:hover { color: var(--cch-ink); }
  .cch-menu .is-active { color: var(--cch-ink); }
  .cch-menu .is-active::after {
    content: '';
    position: absolute; left: 0.75rem; right: 0.75rem; bottom: 0;
    height: 1px; background: var(--cch-muted);
  }

  /* Link de texto, não botão. O índigo é reservado para o CTA
     primário do Hero: um único elemento saturado por viewport. */
  .cch-login {
    display: inline-flex; align-items: center;
    padding: 0.4rem 0;
    background: transparent; color: var(--cch-ink);
    font-family: inherit; font-size: 14px; font-weight: 600;
    border: 0; border-radius: 0; cursor: pointer; text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s ease;
  }
  .cch-login:hover { color: #000; }

  /* ---------- Navbar sobre seção escura ----------
     Com o Hero claro, a variante escura serve apenas à seção de
     Produto, que segue quase preta até ser redesenhada. */
  .cch-nav--dark .cch-menu a { color: rgba(255, 255, 255, 0.72); }
  .cch-nav--dark .cch-menu a:hover { color: #fff; }
  .cch-nav--dark .cch-menu .is-active { color: #fff; }
  .cch-nav--dark .cch-menu .is-active::after { background: rgba(255, 255, 255, 0.55); }
  .cch-nav--dark .cch-login { color: #fff; }
  .cch-nav--dark .cch-login:hover { color: rgba(255, 255, 255, 0.78); }


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

  /* ---------- Responsivo ----------
     A goteira é o único valor responsivo da faixa: a partir de
     768px ela abre de 20px para 48px, e a faixa continua limitada
     a 1120px. A navbar acompanha sem regra própria, porque a
     largura dela É a faixa. */
  @media (min-width: 768px) {
    .cch { --cc-goteira: 48px; }
  }
  @media (max-width: 1280px) {
    .cch-menu a { padding: 0.4rem 0.6rem; }
  }
  @media (max-width: 980px) {
    .cch-menu { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cch *, .cch *::before, .cch *::after { transition: none !important; }
  }

`;



/* ---------- Navegação ---------- */

const NAV_LINKS = [
  { id: 'inicio', label: 'Início' },
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
   Sobre o hero a barra fica transparente: o fundo dela já é o
   #f4f5f7 da página, e um chão translúcido ali seria uma faixa
   visível sem função. Assim que o hero sai de baixo dela, a barra
   ganha esse chão para o conteúdo não passar por trás dos links.

   A variante escura deixou de ser acionada quando o Produto passou
   a ser claro. O CSS dela continua no arquivo porque as seções
   seguintes ainda não foram redesenhadas e podem voltar a precisar
   dela; o gatilho é que não existe mais.

   O limiar continua sendo a altura da própria barra: o tema vira
   exatamente quando o hero deixa de estar atrás dela. */

const ALTURA_NAV = 72;

function useNavTema() {
  const [tema, setTema] = useState('transparente');

  useEffect(() => {
    let frame = null;

    const cobreABarra = (id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top <= ALTURA_NAV && r.bottom > ALTURA_NAV;
    };

    const medir = () => {
      frame = null;
      setTema(cobreABarra('inicio') ? 'transparente' : 'clara');
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

  return tema;
}

/* Mesma curva padronizada no resto do projeto */
const EASE = [0.16, 1, 0.3, 1];

/* ---------- Componente ---------- */

export default function HomePage() {
  const activeNav = useSecaoAtiva(NAV_IDS);
  const navTema = useNavTema();

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

      <div className={`cch cch-nav-wrap${navTema === 'clara' ? ' is-clara' : ''}`}>
        <MainNav
          active={activeNav}
          onNavigate={scrollToSection}
          onDark={navTema === 'escura'}
        />
      </div>

      <div className="cch">
        <HeroSection />

        <ProdutoSection />
      </div>

      <CapitalAdvisorSection />

      {/* Estações 05 e 06 do circuito. Não é uma seção de conteúdo:
          é o trecho do eixo entre DECIDIR e os Planos. */}
      <PassagemSection />

      <PlanosSection />

      {/* Fechamento do circuito: a linha desce em E6, atravessa a
          faixa e sobe em E0 — a mesma coluna em que ela começou a
          descer no Hero. Não é footer e não tem conteúdo. */}
      <RetornoSection />
    </>
  );
}
