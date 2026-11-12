import React from 'react';

const TONS = {
  primary: 'bg-primary',
  success: 'bg-emerald-400',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  muted: 'bg-slate-600',
};

/* Barra de progresso única do painel. Para pintar pelo estado do orçamento
   (ok | alerta | estourado) use `tomDoEstado` de utils/orcamentoCategoria. */
export default function ProgressBar({ value = 0, tone = 'primary', height = 'h-1.5', label, className = '' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className={`w-full bg-hairline ${height} rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${TONS[tone] || TONS.primary} transition-[width] duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
