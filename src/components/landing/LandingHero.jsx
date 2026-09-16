import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import ProductStage from './product/ProductStage';
import RecursosPanel from './recursos/RecursosPanel';
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

/* A variante clara marca "Recursos" como item ativo, e não "Início" — é
   onde a narrativa chega no fim do segundo ato. */
const LINKS_NAV_CLARA = LINKS_NAV.map((l) => ({
  ...l,
  ativo: l.rotulo === 'Recursos',
}));

export default function LandingHero() {
  const storyRef = useRef(null);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const recursosRef = useRef(null);
  // Exposto desde já para a fase seguinte animar este mesmo trilho.
  const trackRef = useRef(null);

  // A narrativa vive fora do React: o GSAP escreve direto nestes nós. O
  // componente só monta a estrutura — e monta uma única vez.
  useHeroScrollStory(storyRef, rootRef);

  /* Sem movimento, nenhuma timeline roda — e aí o painel de Recursos, que
     descansa em 1425px dentro de uma Hero de 900px com `overflow: hidden`,
     ficaria inalcançável. Então nesse modo ele sai de dentro da Hero e vira
     uma seção comum logo abaixo dela: a mesma composição, sem narrativa,
     mas legível e acessível. */
  const semMovimento = useReducedMotion();

  const painel = (
    <RecursosPanel
      ref={recursosRef}
      trackRef={trackRef}
      estatico={semMovimento}
    />
  );

  return (
    <div className="cc-hero-story" ref={storyRef}>
    <section className="cc-hero" id="inicio" ref={rootRef}>
      {/* Plano inferior do bloco rígido. Declarado antes do palco, como na
          prancha: Recursos vem por baixo, a Dashboard por cima. Em repouso
          ele fica fora do fold e só entra quando o segundo ato começa. */}
      {!semMovimento && painel}

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

      {/* Navbar clara. É um nó à parte da escura, não a mesma trocando de
          cor: a prancha desenha as duas com pesos, cores e botão Entrar
          diferentes. Nasce em opacity 0 e só entra entre D4 e D5, quando a
          Dashboard já saiu quase toda. */}
      <header className="cc-hero__nav cc-hero__nav-clara" aria-hidden="true">
        <div className="cc-hero__logo">
          CAPITAL
          <br />
          CYCLE
        </div>

        <nav className="cc-hero__menu">
          {LINKS_NAV_CLARA.map(({ rotulo, href, ativo }) => (
            <a
              key={rotulo}
              href={href}
              tabIndex={-1}
              className={`cc-hero__menu-link${ativo ? ' cc-hero__menu-link--ativo' : ''}`}
            >
              {rotulo}
            </a>
          ))}
        </nav>

        <Link className="cc-hero__entrar" to="/login" state={{ from: 'home' }} tabIndex={-1}>
          Entrar
        </Link>
      </header>

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

    {semMovimento && painel}
    </div>
  );
}
