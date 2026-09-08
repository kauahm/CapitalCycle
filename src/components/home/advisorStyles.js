/* =========================================================
   CSS da seção Capital Advisor — etapa 04, DECIDIR.

   Mesma linguagem das seções anteriores: fundo #f4f5f7, traço
   grafite de 1,25px, rótulo de estação em 11px tabular. Nada de
   cápsula, blur, sombra, brilho, gradiente ou ícone.

   A regra do índigo continua valendo, e aqui ela cai sobre o
   único elemento realmente vivo da seção: o cursor de digitação.
   Ele só existe enquanto alguém está escrevendo.

   O traço fica fino; a área de interação, não. O campo tem 68px
   de altura clicável no desktop, mesmo o desenho sendo um fio.
   ========================================================= */

const ADVISOR_CSS = `
  .ccdec {
    position: relative;
    background: #f4f5f7;
  }

  /* Todo o respiro vertical mora aqui, não na seção: assim a
     altura medida é a da seção inteira e o eixo desce de borda a
     borda, encontrando o Produto acima e os Planos abaixo. */
  .ccdec-faixa {
    position: relative;
    width: var(--cc-faixa);
    margin-inline: auto;
    padding-top: clamp(72px, 8vw, 120px);
    /* Cauda encurtada: 144px depois do último texto era o trecho
       morto entre DECIDIR e INVESTIR. A composição da seção não muda. */
    padding-bottom: clamp(64px, 7vw, 104px);
  }

  .ccdec-faixa > svg {
    position: absolute;
    top: 0; left: 0;
    display: block;
    pointer-events: none;
  }

  .ccdec-traco {
    fill: none;
    stroke: var(--cch-muted);
    stroke-width: 1.25;
    stroke-linecap: butt;
    stroke-linejoin: round;
  }
  /* Foco: 1,25px -> 2px. Só isso. Nada pulsa, nada desliza, nada
     acende. */
  .ccdec-faixa.is-focado .ccdec-sublinhado { stroke-width: 2; }

  /* ---------- Texto ----------
     position: relative também para ancorar as leituras: a borda direita
     deste bloco É a prumada do eixo menos o raio, então basta
     alinhá-las a right: 0. */
  .ccdec-conteudo { position: relative; z-index: 1; }

  /* Só o que o átomo .cc-most não resolve. A unidade desta estação
     não é uma medida, é o que a etapa faz — por isso ela ganha a
     cor de corpo e não a de legenda. */
  .ccdec-estacao .cc-most-un { color: var(--cch-body); }

  /* ---------- Leituras ----------
     No topo à direita, na altura do cabeçalho da estação: o campo
     continua sendo o protagonista da seção, e estes dois números
     ficam fora do caminho dele. */
  .ccdec-leituras {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 22px;
    text-align: right;
  }

  .ccdec-titulo {
    margin: clamp(28px, 3vw, 44px) 0 0;
    max-width: 22ch;
    font-size: clamp(28px, 3.4vw, 46px);
    line-height: 1.14;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--cch-ink);
  }

  /* ---------- Campo de decisão ----------
     Sem borda, sem fundo, sem raio: o único traço embaixo dele é o
     ramo do circuito, desenhado no SVG. A largura vem do JS e
     termina exatamente onde a curva do ramo começa. */
  .ccdec-campo {
    display: flex;
    align-items: stretch;
    gap: 16px;
    margin-top: clamp(48px, 6vw, 84px);
    max-width: 100%;
  }

  .ccdec-input {
    flex: 1 1 auto;
    min-width: 0;
    height: 68px;
    padding: 0;
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: clamp(17px, 1.5vw, 20px);
    font-weight: 400;
    color: var(--cch-ink);
    /* Único elemento saturado da seção, e só enquanto se digita. */
    caret-color: var(--cch-purple-rec);
    outline: none;
  }
  .ccdec-input::placeholder {
    color: var(--cch-muted);
    opacity: 1;
  }
  .ccdec-input:focus-visible { outline: none; }

  .ccdec-enviar {
    flex: none;
    align-self: center;
    padding: 6px 0 4px;
    border: 0;
    /* Sem fio próprio em repouso: o ramo do circuito passa logo
       abaixo desta linha e dois traços paralelos a 25px um do outro
       viravam ruído. O fio aparece no hover, como afirmação da
       ação. */
    border-bottom: 1px solid transparent;
    background: transparent;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    color: var(--cch-ink);
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.18s ease;
  }
  .ccdec-enviar:hover { border-bottom-color: var(--cch-ink); }

  .ccdec-campo a:focus-visible,
  .ccdec-enviar:focus-visible {
    outline: 2px solid var(--cch-purple-rec);
    outline-offset: 3px;
  }

  .ccdec-rodape {
    margin: 18px 0 0;
    max-width: 52ch;
    font-size: 12px;
    line-height: 1.55;
    color: var(--cch-muted);
  }

  /* ---------- Tablet ---------- */
  @media (max-width: 1119px) {
    .ccdec-input { height: 64px; }
  }

  /* ---------- Mobile ----------
     O campo não é espremido: o botão desce para baixo do input e a
     composição ganha altura. O sublinhado continua sendo o ramo do
     circuito, sob o input. */
  @media (max-width: 767px) {
    /* As duas leituras saem da coluna à direita e viram uma leitura
       corrida acima do campo — nenhum dado é removido. Se não
       couber na largura, quebra em duas linhas em vez de vazar. */
    .ccdec-leituras {
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: baseline;
      /* O afastamento é o separador. Um ponto entre as duas leituras
         funcionaria só enquanto elas coubessem na mesma linha: ao
         quebrar, ele ia parar no início da segunda. */
      gap: 10px 20px;
      margin-top: 22px;
      text-align: left;
    }
    .ccdec-leituras .cc-most {
      display: flex;
      align-items: baseline;
      gap: 7px;
    }
    .ccdec-leituras .cc-most-un,
    .ccdec-leituras .cc-most-val {
      display: inline;
      margin: 0;
    }
    .ccdec-leituras .cc-most-val { font-size: 15px; }

    .ccdec-campo {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }
    /* 16px é o piso que evita o zoom automático do iOS ao focar um
       campo, e faz o placeholder caber sem corte na faixa estreita. */
    .ccdec-input {
      width: 100%;
      height: 60px;
      font-size: 16px;
    }
    /* Solto abaixo do campo, longe do ramo: aqui o fio próprio
       volta, porque não há mais nada marcando a ação. */
    .ccdec-enviar {
      align-self: flex-start;
      margin-top: 22px;
      font-size: 16px;
      border-bottom-color: var(--cch-muted);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ccdec-enviar { transition: none; }
  }
`;

export default ADVISOR_CSS;
