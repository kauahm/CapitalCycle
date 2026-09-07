import { memo, useLayoutEffect, useRef, useState } from 'react';

import DEMO from './demoAccount';
import useCircuitoScroll from './circuitoScroll';
import PRODUTO_CSS from './produtoStyles';
import { geometriaDoProduto, geometriaDaDescida } from './hero/circuitoGeometria';
import { formatarMoeda } from '../../utils/formatters';

/* =========================================================
   PRODUTO — etapas 02 (ORGANIZAR) e 03 (ANALISAR).

   A seção é a continuação do circuito, não outra tela. Fundo
   #f4f5f7 como o Hero, mesmo traço grafite, mesmas estações,
   mesmo raio, mesmo SVG 1:1. A linha desce do Hero em E0, recebe
   as quatro contas, dobra para E1 e ali deixa de ser abstração:
   vira o gráfico de fluxo, desenhado com os seis valores reais de
   demoAccount.fluxo.

   Duas consequências disso, ambas propositais:

   - o gráfico de barras esmeralda que vivia dentro do painel
     deixou de existir. Ele era um segundo gráfico dos mesmos
     dados, e a linha do circuito É o gráfico agora;

   - o painel escuro encolheu para o que só ele pode mostrar — os
     números consolidados e a meta — e passou a ocupar a mesma
     coluna do gráfico acima dele.

   Nenhum dado é inventado: tudo vem de demoAccount.js, a mesma
   fonte que o Dashboard Financeiro real usa nos rótulos.
   ========================================================= */

/* Altura da caixa de plotagem em função da largura da faixa, para
   a proporção do gráfico ser a mesma em qualquer viewport sem
   depender de breakpoint. */
const alturaDoPlot = (largura) => Math.min(190, Math.max(120, largura * 0.16));

