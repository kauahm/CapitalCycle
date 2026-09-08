import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import useCircuitoScroll from '../circuitoScroll';
import HERO_CSS from './heroStyles';
import { geometriaDoCircuito } from './circuitoGeometria';
import { INDICE_DO_HERO, LEITURAS, codigo } from '../estacoes';

/* =========================================================
   HeroSection — composição estática, clara, sem movimento.

   O Hero é a estação 01 do Circuito: headline, lead, duas ações
   e o traço. Não há vídeo, objeto, ilustração, gradiente,
   sombra, textura nem animação — e não deve haver: a composição
   precisa se sustentar como imagem parada antes de o movimento
   entrar na Fase 3B.

   A única lógica aqui é medir a faixa e pedir a geometria. O
   desenho inteiro vem de circuitoGeometria.js, em pixels 1:1
   com a tela, para a espessura do traço ser constante e o raio
   da curva não deformar em nenhuma largura.

   Não há listener de scroll. O ResizeObserver só dispara quando
   a faixa muda de tamanho.
   ========================================================= */

/* Divisão do progresso do Hero entre os dois trechos. O horizonte
   fica com a maior parte de propósito: no topo da página a seção já
   nasce ~62% percorrida (a linha de leitura está dentro dela), e com
   um peso menor o horizonte apareceria pronto. Com 0,82 ele abre
   com cerca de três quartos desenhados — a composição lê inteira e
   o primeiro gesto de scroll ainda a completa. */
const PESO_HORIZONTE = 0.82;

