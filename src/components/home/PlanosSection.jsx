import { memo, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import useCircuitoScroll from './circuitoScroll';
import PLANOS_CSS from './planosStyles';
import { geometriaDosPlanos } from './hero/circuitoGeometria';
import { PLAN_LIST } from '../ui/plans';
import { LEITURAS, codigo, qualificacaoDoPlano } from './estacoes';

/* =========================================================
   PLANOS — estação 07 do circuito, ESCOLHER.

   É onde o circuito chega, e não uma seção de preços colada no
   fim da página. O eixo desce da Passagem em E6 e atravessa a
   seção inteira; os dois planos se organizam em relação a ele,
   terminando a 2R do traço.

   Os dados continuam vindo inteiros de plans.js — nomes, preços,
   período, descrições, listas e ids. Nada foi alterado ali, e o
   cadastro continua sendo o mesmo Link com o plano no state da
   rota, que o Register lê para abrir já no passo certo.

   Saíram, por contradizerem o circuito: o selo "Mais popular", o
   card escuro usado só para destacar, as duas sombras pesadas, o
   gradiente do card claro, o halo radial de fundo, os ícones de
   check em círculo índigo, o eyebrow índigo com bolinha, a
   headline em caixa alta peso 900 e a entrada animada com stagger
   do framer-motion.

   `plan.featured` e `plan.badge` continuam existindo no dado e
   deixaram de ser renderizados: a diferença entre os planos está
   nas listas, que é onde ela é verdadeira.
   ========================================================= */

function PlanosSection() {
  const faixaRef = useRef(null);
  const [geo, setGeo] = useState(() => geometriaDosPlanos({ largura: 0, altura: 0 }));

  // Mesma medição das outras seções: sem listener de scroll, só
  // ResizeObserver, e uma remedição quando a Inter termina de
  // carregar e o texto reflui.
  useLayoutEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa) return undefined;

    const arred = (v) => Math.round(v * 100) / 100;

    const medir = () => {
      const largura = faixa.clientWidth;
      const altura = faixa.clientHeight;
      setGeo((atual) => (atual.largura === arred(largura) && atual.altura === arred(altura)
        ? atual
        : geometriaDosPlanos({ largura, altura })));
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

  /* Revelação pelo scroll: uma vertical só, ao lado da composição.
     Nada da seção é animado além dela. */
  useCircuitoScroll(faixaRef, () => {
    const raiz = faixaRef.current;
    if (!raiz) return null;
    return {
      nome: 'planos',
      trechos: [{ el: raiz.querySelector('.ccpla-traco'), de: 0, ate: 1 }],
      binarios: [],
      // A última estação é alcançada assim que o eixo COMEÇA a ser
      // desenhado aqui: chegar aos Planos é escolher. O limiar não
      // pode ser zero — um trecho ainda não desenhado também está em
      // zero, e com isso a coluna do Hero nascia marcando 07/07 no
      // topo da página.
      estacoes: [{ n: 7, trecho: 0, em: 0.02 }],
    };
  }, [geo.largura, geo.altura]);

  return (
    /* `cch` junto pelo mesmo motivo do Advisor e da Passagem: esta
       seção é irmã do wrapper .cch em HomePage, não filha, e sem a
       classe não recebe --cc-faixa nem a paleta do circuito. */
    <section className="cch ccpla" id="planos">
      <style>{PLANOS_CSS}</style>

      <div className="ccpla-faixa" ref={faixaRef}>
        {geo.largura > 0 && geo.altura > 0 && (
          <svg
            width={geo.largura}
            height={geo.altura}
            viewBox={`0 0 ${geo.largura} ${geo.altura}`}
            aria-hidden="true"
            focusable="false"
          >
            {/* O mesmo eixo que desceu da Passagem, sem desvio. */}
            <path className="ccpla-traco" d={geo.eixo} />
          </svg>
        )}

        <div
          className="ccpla-conteudo"
          style={geo.larguraUtil > 0 ? { maxWidth: `${geo.larguraUtil}px` } : undefined}
        >
          <span className="cc-most ccpla-estacao">
            <span className="cc-most-cod">{codigo(7)}</span>
            <span className="cc-most-nome">{LEITURAS[7].nome}</span>
            <span className="cc-most-un">{LEITURAS[7].unidade}</span>
            <span className="cc-most-val">{LEITURAS[7].valor}</span>
          </span>

          <h2 className="ccpla-titulo">Escolha seu ritmo financeiro.</h2>

          <p className="ccpla-lead">
            Do controle prático ao avançado com IA — dois planos para cada etapa da
            sua jornada de capital.
          </p>

          <div className="ccpla-grade">
            {PLAN_LIST.map((plan) => (
              <article className="ccpla-plano" key={plan.id}>
                <h3 className="ccpla-nome">{plan.name}</h3>

                {/* Leitura rápida da diferença entre os dois planos,
                    lida direto de plans.js. Não é argumento de venda:
                    é o limite do plano em forma curta, o mesmo campo
                    que as travas do painel consultam. A lista de
                    benefícios abaixo continua inteira. */}
                <p className="ccpla-limites">{qualificacaoDoPlano(plan.limits)}</p>

                <p className="ccpla-preco">
                  <span className="ccpla-moeda">R$</span>
                  <span className="ccpla-valor">{plan.price}</span>
                  <span className="ccpla-periodo">{plan.period}</span>
                </p>

                <p className="ccpla-desc">{plan.desc}</p>

                <ul className="ccpla-lista">
                  {plan.feats.map((feat) => (
                    <li key={feat}>{feat}</li>
                  ))}
                </ul>

                {/* Mesma lógica de antes: o plano vai no state da rota
                    e o Register abre direto no passo "Seus dados". */}
                <Link
                  className="ccpla-cta"
                  to="/cadastro"
                  state={{ plan: plan.id }}
                >
                  Começar com o {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(PlanosSection);
