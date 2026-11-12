import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/* ==========================================================================
   Button — único botão do painel.

   Variantes pensadas pela hierarquia da ação, não pela cor:
     primary      a ação principal da tela (uma por contexto)
     secondary    ações de apoio, sobre superfície
     ghost        ações discretas em linhas e cabeçalhos
     danger       destrutivas, sempre confirmadas em Dialog
     dangerSolid  o botão de confirmação dentro do Dialog destrutivo
     success      confirmação positiva (ex.: "Já paguei")
   ========================================================================== */

const VARIANTES = {
  primary:
    'bg-primary text-white hover:bg-indigo-500 shadow-lg shadow-primary/20 disabled:shadow-none',
  secondary:
    'bg-surfaceLight text-textMain border border-hairline hover:border-primary/50 hover:bg-hairline',
  ghost:
    'bg-transparent text-textSecondary hover:text-textMain hover:bg-surfaceLight',
  danger:
    'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20',
  dangerSolid:
    'bg-rose-600 text-white hover:bg-rose-500',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-500',
};

const TAMANHOS = {
  sm: 'h-9 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-11 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-sm gap-2 rounded-xl',
  icon: 'h-9 w-9 p-0 rounded-lg',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    children,
    className = '',
    type = 'button',
    disabled,
    ...rest
  },
  ref,
) {
  const iconSize = size === 'sm' || size === 'icon' ? 15 : 16;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-app
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
        ${VARIANTES[variant] || VARIANTES.primary} ${TAMANHOS[size] || TAMANHOS.md} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin shrink-0" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={iconSize} className="shrink-0" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
});

export default Button;
