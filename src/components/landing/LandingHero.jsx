import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import ProductStage from './product/ProductStage';
import RecursosPanel from './recursos/RecursosPanel';
import useHeroScrollStory from './useHeroScrollStory';
import { scrollDaSecaoRecursos } from './landingRunways';

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

/* Fronteira entre a narrativa presa e o fluxo vertical.

   768px porque é onde a composição do Designer deixa de caber como
   narrativa: abaixo disso a Dashboard em F5 teria menos de metade da
   largura para a qual foi desenhada, e o trilho horizontal disputaria o
   gesto do usuário com a rolagem da página. O mesmo valor é usado no
   `matchMedia` do GSAP, para que os dois lados concordem. */
const CONSULTA_FLUXO = '(max-width: 767px)';

function useFluxoVertical() {
  const [ehFluxo, setEhFluxo] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(CONSULTA_FLUXO).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(CONSULTA_FLUXO);
    const sincroniza = () => setEhFluxo(mq.matches);
    sincroniza();
    mq.addEventListener('change', sincroniza);
    return () => mq.removeEventListener('change', sincroniza);
  }, []);
  return ehFluxo;
}

export default function LandingHero() {
  const storyRef = useRef(null);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const recursosRef = useRef(null);
  // Exposto desde já para a fase seguinte animar este mesmo trilho.
  const trackRef = useRef(null);

  /* Sem movimento, nenhuma timeline roda — e aí o painel de Recursos, que
     descansa em 1425px dentro de uma Hero de 900px com `overflow: hidden`,
     ficaria inalcançável. Então nesse modo ele sai de dentro da Hero e vira
     uma seção comum logo abaixo dela: a mesma composição, sem narrativa,
     mas legível e acessível. */
  const semMovimento = useReducedMotion();
  const larguraDeFluxo = useFluxoVertical();

  /* Os dois caminhos chegam no mesmo lugar: sem narrativa presa, o painel
     de Recursos sai de dentro da Hero e vira seção comum logo abaixo. */
  const modoFluxo = semMovimento || larguraDeFluxo;

  // A narrativa vive fora do React: o GSAP escreve direto nestes nós. O
  // componente só monta a estrutura — e monta uma única vez.
  useHeroScrollStory(storyRef, rootRef, modoFluxo);

  /* "Recursos" não é um nó que o navegador possa procurar: a seção vive
     dentro da narrativa pinada, e o elemento dela fica preso na viewport
     o tempo todo. Então o destino é um ponto do runway, calculado a
     partir dos mesmos valores que montam as timelines.

     Os outros três links continuam sendo âncoras de verdade — `#inicio`
     é o topo e as duas seções seguintes estão abaixo do pin, onde o
     documento volta a ser documento. */
  const irPara = (e, href) => {
    if (href !== '#recursos') return;
    e.preventDefault();
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: modoFluxo
        ? (document.querySelector('.cc-recursos')?.getBoundingClientRect().top ?? 0) + window.scrollY
        : scrollDaSecaoRecursos(storyRef.current),
      behavior: suave ? 'smooth' : 'auto',
    });
  };

  /* No fluxo vertical a Dashboard é apresentada inteira, escalada para a
     largura do telefone. `scale()` precisa de um número sem unidade, e o
     CSS não sabe dividir `100vw` por 1182 e devolver isso — então a razão
     é escrita aqui, como custom property, e recalculada no resize. */
  useEffect(() => {
    const el = rootRef.current;
    if (!modoFluxo || !el) return undefined;
    const aplica = () => {
      const disponivel = Math.max(0, el.clientWidth - 32);
      el.style.setProperty('--cc-escala-produto', String(disponivel / 1182));
    };
    aplica();
    window.addEventListener('resize', aplica);
    return () => {
      window.removeEventListener('resize', aplica);
      el.style.removeProperty('--cc-escala-produto');
    };
  }, [modoFluxo]);

  const painel = (
    <RecursosPanel
      ref={recursosRef}
      trackRef={trackRef}
      estatico={modoFluxo}
    />
  );

  return (
    <div className="cc-hero-story" ref={storyRef}>
    <section
      className={`cc-hero${modoFluxo ? ' cc-hero--fluxo' : ''}`}
      id="inicio"
      ref={rootRef}
    >
      {/* Plano inferior do bloco rígido. Declarado antes do palco, como na
          prancha: Recursos vem por baixo, a Dashboard por cima. Em repouso
          ele fica fora do fold e só entra quando o segundo ato começa. */}
      {!modoFluxo && painel}

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
              onClick={(e) => irPara(e, href)}
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
              onClick={(e) => irPara(e, href)}
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

    {modoFluxo && painel}
    </div>
  );
}
