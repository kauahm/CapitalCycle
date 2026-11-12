import React from 'react';

/* Primeira linha de toda tela do painel: a frase de contexto à esquerda e as
   ações à direita. O título da página já está na Topbar, por isso não se
   repete aqui. */
export default function PageHeader({ children, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <p className="text-sm text-textSecondary max-w-xl leading-relaxed">{children}</p>
      {actions && <div className="flex flex-wrap items-center gap-3 w-full md:w-auto [&>button]:flex-1 md:[&>button]:flex-none">{actions}</div>}
    </div>
  );
}
