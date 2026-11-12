import { describe, it, expect } from 'vitest';
import { calcularProgressoCategorias, tomDoEstado } from './orcamentoCategoria';
import { calcularVariacaoPct } from './comparativoMensal';
import { mesAnteriorPrefixo, diasEntre, parseData, addDias } from './data';
import { formatarMoeda, formatarDataBR, parseValor, formatarPct } from './moeda';
import { canAddCiclo, canAddTransacao, canConsultarIA, getPlan, PLAN_LIST } from '../components/ui/plans';

describe('calcularProgressoCategorias', () => {
  const transacoes = [
    { tipo: 'saida', categoria: 'Alimentação', valor: 450, data: '2026-11-03' },
    { tipo: 'saida', categoria: 'Alimentação', valor: '100', data: '2026-11-20' },
    { tipo: 'saida', categoria: 'Lazer', valor: 95, data: '2026-11-08' },
    { tipo: 'saida', categoria: 'Alimentação', valor: 900, data: '2026-10-30' }, // outro mês
    { tipo: 'entrada', categoria: 'Salário', valor: 5000, data: '2026-11-05' }, // entrada não conta
  ];

  it('calcula gasto, percentual e estado por categoria do mês', () => {
    const r = calcularProgressoCategorias({ Alimentação: 500, Lazer: 100, Saúde: 200 }, transacoes, '2026-11');
    const ali = r.find((x) => x.categoria === 'Alimentação');
    const lazer = r.find((x) => x.categoria === 'Lazer');
    const saude = r.find((x) => x.categoria === 'Saúde');
    expect(ali.gasto).toBe(550);
    expect(ali.pct).toBeCloseTo(110);
    expect(ali.estado).toBe('estourado');
    expect(lazer.estado).toBe('alerta'); // 95%
    expect(saude.gasto).toBe(0);
    expect(saude.estado).toBe('ok');
  });

  it('ordena do maior percentual para o menor e ignora limites inválidos', () => {
    const r = calcularProgressoCategorias({ Alimentação: 500, Lazer: 100, Moradia: 0, Transporte: 'abc' }, transacoes, '2026-11');
    expect(r.map((x) => x.categoria)).toEqual(['Alimentação', 'Lazer']);
  });

  it('mapeia estado para tom visual', () => {
    expect(tomDoEstado('estourado')).toBe('danger');
    expect(tomDoEstado('alerta')).toBe('warning');
    expect(tomDoEstado('ok')).toBe('success');
  });
});

describe('calcularVariacaoPct', () => {
  it('retorna a variação percentual', () => {
    expect(calcularVariacaoPct(120, 100)).toBe(20);
    expect(calcularVariacaoPct(80, 100)).toBe(-20);
  });
  it('retorna null sem base de comparação', () => {
    expect(calcularVariacaoPct(100, 0)).toBeNull();
    expect(calcularVariacaoPct(100, null)).toBeNull();
  });
});

describe('helpers de data', () => {
  it('mês anterior cruza a virada de ano', () => {
    expect(mesAnteriorPrefixo('2026-01')).toBe('2025-12');
    expect(mesAnteriorPrefixo('2026-11')).toBe('2026-10');
  });
  it('diasEntre e addDias são inversos', () => {
    expect(diasEntre('2026-11-01', '2026-11-30')).toBe(29);
    expect(addDias('2026-11-01', 29).getDate()).toBe(30);
    expect(parseData(null)).toBeNull();
  });
});

describe('moeda', () => {
  it('formata em BRL', () => {
    // O Intl separa "R$" do número com um espaço inseparável (U+00A0).
    const normal = (s) => s.split(String.fromCharCode(160)).join(' ');
    expect(normal(formatarMoeda(1234.5))).toBe('R$ 1.234,50');
    expect(normal(formatarMoeda(null))).toBe('R$ 0,00');
  });
  it('converte texto em número aceitando vírgula e ponto', () => {
    expect(parseValor('1.234,56')).toBe(1234.56);
    expect(parseValor('1234.56')).toBe(1234.56);
    expect(parseValor('0,5')).toBe(0.5);
    expect(Number.isNaN(parseValor(''))).toBe(true);
    expect(Number.isNaN(parseValor('abc'))).toBe(true);
  });
  it('formata data e percentual', () => {
    expect(formatarDataBR('2026-11-12')).toBe('12/11/2026');
    expect(formatarDataBR('')).toBe('');
    expect(formatarPct(12.4)).toBe('+12%');
    expect(formatarPct(-3)).toBe('-3%');
  });
});

describe('planos e travas', () => {
  it('plano Jovem tem limites e Adulto é ilimitado', () => {
    expect(PLAN_LIST.map((p) => p.id)).toEqual(['jovem', 'adulto']);
    expect(getPlan('inexistente').id).toBe('jovem');
    expect(canAddTransacao('jovem', 99)).toBe(true);
    expect(canAddTransacao('jovem', 100)).toBe(false);
    expect(canAddTransacao('adulto', 100000)).toBe(true);
    expect(canAddCiclo('jovem', 2)).toBe(false);
    expect(canConsultarIA('jovem', 50)).toBe(false);
    expect(canConsultarIA('adulto', 50)).toBe(true);
  });
});
