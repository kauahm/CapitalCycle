import { memo, useLayoutEffect, useRef, useState } from 'react';

import RETORNO_CSS from './retornoStyles';
import { geometriaDoRetorno } from './hero/circuitoGeometria';

/* =========================================================
   RETORNO — fechamento geométrico do circuito.

   O traço desce dos Planos em E6, vira para a esquerda,
   atravessa a faixa e sobe um trecho curto em E0 — a mesma coluna
   em que o horizonte do Hero começou a descer. É a única vez em
   toda a página que a linha anda para a esquerda.

   Não há laço fechado nem ligação física com o Hero: a subida
   termina no ar, sem seta, ponto, círculo ou legenda. O ciclo é
   completado por quem olha.

   Isto não é um footer. O projeto não tem footer e nenhum foi
   inventado aqui: não há texto, logo, card, fundo próprio nem
   qualquer elemento além do traço.
   ========================================================= */

function RetornoSection() {
  const faixaRef = useRef(null);
  const [geo, setGeo] = useState(() => geometriaDoRetorno({ largura: 0, altura: 0 }));

  // Mesma medição das outras seções: sem listener de scroll, só
  // ResizeObserver, e uma remedição quando a Inter termina de
  // carregar e o layout acima reflui.
  useLayoutEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa) return undefined;

    const arred = (v) => Math.round(v * 100) / 100;

    const medir = () => {
      const largura = faixa.clientWidth;
      const altura = faixa.clientHeight;
      setGeo((atual) => (atual.largura === arred(largura) && atual.altura === arred(altura)
        ? atual
        : geometriaDoRetorno({ largura, altura })));
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(faixa);

    let vivo = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (vivo) medir(); }).catch(() => {});
    }

    return () => { vivo = false; ro.disconnect(); };
  }, []);

  return (
    /* `div` e não `section`: não há conteúdo aqui, e um marco de
       navegação vazio e sem nome só atrapalharia quem usa leitor de
       tela. `cch` traz --cc-faixa e a paleta do circuito. */
    <div className="cch ccret">
      <style>{RETORNO_CSS}</style>

      <div className="ccret-faixa" ref={faixaRef}>
        {geo.largura > 0 && geo.altura > 0 && (
          <svg
            width={geo.largura}
            height={geo.altura}
            viewBox={`0 0 ${geo.largura} ${geo.altura}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className="ccret-traco" d={geo.d} />
          </svg>
        )}
      </div>
    </div>
  );
}

export default memo(RetornoSection);
