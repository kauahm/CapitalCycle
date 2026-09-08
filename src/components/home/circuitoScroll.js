import { useLayoutEffect } from 'react';

/* =========================================================
   MOTOR DO CIRCUITO — revelação da linha pelo scroll

   Um controlador para a Home inteira: um listener de scroll, um
   requestAnimationFrame, um ResizeObserver e um
   IntersectionObserver. As seções não têm laço próprio — elas
   apenas se registram aqui com os seus trechos.

   O scroll controla UMA coisa: quanto de cada path está
   desenhado. Nada de texto, card, gráfico ou seção é animado.

   Sem easing, mola, suavização ou inércia: a posição real do
   documento é soberana. Rolar para trás apaga na ordem inversa, e
   um salto de âncora assume o estado correto no mesmo frame.

   ---------- Continuidade entre seções ----------

   O progresso de cada seção é derivado da própria caixa dela em
   relação à linha de leitura:

     inicio = topo    - linhaDeLeitura
     fim    = base    - linhaDeLeitura
     p      = (scrollY - inicio) / (fim - inicio)

   Como as seções são adjacentes, o `fim` de uma é exatamente o
   `inicio` da seguinte: quando uma chega a p=1, a próxima está em
   p=0. A emenda da revelação coincide com a emenda geométrica sem
   precisar de nenhum ajuste.

   ---------- Sem JS, o circuito continua inteiro ----------

   O `stroke-dasharray` só é aplicado depois que o controlador
   monta e confirma que há movimento permitido. Se o JS falhar, ou
   se o visitante pediu movimento reduzido, os paths permanecem
   exatamente como estão no HTML: completos. A aplicação acontece
   em useLayoutEffect, antes da pintura, então não há um quadro
   com a linha inteira antes de ela recuar.
   ========================================================= */

/* Altura da linha de leitura, em fração da viewport. Um trecho
   passa a existir quando cruza esta linha — abaixo do centro, para
   o traço chegar um pouco antes do texto que ele acompanha. */
const LINHA_DE_LEITURA = 0.62;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Mapeia o progresso da seção para o progresso de um trecho que
   ocupa apenas a janela [de, ate] dela. */
const naJanela = (p, de, ate) => (ate > de ? clamp01((p - de) / (ate - de)) : (p >= ate ? 1 : 0));

const registro = new Set();

/* Painéis que querem saber qual estação é a corrente — hoje só a
   coluna de leitura do Hero. Não há um segundo motor para isso: o
   estágio sai do MESMO progresso já calculado para desenhar a
   linha, e a marca só é reescrita quando o número muda. */
const paineis = new Set();
let estacaoAtual = 1;

let raf = null;
let observadorTamanho = null;
let observadorVisibilidade = null;
let ouvindo = false;
let semMovimento = false;
let debug = null;

/* ---------- Medição ----------
   getTotalLength() é caro e nunca roda por frame: só na montagem e
   quando a geometria muda de tamanho de verdade. */
function medir(entrada) {
  const caixa = entrada.raiz.getBoundingClientRect();
  entrada.topo = caixa.top + window.scrollY;
  entrada.altura = caixa.height;

  entrada.trechos.forEach((trecho) => {
    if (!trecho.el) return;
    const comprimento = trecho.el.getTotalLength();
    trecho.comprimento = comprimento;
    if (!semMovimento) {
      trecho.el.style.strokeDasharray = `${comprimento}`;
    }
  });
}

function medirTudo() {
  registro.forEach(medir);
}

/* ---------- Escrita ----------
   Só escrita, nenhuma leitura de layout aqui dentro: as métricas
   já foram lidas na fase de medição. */
function escrever(entrada, p) {
  entrada.trechos.forEach((trecho) => {
    if (!trecho.el || trecho.comprimento == null) return;
    const local = naJanela(p, trecho.de, trecho.ate);
    // `inicial` é o quanto do trecho já nasce desenhado. O resto
    // continua linear a partir dali — é um deslocamento da reta, não
    // um easing: a resposta ao scroll segue 1:1.
    const base = trecho.inicial || 0;
    const visivel = base + (1 - base) * local;
    trecho.visivel = visivel;
    trecho.el.style.strokeDashoffset = `${trecho.comprimento * (1 - visivel)}`;
  });

  // Marcas e pontos: presença binária, sem fade nem deslocamento.
  entrada.binarios.forEach((bin) => {
    if (!bin.el) return;
    bin.el.style.visibility = atingido(entrada, bin, p) ? 'visible' : 'hidden';
  });

  entrada.progresso = p;
}

/* Estações alcançadas por esta seção. Mesmo gatilho das marcas —
   nenhuma medida nova, nenhum laço novo. Roda também para as
   seções assentadas fora da viewport, que não precisam ser
   redesenhadas mas continuam valendo para a conta. */
function contarEstacoes(entrada, p) {
  entrada.estacoes.forEach((est) => {
    if (atingido(entrada, est, p) && est.n > maiorEstacao) maiorEstacao = est.n;
  });
}

