/* =========================================================
   GEOMETRIA DO CIRCUITO — Hero

   Fonte única da geometria da linha. Nenhuma medida do traço
   vive no CSS: tudo aqui é função pura da largura da faixa de
   conteúdo, para que o desenho seja determinístico e igual em
   qualquer viewport.

   Sistema de coordenadas (Fase 1):

     x  normalizado sobre a FAIXA de conteúdo — 0 é a margem
        esquerda, 1 a direita. As sete estações são equidistantes,
        derivadas de uma fórmula e não escolhidas uma a uma.
     y  em pixels, com 0 no topo do SVG. O horizonte fica a
        MARGEM_TOPO do topo para que a metade de cima do traço
        não seja cortada.

   No Hero só existem três peças, e todas nascem daqui:

     horizonte   a reta de x=0 a x=1
     ramo        o rabicho à esquerda de E0, a curva de 90° e o
                 segmento vertical de 24px que declara que a
                 linha continua abaixo
     graduações  as marcas de E1 a E6

   O ramo sai do horizonte com um filete de raio R em vez de
   encostar nele em ângulo reto. Uma marca perpendicular faria o
   conjunto ler como régua; o filete faz ler como derivação de um
   traçado — que é o que a linha é.
   ========================================================= */

/* Eₙ = 0,08 + n · (0,84 / 6). Sete posições, uma fórmula. */
export const ESTACOES = Object.freeze(
  Array.from({ length: 7 }, (_, n) => 0.08 + n * (0.84 / 6))
);

/* Comprimento do segmento vertical depois da curva. É ele que
   diz "continua abaixo" — e é o único convite de rolagem do
   Hero, no lugar de seta ou indicador.

   44px e não os 24px iniciais: contra um horizonte de 1120px,
   uma descida de 24px sumia e o conjunto voltava a ler como
   border-bottom. O que separa trajetória de divisor é a descida
   ter comprimento suficiente para ser vista como um segundo
   trecho da linha, e não como a ponta de um traço. Aumentar a
   espessura resolveria também, e é justamente o que não se pode
   fazer: o instrumento tem de continuar fino.

   48 e não 44: contra 1120px de horizonte a diferença entre os
   dois é pequena, mas 48 é o topo da faixa útil — acima disso a
   descida começa a disputar com o campo aberto que vem abaixo. */
const SEGMENTO_VERTICAL = 48;

/* Marca de E1 a E6. Curta de propósito: a régua começa a
   aparecer por volta de 6px. */
const GRADUACAO = 3;

const MARGEM_TOPO = 6;
const MARGEM_BASE = 8;

/* Afastamento do rótulo "01 — ENTRAR" em relação à curva. */
const ROTULO_ESQ = 10;
const ROTULO_ALTURA = 11;

const arred = (v) => Math.round(v * 100) / 100;

/* R = clamp(8px, faixa/64, 18px). Um valor para a página inteira:
   todo canto do circuito, em qualquer seção, usa este raio.

   Antes era faixa/90 (12px na faixa cheia). A 12px, contra um
   horizonte de 1120px, a curva lia como o canto arredondado de um
   traço e não como uma mudança de direção — e é a mudança de
   direção que separa trajetória de divisor. A 17,5px o giro é
   visível como giro. A espessura continua 1,25px: o que ganhou
   presença foi a geometria, não o peso. */
export function raioDeCanto(larguraFaixa) {
  return arred(Math.min(18, Math.max(8, larguraFaixa / 64)));
}

/* Converte uma estação (0 a 6) em pixels dentro da faixa. */
export function xDaEstacao(indice, larguraFaixa) {
  return arred(ESTACOES[indice] * larguraFaixa);
}

/**
 * Geometria completa do circuito do Hero.
 *
 * @param {number} larguraFaixa largura medida da faixa, em px
 * @returns {{
 *   largura: number, altura: number, horizonteY: number, raio: number,
 *   xEntrada: number, horizonte: string, ramo: string,
 *   graduacoes: {x: number, d: string}[],
 *   rotuloX: number, rotuloY: number
 * }}
 */
