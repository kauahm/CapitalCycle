// Formatação monetária — fonte única. Antes cada tela declarava o próprio
// `formatarMoeda` com `new Intl.NumberFormat(...)` a cada render.

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const BRL_INTEIRO = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
});

/** R$ 1.234,56 */
export const formatarMoeda = (valor) => BRL.format(Number(valor) || 0);

/** R$ 1.235 — para rótulos curtos (eixos, chips). */
export const formatarMoedaCurta = (valor) => BRL_INTEIRO.format(Number(valor) || 0);

/** +12% / -8% com uma casa opcional. */
export const formatarPct = (valor, casas = 0) => {
  const n = Number(valor) || 0;
  return `${n > 0 ? '+' : ''}${n.toFixed(casas)}%`;
};

/** 'YYYY-MM-DD' → 'DD/MM/YYYY'. Tolerante a vazio. */
export const formatarDataBR = (dataStr) => {
  if (!dataStr || typeof dataStr !== 'string') return '';
  const [ano, mes, dia] = dataStr.split('-');
  if (!ano || !mes || !dia) return dataStr;
  return `${dia}/${mes}/${ano}`;
};

/** Converte "1.234,56" ou "1234.56" em número; NaN quando não dá. */
export const parseValor = (texto) => {
  if (typeof texto === 'number') return texto;
  const limpo = String(texto ?? '').trim().replace(/\s/g, '');
  if (!limpo) return NaN;
  // Com vírgula decimal, pontos são milhares.
  const normalizado = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo;
  return Number(normalizado);
};
