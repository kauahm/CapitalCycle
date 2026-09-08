/* =========================================================
   CSS do Hero — composição estática clara.

   Não há animação, scroll, sticky, pin, vídeo, gradiente,
   sombra, blur ou textura. O Hero é uma imagem parada, e é
   assim que ele precisa funcionar antes de qualquer movimento
   entrar (Fase 3B).

   Estrutura vertical, de cima para baixo:

     .cchero-texto     ocupa o espaço livre e encosta o bloco de
                       texto na sua base; o padding inferior dele
                       É o vão entre o CTA e o horizonte
     .cchero-circuito  o traço, com altura vinda da geometria
     .cchero-base      o campo aberto abaixo do horizonte, onde a
                       linha vai continuar

   O vão CTA→horizonte é declarado uma vez em --cc-hero-vao e é
   o intervalo mais largo do Hero: ele separa o argumento (texto
   e ação) do instrumento (a linha). Se encolher, a linha passa a
   ler como sublinhado do bloco de texto.

   Nenhuma medida do traço vive aqui — o desenho todo vem de
   circuitoGeometria.js. Aqui só existem cor, espessura e opacidade.
   ========================================================= */

const HERO_CSS = `
  .cchero {
    /* Vão entre o CTA e o horizonte. Faixa aprovada: 96-112px. */
    --cc-hero-vao: 104px;
    /* Campo aberto abaixo do horizonte. É este valor que posiciona
       o horizonte, e não um percentual: o texto encosta na base da
       sua área e o circuito vem logo depois, então crescer o campo
       de baixo SOBE o horizonte sem tocar em nada da relação
       headline → lead → CTA → vão. A 26vh o horizonte caía a ~69%
       e lia como rodapé da seção; a 30vh ele fica em 60-64% e
       passa a pertencer à composição. */
    --cc-hero-base: clamp(200px, 30vh, 320px);
    /* Altura da navbar fixa, para o texto não nascer debaixo dela. */
    --cc-hero-nav: 72px;

    position: relative;
    display: flex;
    flex-direction: column;
    background: #f4f5f7;

    /* Piso de 640px: em janela baixa o Hero CRESCE e a página
       rola. A composição nunca é comprimida para caber. */
    min-height: 100vh;
    min-height: 100svh;
    min-height: max(100svh, 640px);
  }

  /* ---------- Bloco de texto ----------
     Alinhado à esquerda, na mesma prumada da navbar e da ponta
     esquerda do horizonte. A faixa é a mesma da página inteira. */
  .cchero-texto {
    flex: 1 1 auto;
    display: flex;
    align-items: flex-end;
    width: var(--cc-faixa);
    margin-inline: auto;
    padding-top: calc(var(--cc-hero-nav) + 32px);
    padding-bottom: var(--cc-hero-vao);
  }

  /* Duas colunas de uma composição só, não um bloco com um painel
     ao lado: flex-start alinha o topo da coluna de leitura ao topo
     da headline, e é .cchero-texto que empurra a linha inteira
     para a base da sua área. */
  .cchero-linha {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 48px;
    width: 100%;
  }

  .cchero-bloco { max-width: 640px; }

  /* ---------- Coluna de leitura ----------
     Alinhada à direita da faixa, na mesma prumada em que o horizonte
     termina: é a outra ponta do instrumento, não um card flutuando.
     Sem fundo, borda, sombra, divisor, marcador ou fio de ligação —
     o que a mantém unida é o alinhamento à direita e o intervalo
     regular entre as entradas. */
  .cchero-indice {
    flex: none;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 26px;
    text-align: right;
  }
  /* Leitura, não navegação: nada aqui é clicável, então nada aqui
     reage ao ponteiro. */
  .cchero-idx { cursor: default; }
  /* A coluna é secundária: o valor fica no piso da escala de valor
     e o nome recua para a cor do corpo, para não competir com a
     headline a três metros de distância. */
  .cchero-idx .cc-most-nome { color: var(--cch-body); }
  .cchero-idx .cc-most-val { font-size: 15px; margin-top: 6px; }
  /* No estágio corrente o nome sobe para a tinta cheia junto com o
     código em índigo. Duas mudanças de estado, nenhuma cor nova. */
  .cchero-idx.is-corrente .cc-most-nome { color: var(--cch-ink); }

  /* ---------- Tipografia ----------
     Inter variável, já carregada. Caixa de sentença e peso 600:
     caixa alta em peso 900 era a origem do tom gritado. O único
     texto em caixa alta do Hero é o rótulo da estação. */
  .cchero-title {
    margin: 0;
    font-size: 68px;
    line-height: 1.06;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--cch-ink);
  }
  /* Quebra declarada no conteúdo, não delegada ao navegador:
     text-wrap: balance equilibra em torno de um centro, e a
     composição é alinhada à esquerda. */
  .cchero-title span { display: block; }

  .cchero-lead {
    margin: 28px 0 0;
    max-width: 46ch;
    font-size: 17px;
    line-height: 1.6;
    font-weight: 400;
    color: var(--cch-body);
    text-wrap: pretty;
  }

  .cchero-acoes {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
  }

  /* Único elemento saturado do Hero. Raio curto e sem ícone de
     seta: pílula com seta deslizante lê como botão de marketing,
     retângulo de canto curto lê como controle.
     Nenhum estado move o elemento — instrumento não salta. */
  .cchero-cta {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 26px;
    background: var(--cch-purple-rec);
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    border: 0;
    border-radius: 10px;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.18s ease;
  }
  .cchero-cta:hover { background: #4348e0; }
  .cchero-cta:active { background: #3e43d2; }

  /* O sublinhado usa a cor e a espessura do circuito: a ação
     secundária pertence ao mesmo sistema de traço. */
  .cchero-link {
    display: inline-flex; align-items: center;
    padding-bottom: 2px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    color: var(--cch-ink);
    text-decoration: none;
    white-space: nowrap;
    border-bottom: 1px solid var(--cch-muted);
    transition: border-color 0.18s ease;
  }
  .cchero-link:hover { border-bottom-color: var(--cch-ink); }

  /* ---------- Circuito ----------
     Largura igual à faixa; altura vinda da geometria. O SVG é
     desenhado 1:1 em pixels (viewBox = medida real), então a
     espessura é constante e o raio da curva não deforma em
     nenhuma largura. */
  .cchero-circuito {
    position: relative;
    flex: none;
    width: var(--cc-faixa);
    margin-inline: auto;
    /* A altura vem do JS (só a parte de cima do desenho). O SVG é
       absoluto e mais alto: é assim que o ramo atravessa o campo
       aberto abaixo sem alterar o layout aprovado. */
  }
  .cchero-circuito svg {
    position: absolute;
    top: 0; left: 0;
    display: block;
    pointer-events: none;
  }

  .cchero-traco {
    fill: none;
    stroke: var(--cch-muted);
    stroke-width: 1.25;
    stroke-linecap: butt;
  }

  /* E1-E6 discretas em repouso: mesma cor, meia presença. É o que
     impede o horizonte de ler como régua. */
  .cchero-graduacoes { opacity: 0.55; }

  /* Única estação nomeada do Hero. Fica sobre a linha, sem
     bolinha e sem cor de marca — é marcação de escala, não
     eyebrow. */
  /* Só posição: a tipografia inteira vem do átomo .cc-most, que é
     o mesmo nas sete estações da página. O bloco desce por dentro
     do campo aberto abaixo do horizonte — à direita da linha, que
     continua descendo na prumada de E0. */
  .cchero-estacao { position: absolute; }

  /* Campo aberto abaixo do horizonte. Vazio de propósito: é onde
     a linha continua. */
  .cchero-base { flex: none; height: var(--cc-hero-base); }

  /* ---------- Tablet ---------- */
  @media (max-width: 1119px) {
    .cchero { --cc-hero-vao: 96px; }
    .cchero-bloco { max-width: 62%; }
    .cchero-title { font-size: 52px; }
    .cchero-lead { margin-top: 24px; font-size: 16px; }
    .cchero-acoes { margin-top: 36px; gap: 16px; }
    /* Aperta antes de eliminar: a coluna continua inteira, com as
       quatro leituras, só com menos respiro e um degrau de escala
       a menos. Nenhum dado sai no tablet. */
    .cchero-linha { gap: 32px; }
    .cchero-indice { gap: 22px; }
    .cchero-idx .cc-most-val { font-size: 14px; }
  }

  /* ---------- Mobile ----------
     A topologia do circuito é a mesma: mesmo horizonte, mesmas
     sete estações, mesma curva, mesmo segmento vertical. O que
     muda é a composição — o campo à direita do texto deixa de
     existir e os CTAs empilham. */
  @media (max-width: 767px) {
    .cchero {
      --cc-hero-vao: 72px;
      --cc-hero-base: clamp(160px, 30vh, 260px);
    }
    .cchero-texto { padding-top: calc(var(--cc-hero-nav) + 24px); }
    /* A coluna de leitura SAI, inteira. Não desce para baixo do CTA
       nem empilha depois dele: aqui ela não teria a largura para
       ficar à direita, e empilhada viraria uma segunda lista sem
       relação com a composição. A identidade no mobile continua
       pela estação local — 01/07, a unidade, o valor e a linha que
       dobra logo abaixo do texto. */
    .cchero-indice { display: none; }
    .cchero-linha { display: block; }
    .cchero-bloco { max-width: 100%; }
    .cchero-title { font-size: 36px; }
    .cchero-lead { margin-top: 20px; }
    .cchero-acoes {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      margin-top: 32px;
    }
    .cchero-cta { font-size: 16px; padding: 15px 24px; }
    .cchero-link { font-size: 16px; align-self: flex-start; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cchero-cta, .cchero-link { transition: none; }
  }
`;

export default HERO_CSS;
