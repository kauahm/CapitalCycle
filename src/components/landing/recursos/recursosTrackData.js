/* ==========================================================================
   Conteúdo do RecursosTrack

   Transcrito de `referencia/designer/RecursosTrack.dc.html` e conferido
   contra `docs/hero/02-copy-oficial.md` §6. Os quatro títulos e as quatro
   descrições são idênticos, caractere por caractere, ao `FEATURE_CARDS` que
   a Home já usava — a diferença entre o app atual e o Designer é a forma
   (trilho horizontal com demo dentro de cada painel), não o texto.

   Sobre o "Mercado" do card 2: aqui é categoria de despesa, ao lado de
   Salário, Aluguel e Freelance. Não tem relação com a área de Mercado
   financeiro que foi removida do produto — essa continua fora, e continua
   fora da sidebar da DashboardPreview.

   Os valores são demonstrativos e independentes da fixture da Dashboard,
   conforme §8 do briefing da H1: cada card é um exemplo por si.
   ========================================================================== */

export const RECURSOS_CARDS = [
  {
    id: 'dashboard',
    titulo: 'Dashboard Financeiro',
    descricao:
      'Saldo consolidado de todas as contas com indicadores de fluxo em tempo real.',
    demo: 'kpis',
    kpis: [
      { rotulo: 'SALDO', valor: 'R$ 12.480' },
      { rotulo: 'INVESTIDO', valor: 'R$ 8.200' },
      { rotulo: 'FLUXO', valor: '+4,2%', destaque: true },
    ],
    barras: [
      { altura: 36, cor: '#d7d4ce' },
      { altura: 48, cor: '#cfccc5' },
      { altura: 62, cor: '#c6c2ba' },
      { altura: 41, cor: '#cfccc5' },
      { altura: 55, cor: '#c6c2ba' },
      { altura: 72, cor: '#5b52f0' },
    ],
  },
  {
    id: 'transacoes',
    titulo: 'Transações Inteligentes',
    descricao:
      'Registre entradas e saídas com categorias, filtros avançados e histórico completo.',
    demo: 'lancamentos',
    lancamentos: [
      { nome: 'Salário', valor: '+ R$ 6.200,00', entrada: true },
      { nome: 'Aluguel', valor: '− R$ 1.850,00', entrada: false },
      { nome: 'Freelance', valor: '+ R$ 980,00', entrada: true },
      { nome: 'Mercado', valor: '− R$ 214,90', entrada: false },
    ],
  },
  {
    id: 'ciclos',
    titulo: 'Ciclos de Investimento',
    descricao:
      'Metas de orçamento por período com progresso calculado automaticamente.',
    demo: 'metas',
    metas: [
      { nome: 'Reserva de emergência', progresso: 62 },
      { nome: 'Aporte mensal', progresso: 88 },
      { nome: 'Viagem 2026', progresso: 34 },
    ],
  },
  {
    id: 'advisor',
    titulo: 'Capital Advisor',
    descricao:
      'Análise dos seus dados financeiros em linguagem natural, direto no aplicativo.',
    demo: 'advisor',
    escuro: true,
    advisor: {
      eyebrow: 'CAPITAL ADVISOR',
      balao:
        'Você comprometeu 34% da renda em custos fixos este mês — 6 pontos abaixo da sua média.',
      rodape: 'Baseado em 142 transações de agosto.',
    },
  },
];