export function geometriaDoCircuito(larguraFaixa, alturaAbaixo = 0) {
  const L = arred(Math.max(0, larguraFaixa));
  const R = raioDeCanto(L);
  const yH = MARGEM_TOPO;

  const xEntrada = xDaEstacao(0, L);
  const fimDoRamo = arred(yH + R + SEGMENTO_VERTICAL);

  // O bloco do circuito ocupa só a parte de cima; o ramo continua
  // para dentro do campo aberto e sai pela borda inferior da seção.
  // SEGMENTO_VERTICAL deixa de ser o fim do traço e passa a ser
  // apenas onde o rótulo "01 — ENTRAR" pousa — a composição
  // aprovada não muda, a linha é que não para mais.
  const alturaTopo = arred(fimDoRamo + MARGEM_BASE);
  const alturaSvg = arred(alturaTopo + Math.max(0, alturaAbaixo));

  // O rabicho à esquerda de E0 é o que sobra do horizonte antes da
  // curva. Ele existe para que a linha não pareça começar na curva:
  // um ciclo não tem começo.
  const inicioDaCurva = arred(Math.max(0, xEntrada - R));

  return {
    largura: L,
    alturaAbaixo: arred(Math.max(0, alturaAbaixo)),
    alturaTopo,
    altura: alturaSvg,
    horizonteY: yH,
    raio: R,
    xEntrada,

    horizonte: `M 0 ${yH} H ${L}`,

    // Sentido horário (sweep 1): entra na horizontal, sai na vertical.
    ramo:
      `M ${inicioDaCurva} ${yH} ` +
      `A ${R} ${R} 0 0 1 ${xEntrada} ${arred(yH + R)} ` +
      `V ${alturaSvg}`,

    graduacoes: ESTACOES.slice(1).map((fracao, i) => {
      const x = xDaEstacao(i + 1, L);
      return { x, d: `M ${x} ${yH} V ${arred(yH + GRADUACAO)}` };
    }),

    // Rótulo no PÉ da descida, não no meio dela: assim o olho
    // percorre o segmento vertical até um ponto de chegada, e a
    // descida lê como trajeto com destino em vez de ponta solta.
    rotuloX: arred(xEntrada + ROTULO_ESQ),
    rotuloY: arred(yH + R + SEGMENTO_VERTICAL - ROTULO_ALTURA),
  };
}

export default geometriaDoCircuito;

/* =========================================================
   PRODUTO — etapas 02 (ORGANIZAR) e 03 (ANALISAR)

   Mesmo circuito do Hero: mesmas estações, mesmo raio, mesma
   espessura, mesmo SVG 1:1. A única coisa nova é o que a linha
   faz — deixa de ser abstração, vira estrutura (as contas que
   convergem) e depois vira dado (o fluxo dos seis meses).

   Duas decisões de geometria valem registro:

   1. As quatro entradas nascem em x = 0 da faixa, exatamente onde
      o horizonte do Hero começava. Não são quatro objetos soltos:
      são quatro traços entrando pela mesma prumada mestra da
      página e se juntando ao eixo que desceu do Hero.

   2. Os seis valores do fluxo pousam nas estações E1 a E6. As seis
      graduações que no Hero eram anônimas se revelam aqui como os
      seis últimos meses — a escala do instrumento e a escala do
      dado passam a ser a mesma escala. É por isso que o gráfico
      ocupa cinco degraus em vez de um: ele É a régua.
   ========================================================= */

/* Distâncias verticais do bloco, todas em px e todas medidas a
   partir do topo do bloco. Nenhuma é escolhida por aparência: a
   primeira é o quanto a linha desce antes da primeira conta, a
   segunda é o espaçamento entre contas e a terceira é a folga
   antes do degrau. */
/* 36 e não 52: a descida entre a entrada do Hero e a primeira conta
   era trecho de linha sem nada acontecendo, e é justamente onde o
   vazio 01->02 podia encolher sem tocar no gráfico. */