/* Um trecho chegou ao ponto de gatilho?

   Quando `trecho` é informado, o gatilho é o progresso local
   daquele trecho — assim a marca nunca aparece antes de a linha
   ter chegado nela. `restante` diz quanto de path ainda sobra
   depois do ponto de gatilho; convertido em fração aqui, onde o
   comprimento já foi medido, ele cai exatamente no vértice, e não
   no fim do trecho inteiro. */
function atingido(entrada, spec, p) {
  const alvo = spec.trecho != null ? entrada.trechos[spec.trecho] : null;
  let limite = spec.em;
  if (alvo && spec.restante != null && alvo.comprimento) {
    limite = (alvo.comprimento - spec.restante) / alvo.comprimento;
  }
  const base = alvo ? (alvo.visivel != null ? alvo.visivel : 0) : p;
  return base >= limite;
}

/* Repinta a marca de estágio corrente. Só é chamada quando o número
   muda de fato — nunca por quadro. Cada painel acende a maior das
   suas entradas que já foi alcançada, então uma coluna que lista
   apenas 01, 03, 05 e 07 continua correta enquanto o circuito passa
   por 02, 04 e 06. */
function pintarEstacoes() {
  paineis.forEach((painel) => {
    let escolhida = null;
    painel.itens.forEach((item) => {
      if (item.n <= estacaoAtual && (escolhida == null || item.n > escolhida)) {
        escolhida = item.n;
      }
    });
    painel.itens.forEach((item) => {
      item.el.classList.toggle('is-corrente', item.n === escolhida);
    });
  });
}

function completar(entrada) {
  entrada.trechos.forEach((trecho) => {
    if (!trecho.el) return;
    trecho.el.style.strokeDasharray = '';
    trecho.el.style.strokeDashoffset = '';
  });
  entrada.binarios.forEach((bin) => {
    if (bin.el) bin.el.style.visibility = '';
  });
}

/* A linha de leitura escorrega até a base da viewport nos últimos
   pixels do documento.

   Sem isto a última seção nunca seria desenhada: a página acaba
   antes de ela cruzar os 62%, e o Retorno — justamente o trecho
   que fecha o ciclo — ficaria preso em p=0 para sempre.

   Como o deslocamento depende só do scroll, e não da seção, o
   `fim` de uma continua sendo exatamente o `inicio` da seguinte:
   a emenda da revelação não se desfaz. */
function linhaDeLeitura(y) {
  const vh = window.innerHeight;
  const base = vh * LINHA_DE_LEITURA;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
  const restante = Math.max(0, maxScroll - y);
  return base + Math.max(0, (vh - base) - restante);
}

/* Maior estação alcançada no quadro corrente. Vive fora de
   `escrever` porque a conta é da página inteira, e não de uma
   seção: o Hero lista estações que só são alcançadas lá embaixo. */
let maiorEstacao = 1;

function aplicar() {
  raf = null;
  if (semMovimento) return;

  const y = window.scrollY;
  const leitura = linhaDeLeitura(y);
  maiorEstacao = 1;

  registro.forEach((entrada) => {
    // Fora da vizinhança da viewport a seção não precisa de
    // atualização por frame — ela já está em 0 ou em 1.
    if (!entrada.visivel && entrada.assentada) {
      contarEstacoes(entrada, entrada.progresso || 0);
      return;
    }

    // A primeira seção começa no topo do documento: sem isto a
    // linha de leitura já nasce dentro dela e boa parte do traço
    // apareceria pronta antes de qualquer scroll. O `fim` não muda,
    // então a emenda com a seção seguinte continua exata.
    const inicio = entrada.ancorarNoTopo ? entrada.topo : entrada.topo - leitura;
    const fim = entrada.topo + entrada.altura - leitura;
    const p = fim > inicio ? clamp01((y - inicio) / (fim - inicio)) : 1;

    escrever(entrada, p);
    contarEstacoes(entrada, p);
    entrada.assentada = !entrada.visivel;
  });

  // Uma única escrita, e só quando o estágio muda de verdade.
  if (maiorEstacao !== estacaoAtual) {
    estacaoAtual = maiorEstacao;
    pintarEstacoes();
  }

  if (debug) atualizarDebug(y, leitura);
}

function agendar() {
  if (raf === null) raf = requestAnimationFrame(aplicar);
}

/* ---------- Ciclo de vida do controlador ---------- */
function ligar() {
  if (ouvindo) return;
  ouvindo = true;

  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', aoRedimensionar, { passive: true });

  observadorTamanho = new ResizeObserver(aoRedimensionar);
  observadorVisibilidade = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        const alvo = [...registro].find((r) => r.raiz === e.target);
        if (!alvo) return;
        alvo.visivel = e.isIntersecting;
        if (e.isIntersecting) alvo.assentada = false;
      });
      agendar();
    },
    // Margem generosa: a seção entra no laço antes de aparecer, então
    // nunca há um quadro com o trecho parado no valor errado.
    { rootMargin: '60% 0px' }
  );

  registro.forEach((entrada) => {
    observadorTamanho.observe(entrada.raiz);
    observadorVisibilidade.observe(entrada.raiz);
  });
}

