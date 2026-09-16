import React, { forwardRef } from 'react';

import DashboardPreview from './DashboardPreview';

/* ==========================================================================
   ProductStage

   O palco da Dashboard na landing. Existe UMA vez na página e é o mesmo nó
   do início ao fim da narrativa: a H2 deverá apenas transformar este
   elemento, nunca trocá-lo por outra cópia nem fazer crossfade para um
   segundo dashboard.

   Três camadas, e a divisão importa:

     .cc-stage        posição + `perspective: 2400px`. NÃO é transformada
                      além do centramento horizontal.
     .cc-stage__glow  o brilho violeta.
     .cc-stage__frame a camada que recebe rotateX/scale/raio/sombra — é
                      aqui que a H2 vai mexer.

   Sobre o glow: a auditoria mostrou que ele fica exatamente 440px acima do
   topo da Dashboard nos quatro frames em que existe (82−522, −80−360,
   −256−184, −386−54). Ou seja, ele não tem trajetória própria — anda junto
   com a Dashboard. Por isso mora DENTRO do palco, deslocado −440px, e não
   como camada de fundo solta: assim a H2 move os dois de graça, e só a
   opacidade do glow precisa ser animada à parte.
   ========================================================================== */

const ProductStage = forwardRef(function ProductStage(_props, ref) {
  return (
    <div className="cc-stage" ref={ref}>
      <div className="cc-stage__glow" aria-hidden="true" />
      <div className="cc-stage__frame">
        <DashboardPreview />
      </div>
    </div>
  );
});

export default ProductStage;
