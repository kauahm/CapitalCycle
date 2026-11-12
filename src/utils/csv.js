// Exportação de lançamentos em CSV.
//
// Separador `;` e BOM UTF-8 de propósito: é o que faz o Excel em português
// abrir o arquivo com acentos corretos e uma coluna por campo, sem o
// assistente de importação. Valores usam vírgula decimal pelo mesmo motivo.

import { formatarDataBR } from './moeda';

const CABECALHO = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Conta', 'Valor (R$)', 'Origem'];

function celula(valor) {
  const texto = valor == null ? '' : String(valor);
  // Aspas quando há separador, aspas ou quebra de linha; aspas internas dobram.
  return /[;"\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function valorCsv(valor, tipo) {
  const n = Math.abs(Number(valor) || 0);
  const comSinal = tipo === 'saida' ? -n : n;
  return comSinal.toFixed(2).replace('.', ',');
}

/**
 * @param {Array} transacoes - lançamentos já filtrados/ordenados como na tela
 * @param {Object} contasPorId - { [id]: { nome, banco } }
 * @returns {string} conteúdo do CSV (sem BOM)
 */
export function gerarCsvTransacoes(transacoes, contasPorId = {}) {
  const linhas = [CABECALHO.join(';')];
  for (const t of transacoes) {
    const conta = contasPorId[t.conta_id];
    const nomeConta = conta ? [conta.nome, conta.banco].filter(Boolean).join(' · ') : '';
    linhas.push([
      formatarDataBR(t.data),
      t.descricao || '',
      t.tipo === 'entrada' ? 'Entrada' : 'Saída',
      t.categoria || '',
      nomeConta,
      valorCsv(t.valor, t.tipo),
      t.origem === 'openfinance' ? 'Open Finance' : 'Manual',
    ].map(celula).join(';'));
  }
  return linhas.join('\r\n');
}

/** Dispara o download de um texto como arquivo. Só roda no navegador. */
export function baixarArquivo(nome, conteudo, tipo = 'text/csv;charset=utf-8') {
  const blob = new Blob(['﻿', conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
