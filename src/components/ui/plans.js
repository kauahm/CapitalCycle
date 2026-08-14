// ─────────────────────────────────────────────────────────────────────────────
//  Fonte única de verdade dos planos, limites e cópias de texto.
//  Usada por: Register.jsx (seleção de plano), UpgradeModal.jsx e pelas
//  páginas do painel (travas de funcionalidade por plano).
//
//  limites com valor `null` significam "sem limite" (plano Adulto).
//
//  Cobrança: os dois planos são ANUAIS (não existe mais plano mensal).
//  `price` é a string exibida na interface e `priceNum` o valor usado nos
//  cálculos de pagamento; `period` é o sufixo mostrado ao lado do preço.
// ─────────────────────────────────────────────────────────────────────────────

export const BILLING_PERIOD = '/ano';

export const PLAN_LIST = [
  {
    id: 'jovem',
    name: 'Jovem',
    price: '44,90',
    priceNum: 44.90,
    period: BILLING_PERIOD,
    desc: 'Para quem está começando a organizar as finanças com controle prático.',
    featured: false,
    badge: null,
    feats: [
      'Dashboard financeiro completo',
      'Até 100 lançamentos por mês',
      'Até 3 contas bancárias',
      '2 ciclos de meta ou orçamento em andamento',
      'Capital Advisor — 50 consultas/mês',
      'Sincronização em tempo real',
    ],
    limits: {
      contas: 3,
      transacoesPorMes: 100,
      ciclosAtivos: 2,
      consultasIAMes: 50,
      mercado: false,
    },
  },
  {
    id: 'adulto',
    name: 'Adulto',
    price: '64,90',
    priceNum: 64.90,
    period: BILLING_PERIOD,
    desc: 'Controle total, IA ilimitada e mercado em tempo real para quem leva as finanças a sério.',
    featured: true,
    badge: 'Mais popular',
    feats: [
      'Tudo do plano Jovem',
      'Contas bancárias e lançamentos ilimitados',
      'Ciclos e metas ilimitados',
      'Capital Advisor — consultas ilimitadas',
      'Mercado com cotações de B3, cripto e câmbio',
      'Sincronização em tempo real',
    ],
    limits: {
      contas: null,
      transacoesPorMes: null,
      ciclosAtivos: null,
      consultasIAMes: null,
      mercado: true,
    },
  },
];

export const PLANS = Object.fromEntries(PLAN_LIST.map((p) => [p.id, p]));

export const DEFAULT_PLAN = 'jovem';

export const getPlan = (planId) => PLANS[planId] || PLANS[DEFAULT_PLAN];

export const getLimits = (planId) => getPlan(planId).limits;

// Chave do mês corrente no formato YYYY-MM (usada nas cotas mensais)
export const mesAtualKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// ── Predicados das travas ──────────────────────────────────────────────
// Recebem o plano do usuário e o estado atual (contagens) e devolvem
// `true` quando a ação ainda é permitida.

export const canAddConta = (planId, quantidade) => {
  const limite = getLimits(planId).contas;
  return limite == null || quantidade < limite;
};

export const canAddCiclo = (planId, ativos) => {
  const limite = getLimits(planId).ciclosAtivos;
  return limite == null || ativos < limite;
};

export const canAddTransacao = (planId, lancamentosNoMes) => {
  const limite = getLimits(planId).transacoesPorMes;
  return limite == null || lancamentosNoMes < limite;
};

export const canConsultarIA = (planId, usadasNoMes) => {
  const limite = getLimits(planId).consultasIAMes;
  return limite == null || usadasNoMes < limite;
};

export const temMercado = (planId) => !!getLimits(planId).mercado;

// ── Metadados das travas → usados pelo UpgradeModal ────────────────────
export const GATES = {
  contas: {
    title: 'Limite de contas alcançado',
    message: 'O plano Jovem permite até 3 contas cadastradas. Faça upgrade para o plano Adulto e cadastre quantas contas precisar.',
    requiredPlan: 'adulto',
  },
  ciclos: {
    title: 'Limite de ciclos alcançado',
    message: 'O plano Jovem permite até 2 ciclos ou metas em andamento. Faça upgrade para o plano Adulto e crie quantos objetivos quiser.',
    requiredPlan: 'adulto',
  },
  transacoes: {
    title: 'Cota mensal de lançamentos atingida',
    message: 'O plano Jovem permite até 100 lançamentos por mês. Faça upgrade para o plano Adulto e faça lançamentos ilimitados.',
    requiredPlan: 'adulto',
  },
  consultasIA: {
    title: 'Cota de consultas do Capital Advisor atingida',
    message: 'O plano Jovem inclui 50 consultas do Capital Advisor por mês. Faça upgrade para o plano Adulto e converse sem limites.',
    requiredPlan: 'adulto',
  },
  mercado: {
    title: 'Exclusivo do plano Adulto',
    message: 'O Mercado, com cotações de B3, cripto e câmbio em tempo real, é um recurso exclusivo do plano Adulto. Faça upgrade para liberar.',
    requiredPlan: 'adulto',
  },
};