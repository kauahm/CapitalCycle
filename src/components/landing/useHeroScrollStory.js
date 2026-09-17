import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HERO_KEYFRAMES, HERO_RUNWAY_VH, HERO_SEGMENTO } from './heroKeyframes';
import {
  RECURSOS_FUNDO,
  RECURSOS_KEYFRAMES,
  RECURSOS_RUNWAY_VH,
} from './recursosKeyframes';
import { SHOWCASE_KEYFRAMES, SHOWCASE_RUNWAY_VH } from './showcaseKeyframes';

/* Registro idempotente. Em dev o Vite reexecuta o módulo a cada HMR, e
   registrar o mesmo plugin duas vezes é inofensivo, mas o guard deixa
   explícito que só existe um registro. */
gsap.registerPlugin(ScrollTrigger);

const runwayHero = () => window.innerHeight * (HERO_RUNWAY_VH / 100);
const runwayRecursos = () => window.innerHeight * (RECURSOS_RUNWAY_VH / 100);
const runwayShowcase = () => window.innerHeight * (SHOWCASE_RUNWAY_VH / 100);

/* ==========================================================================
   useHeroScrollStory — os três atos da landing

     Ato 1 · Hero Scroll Storyboard ............. F1 → F5
     Ato 2 · Dashboard → Recursos ............... D1 → D5
     Ato 3 · Recursos Showcase .................. D5 → S1 → S2 → S3 → S4

   Um pin só, três timelines. O pin cobre os três runways porque a cena
   inteira acontece na mesma viewport presa; pins encostados criariam um
   spacer por ato e uma emenda de scroll entre eles. As timelines é que
   são separadas, cada uma com o seu trecho — dá para ler e mexer num ato
   sem abrir os outros.

   A rolagem vertical transforma A MESMA instância de ProductStage do
   começo ao fim. Nada aqui monta, desmonta ou troca a Dashboard: o GSAP
   escreve direto no DOM e o React nunca vê o progresso. É por isso que não
   há `useState` nenhum neste arquivo — `setState` a 60fps re-renderizaria
   a landing inteira (R6).

   Estrutura das timelines: em vez de um tween único com ease genérica, são
   segmentos encadeados, um por transição, com `ease: 'none'`. Assim os
   elementos passam EXATAMENTE pelos estados nos progressos que as pranchas
   rotulam. No ato 1 os cinco frames são equidistantes (0 / 0,25 / 0,5 /
   0,75 / 1); no ato 2 NÃO são (0 / 0,14 / 0,38 / 0,67 / 1), e cada trecho
   dura o que o storyboard manda.

   Por que `fromTo` com `immediateRender: false` no ato 2
   ------------------------------------------------------
   Uma timeline com scrub renderiza a posição 0 mesmo antes do trigger
   dela começar. Um `set()` no instante 0 — ou um `to()` que capture o
   valor corrente como ponto de partida — vazaria para o ato 1 e
   estragaria o F1. Com `fromTo` explícito e `immediateRender: false`,
   cada trecho só escreve quando a cabeça de leitura chega nele, e o ponto
   de partida é sempre o keyframe anterior, nunca o que estiver no DOM.
   ========================================================================== */

/* `storyRef` é o invólucro que NÃO é pinado, e serve de régua para os três
   triggers; `rootRef` é a Hero, que é o elemento pinado.

   Os dois precisam ser distintos. Quando um elemento é pinado, o
   ScrollTrigger o troca por um pin-spacer no fluxo — e qualquer trigger que
   use esse mesmo elemento como referência passa a medir a partir do fim do
   spacer, jogando o início da narrativa para depois de todo o runway. Foi
   exatamente o que aconteceu antes desta separação: as timelines só
   começavam a rodar quando o pin já tinha soltado. */
