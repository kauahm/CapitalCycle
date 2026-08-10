// Helpers de data compartilhados — Fase 1 (metas, orçamento por categoria,
// comparação com mês anterior). Todas as datas de negócio no formato
// string 'YYYY-MM-DD', consistente com o resto do projeto (transactions.data,
// ciclos.inicio/fim).

const DIA_MS = 24 * 60 * 60 * 1000;

// Data de hoje no formato 'YYYY-MM-DD'
export function hojeStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Prefixo do mês corrente, formato 'YYYY-MM'
export function mesAtualPrefixo() {
  return hojeStr().slice(0, 7);
}

// Prefixo do mês anterior a partir de um prefixo 'YYYY-MM'
export function mesAnteriorPrefixo(prefixoAtual) {
  const [ano, mes] = prefixoAtual.split('-').map(Number);
  const d = new Date(ano, mes - 2, 1); // mes é 1-indexed no prefixo, Date usa 0-indexed
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Converte 'YYYY-MM-DD' em Date à meia-noite local
export function parseData(dataStr) {
  if (!dataStr) return null;
  return new Date(`${dataStr}T00:00:00`);
}

// Diferença em dias inteiros entre duas datas string (fim - inicio)
export function diasEntre(dataInicioStr, dataFimStr) {
  const a = parseData(dataInicioStr);
  const b = parseData(dataFimStr);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / DIA_MS);
}

// Soma dias (pode ser fracionário — arredonda) a uma data string, retorna Date
export function addDias(dataStr, dias) {
  const d = parseData(dataStr);
  if (!d) return null;
  d.setDate(d.getDate() + Math.round(dias));
  return d;
}

export function formatarDataCurta(date) {
  if (!date) return '';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
