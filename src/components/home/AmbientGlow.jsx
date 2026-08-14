import { memo } from 'react';

/* =========================================================
   AmbientGlow — atmosfera de fundo compartilhada da landing.

   Duas manchas radiais indigo em opacidade muito baixa (5–6%)
   com deriva lenta e dessincronizada, só para o fundo não
   parecer morto. Fica atrás de tudo (z-index 0) e é inerte ao
   mouse; o conteúdo das seções vive em z-10.

   Estilos e keyframes em src/index.css (.cc-ambient), onde
   também mora a trava de prefers-reduced-motion.
   ========================================================= */

function AmbientGlow() {
  return (
    <div className="cc-ambient" aria-hidden="true">
      <span className="cc-ambient__blob cc-ambient__blob--a" />
      <span className="cc-ambient__blob cc-ambient__blob--b" />
    </div>
  );
}

export default memo(AmbientGlow);
