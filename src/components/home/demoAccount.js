/* =========================================================
   CONTA DEMO DA LANDING — fonte única de verdade

   O número do hero e a tela de produto logo abaixo dele precisam
   fechar entre si: o hero mostra o saldo consolidado, e a tela
   abre esse mesmo saldo em disponível + investido. Se os dois
   viessem de literais espalhados, bastaria alguém mexer em um
   para a landing passar a se contradizer na própria dobra.

   Os rótulos e o formato de moeda são os mesmos do Dashboard
   Financeiro real (src/pages/admin/DashboardFinanceiro.jsx).
   ========================================================= */

const SALDO_DISPONIVEL = 14820;
const TOTAL_INVESTIDO = 9412;
const SOBRA_DO_MES = 1236.5;

/* Rótulos de mês no mesmo formato do app ("jan", "fev", ...).
   Derivados da data atual para a tela não envelhecer sozinha:
   uma captura com meses fixos denuncia o ano em que foi feita. */
function ultimosMeses(quantidade) {
  const hoje = new Date();
  return Array.from({ length: quantidade }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (quantidade - 1 - i), 1);
    return d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  });
}

const MESES = ultimosMeses(6);

/* O último mês é o mês corrente: o valor dele tem que ser a mesma
   sobra anunciada no cabeçalho, senão o gráfico contradiz o texto. */
const LIQUIDOS = [860, 1420, 640, 1810, 980, SOBRA_DO_MES];

const DEMO = {
  nome: 'Lucas',

  saldoDisponivel: SALDO_DISPONIVEL,
  totalInvestido: TOTAL_INVESTIDO,
  saldoConsolidado: SALDO_DISPONIVEL + TOTAL_INVESTIDO,
  contasAtivas: 4,
  sobraDoMes: SOBRA_DO_MES,

  fluxo: MESES.map((label, i) => ({
    label,
    liquido: LIQUIDOS[i],
    atual: i === MESES.length - 1,
  })),

  meta: {
    nome: 'Reserva de emergência',
    atual: 6400,
    alvo: 10000,
  },
};

export default DEMO;