const PRODUTO_ENTRADA = 36;
const PRODUTO_PASSO_CONTA = 26;
const PRODUTO_APOS_CONTAS = 40;
/* Folga depois da fileira de meses até o fim do bloco. 40 e não os
   76 iniciais: o painel precisa vir logo depois da leitura para ser
   lido como consequência dela, e não como um bloco à parte mais
   abaixo na página. */
const PRODUTO_APOS_PLOT = 40;

/**
 * Geometria do bloco superior do Produto: entrada, convergência
 * das contas, degrau e gráfico.
 *
 * @param {object} p
 * @param {number} p.largura     largura medida da faixa, em px
 * @param {number[]} p.valores   fluxo[].liquido — dados reais
 * @param {number} p.contas      demoAccount.contasAtivas
 * @param {number} p.plotAltura  altura da caixa de plotagem, em px
 */
export function geometriaDoProduto({ largura, valores, contas, plotAltura = 180, entrada = 0 }) {
  const L = arred(Math.max(0, largura));
  // Distância entre o topo da seção e o topo deste bloco. O eixo
  // começa acima do bloco, em y negativo, para receber o traço na
  // borda exata em que o Hero o entrega — sem um segundo desenho
  // no meio.
  const acima = arred(Math.max(0, entrada));
  const R = raioDeCanto(L);
  const xEixo = xDaEstacao(0, L);
  const xPlot0 = xDaEstacao(1, L);
  const xPlotN = xDaEstacao(6, L);

  // ---- Convergência das contas ----
  const nContas = Math.max(0, Math.floor(contas) || 0);
  const yContas = Array.from(
    { length: nContas },
    (_, i) => arred(PRODUTO_ENTRADA + i * PRODUTO_PASSO_CONTA)
  );
  const yUltimaConta = yContas.length ? yContas[yContas.length - 1] + R : PRODUTO_ENTRADA;

  // ---- Degrau E0 -> E1 ----
  const yDegrau = arred(yUltimaConta + PRODUTO_APOS_CONTAS);
  // A folga entre o fim do degrau e o topo da plotagem é o espaço
  // do rótulo da estação 03 — não é respiro decorativo.
  const plotTopo = arred(yDegrau + R * 2 + 44);
  const plotBase = arred(plotTopo + plotAltura);

  // ---- Escala vertical do gráfico ----
  // O piso é o zero, não o menor valor: encolher a base exagera a
  // variação e faria o desenho mentir sobre o dado.
  const teto = Math.max(0, ...valores);
  const piso = Math.min(0, ...valores);
  const amplitude = teto - piso || 1;
  const yDoValor = (v) => arred(plotBase - ((v - piso) / amplitude) * plotAltura);

  // Seis valores caem nas seis estações. Com outra quantidade, a
  // distribuição é uniforme entre E1 e E6 — o desenho continua
  // determinístico se a conta demo mudar de tamanho.
  const naRegua = valores.length === ESTACOES.length - 1;
  const xDoIndice = (i) => (naRegua
    ? xDaEstacao(i + 1, L)
    : arred(xPlot0 + (xPlotN - xPlot0) * (i / Math.max(1, valores.length - 1))));

  const pontos = valores.map((v, i) => ({ x: xDoIndice(i), y: yDoValor(v), valor: v }));

  // Os meses pousam logo abaixo do ponto MAIS BAIXO do gráfico, e
  // não da linha do zero: ancorados no zero eles ficavam ~80px
  // afastados do traço e liam como legenda solta. A escala dos
  // dados não muda — só a linha de rótulos sobe até encostar no
  // desenho.
  const yMaisBaixo = pontos.length ? Math.max(...pontos.map((p) => p.y)) : plotBase;
  const yMeses = arred(yMaisBaixo + 22);
  const altura = arred(yMeses + PRODUTO_APOS_PLOT);

  // ---- Eixo: desce do Hero, dobra para E1, desce, vira gráfico,
  //      e volta a descer na última leitura ----
  const eixo = [
    `M ${xEixo} ${-acima}`,
    `V ${yDegrau}`,
    `A ${R} ${R} 0 0 0 ${arred(xEixo + R)} ${arred(yDegrau + R)}`,
    `H ${arred(xPlot0 - R)}`,
    `A ${R} ${R} 0 0 1 ${xPlot0} ${arred(yDegrau + R * 2)}`,
    pontos.length ? `V ${pontos[0].y}` : '',
    ...pontos.slice(1).map((p) => `L ${p.x} ${p.y}`),
    pontos.length ? `V ${altura}` : '',
  ].filter(Boolean).join(' ');

  return {
    largura: L,
    altura,
    acima,
    alturaSvg: arred(altura + acima),
    raio: R,
    xEixo,
    xPlot0,
    xPlotN,
    eixo,
    // Cada conta entra pela prumada mestra e curva para dentro do eixo.
    contas: yContas.map((y) => ({
      y,
      d: `M 0 ${y} H ${arred(xEixo - R)} A ${R} ${R} 0 0 1 ${xEixo} ${arred(y + R)}`,
    })),
    pontos,
    plot: { topo: plotTopo, base: plotBase, altura: arred(plotAltura) },
    rotulos: {
      // Centrado no grupo de contas, à direita do eixo — nunca sobre
      // os traços que entram, que ficam todos à esquerda dele.
      organizar: {
        x: arred(xEixo + 14),
        y: arred(PRODUTO_ENTRADA + ((Math.max(1, nContas) - 1) * PRODUTO_PASSO_CONTA) / 2 - 14),
      },
      analisar: { x: arred(xPlot0 + 14), y: arred(yDegrau + R * 2 + 4) },
      meses: yMeses,
    },
  };
}

