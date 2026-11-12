// Contexto financeiro do Capital Advisor.
//
// Resume os dados da conta em um bloco de texto curto, agregado, que vai no
// início da conversa com o modelo — SOMENTE quando a pessoa liga a opção
// "usar meus dados" na tela do Advisor. Nada aqui lista lançamento por
// lançamento: vão totais por categoria, saldos por tipo de conta e o estado
// das metas. É o suficiente para o assistente responder "onde estou gastando
// mais?" sem receber o extrato inteiro.

import { calcularProgressoMeta } from './metas';
import { calcularProgressoCategorias } from './orcamentoCategoria';
import { mesAnteriorPrefixo, hojeStr } from './data';

const BRL = (v) => `R$ ${(Number(v) || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

function somar(lista, campo = 'valor') {
  return lista.reduce((acc, t) => acc + (parseFloat(t[campo]) || 0), 0);
}

function porCategoria(lista) {
  const mapa = {};
  for (const t of lista) mapa[t.categoria || 'Outros'] = (mapa[t.categoria || 'Outros'] || 0) + (parseFloat(t.valor) || 0);
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}

/**
 * @returns {{ texto: string, resumo: object }}
 */
export function montarContextoFinanceiro({
  contas = [],
  transacoes = [],
  ciclos = [],
  aportesMap = {},
  limites = {},
  rendaMensal = 0,
  hoje = hojeStr(),
} = {}) {
  const mes = hoje.slice(0, 7);
  const mesAnterior = mesAnteriorPrefixo(mes);

  const doMes = transacoes.filter((t) => t.data && t.data.startsWith(mes));
  const doMesAnterior = transacoes.filter((t) => t.data && t.data.startsWith(mesAnterior));

  const entradasMes = somar(doMes.filter((t) => t.tipo === 'entrada'));
  const saidasMes = somar(doMes.filter((t) => t.tipo === 'saida'));
  const saidasMesAnterior = somar(doMesAnterior.filter((t) => t.tipo === 'saida'));

  const saldoDisponivel = somar(contas.filter((c) => c.tipo !== 'Cartão de crédito'), 'saldo');
  const faturaCartao = Math.abs(somar(contas.filter((c) => c.tipo === 'Cartão de crédito'), 'saldo'));

  const categorias = porCategoria(doMes.filter((t) => t.tipo === 'saida'));
  const orcamento = calcularProgressoCategorias(limites, transacoes, mes);

  const metas = ciclos
    .filter((c) => c.tipo === 'Meta')
    .map((c) => {
      const p = calcularProgressoMeta(c, aportesMap[c.id] || []);
      return { nome: c.nome, fim: c.fim, ...p };
    });

  const linhas = [];
  linhas.push(`Data de hoje: ${hoje}.`);
  linhas.push(`Contas: ${contas.length}. Saldo disponível (sem cartão): ${BRL(saldoDisponivel)}.` + (faturaCartao ? ` Fatura de cartão em aberto: ${BRL(faturaCartao)}.` : ''));
  if (rendaMensal > 0) linhas.push(`Renda mensal declarada: ${BRL(rendaMensal)}.`);
  linhas.push(`Mês atual (${mes}): entradas ${BRL(entradasMes)}, saídas ${BRL(saidasMes)}, ${doMes.length} lançamentos.`);
  if (doMesAnterior.length) linhas.push(`Mês anterior (${mesAnterior}): saídas ${BRL(saidasMesAnterior)}.`);
  if (categorias.length) {
    linhas.push('Gastos do mês por categoria: ' + categorias.map(([c, v]) => `${c} ${BRL(v)}`).join('; ') + '.');
  }
  if (orcamento.length) {
    linhas.push('Limites por categoria: ' + orcamento.map((o) => `${o.categoria} ${o.pct.toFixed(0)}% de ${BRL(o.limite)}${o.estado !== 'ok' ? ` (${o.estado})` : ''}`).join('; ') + '.');
  }
  if (metas.length) {
    linhas.push('Metas: ' + metas.map((m) => {
      const prazo = m.fim ? `, prazo ${m.fim}` : '';
      const ritmo = m.ritmoNecessario != null ? `, precisa de ${BRL(m.ritmoNecessario)}/dia` : '';
      return `${m.nome}: ${BRL(m.valorAcumulado)} de ${BRL(m.valorMeta)} (${m.progressoPct.toFixed(0)}%${prazo}${ritmo})`;
    }).join('; ') + '.');
  }

  const texto = [
    '[Contexto financeiro do usuário — dados agregados fornecidos pelo sistema com autorização dele. Use-os para responder; não invente valores além destes.]',
    ...linhas,
  ].join('\n');

  return {
    texto,
    resumo: {
      mes,
      entradasMes,
      saidasMes,
      saidasMesAnterior,
      saldoDisponivel,
      faturaCartao,
      categorias,
      metas: metas.length,
      lancamentos: doMes.length,
    },
  };
}
