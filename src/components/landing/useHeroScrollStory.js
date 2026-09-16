import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HERO_KEYFRAMES, HERO_RUNWAY_VH, HERO_SEGMENTO } from './heroKeyframes';

/* Registro idempotente. Em dev o Vite reexecuta o módulo a cada HMR, e
   registrar o mesmo plugin duas vezes é inofensivo, mas o guard deixa
   explícito que só existe um registro. */
gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   useHeroScrollStory — F1 → F5 do Hero Scroll Storyboard

   A rolagem vertical transforma A MESMA instância de ProductStage pelos
   cinco keyframes oficiais. Nada aqui monta, desmonta ou troca a
   Dashboard: o GSAP escreve direto no DOM e o React nunca vê o progresso.
   É por isso que não há `useState` nenhum neste arquivo — `setState` a
   60fps re-renderizaria a landing inteira (R6).

   Estrutura da timeline: em vez de um único tween com ease genérica, são
   quatro segmentos encadeados de duração igual (0,25 cada), um por
   transição. Com `ease: 'none'` em cada um, o elemento passa EXATAMENTE
   pelos cinco estados nos progressos 0 / 0,25 / 0,5 / 0,75 / 1 — que é o
   que a prancha rotula. A continuidade vem do scrub, não de uma curva.
   ========================================================================== */

export default function useHeroScrollStory(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    /* matchMedia dá o corte de reduced motion e o cleanup de graça: fora
       da query nada é criado, e `revert()` no unmount mata timeline, pin
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

      if (!persp || !frame) return;

      /* Glow e perspectiva sobem juntos, sempre com o MESMO valor de `y`,
         num tween só. É o que garante que o glow não ganhe trajetória
         própria mesmo morando numa camada de empilhamento diferente. */
      const sobem = [glow, persp];

      const [F1] = HERO_KEYFRAMES;

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

      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: HERO_SEGMENTO },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          // Em função, para ser remedido a cada refresh em vez de congelar
          // a altura da primeira medição.
          end: () => `+=${window.innerHeight * (HERO_RUNWAY_VH / 100)}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* Um bloco de tweens por transição, todos ancorados no mesmo
         instante da timeline, para que os elementos cheguem juntos em
         cada keyframe. */
      HERO_KEYFRAMES.slice(1).forEach((kf, i) => {
        const at = i * HERO_SEGMENTO;

        tl.to(sobem, { y: kf.stage.y }, at);
        tl.to(
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
        tl.to(glow, { opacity: kf.glowOpacity }, at);
        tl.to(navbar, { opacity: kf.navbarOpacity }, at);
        tl.to(h1, { opacity: kf.h1.opacity, y: kf.h1.y }, at);
        tl.to(sub, { opacity: kf.sub.opacity, y: kf.sub.y }, at);
        tl.to(ctas, { opacity: kf.ctas.opacity, y: kf.ctas.y }, at);

        /* O fundo só muda na última transição: #07070b → #0b0b11, o
           fundo do próprio produto. Fora dela seria trabalho à toa. */
        if (kf.background !== HERO_KEYFRAMES[i].background) {
          tl.to(root, { backgroundColor: kf.background }, at);
        }
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
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
  }, [rootRef]);
}
