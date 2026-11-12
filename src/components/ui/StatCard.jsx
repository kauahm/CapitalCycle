import React from 'react';
import CurrencyValue from './CurrencyValue';

/* Card de indicador (KPI) do painel. `valor` numérico vira moeda; string é
   impressa como está. `rodape` recebe um nó (tendência, explicação). */
export default function StatCard({ label, valor, texto, tone = 'default', size = '3xl', rodape, className = '', children }) {
  const cor = {
    default: 'text-textMain',
    success: 'text-success',
    danger: 'text-rose-400',
    warning: 'text-amber-400',
    primary: 'text-indigo-300',
  }[tone] || 'text-textMain';

  return (
    <div className={`cc-card-p flex flex-col justify-center ${className}`}>
      <p className="cc-label mb-3">{label}</p>
      {texto != null ? (
        <p className={`text-3xl font-bold tabular-nums tracking-tight ${cor}`}>{texto}</p>
      ) : (
        <CurrencyValue value={valor} size={size} align="left" className={`font-bold tracking-tight ${cor}`} />
      )}
      {rodape && <div className="mt-3 text-sm text-textSecondary">{rodape}</div>}
      {children}
    </div>
  );
}
