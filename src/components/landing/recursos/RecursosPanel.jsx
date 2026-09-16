import React, { forwardRef } from 'react';

import RecursosTrack from './RecursosTrack';

/* ==========================================================================
   RecursosPanel — 1440 × 900

   Transcrição de `referencia/designer/RecursosPanel.dc.html`, com uma
   ressalva registrada no briefing da H3: quando `RecursosPanel.dc.html` e
   `Dashboard to Recursos.dc.html` divergirem, quem manda é o storyboard.
   Nesta fase não houve divergência — o storyboard importa o painel inteiro,
   sem sobrescrever nada dele.

   O painel é o PLANO INFERIOR do bloco rígido. Ele não tem animação
   própria: sobe com a mesma translação da Dashboard (ver
   `useHeroScrollStory`), porque a borda de baixo de uma é a borda de cima
   do outro durante toda a passagem.

   O trilho de 2164px transborda os 1440px e é cortado pelo `overflow`
   do painel — é o estado estático inicial. O percurso horizontal é a H4.
   ========================================================================== */

const RecursosPanel = forwardRef(function RecursosPanel({ trackRef, estatico }, ref) {
  return (
    <section
      className={`cc-recursos${estatico ? ' cc-recursos--estatico' : ''}`}
      ref={ref}
      aria-label="Recursos"
    >
      <div className="cc-recursos__eyebrow">
        <span className="cc-recursos__ponto" aria-hidden="true" />
        <span>RECURSOS</span>
      </div>

      <h2 className="cc-recursos__titulo">
        Gestão que <span className="cc-recursos__realce">evolui</span> com você.
      </h2>

      <p className="cc-recursos__sub">
        Ferramentas profissionais para controle total do seu dinheiro — do
        lançamento individual à inteligência financeira por IA.
      </p>

      <div className="cc-recursos__trilho">
        <RecursosTrack ref={trackRef} />
      </div>
    </section>
  );
});

export default RecursosPanel;
