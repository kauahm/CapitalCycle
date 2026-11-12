import React, { forwardRef, useId } from 'react';

/* ==========================================================================
   Campos de formulário do painel.

   <Field label hint error> envolve qualquer controle e liga rótulo, dica e
   erro ao controle por id/aria — o que os formulários anteriores não faziam
   (labels sem `htmlFor`, erros só visuais).

   <Input>, <Select> e <Textarea> aplicam a superfície padrão `cc-field`.
   ========================================================================== */

export function Field({ label, hint, error, children, className = '', id: idExterno }) {
  const idGerado = useId();
  const id = idExterno || idGerado;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const controle = React.isValidElement(children)
    ? React.cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [hintId, errId].filter(Boolean).join(' ') || undefined,
      })
    : children;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-textSecondary mb-1.5">
          {label}
        </label>
      )}
      {controle}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-[11px] text-rose-400 leading-relaxed" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const BASE =
  'w-full bg-app border text-textMain rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 ' +
  'transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed aria-[invalid=true]:border-rose-500/70';

export const Input = forwardRef(function Input({ className = '', ...rest }, ref) {
  return <input ref={ref} className={`${BASE} border-hairline ${className}`} {...rest} />;
});

export const Select = forwardRef(function Select({ className = '', children, ...rest }, ref) {
  return (
    <select ref={ref} className={`${BASE} border-hairline appearance-none cc-select ${className}`} {...rest}>
      {children}
    </select>
  );
});

export const Textarea = forwardRef(function Textarea({ className = '', ...rest }, ref) {
  return <textarea ref={ref} className={`${BASE} border-hairline min-h-[6rem] ${className}`} {...rest} />;
});

/* Alternador de duas ou mais opções (Saída/Entrada, Orçamento/Meta). */
export function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex p-1 bg-app rounded-xl border border-hairline">
      {options.map((opt) => {
        const ativo = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              ativo ? `${opt.activeClass || 'bg-primary'} text-white` : 'text-textSecondary hover:text-textMain'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