/**
 * Trecho que continua descendo ao lado do painel, até o fim da
 * seção. Fica em E6 — a mesma prumada em que o gráfico terminou.
 */
export function geometriaDaDescida(largura, altura) {
  const L = arred(Math.max(0, largura));
  const A = arred(Math.max(0, altura));
  return { largura: L, altura: A, x: xDaEstacao(6, L), d: `M ${xDaEstacao(6, L)} 0 V ${A}` };
}

/* =========================================================
   ADVISOR — etapa 04 (DECIDIR)

   O circuito chega do Produto na mesma prumada em que o gráfico
   terminou (E6) e continua descendo por toda a seção. Do eixo sai
   um ramo que vira para a esquerda e se torna o sublinhado do
   campo de decisão.

   É de propósito um RAMO e não um desvio do caminho principal: o
   eixo não anda para a esquerda, ele segue reto até a seção
   seguinte. O que a composição diz é "a leitura que desceu até
   aqui alimenta esta decisão" — a mesma figura das quatro contas
   do Produto, invertida no sentido.
   ========================================================= */

/**
 * @param {object} p
 * @param {number} p.largura  largura medida da faixa, em px
 * @param {number} p.altura   altura total da seção, em px
 * @param {number} p.yCampo   linha de base do campo, medida do topo
 */
export function geometriaDoAdvisor({ largura, altura, yCampo }) {
  const L = arred(Math.max(0, largura));
  const A = arred(Math.max(0, altura));
  const R = raioDeCanto(L);
  const x = xDaEstacao(6, L);
  // O ramo precisa de R de folga acima da linha de base para a
  // curva caber sem cortar.
  const y = arred(Math.min(Math.max(R, yCampo), Math.max(R, A)));

  return {
    largura: L,
    altura: A,
    raio: R,
    x,
    // Largura útil do campo: até onde o sublinhado vai antes da curva.
    larguraCampo: arred(Math.max(0, x - R)),
    eixo: `M ${x} 0 V ${A}`,
    // Sentido horário (sweep 1): desce e vira para a esquerda.
    sublinhado: `M ${x} ${arred(y - R)} A ${R} ${R} 0 0 1 ${arred(x - R)} ${y} H 0`,
  };
}

