/* =========================================================
   CSS da seção Produto.

   Mesma linguagem do Hero: fundo #f4f5f7, traço grafite de
   1,25px, rótulos de estação em 11px tabular, índigo reservado
   para um único elemento — aqui, o mês corrente do gráfico.

   As propriedades do traço estão duplicadas em vez de importadas
   do Hero de propósito: o Hero está aprovado e congelado nesta
   fase, e fazer as duas seções dependerem do mesmo bloco de CSS
   injetado exigiria mexer nele. São quatro linhas.

   Nenhuma medida do circuito vive aqui — o desenho todo vem de
   circuitoGeometria.js. Aqui há cor, espessura e posição de
   rótulo, nada mais.
   ========================================================= */

const PRODUTO_CSS = `
  .ccprod {
    position: relative;
    background: #f4f5f7;
    padding-top: clamp(44px, 4.4vw, 72px);
  }

  .ccprod-faixa {
    width: var(--cc-faixa);
    margin-inline: auto;
  }

  /* Prioridade 4 da seção: o texto explica, não anuncia. Um quarto
     do tamanho da headline do Hero e o mesmo peso — é a mesma voz
     falando mais baixo, não outra tipografia. */
  .ccprod-titulo {
    margin: 0;
    max-width: 30ch;
    font-size: clamp(20px, 2.2vw, 27px);
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: var(--cch-ink);
  }

  /* ---------- Circuito ---------- */
  .ccprod-circuito {
    position: relative;
    width: var(--cc-faixa);
    margin-inline: auto;
    margin-top: clamp(20px, 2.2vw, 36px);
  }
  /* Altura vinda do JS; o SVG é absoluto e sobe acima do bloco para
     receber o traço na borda superior da seção. */
  .ccprod-circuito svg {
    position: absolute;
    left: 0;
    display: block;
    pointer-events: none;
  }

  .ccprod-traco {
    fill: none;
    stroke: var(--cch-muted);
    stroke-width: 1.25;
    stroke-linecap: butt;
    stroke-linejoin: round;
  }

  /* O único elemento saturado da seção: o mês corrente. Índigo
     marca o estado vivo, e nada mais na página o usa. */
  .ccprod-atual {
    fill: var(--cch-purple-rec);
    stroke: #f4f5f7;
    stroke-width: 2;
  }

  /* ---------- Rótulos ----------
     Os mostradores das estações são posicionados aqui e nada mais:
     a tipografia inteira vem do átomo .cc-most, compartilhado pelas
     sete estações da página. */
  .ccprod-leitura,
  .ccprod-mes,
  .ccprod-valor {
    position: absolute;
    margin: 0;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .ccprod-mes {
    font-size: 11px;
    font-weight: 500;
    color: var(--cch-muted);
    transform: translateX(-50%);
  }
  /* O último mês não é centrado: a linha desce exatamente na
     prumada dele e passaria por cima do rótulo. */
  .ccprod-mes.is-ultimo { transform: none; }
  /* O valor da estação 03 mora fora do bloco dela: alinhado à
     direita na prumada da última leitura, ele lê como cabeçalho do
     gráfico junto com o nome à esquerda. Mesmo nível tipográfico
     dos outros valores, só deslocado. */
  .ccprod-valor {
    margin-top: -2px;
    transform: translateX(-100%);
  }

  /* ---------- Painel do produto ----------
     A descida continua ao lado dele, na mesma prumada em que o
     gráfico terminou. O painel não flutua: sem sombra, sem brilho
     de aresta, sem moldura de janela com bolinhas. */
  /* O respiro final da seção fica DENTRO deste bloco, não no
     padding da seção: assim a altura medida inclui esse trecho e a
     descida chega à borda inferior, no mesmo x em que a próxima
     seção vai continuar. Com o padding na seção, o traço parava
     acima do fim e a linha ficava interrompida entre as duas. */
  .ccprod-abaixo {
    position: relative;
    width: var(--cc-faixa);
    margin-inline: auto;
    padding-bottom: clamp(72px, 8vw, 120px);
  }
  /* Depois do painel no DOM: a descida corre na prumada da borda
     direita dele e precisa continuar visivel. Escondê-la atrás do
     painel criaria o intervalo em que o circuito desaparece —
     justamente o que não pode acontecer. */
  .ccprod-abaixo > svg {
    position: absolute;
    top: 0; left: 0;
    display: block;
    pointer-events: none;
  }

  .ccprod-painel {
    position: relative;
    /* Exatamente as colunas do gráfico: borda esquerda em E1, onde
       acontece a primeira leitura, e borda direita em E6, onde a
       última leitura vira descida. O painel deixa de ser um card
       solto no meio da seção e passa a ocupar a pegada do gráfico,
       pendurado no mesmo traço que desce rente a ele.
       Mesma largura de 70% aprovada — o que mudou foi a coluna. */
    margin-left: 22%;
    width: 70%;
    padding: 34px 38px 36px;
    border-radius: 12px;
    background: #070b14;
    border: 1px solid rgba(255, 255, 255, 0.07);
  }

  .ccprod-painel-topo {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px;
    padding-bottom: 20px;
    margin-bottom: 26px;
    border-bottom: 1px solid #1e293b;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    font-variant-numeric: tabular-nums;
    color: #94a3b8;
  }

  .ccprod-saudacao {
    margin: 0 0 22px;
    font-size: 14px; line-height: 1.5; color: #94a3b8;
  }

  .ccprod-grade {
    display: grid;
    grid-template-columns: 1.4fr 1fr 0.7fr;
    gap: 28px;
    align-items: end;
  }
  .ccprod-rot {
    margin: 0 0 6px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #94a3b8;
  }
  .ccprod-num {
    margin: 0;
    font-weight: 600;
    line-height: 1;
    color: #f8fafc;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .ccprod-num--grande { font-size: clamp(30px, 3vw, 40px); }
  .ccprod-num--medio { font-size: 21px; }

  .ccprod-meta {
    margin-top: 32px;
    padding-top: 28px;
    border-top: 1px solid #1e293b;
  }
  .ccprod-meta-linha {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }
  .ccprod-meta-nome {
    margin: 0; font-size: 13px; font-weight: 500; color: #e2e8f0;
  }
  .ccprod-meta-valor {
    margin: 0; font-size: 12px; color: #94a3b8;
    font-variant-numeric: tabular-nums;
  }
  /* Barra neutra e não índigo: o índigo já está no mês corrente do
     gráfico, e a regra é um elemento saturado por viewport. */
  .ccprod-barra {
    height: 3px; border-radius: 2px;
    background: rgba(255, 255, 255, 0.10);
    overflow: hidden;
  }
  .ccprod-barra span {
    display: block; height: 100%;
    background: rgba(248, 250, 252, 0.82);
  }

  /* ---------- Tablet ---------- */
  @media (max-width: 1119px) {
    /* Mesmas colunas do desktop: as estações são frações, então
       E1->E6 vale em qualquer largura. */
    .ccprod-painel { margin-left: 22%; width: 70%; padding: 28px 28px 30px; }
    .ccprod-grade { gap: 18px; }
  }

  /* ---------- Mobile ----------
     O painel não é espremido: passa a ocupar a faixa inteira e
     empilha. O circuito continua sendo a espinha e o gráfico
     mantém os seis pontos. */
  @media (max-width: 767px) {
    /* Da prumada mestra até E6: no estreito o painel não cabe
       recuado até E1, então ele encosta na esquerda e mantém a borda
       direita na mesma prumada da descida. */
    .ccprod-painel {
      margin-left: 0;
      width: 92%;
      padding: 22px 20px 24px;
    }
    /* O saldo ocupa a linha inteira: dividindo a largura com ele,
       "Investido" não cabia e o número era cortado pela borda do
       painel. Nenhum dado sai — a leitura passa a ser em duas
       linhas. */
    .ccprod-grade {
      grid-template-columns: 1fr 1fr;
      gap: 20px 18px;
    }
    .ccprod-grade > * { min-width: 0; }
    .ccprod-grade > :first-child { grid-column: 1 / -1; }
    .ccprod-num--grande { font-size: 26px; }
    .ccprod-painel-topo { flex-direction: column; align-items: flex-start; gap: 6px; }
  }
`;

export default PRODUTO_CSS;
