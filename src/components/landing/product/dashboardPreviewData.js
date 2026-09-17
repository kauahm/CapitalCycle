/* ==========================================================================
   Fixture da DashboardPreview (landing)

   Dados ESTÁTICOS e demonstrativos. Esta fixture existe para que a vitrine
   da landing nunca dependa de Firebase, Auth ou Firestore — e para que o
   frame renderize sempre igual, em qualquer máquina e em qualquer dia.

   Os meses são CONGELADOS de propósito: nada aqui pode usar `new Date()`,
   `Date.now()` ou o mês corrente. Se a janela Mar→Ago passasse a ser
   calculada, o frame deixaria de ser comparável com a prancha do Designer.

   Fonte dos valores: briefing da H1, §7 (fixture aprovada).
   ========================================================================== */

export const dashboardPreviewData = {
  usuario: {
    nome: 'Kaua Martins',
    papel: 'Investidor',
    // Derivar a inicial de `nome` seria mais "esperto", mas o avatar do
    // Designer é um K literal — deixar explícito evita surpresa se o nome
    // da fixture mudar.
    inicial: 'K',
    primeiroNome: 'Kaua',
  },

  saldoDisponivel: 12480,
  totalInvestido: 8200,
  sobrouNoMes: 840,
  contasAtivas: 3,

  /* As cores vêm da prancha do Designer, uma por posição: rampa de verde
     escuro a claro, com o último mês destacado em #4ade80. A altura de
     cada barra é derivada do valor (ver DashboardPreview), não fixada aqui,
     para que a fixture continue sendo a única fonte dos números. */
  fluxo: [
    { mes: 'Mar', valor: 520, cor: '#14532d' },
    { mes: 'Abr', valor: 630, cor: '#166534' },
    { mes: 'Mai', valor: 740, cor: '#15803d' },
    { mes: 'Jun', valor: 530, cor: '#14532d' },
    { mes: 'Jul', valor: 680, cor: '#166534' },
    { mes: 'Ago', valor: 840, cor: '#4ade80' },
  ],

  rendaMensal: 2800,
  rendaComprometida: 70,

  metas: [
    { nome: 'Reserva de emergência', meta: 10000, acumulado: 6200, progresso: 62 },
    { nome: 'Viagem 2026', meta: 6000, acumulado: 2040, progresso: 34 },
  ],
};

/* R$ 12.480,00 — espaço normal, não o NBSP que o Intl insere, porque a
   prancha do Designer usa espaço comum. */
export function formatBRL(valor) {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

/* R$ 6.200 — sem centavos, para as linhas de progresso das metas. */
export function formatBRLCurto(valor) {
  return `R$ ${Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}
