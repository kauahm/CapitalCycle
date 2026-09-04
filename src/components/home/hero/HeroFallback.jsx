import { memo } from 'react';

/* =========================================================
   Fallback da Hero — sem WebGL, ou com prefers-reduced-motion.

   Não é um "estado de erro": é a mesma composição desenhada em SVG.
   O ciclo continua sendo um anel inclinado com as quatro fases
   marcadas e a curva de crescimento saindo do pico. Quem cai aqui vê
   a mesma ideia, parada.

   Também é o que fica no ar durante o carregamento sob demanda da
   cena 3D — por isso ele nunca some sozinho, apenas é coberto.
   ========================================================= */

function HeroFallback() {
  return (
    <div className="cchero-fallback" aria-hidden="true">
      <svg viewBox="0 0 520 460" role="presentation" focusable="false">
        <defs>
          <linearGradient id="cchero-band" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b9bcc9" />
            <stop offset="45%" stopColor="#8b7cf6" />
            <stop offset="100%" stopColor="#c6c8d2" />
          </linearGradient>
          <linearGradient id="cchero-growth" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#8b7cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="cchero-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#181a26" stopOpacity="0.26" />
            <stop offset="70%" stopColor="#181a26" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#181a26" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* sombra de contato */}
        <ellipse cx="260" cy="366" rx="185" ry="46" fill="url(#cchero-shadow)" />

        {/* o ciclo */}
        <ellipse
          cx="260" cy="258" rx="176" ry="72"
          fill="none" stroke="url(#cchero-band)" strokeWidth="13"
          strokeLinecap="round" transform="rotate(-8 260 258)"
        />

        {/* hélice de crescimento, saindo do pico do ciclo */}
        <path
          d="M368 214 C 352 168, 300 150, 284 108 C 276 86, 288 68, 306 58"
          fill="none" stroke="url(#cchero-growth)" strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="306" cy="58" r="7" fill="#6366f1" />

        {/* nós de alocação sobre a curva */}
        {[
          [92, 244], [150, 300], [260, 322], [372, 292], [428, 236], [352, 190], [196, 196],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx} cy={cy} r={i % 3 === 0 ? 6 : 4.5}
            fill={i < 4 ? '#6366f1' : '#aab0c6'}
          />
        ))}
      </svg>
    </div>
  );
}

export default memo(HeroFallback);