function ProdutoSection() {
  const { nome, saldoDisponivel, totalInvestido, contasAtivas, sobraDoMes, fluxo, meta } = DEMO;
  const progressoMeta = Math.round((meta.atual / meta.alvo) * 100);

  const secaoRef = useRef(null);
  const faixaRef = useRef(null);
  const circuitoRef = useRef(null);
  const abaixoRef = useRef(null);

  const [geo, setGeo] = useState(() => geometriaDoProduto({
    largura: 0,
    valores: fluxo.map((m) => m.liquido),
    contas: contasAtivas,
    plotAltura: alturaDoPlot(0),
  }));
  const [descida, setDescida] = useState(() => geometriaDaDescida(0, 0));

  // Medição antes da pintura, como no Hero. Sem listener de scroll:
  // o ResizeObserver só dispara quando a faixa muda de tamanho.
  useLayoutEffect(() => {
    const secao = secaoRef.current;
    const topo = circuitoRef.current;
    const abaixo = abaixoRef.current;
    if (!secao || !topo || !abaixo) return undefined;

    const valores = fluxo.map((m) => m.liquido);
    const arred = (v) => Math.round(v * 100) / 100;

    const medir = () => {
      const largura = topo.clientWidth;
      // Quanto o eixo precisa subir para nascer na borda superior da
      // seção — exatamente onde o Hero entrega o traço.
      const entrada = topo.getBoundingClientRect().top - secao.getBoundingClientRect().top;
      setGeo((atual) => (atual.largura === arred(largura) && atual.acima === arred(Math.max(0, entrada))
        ? atual
        : geometriaDoProduto({
          largura,
          valores,
          contas: contasAtivas,
          plotAltura: alturaDoPlot(largura),
          entrada,
        })));

      const l = abaixo.clientWidth;
      const a = abaixo.clientHeight;
      setDescida((atual) => (atual.largura === Math.round(l * 100) / 100
        && atual.altura === Math.round(a * 100) / 100
        ? atual
        : geometriaDaDescida(l, a)));
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(secao);
    ro.observe(topo);
    ro.observe(abaixo);
    // O bloco do título também: quando a Inter termina de carregar,
    // o título reflui de duas linhas para uma e a distância até o
    // topo da seção encolhe. Sem observar isso, o eixo continuava
    // desenhado a partir da medida antiga e nascia acima da borda.
    if (faixaRef.current) ro.observe(faixaRef.current);

    let vivo = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (vivo) medir(); }).catch(() => {});
    }

    return () => { vivo = false; ro.disconnect(); };
  }, [fluxo, contasAtivas]);

  const ultimo = geo.pontos[geo.pontos.length - 1];

  /* Revelação pelo scroll. As janelas saem todas de medidas reais:
     `acima` é a distância do topo da seção até o bloco do circuito,
     e a altura da seção é a soma dela com o bloco e com o campo de
     baixo. Nenhum número de scroll fixo. */
  useCircuitoScroll(secaoRef, () => {
    const raiz = secaoRef.current;
    if (!raiz) return null;
    const alturaSecao = geo.acima + geo.altura + descida.altura;
    if (alturaSecao <= 0) return null;
    const fimDoEixo = (geo.acima + geo.altura) / alturaSecao;
    const contas = [...raiz.querySelectorAll('.ccprod-conta')];
    // As quatro entram juntas, na mesma janela: são quatro fontes
    // convergindo, não quatro animações escalonadas.
    const primeira = geo.contas.length ? geo.acima + geo.contas[0].y : 0;
    const ultimaConta = geo.contas.length
      ? geo.acima + geo.contas[geo.contas.length - 1].y + geo.raio
      : 0;
    return {
      nome: 'produto',
      trechos: [
        { el: raiz.querySelector('.ccprod-eixo'), de: 0, ate: fimDoEixo },
        { el: raiz.querySelector('.ccprod-descida'), de: fimDoEixo, ate: 1 },
        ...contas.map((el) => ({
          el,
          de: primeira / alturaSecao,
          ate: ultimaConta / alturaSecao,
        })),
      ],
      // O ponto índigo acende no último vértice do gráfico, não no
      // fim do eixo: o que sobra de path depois do vértice é só a
      // descida reta até a base do bloco, e é esse comprimento que
      // vira o gatilho.
      binarios: [{
        el: raiz.querySelector('.ccprod-atual'),
        trecho: 0,
        restante: ultimo ? geo.altura - ultimo.y : 0,
        em: 1,
      }],
    };
  }, [geo.largura, geo.altura, geo.acima, descida.altura]);

  return (
    <section className="ccprod" id="produto" ref={secaoRef}>
      <style>{PRODUTO_CSS}</style>

      {/* O título recua até a mesma prumada dos rótulos de estação.
          Com o eixo agora nascendo na borda superior da seção, ele
          desce por onde o título estava e cortava o texto. Todo
          texto do Produto vive à direita do eixo — o eixo é o
          elemento mais à esquerda da seção. */}
      <div
        className="ccprod-faixa"
        ref={faixaRef}
        style={{ paddingLeft: `${geo.rotulos.organizar.x}px` }}
      >
        <h2 className="ccprod-titulo">A tela que você abre depois de entrar.</h2>
      </div>

      {/* Mesma técnica do Hero: o bloco tem a altura do desenho, e o
          SVG é absoluto e mais alto, começando acima dele (viewBox
          com origem negativa) para o eixo nascer na borda superior
          da seção — o mesmo traço, não uma cópia. */}
      <div
        className="ccprod-circuito"
        ref={circuitoRef}
        style={{ height: `${geo.altura}px` }}
      >
        {geo.largura > 0 && (
          <svg
            width={geo.largura}
            height={geo.alturaSvg}
            viewBox={`0 ${-geo.acima} ${geo.largura} ${geo.alturaSvg}`}
            style={{ top: `${-geo.acima}px` }}
            aria-hidden="true"
            focusable="false"
          >
            {geo.contas.map((conta) => (
              <path key={conta.y} className="ccprod-traco ccprod-conta" d={conta.d} />
            ))}
            <path className="ccprod-traco ccprod-eixo" d={geo.eixo} />
            {ultimo && (
              <circle className="ccprod-atual" cx={ultimo.x} cy={ultimo.y} r="3.5" />
            )}
          </svg>
        )}

        <span
          className="ccprod-estacao"
          style={{ left: `${geo.rotulos.organizar.x}px`, top: `${geo.rotulos.organizar.y}px` }}
        >
          02 — Organizar
        </span>
        <span
          className="ccprod-nota"
          style={{
            left: `${geo.rotulos.organizar.x}px`,
            top: `${geo.rotulos.organizar.y + 17}px`,
          }}
        >
          {contasAtivas} contas ativas, uma leitura
        </span>

        <span
          className="ccprod-estacao"
          style={{ left: `${geo.rotulos.analisar.x}px`, top: `${geo.rotulos.analisar.y}px` }}
        >
          03 — Analisar
        </span>
        <span
          className="ccprod-nota"
          style={{
            left: `${geo.rotulos.analisar.x}px`,
            top: `${geo.rotulos.analisar.y + 17}px`,
          }}
        >
          Fluxo líquido — últimos {fluxo.length} meses
        </span>

        {/* Rótulos de mês: mesma fonte de dados dos pontos. */}
        {geo.pontos.map((ponto, i) => {
          const ehUltimo = i === geo.pontos.length - 1;
          return (
            <span
              key={fluxo[i].label}
              className={`ccprod-mes${ehUltimo ? ' is-ultimo' : ''}`}
              style={{
                left: `${ehUltimo ? ponto.x + 10 : ponto.x}px`,
                top: `${geo.rotulos.meses}px`,
              }}
            >
              {fluxo[i].label}
            </span>
          );
        })}

        {/* Único valor escrito no gráfico: o do mês corrente, que é
            o mesmo número que o painel abaixo chama de sobra.

            Fica na mesma linha do rótulo da estação, alinhado à
            direita na prumada da última leitura: colado ao ponto ele
            cruzava o traço do gráfico sempre que um mês vizinho
            ficava alto, e logo acima da plotagem ele batia na nota
            "Fluxo líquido" nas faixas estreitas. Aqui o par
            estação-à-esquerda / valor-à-direita lê como cabeçalho do
            gráfico e não colide em nenhuma largura. */}
        {ultimo && (
          <span
            className="ccprod-valor"
            style={{ left: `${ultimo.x}px`, top: `${geo.rotulos.analisar.y}px` }}
          >
            {`+${formatarMoeda(sobraDoMes)}`}
          </span>
        )}
      </div>

      <div className="ccprod-abaixo" ref={abaixoRef}>
        <div className="ccprod-painel">
          <div className="ccprod-painel-topo">
            <span>CapitalCycle · Dashboard Financeiro</span>
            <span>{contasAtivas} contas</span>
          </div>

          <p className="ccprod-saudacao">
            Olá, {nome}. Aqui está o resumo do seu capital.
          </p>

          <div className="ccprod-grade">
            <div>
              <p className="ccprod-rot">Saldo disponível</p>
              <p className="ccprod-num ccprod-num--grande">{formatarMoeda(saldoDisponivel)}</p>
            </div>
            <div>
              <p className="ccprod-rot">Investido</p>
              <p className="ccprod-num ccprod-num--medio">{formatarMoeda(totalInvestido)}</p>
            </div>
            <div>
              <p className="ccprod-rot">Contas ativas</p>
              <p className="ccprod-num ccprod-num--medio">{contasAtivas}</p>
            </div>
          </div>

          <div className="ccprod-meta">
            <div className="ccprod-meta-linha">
              <p className="ccprod-meta-nome">{meta.nome}</p>
              <p className="ccprod-meta-valor">
                {formatarMoeda(meta.atual)} de {formatarMoeda(meta.alvo)} · {progressoMeta}%
              </p>
            </div>
            <div
              className="ccprod-barra"
              role="progressbar"
              aria-valuenow={progressoMeta}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={meta.nome}
            >
              <span style={{ width: `${progressoMeta}%` }} />
            </div>
          </div>
        </div>

        {/* Depois do painel no DOM, e não antes: a descida corre na
            prumada da borda direita dele. Desenhada por baixo, ela
            sumiria durante toda a altura do painel — e o circuito
            não pode desaparecer em nenhum trecho. */}
        {descida.largura > 0 && descida.altura > 0 && (
          <svg
            width={descida.largura}
            height={descida.altura}
            viewBox={`0 0 ${descida.largura} ${descida.altura}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className="ccprod-traco ccprod-descida" d={descida.d} />
          </svg>
        )}
      </div>
    </section>
  );
}

export default memo(ProdutoSection);