/* =========================================================
   PASSAGEM — estações 05 (INVESTIR) e 06 (EVOLUIR)

   Duas estações do mesmo eixo, entre DECIDIR e os Planos. Não é
   uma seção de conteúdo: é o trecho em que o circuito atravessa
   duas etapas que não têm tela própria — elas são consequências,
   não interfaces.

   ---------- Por que não há degrau horizontal aqui ----------

   O mapa da Fase 1 previa INVESTIR em E4 e EVOLUIR em E5, com um
   degrau ortogonal em cada. Esse mapa assumia que o eixo chegaria
   aqui em E3. Não foi o que aconteceu: na Fase 3B o gráfico do
   Produto passou a ocupar E1..E6 — as seis graduações viraram os
   seis meses — e desde então o eixo desce em E6 (0,92).

   Ir de 0,92 até E4 (0,64) e depois E5 (0,78) seria andar para a
   ESQUERDA duas vezes. Isso quebraria a lei que sustenta o
   fechamento do ciclo: a única inversão horizontal da página é o
   RETORNO. Entre perder o degrau e perder o retorno, o degrau é o
   que custa menos — ele era forma, o retorno é o conceito.

   As estações viram então marcas de graduação no próprio eixo,
   que é a mesma linguagem das seis graduações do Hero. A palavra
   fica sendo legenda do eixo, que é exatamente o que o briefing
   desta fase pede.
   ========================================================= */

/* Comprimento da marca de estação, perpendicular ao eixo.

   44px e não os 10px iniciais: a 10px a marca lia como um tique e
   a palavra ao lado parecia um texto solto perto da linha. Com um
   traço desse comprimento a legenda passa a nascer visivelmente da
   graduação, que por sua vez nasce do eixo.

   A marca cresce para a ESQUERDA porque o eixo está em E6 (0,92):
   à direita dele sobram 8% da faixa — 90px no desktop e 27px no
   mobile, onde nenhuma legenda caberia. É o espelho horizontal do
   desenho, com a mesma leitura.

   Perpendicular e sem filete, de propósito: o filete é a figura
   dos ramos (o do Hero, os das contas, o do campo do Advisor). Uma
   graduação encosta no eixo em ângulo reto, como as seis do
   horizonte do Hero. */
const PASSAGEM_MARCA = 44;

/* Afastamento entre a ponta da marca e o fim do rótulo. 8px: perto
   o suficiente para os dois lerem como uma peça só. */
const PASSAGEM_ROTULO = 8;

/**
 * @param {object} p
 * @param {number} p.largura  largura medida da faixa, em px
 * @param {number} p.altura   altura total da seção, em px
 * @param {number[]} p.ys     centro vertical de cada rótulo, medido
 *                            do topo da seção — vem do DOM, nunca
 *                            de um valor fixo em pixels
 */
export function geometriaDaPassagem({ largura, altura, ys = [] }) {
  const L = arred(Math.max(0, largura));
  const A = arred(Math.max(0, altura));
  const x = xDaEstacao(6, L);

  return {
    largura: L,
    altura: A,
    x,
    // Largura da coluna dos rótulos: eles terminam encostando na
    // marca, alinhados à direita.
    larguraRotulo: arred(Math.max(0, x - PASSAGEM_MARCA - PASSAGEM_ROTULO)),
    eixo: `M ${x} 0 V ${A}`,
    marcas: ys.map((y) => {
      const yy = arred(y);
      return { y: yy, d: `M ${x} ${yy} H ${arred(x - PASSAGEM_MARCA)}` };
    }),
  };
}

