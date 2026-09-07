/* =========================================================
   CSS da passagem — estações 05 (INVESTIR) e 06 (EVOLUIR).

   Não há composição nova aqui: um eixo vertical, duas marcas e
   duas palavras. É deliberadamente o trecho mais vazio da página,
   porque estas duas etapas não são telas do produto — são o que
   acontece depois de decidir.

   O ritmo vertical é o único recurso de composição: o espaço
   entre as estações é o que faz a passagem ler como percurso e
   não como duas legendas empilhadas.
   ========================================================= */

const PASSAGEM_CSS = `
  .ccpas {
    position: relative;
    background: #f4f5f7;
  }

  /* Todo o respiro mora aqui, e não na seção: assim a altura
     medida é a da seção inteira e o eixo desce de borda a borda,
     encontrando o Advisor acima e os Planos abaixo. */
  .ccpas-faixa {
    position: relative;
    width: var(--cc-faixa);
    margin-inline: auto;
    padding-top: clamp(56px, 6.2vw, 92px);
    padding-bottom: clamp(60px, 6.6vw, 100px);
  }

  .ccpas-faixa > svg {
    position: absolute;
    top: 0; left: 0;
    display: block;
    pointer-events: none;
  }

  .ccpas-traco {
    fill: none;
    stroke: var(--cch-muted);
    stroke-width: 1.25;
    stroke-linecap: butt;
    stroke-linejoin: round;
  }

  /* Os rótulos ficam em fluxo normal: é a posição deles que define
     onde as marcas são desenhadas, e não o contrário. A largura vem
     da geometria e termina encostando na marca. */
  .ccpas-estacoes {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: clamp(72px, 7.8vw, 116px);
    text-align: right;
  }

  .ccpas-estacao {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
    color: var(--cch-muted);
  }

  /* ---------- Tablet ---------- */
  @media (max-width: 1119px) {
    .ccpas-estacoes { gap: clamp(64px, 7.5vw, 100px); }
  }

  /* ---------- Mobile ----------
     As duas estações continuam existindo, com o mesmo eixo e as
     mesmas marcas. O que encolhe é a distância entre elas — não o
     número de estações. */
  @media (max-width: 767px) {
    .ccpas-faixa {
      padding-top: 56px;
      padding-bottom: 60px;
    }
    .ccpas-estacoes { gap: 64px; }
  }
`;

export default PASSAGEM_CSS;
