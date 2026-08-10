// Cálculo de progresso do orçamento por categoria — Fase 1.
// Sempre derivado em tempo real (limites x transações do mês corrente),
// nunca armazenado — ver especificação, seção 5.

export function calcularProgressoCategorias(limites, transacoes, mesPrefixo) {
  const gastosPorCategoria = transacoes
    .filter((t) => t.tipo === 'saida' && t.data && t.data.startsWith(mesPrefixo))
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + (parseFloat(t.valor) || 0);
      return acc;
    }, {});

  return Object.entries(limites || {})
    .filter(([, limite]) => (parseFloat(limite) || 0) > 0)
    .map(([categoria, limite]) => {
      const limiteNum = parseFloat(limite) || 0;
      const gasto = gastosPorCategoria[categoria] || 0;
      const pct = limiteNum > 0 ? (gasto / limiteNum) * 100 : 0;

      let estado = 'ok';
      if (pct >= 100) estado = 'estourado';
      else if (pct >= 90) estado = 'alerta';

      return { categoria, limite: limiteNum, gasto, pct, estado };
    })
    .sort((a, b) => b.pct - a.pct);
}