/* =========================================================
   PLANOS — estação 07 (ESCOLHER)

   O eixo chega da Passagem em E6 e continua descendo por toda a
   seção. Não há figura nova aqui: os planos se organizam EM
   RELAÇÃO ao eixo, não em volta de um desenho próprio.

   O conteúdo termina a 2R do eixo. O corredor não é um número
   escolhido a olho: é o dobro do raio de canto da página, o mesmo
   R que define toda curva do circuito. Assim ele acompanha a
   faixa (35px no desktop, 25px no tablet, 16px no mobile) e os
   cards nunca encostam no traço nem o escondem.
   ========================================================= */

/**
 * @param {object} p
 * @param {number} p.largura  largura medida da faixa, em px
 * @param {number} p.altura   altura total da seção, em px
 */
export function geometriaDosPlanos({ largura, altura }) {
  const L = arred(Math.max(0, largura));
  const A = arred(Math.max(0, altura));
  const R = raioDeCanto(L);
  const x = xDaEstacao(6, L);

  return {
    largura: L,
    altura: A,
    raio: R,
    x,
    larguraUtil: arred(Math.max(0, x - R * 2)),
    eixo: `M ${x} 0 V ${A}`,
  };
}

/* =========================================================
   RETORNO — fechamento do circuito

   Depois dos Planos a linha desce em E6, vira para a esquerda,
   atravessa a faixa e sobe um trecho curto em E0 — a mesma coluna
   em que o horizonte do Hero começou a descer.

   É a ÚNICA vez em toda a página que o traçado anda para a
   esquerda. Foi para preservar essa exclusividade que as estações
   05 e 06 viraram graduações em vez de degraus: se a linha
   voltasse em qualquer outro ponto, esta inversão deixaria de
   significar fechamento e viraria só mais uma curva.

   Não há laço fechado: a subida termina no ar. O ciclo é
   completado por quem olha, não pelo desenho — e é por isso que
   não há seta, ponto, círculo nem legenda na ponta.

   Nada aqui é escolhido a olho. A folga inferior é 5R, a subida é
   3R e o raio é o mesmo R da página: se a faixa mudar, a
   proporção acompanha.
   ========================================================= */

/**
 * @param {object} p
 * @param {number} p.largura  largura medida da faixa, em px
 * @param {number} p.altura   altura medida da zona de retorno, em px
 */
export function geometriaDoRetorno({ largura, altura }) {
  const L = arred(Math.max(0, largura));
  const A = arred(Math.max(0, altura));
  const R = raioDeCanto(L);
  const x6 = xDaEstacao(6, L);
  const x0 = xDaEstacao(0, L);

  /* Folga abaixo da horizontal. Sem ela a linha encostaria no fim
     da página e leria como border-bottom do site — mas 5R era mais
     do que o necessário e engordava o "U". 3,5R mantém claro que a
     linha está dentro da página, não no limite dela. */
  const folga = arred(Math.max(48, R * 3.5));
  /* Subida final: curta o bastante para dizer "isto poderia
     continuar" sem virar um novo eixo vertical. Baixou de 3R para
     2R porque, com a altura total menor, 3R já lia como uma segunda
     parede vertical. */
  const subida = arred(Math.max(30, R * 2));

  const yHorizontal = arred(Math.max(R, A - folga));
  const yCurva = arred(Math.max(0, yHorizontal - R));
  const yTopo = arred(Math.max(0, yCurva - subida));

  return {
    largura: L,
    altura: A,
    raio: R,
    x0,
    x6,
    yHorizontal,
    // Comprimentos dos três trechos, para conferência.
    descida: yCurva,
    horizontal: arred(Math.max(0, (x6 - R) - (x0 + R))),
    subida: arred(yCurva - yTopo),
    folgaInferior: folga,

    // Um path só. Os dois cantos são de 90° com o raio da página,
    // no mesmo sentido horário dos demais filetes do circuito.
    d: `M ${x6} 0 `
      + `V ${yCurva} `
      + `A ${R} ${R} 0 0 1 ${arred(x6 - R)} ${yHorizontal} `
      + `H ${arred(x0 + R)} `
      + `A ${R} ${R} 0 0 1 ${x0} ${yCurva} `
      + `V ${yTopo}`,
  };
}
