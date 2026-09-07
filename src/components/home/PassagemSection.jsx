import { memo, useLayoutEffect, useRef, useState } from 'react';

import useCircuitoScroll from './circuitoScroll';
import PASSAGEM_CSS from './passagemStyles';
import { geometriaDaPassagem } from './hero/circuitoGeometria';

/* =========================================================
   PASSAGEM — estações 05 (INVESTIR) e 06 (EVOLUIR).

   Não é uma seção de conteúdo e não deve virar uma. É o trecho do
   circuito entre DECIDIR e os Planos, onde o eixo atravessa duas
   etapas que não têm tela própria: investir e evoluir não são
   interfaces, são consequências de ter decidido.

   Por isso aqui há exatamente três coisas: o eixo, duas marcas e
   duas palavras. Sem card, sem ícone, sem ilustração, sem
   descrição, sem animação.

   As palavras ficam em fluxo normal e as marcas são desenhadas
   NA POSIÇÃO MEDIDA delas — a geometria segue o DOM, não o
   contrário.
   ========================================================= */

const ESTACOES = ['05 — Investir', '06 — Evoluir'];

function PassagemSection() {
  const faixaRef = useRef(null);
  const rotulosRef = useRef([]);

  const [geo, setGeo] = useState(() => geometriaDaPassagem({ largura: 0, altura: 0, ys: [] }));

  useLayoutEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa) return undefined;

    const arred = (v) => Math.round(v * 100) / 100;

    const medir = () => {
      const largura = faixa.clientWidth;
      const altura = faixa.clientHeight;
      const topo = faixa.getBoundingClientRect().top;
      // Centro vertical de cada rótulo, medido do topo da seção.
      const ys = rotulosRef.current.filter(Boolean).map((el) => {
        const r = el.getBoundingClientRect();
        return arred(r.top + r.height / 2 - topo);
      });

      setGeo((atual) => (atual.largura === arred(largura)
        && atual.altura === arred(altura)
        && atual.marcas.length === ys.length
        && atual.marcas.every((m, i) => m.y === ys[i])
        ? atual
        : geometriaDaPassagem({ largura, altura, ys })));
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(faixa);
    rotulosRef.current.filter(Boolean).forEach((el) => ro.observe(el));

    // A Inter reflui os rótulos ao terminar de carregar e desloca
    // as posições medidas.
    let vivo = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (vivo) medir(); }).catch(() => {});
    }

    return () => { vivo = false; ro.disconnect(); };
  }, []);

  /* Revelação pelo scroll. O eixo é uma vertical pura, então a
     fração de comprimento é exatamente y/altura: cada marca acende
     no instante em que a linha passa por ela. */
  useCircuitoScroll(faixaRef, () => {
    const raiz = faixaRef.current;
    if (!raiz || !geo.altura) return null;
    const marcas = [...raiz.querySelectorAll('.ccpas-marca')];
    return {
      nome: 'passagem',
      trechos: [{ el: raiz.querySelector('.ccpas-eixo'), de: 0, ate: 1 }],
      binarios: marcas.map((el, i) => ({
        el,
        trecho: 0,
        em: geo.marcas[i] ? geo.marcas[i].y / geo.altura : 1,
      })),
    };
    // `marcas.length` nas dependências: as posições saem da medição
    // dos rótulos e podem chegar depois da primeira geometria, sem
    // alterar largura nem altura.
  }, [geo.largura, geo.altura, geo.marcas.length, geo.marcas.map((m) => m.y).join()]);

  return (
    /* `cch` junto pelo mesmo motivo do Advisor: esta seção é irmã do
       wrapper .cch em HomePage, não filha, e sem a classe não recebe
       --cc-faixa nem a paleta do circuito. */
    <section className="cch ccpas" aria-label="Investir e evoluir">
      <style>{PASSAGEM_CSS}</style>

      <div className="ccpas-faixa" ref={faixaRef}>
        {geo.largura > 0 && geo.altura > 0 && (
          <svg
            width={geo.largura}
            height={geo.altura}
            viewBox={`0 0 ${geo.largura} ${geo.altura}`}
            aria-hidden="true"
            focusable="false"
          >
            {/* O mesmo eixo que desceu do Advisor, sem desvio. */}
            <path className="ccpas-traco ccpas-eixo" d={geo.eixo} />
            {geo.marcas.map((marca) => (
              <path key={marca.y} className="ccpas-traco ccpas-marca" d={marca.d} />
            ))}
          </svg>
        )}

        <div
          className="ccpas-estacoes"
          style={geo.larguraRotulo > 0 ? { width: `${geo.larguraRotulo}px` } : undefined}
        >
          {ESTACOES.map((nome, i) => (
            <p
              key={nome}
              className="ccpas-estacao"
              ref={(el) => { rotulosRef.current[i] = el; }}
            >
              {nome}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(PassagemSection);
