import DEMO from './demoAccount';
import { PLAN_LIST } from '../ui/plans';
import { formatarMoeda } from '../../utils/formatters';

/* =========================================================
   LEITURAS DAS ESTAÇÕES — camada de identidade da Home

   Cada estação do circuito mostra um par unidade + valor. Este
   arquivo é o único lugar em que esses pares existem, e nenhum
   deles é escrito à mão: todos derivam de demoAccount.js e de
   plans.js, as mesmas fontes que o produto real usa.

   A consequência é a que interessa: se a conta demo mudar de
   saldo, de meta ou de número de contas, ou se um plano mudar de
   limite, a leitura da Home muda junto. Nenhum número da landing
   pode passar a contradizer o dado.

   O formato monetário é sempre o mesmo — pt-BR, com R$ e duas
   casas, via formatarMoeda. Não há uma segunda convenção em
   lugar nenhum da página.

   A caixa alta das unidades é feita no CSS (text-transform), não
   no texto: assim o conteúdo continua legível para leitor de tela
   e o mesmo dado serve a qualquer estilo.
   ========================================================= */

export const TOTAL_ESTACOES = 7;

/* "01/07" — o índice sobre o total. É o que diz que a página é um
   percurso de sete etapas, e não uma sequência de seções. */
const doisDigitos = (n) => String(n).padStart(2, '0');
export const codigo = (n) => `${doisDigitos(n)}/${doisDigitos(TOTAL_ESTACOES)}`;

/* Extremos do período coberto pelo gráfico, tirados dos rótulos
   reais de fluxo — que são derivados da data corrente. Escrever
   "abr — set" à mão faria a Home envelhecer sozinha. */
const periodoDoFluxo = () => {
  const meses = DEMO.fluxo;
  if (!meses.length) return '';
  return `${meses[0].label} — ${meses[meses.length - 1].label}`;
};

/* Quanto do consolidado está investido. É leitura da estação 05, e
   não um número novo: sai da divisão dos dois valores que o painel
   do Produto já mostra lado a lado. */
export const percentualInvestido = DEMO.saldoConsolidado
  ? Math.round((DEMO.totalInvestido / DEMO.saldoConsolidado) * 100)
  : 0;

/* As sete leituras. `nome` e `unidade` ficam em caixa de sentença;
   quem coloca em caixa alta é o CSS. */
export const LEITURAS = {
  1: {
    nome: 'Entrar',
    unidade: 'Contas conectadas',
    valor: String(DEMO.contasAtivas),
  },
  2: {
    nome: 'Organizar',
    unidade: 'Consolidado',
    valor: formatarMoeda(DEMO.saldoConsolidado),
  },
  3: {
    nome: 'Analisar',
    unidade: `Fluxo líquido · ${periodoDoFluxo()}`,
    valor: `+${formatarMoeda(DEMO.sobraDoMes)}`,
  },
  4: {
    nome: 'Decidir',
    // A única estação com duas leituras: são os dois números que o
    // painel do Produto mostra logo acima, trazidos para a decisão.
    // A sobra fica de fora de propósito — ela é a leitura da 03.
    leituras: [
      { unidade: 'Disponível', valor: formatarMoeda(DEMO.saldoDisponivel) },
      { unidade: 'Investido', valor: formatarMoeda(DEMO.totalInvestido) },
    ],
  },
  5: {
    nome: 'Investir',
    unidade: 'Do consolidado',
    valor: `${percentualInvestido}%`,
  },
  6: {
    nome: 'Evoluir',
    unidade: 'Reserva',
    valor: `${formatarMoeda(DEMO.meta.atual)} de ${formatarMoeda(DEMO.meta.alvo)}`,
  },
  7: {
    nome: 'Escolher',
    unidade: 'Planos',
    valor: String(PLAN_LIST.length),
  },
};

/* ---------- Coluna de leitura do Hero ----------
   Quatro entradas, não sete: a coluna é secundária e uma lista
   completa viraria sumário. As escolhidas são as quatro etapas com
   mostrador completo mais adiante na página.

   O valor aqui é a versão curta. Em INVESTIR ele é o percentual, e
   não o total investido, porque esse mesmo total já aparece duas
   vezes na seção do Advisor — repetir seria dizer menos, não mais. */
export const INDICE_DO_HERO = [1, 3, 5, 7].map((n) => {
  const resumo = {
    1: `${DEMO.contasAtivas} contas`,
    3: `+${formatarMoeda(DEMO.sobraDoMes)}`,
    5: `${percentualInvestido}%`,
    7: `${PLAN_LIST.length} planos`,
  }[n];
  return { n, codigo: codigo(n), nome: LEITURAS[n].nome, resumo };
});

/* ---------- Qualificação dos planos ----------
   Uma linha por plano, lida direto de `limits`. Não é copy: é o
   próprio limite do plano em forma curta. Quando os dois limites
   relevantes são nulos, o plano é o ilimitado — é assim que
   plans.js codifica "sem limite", e é assim que os predicados de
   trava já leem o campo. */
export function qualificacaoDoPlano(limits) {
  if (!limits) return '';
  const { contas, transacoesPorMes } = limits;
  if (contas == null && transacoesPorMes == null) {
    return 'Contas e lançamentos ilimitados';
  }
  return `${contas} contas · ${transacoesPorMes} lançamentos/mês`;
}
