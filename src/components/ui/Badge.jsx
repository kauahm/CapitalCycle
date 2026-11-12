import React from 'react';

const TONS = {
  neutral: 'bg-hairline text-slate-300',
  primary: 'bg-primary/15 text-indigo-300 border border-primary/30',
  success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25',
  danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/25',
  warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/25',
  info: 'bg-sky-500/10 text-sky-300 border border-sky-500/25',
};

export default function Badge({ children, tone = 'neutral', icon: Icon, className = '', title }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap ${TONS[tone] || TONS.neutral} ${className}`}
    >
      {Icon && <Icon size={11} aria-hidden="true" />}
      {children}
    </span>
  );
}
