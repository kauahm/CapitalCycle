import React from 'react';

/**
 * Mockup estático e fiel do Dashboard Financeiro real do CapitalCycle.
 * Reproduz o layout que o usuário vê ao logar (cards de saldo, gráfico de
 * investimento, lista de transações). É um componente puramente visual
 * construído com divs + SVG inline — não depende de bibliotecas externas.
 */
export default function DashboardMockup() {
  // Pontos do gráfico (valores fictícios, mas plausíveis para um usuário "Adulto")
  const bars = [42, 58, 35, 71, 49, 88, 64, 77, 55, 92, 68, 81];

  // Transações recentes exibidas no painel direito
  const transactions = [
    { cat: 'Mercado',  date: '07 ago', value: '− R$ 184,30', kind: 'out' },
    { cat: 'Salário',  date: '05 ago', value: '+ R$ 6.800,00', kind: 'in'  },
    { cat: 'Uber',     date: '04 ago', value: '− R$ 27,90',   kind: 'out' },
    { cat: 'CDB Nubank', date: '01 ago', value: '+ R$ 312,40', kind: 'in'  },
  ];

  return (
    <div className="cc-mockup" aria-hidden="true">
      <div className="cc-mockup-frame">

        {/* Topo: saudação + avatar (igual ao app real) */}
        <div className="cc-mock-top">
          <div>
            <div className="cc-mock-eyebrow">Olá, Lucas</div>
            <div className="cc-mock-sub">Acompanhe a evolução real do seu capital.</div>
          </div>
          <div className="cc-mock-avatar" />
        </div>

        {/* Cards de KPI */}
        <div className="cc-mock-kpis">
          <div className="cc-mock-kpi">
            <div className="cc-mock-kpi-label">Saldo disponível</div>
            <div className="cc-mock-kpi-val indigo">R$ 14.820,00</div>
            <div className="cc-mock-kpi-foot pos">Fluxo positivo este mês</div>
          </div>
          <div className="cc-mock-kpi">
            <div className="cc-mock-kpi-label">Total investido</div>
            <div className="cc-mock-kpi-val emerald">R$ 9.412,00</div>
            <div className="cc-mock-kpi-foot pos">+ 4,2% no mês</div>
          </div>
        </div>

        {/* Gráfico de barras (SVG puro) */}
        <div className="cc-mock-chart">
          <div className="cc-mock-chart-head">
            <span className="cc-mock-chart-title">Evolução patrimonial</span>
            <span className="cc-mock-chart-legend">12 meses</span>
          </div>
          <svg viewBox="0 0 320 90" className="cc-mock-svg" preserveAspectRatio="none">
            <line x1="0" y1="89" x2="320" y2="89" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {bars.map((h, i) => {
              const w = 320 / bars.length;
              return (
                <rect
                  key={i}
                  x={i * w + 4}
                  y={90 - h * 0.78}
                  width={w - 8}
                  height={h * 0.78}
                  rx="2"
                  fill={i === bars.length - 1 ? '#6366f1' : 'rgba(99,102,241,0.32)'}
                />
              );
            })}
            <circle cx={11 * (320 / 12) + (320 / 24)} cy={90 - 81 * 0.78} r="3" fill="#fff" />
          </svg>
        </div>

        {/* Lista de transações */}
        <div className="cc-mock-tx">
          <div className="cc-mock-tx-title">Últimas movimentações</div>
          <ul className="cc-mock-tx-list">
            {transactions.map((t, i) => (
              <li key={i} className="cc-mock-tx-item">
                <div>
                  <div className="cc-mock-tx-cat">{t.cat}</div>
                  <div className="cc-mock-tx-date">{t.date}</div>
                </div>
                <div className={`cc-mock-tx-val ${t.kind}`}>{t.value}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Marca d'água interna */}
        <div className="cc-mock-watermark">CapitalCycle</div>
      </div>
    </div>
  );
}