function desligar() {
  if (!ouvindo) return;
  ouvindo = false;
  window.removeEventListener('scroll', agendar);
  window.removeEventListener('resize', aoRedimensionar);
  if (observadorTamanho) observadorTamanho.disconnect();
  if (observadorVisibilidade) observadorVisibilidade.disconnect();
  observadorTamanho = null;
  observadorVisibilidade = null;
  if (raf !== null) cancelAnimationFrame(raf);
  raf = null;
}

function aoRedimensionar() {
  // Remede tudo e reaplica no mesmo frame: o progresso é sempre
  // recalculado da posição real, então nada fica preso a um
  // comprimento de path antigo.
  medirTudo();
  registro.forEach((e) => { e.assentada = false; });
  agendar();
}

/* ---------- Preferência de movimento ---------- */
function sincronizarMovimento() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  semMovimento = mq.matches;
  return mq;
}

/* ---------- Overlay de conferência (?debug-circuito) ---------- */
function criarDebug() {
  const el = document.createElement('div');
  el.setAttribute('data-circuito-debug', '');
  el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;'
    + 'font:11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;'
    + 'white-space:pre;color:#131316;background:rgba(244,245,247,.92);'
    + 'border:1px solid rgba(19,19,22,.12);padding:8px 10px;border-radius:6px;'
    + 'pointer-events:none;';
  document.body.appendChild(el);
  return el;
}

function atualizarDebug(y, leitura) {
  const linhas = [`scrollY ${Math.round(y)}`, `readingY ${Math.round(leitura)}`];
  registro.forEach((e) => {
    const comprimentos = e.trechos.map((t) => Math.round(t.comprimento || 0)).join('/');
    const offsets = e.trechos
      .map((t) => Math.round((t.comprimento || 0) * (1 - naJanela(e.progresso || 0, t.de, t.ate))))
      .join('/');
    linhas.push(
      `${e.nome.padEnd(9)} p=${(e.progresso || 0).toFixed(3)} len=${comprimentos} off=${offsets}`
    );
  });
  debug.textContent = linhas.join('\n');
}

/* =========================================================
   Hook de registro.

   Cada seção chama isto com a sua raiz e uma função que devolve os
   trechos na ordem em que a linha os percorre. As janelas [de, ate]
   são sempre derivadas de medidas reais da própria seção — nunca
   de números de scroll fixos.

   Além dos trechos, a seção pode declarar as `estacoes` que o seu
   traço alcança — com o mesmo gatilho das marcas — e um `painel`
   que quer ser repintado quando o estágio corrente muda. Nenhum
   dos dois cria listener, RAF ou medição própria: os dois saem do
   progresso que já foi calculado para desenhar a linha.

   @param {object} raizRef   ref da caixa que define o progresso
   @param {function} montar  () => ({ trechos, binarios, estacoes, painel })
   @param {Array} deps       recalcula quando a geometria muda
   ========================================================= */
export default function useCircuitoScroll(raizRef, montar, deps = []) {
  useLayoutEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return undefined;

    const mq = sincronizarMovimento();
    const {
      trechos = [], binarios = [], estacoes = [], painel = null,
      nome = 'secao', ancorarNoTopo = false,
    } = montar() || {};

    // A coluna de leitura do Hero não tem laço próprio: ela só se
    // inscreve aqui e é repintada quando o estágio muda.
    if (painel && painel.itens && painel.itens.length) paineis.add(painel);

    const entrada = {
      raiz,
      nome,
      ancorarNoTopo: !!ancorarNoTopo,
      trechos: trechos.map((t) => ({ de: 0, ate: 1, ...t, comprimento: null, visivel: null })),
      binarios,
      estacoes,
      painel,
      visivel: true,
      assentada: false,
      progresso: 0,
      topo: 0,
      altura: 0,
    };

    registro.add(entrada);

    if (semMovimento) {
      // Composição estática aprovada, sem nenhuma alteração.
      completar(entrada);
    } else {
      medir(entrada);
      if (!debug && typeof window !== 'undefined'
        && window.location.search.includes('debug-circuito')) {
        debug = criarDebug();
      }
      ligar();
      if (observadorTamanho) observadorTamanho.observe(raiz);
      if (observadorVisibilidade) observadorVisibilidade.observe(raiz);
      // Estado correto já no primeiro quadro, inclusive se a página
      // abriu no meio (recarga com scroll restaurado ou âncora).
      aplicar();
    }

    const aoTrocarPreferencia = () => {
      semMovimento = mq.matches;
      if (semMovimento) {
        registro.forEach(completar);
        desligar();
      } else {
        medirTudo();
        ligar();
        agendar();
      }
    };
    mq.addEventListener('change', aoTrocarPreferencia);

    return () => {
      mq.removeEventListener('change', aoTrocarPreferencia);
      if (observadorTamanho) observadorTamanho.unobserve(raiz);
      if (observadorVisibilidade) observadorVisibilidade.unobserve(raiz);
      completar(entrada);
      if (painel) paineis.delete(painel);
      registro.delete(entrada);
      if (registro.size === 0) {
        desligar();
        if (debug) { debug.remove(); debug = null; }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
