import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/* ==========================================================================
   Dialog — modal acessível do painel.

   O que os modais anteriores não faziam e este faz:
     - `role="dialog"` + `aria-modal` + título ligado por `aria-labelledby`
     - Esc fecha; clique no fundo fecha (desligável com `fecharNoFundo`)
     - foco entra no diálogo ao abrir e volta ao elemento de origem ao fechar
     - Tab fica preso dentro do diálogo
     - a página atrás não rola enquanto ele está aberto
     - no celular abre como folha inferior; no desktop, centralizado
   ========================================================================== */

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TAMANHOS = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-2xl' };

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  tone = 'default', // 'default' | 'danger'
  fecharNoFundo = true,
  bloqueado = false, // impede fechar (ex.: operação em andamento)
}) {
  const painelRef = useRef(null);
  const origemRef = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    if (!open) return undefined;
    origemRef.current = document.activeElement;

    const painel = painelRef.current;
    const primeiro = painel?.querySelector('[data-autofocus]') || painel?.querySelector(FOCAVEIS);
    (primeiro || painel)?.focus?.();

    const anteriorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape' && !bloqueado) {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === 'Tab' && painel) {
        const itens = [...painel.querySelectorAll(FOCAVEIS)].filter((el) => el.offsetParent !== null);
        if (!itens.length) return;
        const first = itens[0];
        const last = itens[itens.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = anteriorOverflow;
      origemRef.current?.focus?.();
    };
  }, [open, onClose, bloqueado]);

  if (!open) return null;

  return createPortal(
    <div
      className="cc-dialog-backdrop fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4"
      onMouseDown={(e) => {
        if (fecharNoFundo && !bloqueado && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className={`cc-dialog-panel w-full ${TAMANHOS[size] || TAMANHOS.md} bg-surface border ${
          tone === 'danger' ? 'border-rose-500/30' : 'border-hairline'
        } rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/60 flex flex-col max-h-[92vh] outline-none`}
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-hairline shrink-0">
          <div className="min-w-0">
            <h2 id={tituloId} className="text-lg font-bold text-textMain leading-snug">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-textSecondary leading-relaxed">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={bloqueado}
            aria-label="Fechar"
            className="shrink-0 -m-1 p-1 rounded-lg text-textSecondary hover:text-textMain hover:bg-surfaceLight transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">{children}</div>

        {footer && (
          <div className="p-6 pt-0 shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
