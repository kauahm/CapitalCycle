import { describe, it, expect, vi, afterEach } from 'vitest';
import { calcularProgressoMeta } from './metas';

// Congela "hoje" para que os cálculos de prazo sejam determinísticos.
function fixarHoje(iso) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${iso}T12:00:00`));
}

afterEach(() => vi.useRealTimers());

describe('calcularProgressoMeta', () => {
  it('soma aportes, calcula percentual e restante', () => {
    fixarHoje('2026-11-12');
    const p = calcularProgressoMeta(
      { orcamento: 1000, inicio: '2026-11-01', fim: '2026-12-31' },
      [{ valor: 250, data: '2026-11-05' }, { valor: '150', data: '2026-11-10' }],
    );
    expect(p.valorAcumulado).toBe(400);
    expect(p.valorRestante).toBe(600);
    expect(p.progressoPct).toBe(40);
    expect(p.concluida).toBe(false);
    expect(p.prazoEncerrado).toBe(false);
    expect(p.diasRestantes).toBe(49);
  });

  it('nunca passa de 100% e marca como concluída', () => {
    fixarHoje('2026-11-12');
    const p = calcularProgressoMeta({ orcamento: 500, fim: '2026-12-01' }, [{ valor: 700, data: '2026-11-01' }]);
    expect(p.progressoPct).toBe(100);
    expect(p.valorRestante).toBe(0);
    expect(p.concluida).toBe(true);
    expect(p.equivalentes).toBeNull();
  });

  it('meta vencida: dias restantes travam em 0 e não há ritmo necessário', () => {
    fixarHoje('2026-11-12');
    const p = calcularProgressoMeta({ orcamento: 1000, fim: '2026-10-01' }, []);
    expect(p.prazoEncerrado).toBe(true);
    expect(p.diasRestantes).toBe(0);
    expect(p.ritmoNecessario).toBeNull();
    expect(p.equivalentes).toBeNull();
  });

  it('último dia do prazo: tudo precisa entrar hoje', () => {
    fixarHoje('2026-11-12');
    const p = calcularProgressoMeta({ orcamento: 1000, fim: '2026-11-12' }, [{ valor: 400, data: '2026-11-01' }]);
    expect(p.equivalentes.horizonte).toBe('hoje');
    expect(p.equivalentes.hoje).toBe(600);
  });

  it('equivalentes por período só existem quando o período cabe no horizonte', () => {
    fixarHoje('2026-11-12');
    // 10 dias restantes: por dia e por semana existem; por mês e por ano, não.
    const p = calcularProgressoMeta({ orcamento: 1000, fim: '2026-11-22' }, []);
    expect(p.equivalentes.porDia).toBe(100);
    expect(p.equivalentes.porSemana).toBe(500); // 2 semanas (ceil(10/7))
    expect(p.equivalentes.porMes).toBeNull();
    expect(p.equivalentes.porAno).toBeNull();
    expect(p.equivalentes.horizonte).toBe('menos-de-um-mes');
  });

  it('ritmo atual usa a janela de 30 dias e gera previsão de conclusão', () => {
    fixarHoje('2026-11-12');
    const p = calcularProgressoMeta(
      { orcamento: 3000, fim: '2027-01-11', criadoEm: new Date('2026-01-01') },
      [{ valor: 300, data: '2026-10-20' }, { valor: 300, data: '2026-11-10' }, { valor: 1000, data: '2026-05-01' }],
    );
    // Janela: 2026-10-13..2026-11-12 (30 dias) → 600 / 30 = 20 por dia
    expect(p.ritmoAtual).toBeCloseTo(20, 5);
    expect(p.temAporte).toBe(true);
    expect(p.dataPrevista).toBeInstanceOf(Date);
    expect(p.valorRestante).toBe(1400);
  });

  it('sem valor de meta, o progresso é zero e nada quebra', () => {
    fixarHoje('2026-11-12');
    const p = calcularProgressoMeta({ orcamento: 0, fim: '2026-12-01' }, []);
    expect(p.progressoPct).toBe(0);
    expect(p.concluida).toBe(false);
  });
});
