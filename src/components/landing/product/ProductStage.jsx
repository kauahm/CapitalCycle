import React, { forwardRef } from 'react';

import DashboardPreview from './DashboardPreview';

/* ==========================================================================
   ProductStage

   O palco da Dashboard na landing. Existe UMA vez na página e é o mesmo nó
   do início ao fim da narrativa: a H2 transforma este elemento, nunca o
   troca por outra cópia nem faz crossfade para um segundo dashboard.

   Quatro camadas, e a divisão importa:

     .cc-stage         âncora de posição (top estrutural 522px). NÃO é
                       transformada e NÃO cria contexto de empilhamento —
                       ver abaixo, é o ponto central do arranjo.
     .cc-stage__glow   o brilho violeta.
     .cc-stage__persp  `perspective: 2400px`. É o pai da camada animada,
                       então a fuga da perspectiva fica no centro dele e
                       acompanha a subida, como na prancha.
     .cc-stage__frame  rotateX/scale/raio/borda/sombra — o que a H2 anima.

   Por que a âncora não pode selar o empilhamento
   ----------------------------------------------
   Na prancha, o glow é o PRIMEIRO filho do frame de 1440×900 (vai por
   baixo de tudo) e a Dashboard é o ÚLTIMO (vai por cima de tudo). O texto
   fica no meio. Isso não é detalhe: em F1 o glow tem alfa 0,45 no centro
   e cobriria o subtítulo e os CTAs se pintasse por cima; já em F2 a
   Dashboard sobe até `top:360` e precisa cobrir os CTAs, que ainda estão
   em opacity 0,18. Ou seja, glow embaixo do texto E Dashboard em cima do
   texto — ao mesmo tempo.

   Um palco que criasse contexto de empilhamento (o que `perspective`,
   `transform` ou um `z-index` numérico fazem) prenderia glow e Dashboard
   na mesma camada, e aí só daria para escolher um dos dois. Por isso a
   âncora fica sem transform, sem perspective e com `z-index: auto`: os
   dois filhos participam direto do empilhamento da Hero e se encaixam nos
   dois lados do texto.

   O glow continua filho do palco e sem trajetória própria: o `y` dele sai
   do MESMO tween que move a perspectiva (ver `useHeroScrollStory`), com o
   deslocamento de −440px que a auditoria apurou. Ele não herda scale nem
   rotation — correto, porque na prancha ele mede 1300×760 em todos os
   frames em que existe.
   ========================================================================== */

const ProductStage = forwardRef(function ProductStage(_props, ref) {
  return (
    <div className="cc-stage" ref={ref}>
      <div className="cc-stage__glow" aria-hidden="true" />
      <div className="cc-stage__persp">
        <div className="cc-stage__frame">
          <DashboardPreview />
        </div>
      </div>
    </div>
  );
});

export default ProductStage;
