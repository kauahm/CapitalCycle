import { describe, it, expect } from 'vitest';
import { categoriaApp, tipoTransacao, tipoConta, saldoConta } from './openFinanceMapeamento';
import { gerarCsvTransacoes } from './csv';
import { montarContextoFinanceiro } from './advisorContexto';
import { dadosCarteiraManual, idCarteiraManual, rotuloConta, saldoGeridoPeloApp } from './contaManual';

describe('mapeamento Pluggy → app', () => {
  it('classifica pelo sinal do valor, não pelo type', () => {
    expect(tipoTransacao({ amount: -35.9, type: 'CREDIT' })).toBe('saida');
    expect(tipoTransacao({ amount: 1200, type: 'DEBIT' })).toBe('entrada');
    expect(tipoTransacao({ amount: 0, type: 'CREDIT' })).toBe('entrada');
  });

  it('categoriza por categoria do banco ou descrição', () => {
    expect(categoriaApp({ category: 'Groceries', description: 'Mercado X' }, 'saida')).toBe('Alimentação');
    expect(categoriaApp({ description: 'UBER *TRIP' }, 'saida')).toBe('Transporte');
    expect(categoriaApp({ description: 'NETFLIX.COM' }, 'saida')).toBe('Lazer');
    expect(categoriaApp({ description: 'PAGTO SALARIO' }, 'entrada')).toBe('Salário');
    expect(categoriaApp({ description: 'coisa qualquer' }, 'saida')).toBe('Outros');
  });

  it('cartão de crédito vira saldo negativo (fatura)', () => {
    expect(tipoConta({ type: 'CREDIT' })).toBe('Cartão de crédito');
    expect(tipoConta({ type: 'BANK', subtype: 'SAVINGS_ACCOUNT' })).toBe('Poupança');
    expect(saldoConta({ type: 'CREDIT', balance: 850 })).toBe(-850);
    expect(saldoConta({ type: 'BANK', balance: 850 })).toBe(850);
  });
});

describe('gerarCsvTransacoes', () => {
  it('gera cabeçalho e linhas com separador ; e vírgula decimal', () => {
    const csv = gerarCsvTransacoes(
      [
        { data: '2026-11-02', descricao: 'Mercado; "semana"', tipo: 'saida', categoria: 'Alimentação', conta_id: 'c1', valor: 123.4, origem: 'manual' },
        { data: '2026-11-05', descricao: 'Salário', tipo: 'entrada', categoria: 'Salário', conta_id: 'c2', valor: 5000, origem: 'openfinance' },
      ],
      { c1: { nome: 'Carteira', banco: 'Manual' }, c2: { nome: 'Conta', banco: 'Nubank' } },
    );
    const linhas = csv.split('\r\n');
    expect(linhas[0]).toBe('Data;Descrição;Tipo;Categoria;Conta;Valor (R$);Origem');
    expect(linhas[1]).toBe('02/11/2026;"Mercado; ""semana""";Saída;Alimentação;Carteira · Manual;-123,40;Manual');
    expect(linhas[2]).toBe('05/11/2026;Salário;Entrada;Salário;Conta · Nubank;5000,00;Open Finance');
  });
});

describe('montarContextoFinanceiro', () => {
  it('resume o mês sem expor lançamentos individuais', () => {
    const { texto, resumo } = montarContextoFinanceiro({
      hoje: '2026-11-12',
      rendaMensal: 4000,
      contas: [
        { tipo: 'Corrente', saldo: 1500 },
        { tipo: 'Cartão de crédito', saldo: -300 },
      ],
      transacoes: [
        { tipo: 'saida', categoria: 'Alimentação', valor: 600, data: '2026-11-03', descricao: 'Padaria do João' },
        { tipo: 'saida', categoria: 'Lazer', valor: 200, data: '2026-11-04', descricao: 'Cinema' },
        { tipo: 'entrada', categoria: 'Salário', valor: 4000, data: '2026-11-05', descricao: 'Empresa X' },
        { tipo: 'saida', categoria: 'Alimentação', valor: 500, data: '2026-10-10', descricao: 'Mercado' },
      ],
      ciclos: [{ id: 'm1', tipo: 'Meta', nome: 'Reserva', orcamento: 1000, fim: '2026-12-31' }],
      aportesMap: { m1: [{ valor: 250, data: '2026-11-01' }] },
      limites: { Alimentação: 500 },
    });
    expect(resumo.entradasMes).toBe(4000);
    expect(resumo.saidasMes).toBe(800);
    expect(resumo.saldoDisponivel).toBe(1500);
    expect(resumo.faturaCartao).toBe(300);
    expect(texto).toContain('Alimentação R$ 600,00');
    expect(texto).toContain('Reserva: R$ 250,00 de R$ 1.000,00 (25%');
    expect(texto).toContain('Alimentação 120% de R$ 500,00 (estourado)');
    // Descrições de lançamentos não vazam para o modelo.
    expect(texto).not.toContain('Padaria do João');
    expect(texto).not.toContain('Empresa X');
  });
});

describe('carteira manual', () => {
  it('tem id determinístico por usuário e saldo gerido pelo app', () => {
    expect(idCarteiraManual('abc')).toBe('carteira_abc');
    const c = dadosCarteiraManual('abc');
    expect(c).toMatchObject({ uid: 'abc', origem: 'manual', saldo: 0, tipo: 'Corrente' });
    expect(rotuloConta(c)).toBe('Carteira (manual)');
    expect(rotuloConta({ nome: 'Conta Corrente', banco: 'Nubank', origem: 'openfinance' })).toBe('Conta Corrente · Nubank');
    expect(saldoGeridoPeloApp(c)).toBe(true);
    expect(saldoGeridoPeloApp({ origem: 'openfinance' })).toBe(false);
    expect(saldoGeridoPeloApp(undefined)).toBe(true);
  });
});
