import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import ProductStage from './product/ProductStage';
import useHeroScrollStory from './useHeroScrollStory';

/* ==========================================================================
   LandingHero — Hero Scroll Storyboard, F1 → F5

   Alvo 1440 × 900. Ao carregar `/`, a tela abre em F1 ("HERO INICIAL");
   a rolagem conduz a mesma composição até F5 ("DENTRO DO CAPITAL
   CYCLE"). A narrativa em si está em `useHeroScrollStory` — aqui só mora
   a estrutura, montada uma única vez.

   Com `prefers-reduced-motion: reduce` nenhuma timeline é criada e a
   Hero fica no F1 estático, que é exatamente o que o CSS já descreve.

   A ordem do DOM difere da prancha num ponto, de propósito. No Designer o
   glow é o primeiro filho (fundo) e a Dashboard é o último (topo). Aqui o
   palco inteiro — glow + Dashboard — vem antes das camadas de texto, porque
   o glow PRECISA ficar sob o texto: ele é um radial violeta de alfa 0,45 no
   centro, e o centro cai justamente sobre o subtítulo e os CTAs. Pintá-lo
   por cima lavaria os dois de roxo.

   Em F1 isso é pixel-idêntico à prancha: a Dashboard começa em y=522 e o
   texto termina em y≈445, então Dashboard e texto não se cruzam, e a ordem
   relativa entre eles não tem efeito visual. Quando a H2 subir a Dashboard
   por cima do texto, basta elevar o z-index do palco.
   ========================================================================== */

const LINKS_NAV = [
  { rotulo: 'Início', href: '#inicio', ativo: true },
  { rotulo: 'Recursos', href: '#recursos' },
  { rotulo: 'Capital Advisor', href: '#capital-advisor' },
  { rotulo: 'Planos', href: '#planos' },
];

export default function LandingHero() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  // A narrativa F1 → F5 vive fora do React: o GSAP escreve direto nestes
  // nós. O componente só monta a estrutura — e monta uma única vez.
  useHeroScrollStory(rootRef);

  return (
    <section className="cc-hero" id="inicio" ref={rootRef}>
      <ProductStage ref={stageRef} />

      <header className="cc-hero__nav">
        <div className="cc-hero__logo">
          CAPITAL
          <br />
          CYCLE
        </div>

        <nav className="cc-hero__menu">
          {LINKS_NAV.map(({ rotulo, href, ativo }) => (
            <a
              key={rotulo}
              href={href}
              className={`cc-hero__menu-link${ativo ? ' cc-hero__menu-link--ativo' : ''}`}
            >
              {rotulo}
            </a>
          ))}
        </nav>

        <Link className="cc-hero__entrar" to="/login" state={{ from: 'home' }}>
          Entrar
        </Link>
      </header>

      <div className="cc-hero__headline-wrap">
        <h1 className="cc-hero__headline">
          Sua jornada
          <br />
          financeira.
        </h1>
      </div>

      <div className="cc-hero__sub-wrap">
        <p className="cc-hero__sub">
          Da primeira transação ao ciclo de investimento completo — controle total
          do seu capital com inteligência artificial integrada.
        </p>
      </div>

      <div className="cc-hero__ctas">
        <a className="cc-hero__cta cc-hero__cta--primario" href="/cadastro">
          Começar agora
        </a>
        <Link
          className="cc-hero__cta cc-hero__cta--secundario"
          to="/login"
          state={{ from: 'home' }}
        >
          Já tenho conta
        </Link>
      </div>
    </section>
  );
}
