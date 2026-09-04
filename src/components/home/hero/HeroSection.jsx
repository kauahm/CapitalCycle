import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import HeroCycle from './HeroCycle';
import HERO_CSS from './heroStyles';
import PHASES, { phaseFromProgress } from './cyclePhases';

/* =========================================================
   HeroSection — a camada da Hero da landing.

   O conceito: o capital não termina, ele circula. A fita 3D atrás do
   texto é esse ciclo, e o scroll é o playhead que o percorre —
   entrada, alocação, crescimento, patrimônio — acendendo cada fase na
   fita e, ao mesmo tempo, na coluna de leitura à direita.

   Headline, subtítulo, CTAs e a leitura das fases são HTML normal.
   Nada de texto dentro do canvas: o 3D pode não carregar, e a
   mensagem não pode depender dele.
   ========================================================= */

/* Quando o scroll pinado não existe (mobile) a cena 3D roda a própria
   linha do tempo — 5,5s com ease-out até 0.72 de progresso. Este hook
   reproduz exatamente essa curva para a lista de fases, senão o texto
   e a fita acenderiam em momentos diferentes. */
const AUTO_DURATION = 5500;
const AUTO_TARGET = 0.72;

function useAutoProgress(active) {
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let raf = null;
    const started = performance.now();

    const tick = (now) => {
      const e = Math.min((now - started) / AUTO_DURATION, 1);
      setP((1 - Math.pow(1 - e, 3)) * AUTO_TARGET);
      if (e < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [active]);

  return p;
}

/* Dica de rolagem. Vive na Hero porque é ela que tem um runway de
   scroll para anunciar. */
function MouseIcon() {
  return (
    <svg className="cchero-mouse" width="28" height="43" viewBox="0 0 38 58" fill="none"
      stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="1.5" y="1.5" width="35" height="55" rx="17.5" />
      <path d="M19 13v10" strokeLinecap="round" />
    </svg>
  );
}

/* Escalonamento interno da Hero.

   A headline cumpre o papel dela nos primeiros instantes e sai cedo,
   liberando a tela para o ciclo. A coluna de fases é o oposto: ela é a
   revelação de dados da narrativa, então precisa continuar legível
   exatamente enquanto as fases acendem — só sai quando o ciclo já
   terminou de contar a história e a transição para os Recursos começa. */
const TEXT_OUT = [0, 0.30];
const PHASES_OUT = [0.70, 0.84];

function fadeStyle(p, [from, to], { lift = 0, enabled = true }) {
  if (!enabled) return undefined;
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return {
    opacity: 1 - t,
    transform: lift ? `translateY(${-t * lift}px)` : undefined,
    pointerEvents: t > 0.9 ? 'none' : 'auto',
  };
}

export default function HeroSection({ progress = 0, pinnedEnabled = true }) {
  // Sem scroll pinado (mobile / reduced motion) a Hero conta a
  // história sozinha na entrada.
  const autoProgress = useAutoProgress(!pinnedEnabled);
  const p = pinnedEnabled ? progress : autoProgress;

  const activePhase = phaseFromProgress(p);

  const textStyle = fadeStyle(p, TEXT_OUT, { lift: 46, enabled: pinnedEnabled });
  const phasesStyle = fadeStyle(p, PHASES_OUT, { lift: 28, enabled: pinnedEnabled });

  return (
    <div className="cch cch-layer cch-hero-layer">
      <style>{HERO_CSS}</style>

      <HeroCycle progress={p} />

      <div className="cch-inner" id="inicio">
        <div className="cch-left" style={textStyle}>
          <h1 className="cch-title">
            <span>Todo capital</span>
            <span>tem um</span>
            <span className="cch-accent">ciclo</span>
          </h1>

          <p className="cch-lead">
            Entrada, alocação, crescimento e patrimônio — a Capital Cycle
            acompanha cada volta do seu dinheiro, com inteligência artificial
            integrada.
          </p>

          <div className="cch-ctas">
            <a className="cch-btn cch-btn-primary" href="/cadastro">Começar agora</a>
            <Link className="cch-btn cch-btn-ghost" to="/login" state={{ from: 'home' }}>
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="cch-right" style={phasesStyle}>
          <div className="cchero-phases">
            <h2 className="cchero-phases-title">O ciclo do seu capital</h2>

            {PHASES.map(({ id, label, value, note }, i) => (
              <div
                key={id}
                className={`cchero-phase${i === activePhase ? ' is-on' : ''}`}
              >
                <span className="cchero-phase-dot" aria-hidden="true" />
                <span className="cchero-phase-head">
                  <span className="cchero-phase-label">{label}</span>
                  <span className="cchero-phase-value">{value}</span>
                </span>
                <p className="cchero-phase-note">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cchero-scroll" style={textStyle}>
        <MouseIcon />
        <span>Role para baixo</span>
      </div>
    </div>
  );
}
