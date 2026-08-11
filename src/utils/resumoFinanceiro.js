// Resumo financeiro agregado — Fase 1 (upgrade do Capital Advisor).
// Função pura: só agrega dados já carregados (mesmo shape usado no
// DashboardFinanceiro), sem nenhuma chamada de rede. Reaproveita os
// cálculos já existentes em utils/metas.js e utils/orcamentoCategoria.js
// para não duplicar regra de negócio.

import { mesAtualPrefixo as getMesAtualPrefixo } from './data';
import { calcularProgressoMeta } from './metas';
import { calcularProgressoCategorias } from './orcamentoCategoria';
import { formatarMoeda } from './formatters';

/**
 * Agrega contas, transações, ciclos e aportes num objeto-resumo único.
 *
 * @param {{
 *   contas?: Array,
 *   transacoes?: Array,
 *   ciclos?: Array,
 *   aportesMap?: Object,
 *   limitesCategorias?: Object,
 * }} dados - mesmo shape já usado no DashboardFinanceiro.jsx
 */
export function gerarResumoFinanceiro({
  contas = [],
  transacoes = [],
  ciclos = [],
  aportesMap = {},
  limitesCategorias = {},
} = {}) {
  const mesPrefixo = getMesAtualPrefixo();

  // Saldos
  const saldoDisponivel = contas
    .filter((c) => c.tipo !== 'Investimentos')
    .reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);

  const totalInvestido = contas
    .filter((c) => c.tipo === 'Investimentos')
    .reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);

  const saldoTotal = saldoDisponivel + totalInvestido;

  // Gastos do mês por categoria
  const gastosPorCategoriaMap = transacoes
    .filter((t) => t.tipo === 'saida' && t.data && t.data.startsWith(mesPrefixo))
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + (parseFloat(t.valor) || 0);
      return acc;
    }, {});

  const gastosPorCategoria = Object.entries(gastosPorCategoriaMap)
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);

  const totalGastoMes = gastosPorCategoria.reduce((acc, g) => acc + g.valor, 0);

  const totalEntradasMes = transacoes
    .filter((t) => t.tipo === 'entrada' && t.data && t.data.startsWith(mesPrefixo))
    .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);

  // Metas (tipo 'Meta') — usa calcularProgressoMeta já existente
  const metas = ciclos
    .filter((c) => c.tipo === 'Meta')
    .map((ciclo) => ({
      nome: ciclo.nome,
      ...calcularProgressoMeta(ciclo, aportesMap[ciclo.id] || []),
    }));

  // Orçamentos ad-hoc (ciclos que não são Meta) — mesma lógica já usada
  // no DashboardFinanceiro para esses cards
  const orcamentosAdHoc = ciclos
    .filter((c) => c.tipo !== 'Meta')
    .map((ciclo) => {
      const gasto = transacoes
        .filter((t) => t.tipo === 'saida' && t.data >= ciclo.inicio && t.data <= ciclo.fim)
        .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
      const orcamento = parseFloat(ciclo.orcamento) || 0;
      const pct = orcamento > 0 ? (gasto / orcamento) * 100 : 0;
      return { nome: ciclo.nome, gasto, orcamento, pct, estourado: pct >= 100 };
    });

  // Orçamento por categoria — usa calcularProgressoCategorias já existente
  const orcamentoCategorias = calcularProgressoCategorias(limitesCategorias, transacoes, mesPrefixo);

  return {
    mesPrefixo,
    saldoTotal,
    saldoDisponivel,
    totalInvestido,
    totalGastoMes,
    totalEntradasMes,
    gastosPorCategoria,
    metas,
    orcamentosAdHoc,
    orcamentoCategorias,
  };
}

/**
 * Converte o resumo em um bloco de texto curto (PT-BR) para injetar como
 * contexto real do usuário num prompt de IA. Usado tanto pelo card do
 * Dashboard quanto pelo AnaliseIA.jsx.
 */
export function formatarResumoParaPrompt(resumo) {
  if (!resumo) return '';

  const linhas = [];
  linhas.push(`Saldo disponível: ${formatarMoeda(resumo.saldoDisponivel)}`);
  linhas.push(`Total investido: ${formatarMoeda(resumo.totalInvestido)}`);
  linhas.push(`Gasto total no mês: ${formatarMoeda(resumo.totalGastoMes)}`);

  if (resumo.gastosPorCategoria.length > 0) {
    const top3 = resumo.gastosPorCategoria
      .slice(0, 3)
      .map((g) => `${g.categoria} (${formatarMoeda(g.valor)})`)
      .join(', ');
    linhas.push(`Maiores categorias de gasto no mês: ${top3}`);
  } else {
    linhas.push('Nenhuma despesa registrada no mês.');
  }

  if (resumo.metas.length > 0) {
    const metasTxt = resumo.metas
      .map((m) => `${m.nome}: ${m.progressoPct.toFixed(0)}% concluída (faltam ${formatarMoeda(m.valorRestante)}${m.prazoEncerrado ? ', prazo encerrado' : ''})`)
      .join('; ');
    linhas.push(`Metas: ${metasTxt}`);
  }

  if (resumo.orcamentoCategorias.length > 0) {
    const orcTxt = resumo.orcamentoCategorias
      .map((c) => `${c.categoria}: ${c.pct.toFixed(0)}% do limite${c.estado === 'estourado' ? ' (estourado)' : c.estado === 'alerta' ? ' (alerta)' : ''}`)
      .join('; ');
    linhas.push(`Orçamento por categoria: ${orcTxt}`);
  }

  return linhas.map((l) => `- ${l}`).join('\n');
}
