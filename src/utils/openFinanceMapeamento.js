// Mapeamento Pluggy → modelo do app. Funções puras, sem Firebase, para que
// a sincronização (utils/openFinance.js) e os testes usem a mesma regra.

import { CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA } from './categorias';

/** Data local 'YYYY-MM-DD' a partir de um ISO do Pluggy. */
export function dataLocal(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Tipo de conta do app a partir do type/subtype do Pluggy. */
export function tipoConta(conta) {
  if (conta.type === 'CREDIT' || conta.subtype === 'CREDIT_CARD') return 'Cartão de crédito';
  if (conta.subtype === 'SAVINGS_ACCOUNT') return 'Poupança';
  return 'Corrente';
}

/** No cartão, o "balance" do Pluggy é a fatura devida: vira saldo negativo. */
export function saldoConta(conta) {
  const valor = Number(conta.balance) || 0;
  return tipoConta(conta) === 'Cartão de crédito' ? -Math.abs(valor) : valor;
}

// Categoria do app a partir da categoria do Pluggy E da descrição do
// lançamento. A descrição importa: nem todo banco (o Pluggy Bank de testes,
// por exemplo) manda `category`. A primeira regra que casar vence; o resto
// cai em "Outros".
const REGRAS_SAIDA = [
  [/food|restaurant|groceries|supermarket|eating|aliment|restaurante|mercado|padaria|ifood|delivery|lanchonete/i, 'Alimentação'],
  [/hous|\brent\b|utilit|electric|water|telecom|moradia|aluguel|condom|energia|eletro|light|enel|sabesp|[aá]gua|internet|vivo|claro|\btim\b|\boi\b/i, 'Moradia'],
  [/transport|taxi|\bride|uber|\b99\b|fuel|gas station|parking|toll|vehicle|automotive|combust|posto|estacion|ped[aá]gio|metr[oô]|[oô]nibus/i, 'Transporte'],
  [/health|pharma|drug|medical|hospital|dentist|gym|wellness|sa[uú]de|farm[aá]cia|drogaria|academia|smart ?fit|cl[ií]nica/i, 'Saúde'],
  [/leisure|entertain|travel|streaming|\bgames?\b|ticket|lazer|viage|cinema|hotel|netflix|spotify|disney|prime video|hbo|steam/i, 'Lazer'],
  [/educa|school|course|book|universit|escola|faculdade|curso|livro|udemy|alura/i, 'Educação'],
];

const REGRAS_ENTRADA = [
  [/salary|wage|payroll|sal[aá]rio|remunera|folha/i, 'Salário'],
  [/interest|yield|dividend|rendimento|juros|intereses/i, 'Rendimento'],
  [/invest|resgate|redemption/i, 'Investimento'],
  [/\bsale\b|venda/i, 'Venda'],
];

export function categoriaApp(tx, tipo) {
  const regras = tipo === 'entrada' ? REGRAS_ENTRADA : REGRAS_SAIDA;
  const permitidas = tipo === 'entrada' ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA;
  const texto = [tx.category, tx.description, tx.descriptionRaw].filter(Boolean).join(' ');
  const achada = regras.find(([re]) => re.test(texto))?.[1];
  return achada && permitidas.includes(achada) ? achada : 'Outros';
}

/** Entrada/saída pelo sinal do valor.
 *  O `type` NÃO serve: no cartão do Pluggy, compra vem como CREDIT com valor
 *  negativo (medido no Pluggy Bank). Negativo = dinheiro saindo, nos dois
 *  tipos de conta. */
export function tipoTransacao(tx) {
  const valor = Number(tx.amount) || 0;
  if (valor !== 0) return valor < 0 ? 'saida' : 'entrada';
  return tx.type === 'CREDIT' ? 'entrada' : 'saida';
}
