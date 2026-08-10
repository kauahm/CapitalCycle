// Comparação com o mês anterior — genérica, aplicável a gasto total, gasto
// por categoria ou economia. Ver especificação, seção 7 e caso extremo
// "mês anterior sem nenhuma transação" na seção 9: retorna null em vez de
// inventar um percentual quando não há base de comparação.

export function calcularVariacaoPct(valorAtual, valorAnterior) {
  if (valorAnterior === null || valorAnterior === undefined || valorAnterior === 0) {
    return null;
  }
  return ((valorAtual - valorAnterior) / valorAnterior) * 100;
}