export default function HeroSection() {
  const secaoRef = useRef(null);
  const circuitoRef = useRef(null);
  const baseRef = useRef(null);
  const indiceRef = useRef([]);
  const [geo, setGeo] = useState(() => geometriaDoCircuito(0, 0));

  // useLayoutEffect e não useEffect: a medição acontece antes da
  // pintura, então o circuito nunca aparece com largura zero.
  useLayoutEffect(() => {
    const caixa = circuitoRef.current;
    const base = baseRef.current;
    if (!caixa || !base) return undefined;

    const arred = (v) => Math.round(v * 100) / 100;

    const medir = () => {
      const largura = caixa.clientWidth;
      // O campo aberto abaixo do horizonte entra na conta: é por
      // ele que o ramo continua até a borda inferior da seção.
      const abaixo = base.clientHeight;
      // Só recalcula quando alguma das duas medidas muda de fato:
      // evita re-render a cada notificação do observer.
      setGeo((atual) => (atual.largura === arred(largura) && atual.alturaAbaixo === arred(abaixo)
        ? atual
        : geometriaDoCircuito(largura, abaixo)));
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(caixa);
    ro.observe(base);
    return () => ro.disconnect();
  }, []);

  // Revelação pelo scroll. O controlador é único para a Home; aqui
  // a seção só declara os seus trechos na ordem em que a linha os
  // percorre: horizonte da esquerda para a direita, depois a curva
  // e a descida.
  useCircuitoScroll(secaoRef, () => {
    const raiz = secaoRef.current;
    if (!raiz) return null;
    const graduacoes = [...raiz.querySelectorAll('.cchero-graduacoes .cchero-traco')];
    return {
      nome: 'hero',
      // Ancorado no topo do documento: o progresso passa a contar do
      // scroll 0, e não de onde a linha de leitura cai dentro da
      // primeira seção.
      ancorarNoTopo: true,
      trechos: [
        {
          el: raiz.querySelector('.cchero-horizonte'),
          de: 0,
          ate: PESO_HORIZONTE,
          // Nasce desenhado até a primeira graduação: o instrumento
          // já existe no primeiro quadro, e todo o resto do horizonte
          // fica para o scroll. A fração é a própria posição de E1.
          inicial: geo.largura > 0 && geo.graduacoes[0]
            ? geo.graduacoes[0].x / geo.largura
            : 0,
        },
        { el: raiz.querySelector('.cchero-ramo'), de: PESO_HORIZONTE, ate: 1 },
      ],
      // Cada graduação acende quando o horizonte passa pelo x dela.
      // Como o horizonte é uma reta, a fração de comprimento é
      // exatamente x/largura — nenhum ajuste manual.
      binarios: graduacoes.map((el, i) => ({
        el,
        trecho: 0,
        em: geo.largura > 0 && geo.graduacoes[i] ? geo.graduacoes[i].x / geo.largura : 1,
      })),
      // A estação 01 é alcançada no instante em que a página abre:
      // o horizonte já nasce desenhado até E1.
      estacoes: [{ n: 1, trecho: 0, em: 0 }],
      // A coluna não é animada nem observada: ela só se inscreve
      // para receber a marca de estágio corrente do mesmo motor.
      painel: {
        itens: INDICE_DO_HERO
          .map((item, i) => ({ n: item.n, el: indiceRef.current[i] }))
          .filter((item) => item.el),
      },
    };
  }, [geo.largura, geo.altura, geo.alturaTopo]);

  return (
    <section className="cchero" id="inicio" ref={secaoRef}>
      <style>{HERO_CSS}</style>

      {/* `data-cc-topo` marca o bloco mais alto da seção. A navbar
          mede ELE para decidir quando ganhar chão: enquanto este
          topo estiver abaixo dos 72px da barra, nada de conteúdo
          pode entrar na faixa dela. */}
      <div className="cchero-texto">
        <div className="cchero-linha" data-cc-topo>
          <div className="cchero-bloco">
            <h1 className="cchero-title">
              <span>Todo capital</span>
              <span>tem um ciclo.</span>
            </h1>

            <p className="cchero-lead">
              Centralize suas contas, acompanhe seus investimentos e veja seu
              patrimônio em um só lugar.
            </p>

            <div className="cchero-acoes">
              {/* Link e não <a href>: em <a> a navegação recarregava a
                  aplicação inteira e descartava o estado do router. */}
              <Link className="cchero-cta" to="/cadastro">
                Criar conta
              </Link>

              {/* Âncora nativa: #produto já existe e a página define
                  scroll-margin-top para a navbar fixa. */}
              <a className="cchero-link" href="#produto">
                Ver o produto
              </a>
            </div>
          </div>

          {/* ---------- Coluna de leitura ----------
              Quatro etapas do percurso com o valor real de cada uma.
              Não é menu e não vira um: sem link, sem hover, sem
              cursor, sem alvo de clique. É a mesma informação que a
              página vai mostrar por extenso mais abaixo, adiantada
              aqui como índice — e é ela que diz, na primeira tela, de
              que sistema esta página trata.

              O primeiro item já nasce com `is-corrente`: sem JS, com
              movimento reduzido ou antes do primeiro quadro, o
              estágio marcado é o certo, e o motor só o move dali. */}
          <ul className="cchero-indice" aria-label="Etapas do ciclo">
            {INDICE_DO_HERO.map((item, i) => (
              <li
                key={item.n}
                className={`cc-most cchero-idx${i === 0 ? ' is-corrente' : ''}`}
                ref={(el) => { indiceRef.current[i] = el; }}
              >
                <span className="cc-most-cod">{item.codigo}</span>
                <span className="cc-most-nome">{item.nome}</span>
                <span className="cc-most-val">{item.resumo}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* A altura do bloco é só a parte de cima do desenho; o SVG é
          absoluto e maior que ela, então o ramo desce por cima do
          campo aberto e sai pela borda da seção sem empurrar nada
          do layout. */}
      <div
        className="cchero-circuito"
        ref={circuitoRef}
        style={{ height: `${geo.alturaTopo}px` }}
      >
        {geo.largura > 0 && (
          <svg
            width={geo.largura}
            height={geo.altura}
            viewBox={`0 0 ${geo.largura} ${geo.altura}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className="cchero-traco cchero-horizonte" d={geo.horizonte} />
            <path className="cchero-traco cchero-ramo" d={geo.ramo} />
            <g className="cchero-graduacoes">
              {geo.graduacoes.map((marca) => (
                <path key={marca.x} className="cchero-traco" d={marca.d} />
              ))}
            </g>
          </svg>
        )}

        {/* Texto de verdade, não <text> de SVG: renderiza com a
            Inter variável e é lido por leitor de tela.

            Mostrador completo: a 01 é uma das quatro estações que
            mostram unidade e valor. O que ela mede são as contas
            conectadas, que é literalmente o que "entrar" produz. */}
        <span
          className="cc-most cchero-estacao"
          style={{ left: `${geo.rotuloX}px`, top: `${geo.rotuloY}px` }}
        >
          <span className="cc-most-cod">{codigo(1)}</span>
          <span className="cc-most-nome">{LEITURAS[1].nome}</span>
          <span className="cc-most-un">{LEITURAS[1].unidade}</span>
          <span className="cc-most-val">{LEITURAS[1].valor}</span>
        </span>
      </div>

      <div className="cchero-base" ref={baseRef} />
    </section>
  );
}