export default function useHeroScrollStory(storyRef, rootRef) {
  useLayoutEffect(() => {
    const story = storyRef.current;
    const root = rootRef.current;
    if (!story || !root) return undefined;

    /* matchMedia dá o corte de reduced motion e o cleanup de graça: fora
       da query nada é criado, e `revert()` no unmount mata timelines, pin
       e triggers, devolvendo os estilos inline ao estado original. */
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);
      const persp = q('.cc-stage__persp')[0];
      const frame = q('.cc-stage__frame')[0];
      const glow = q('.cc-stage__glow')[0];
      const navbar = q('.cc-hero__nav')[0];
      const h1 = q('.cc-hero__headline-wrap')[0];
      const sub = q('.cc-hero__sub-wrap')[0];
      const ctas = q('.cc-hero__ctas')[0];
      const painel = q('.cc-recursos')[0];
      const navClara = q('.cc-hero__nav-clara')[0];

      if (!persp || !frame || !painel) return;

      /* O BLOCO RÍGIDO.

         Glow, perspectiva e painel de Recursos sobem sempre com o MESMO
         valor de `y`, no mesmo tween. Para o painel isso só funciona
         porque ele descansa em `522 + 903,022` — o topo do palco mais a
         altura renderizada da Dashboard —, o que faz a distância entre a
         borda de baixo dela e a de cima dele ser 903,022px por
         construção, em qualquer progresso, sem segunda conta para bater.

         O glow acompanha no ato 1 e sai do grupo no ato 2: ele já está em
         opacity 0 desde o F5 e não pertence à prancha de Recursos. */
      const sobem = [glow, persp, painel].filter(Boolean);
      const blocoRigido = [persp, painel];

      const [F1] = HERO_KEYFRAMES;
      const F5 = HERO_KEYFRAMES[HERO_KEYFRAMES.length - 1];

      /* F1 explícito: a partir daqui quem manda nos transforms é o GSAP,
         não o CSS. Evita depender de como o navegador serializou a
         matrix do `rotateX(6deg) scale(0.86)` que a H1 deixou no CSS. */
      gsap.set(sobem, { y: F1.stage.y });
      gsap.set(frame, {
        transformOrigin: '50% 0%',
        scale: F1.stage.scale,
        rotationX: F1.stage.rotationX,
        borderRadius: F1.stage.radius,
        borderColor: F1.stage.borderColor,
        boxShadow: F1.stage.boxShadow,
      });
      gsap.set(glow, { opacity: F1.glowOpacity });
      gsap.set(navbar, { opacity: F1.navbarOpacity });
      gsap.set(h1, { opacity: F1.h1.opacity, y: F1.h1.y });
      gsap.set(sub, { opacity: F1.sub.opacity, y: F1.sub.y });
      gsap.set(ctas, { opacity: F1.ctas.opacity, y: F1.ctas.y });

      /* Um pin só para os dois atos.

         A Hero fica presa da abertura até Recursos se estabelecer, porque
         durante o segundo ato a Dashboard ainda está em cena, saindo. Dois
         pins encostados criariam dois pin-spacers e uma emenda para o
         scroll atravessar — exatamente o salto que o briefing proíbe.
         Então o pin é um só, cobrindo os dois runways, e as timelines é
         que são separadas, cada uma com o seu trecho de rolagem. */
      const pin = ScrollTrigger.create({
        trigger: story,
        start: 'top top',
        end: () => `+=${runwayHero() + runwayRecursos() + runwayShowcase()}`,
        pin: root,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Medido antes das timelines, para elas já lerem o layout pinado.
        refreshPriority: 1,
      });

      /* ------------------------------------------------------------------
         ATO 1 — Hero Scroll Storyboard (F1 → F5)
         ------------------------------------------------------------------ */
      const tlHero = gsap.timeline({
        defaults: { ease: 'none', duration: HERO_SEGMENTO },
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          // Em função, para ser remedido a cada refresh em vez de congelar
          // a altura da primeira medição.
          end: () => `+=${runwayHero()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /* Um bloco de tweens por transição, todos ancorados no mesmo
         instante da timeline, para que os elementos cheguem juntos em
         cada keyframe. */
      HERO_KEYFRAMES.slice(1).forEach((kf, i) => {
        const at = i * HERO_SEGMENTO;

        tlHero.to(sobem, { y: kf.stage.y }, at);
        tlHero.to(
          frame,
          {
            scale: kf.stage.scale,
            rotationX: kf.stage.rotationX,
            borderRadius: kf.stage.radius,
            borderColor: kf.stage.borderColor,
            boxShadow: kf.stage.boxShadow,
          },
          at,
        );
        tlHero.to(glow, { opacity: kf.glowOpacity }, at);
        tlHero.to(navbar, { opacity: kf.navbarOpacity }, at);
        tlHero.to(h1, { opacity: kf.h1.opacity, y: kf.h1.y }, at);
        tlHero.to(sub, { opacity: kf.sub.opacity, y: kf.sub.y }, at);
        tlHero.to(ctas, { opacity: kf.ctas.opacity, y: kf.ctas.y }, at);

        /* O fundo só muda na última transição: #07070b → #0b0b11, o
           fundo do próprio produto. Fora dela seria trabalho à toa. */
        if (kf.background !== HERO_KEYFRAMES[i].background) {
          tlHero.to(root, { backgroundColor: kf.background }, at);
        }
      });

      /* ------------------------------------------------------------------
         ATO 2 — Dashboard → Recursos (D1 → D5)

         Uma translação só, de um bloco de dois planos. Nada some por
         opacidade: a Dashboard sai de cena por deslocamento e Recursos
         ocupa o espaço que ela liberou.
         ------------------------------------------------------------------ */
      const tlRec = gsap.timeline({
        defaults: { ease: 'none', immediateRender: false },
        scrollTrigger: {
          trigger: story,
          // Começa exatamente onde a Hero termina.
          start: () => `top top-=${runwayHero()}`,
          end: () => `+=${runwayRecursos()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      RECURSOS_KEYFRAMES.slice(1).forEach((kf, i) => {
        const anterior = RECURSOS_KEYFRAMES[i];
        const at = anterior.progresso;
        const duration = kf.progresso - anterior.progresso;

        tlRec.fromTo(
          blocoRigido,
          { y: anterior.y },
          { y: kf.y, duration, immediateRender: false },
          at,
        );

        if (kf.boxShadow !== anterior.boxShadow) {
          tlRec.fromTo(
            frame,
            { boxShadow: anterior.boxShadow },
            { boxShadow: kf.boxShadow, duration, immediateRender: false },
            at,
          );
        }

        if (kf.navClaraOpacity !== anterior.navClaraOpacity) {
          tlRec.fromTo(
            navClara,
            { opacity: anterior.navClaraOpacity },
            { opacity: kf.navClaraOpacity, duration, immediateRender: false },
            at,
          );
        }
      });

      /* Duas coisas que a prancha de Recursos já mostra no D1 e a Hero não
         tinha no F5: a superfície off-white atrás do palco e a sombra que
         faz a Dashboard ler como plano superior.

         Nenhuma das duas é visível no D1 — a Dashboard cobre a viewport
         inteira e a sombra cai 21px abaixo de uma borda que está em 903,
         fora dos 900px de tela. Por isso elas entram ao longo do primeiro
         trecho, em vez de num corte no instante 0: o resultado visível é o
         mesmo, e o handoff F5 → D1 fica sem salto, inclusive na volta. */
      const primeiroTrecho = RECURSOS_KEYFRAMES[1].progresso;

      tlRec.fromTo(
        root,
        { backgroundColor: F5.background },
        { backgroundColor: RECURSOS_FUNDO, duration: primeiroTrecho, immediateRender: false },
        0,
      );
      tlRec.fromTo(
        frame,
        { boxShadow: F5.stage.boxShadow },
        { boxShadow: RECURSOS_KEYFRAMES[0].boxShadow, duration: primeiroTrecho, immediateRender: false },
        0,
      );

      /* ------------------------------------------------------------------
         ATO 3 — Recursos Showcase (D5 → S1 → S2 → S3 → S4)

         O painel já é a viewport desde o fim do ato 2 e fica parado aqui;
         o que se transforma é o conteúdo dele. Mesmos nós, sempre: o
         lockup encolhe e cresce de volta, o trilho desce até o rodapé,
         sobe para o trilho de leitura e então atravessa a tela.

         O lockup vai da esquerda ao centro e volta sem que nada meça
         largura: `x` e `xPercent` interpolam juntos e o resultado é
         `120 + x − largura·|xPercent|`, que dá o centro de 1440 quando
         x = 600 e xPercent = −50, seja qual for o corpo da fonte.
         ------------------------------------------------------------------ */
      const eyebrow = q('.cc-recursos__eyebrow')[0];
      const titulo = q('.cc-recursos__titulo')[0];
      const subRecursos = q('.cc-recursos__sub')[0];
      const cta = q('.cc-recursos__cta')[0];
      const indicador = q('.cc-recursos__indicador')[0];
      const preenchido = q('.cc-recursos__indicador-preenchido')[0];
      const trilho = q('.cc-recursos__trilho')[0];

      const tlShow = gsap.timeline({
        defaults: { ease: 'none', immediateRender: false },
        scrollTrigger: {
          trigger: story,
          start: () => `top top-=${runwayHero() + runwayRecursos()}`,
          end: () => `+=${runwayShowcase()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      SHOWCASE_KEYFRAMES.slice(1).forEach((kf, i) => {
        const ant = SHOWCASE_KEYFRAMES[i];
        const at = ant.progresso;
        const duration = kf.progresso - ant.progresso;
        const trecho = { duration, immediateRender: false };

        tlShow.fromTo(eyebrow, { ...ant.eyebrow }, { ...kf.eyebrow, ...trecho }, at);
        tlShow.fromTo(titulo, { ...ant.titulo }, { ...kf.titulo, ...trecho }, at);
        tlShow.fromTo(subRecursos, { ...ant.sub }, { ...kf.sub, ...trecho }, at);
        tlShow.fromTo(cta, { ...ant.cta }, { ...kf.cta, ...trecho }, at);
        tlShow.fromTo(
          indicador,
          { opacity: ant.hairline.opacity },
          { opacity: kf.hairline.opacity, ...trecho },
          at,
        );
        /* Tween separado do trilho, de propósito: no S3 o preenchimento
           está em 55% enquanto o trilho está em 50%. Derivar um do outro
           apagaria essa diferença, que é do Designer. */
        tlShow.fromTo(
          preenchido,
          { width: ant.hairline.fill },
          { width: kf.hairline.fill, ...trecho },
          at,
        );
        tlShow.fromTo(trilho, { ...ant.trilho }, { ...kf.trilho, ...trecho }, at);
      });

      /* O subtítulo é alinhado à esquerda no painel de Recursos e
         centralizado no S1 — a prancha muda as duas coisas. `text-align`
         não interpola, então a troca acontece no meio do primeiro trecho,
         quando o bloco inteiro já está em movimento e o deslocamento da
         segunda linha passa despercebido. */
      tlShow.set(
        subRecursos,
        { textAlign: 'center' },
        SHOWCASE_KEYFRAMES[1].progresso / 2,
      );

      return () => {
        pin.kill();
        tlHero.scrollTrigger?.kill();
        tlHero.kill();
        tlRec.scrollTrigger?.kill();
        tlRec.kill();
        tlShow.scrollTrigger?.kill();
        tlShow.kill();
      };
    });

    /* As medidas do pin dependem da altura real do texto, que só fecha
       depois que as fontes do Designer carregam. Um refresh único, sem
       laço. */
    let vivo = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (vivo) ScrollTrigger.refresh();
      });
    }

    return () => {
      vivo = false;
      mm.revert();
    };
  }, [storyRef, rootRef]);
}
