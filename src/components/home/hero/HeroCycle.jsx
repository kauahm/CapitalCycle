import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import useHeroCapability from './useHeroCapability';
import HeroFallback from './HeroFallback';

/* three.js é o item mais pesado que a landing poderia carregar. Fica
   num chunk separado, buscado só depois que a Hero já pintou — o
   Estado 1 (headline imediata) não pode esperar por WebGL. */
const CycleScene = lazy(() => import('./CycleScene'));

/* =========================================================
   HeroCycle — a camada visual da Hero.

   Empilha, de baixo para cima:
     1. o fallback SVG, que segura a composição até o 3D existir
     2. o canvas 3D, que entra com fade quando estiver pronto
     3. o scrim, que garante contraste da headline sobre os dois

   O canvas tem fundo transparente, então os dois não podem coexistir:
   o fallback sai com fade na mesma transição em que o canvas entra,
   senão as duas versões do ciclo aparecem sobrepostas.

   O canvas é inerte ao mouse: a Hero é texto e CTA, e nada aqui pode
   roubar clique ou scroll.
   ========================================================= */

export default function HeroCycle({ progress = 0, className = '' }) {
  const tier = useHeroCapability();

  const wrapRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);

  // Escrever num ref durante o render mantém a cena fora do ciclo de
  // re-render do React: o HomePage re-renderiza a cada frame de
  // scroll, e o loop do R3F apenas lê `.current`.
  progressRef.current = progress;

  /* ---- Só anima o que está à vista ----
     A Home tem várias telas de altura. Sem isto, o loop de render
     continuaria queimando GPU com a Hero muito acima da viewport,
     enquanto o usuário lê os Planos. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let visible = true;

    const sync = () => setRunning(visible && !document.hidden);

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          sync();
        },
        { rootMargin: '120px' }
      );
      io.observe(el);
      document.addEventListener('visibilitychange', sync);
      sync();
      return () => {
        io.disconnect();
        document.removeEventListener('visibilitychange', sync);
      };
    }

    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  /* ---- Parallax de mouse (desktop) ---- */
  useEffect(() => {
    if (tier !== 'full') {
      pointerRef.current = { x: 0, y: 0 };
      return undefined;
    }
    const onMove = (e) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [tier]);

  const showCanvas = tier !== 'static';

  return (
    <div
      ref={wrapRef}
      className={`cchero-stage${ready ? ' is-ready' : ''} ${className}`}
      aria-hidden="true"
    >
      <HeroFallback />

      {showCanvas && (
        <div className={`cchero-canvas${ready ? ' is-ready' : ''}`}>
          <Suspense fallback={null}>
            <CycleScene
              progressRef={progressRef}
              pointerRef={pointerRef}
              tier={tier}
              running={running}
              onReady={() => setReady(true)}
            />
          </Suspense>
        </div>
      )}

      <div className="cchero-scrim" />
    </div>
  );
}
