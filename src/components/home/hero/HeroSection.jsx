import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import useCircuitoScroll from '../circuitoScroll';
import HERO_CSS from './heroStyles';
import { geometriaDoCircuito } from './circuitoGeometria';

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
    };
  }, [geo.largura, geo.altura, geo.alturaTopo]);

  return (
    <section className="cchero" id="inicio" ref={secaoRef}>
      <style>{HERO_CSS}</style>

      <div className="cchero-texto">
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
            Inter variável e é lido por leitor de tela. */}
        <span
          className="cchero-estacao"
          style={{ left: `${geo.rotuloX}px`, top: `${geo.rotuloY}px` }}
        >
          01 — Entrar
        </span>
      </div>

      <div className="cchero-base" ref={baseRef} />
    </section>
  );
}
