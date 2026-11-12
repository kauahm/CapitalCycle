import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from '../../context/ToastContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/* ==========================================================================
   Toasts — um provedor para o app inteiro.

   Antes cada tela mantinha `const [toast, setToast] = useState({show,...})`
   e renderizava o próprio <Toast>; dois avisos seguidos se sobrescreviam e
   um aviso disparado logo antes de navegar sumia junto com a tela.

   Uso:  const toast = useToast();  toast.success('Salvo.');
   ========================================================================== */

const ESTILOS = {
  success: { border: 'border-emerald-500/30', icon: 'text-emerald-400', Icon: CheckCircle },
  error: { border: 'border-rose-500/30', icon: 'text-rose-400', Icon: XCircle },
  warning: { border: 'border-amber-500/30', icon: 'text-amber-400', Icon: AlertCircle },
  info: { border: 'border-primary/30', icon: 'text-indigo-300', Icon: Info },
};

const DURACAO = { success: 3200, info: 4000, warning: 5000, error: 6000 };

export function ToastProvider({ children }) {
  const [itens, setItens] = useState([]);
  const seq = useRef(0);

  const remover = useCallback((id) => setItens((l) => l.filter((t) => t.id !== id)), []);

  const mostrar = useCallback(
    (message, type = 'success', opcoes = {}) => {
      if (!message) return undefined;
      const id = ++seq.current;
      setItens((l) => [...l.slice(-3), { id, message, type }]);
      const ms = opcoes.duracao ?? DURACAO[type] ?? 3500;
      setTimeout(() => remover(id), ms);
      return id;
    },
    [remover],
  );

  const api = useMemo(
    () => ({
      show: mostrar,
      success: (m, o) => mostrar(m, 'success', o),
      error: (m, o) => mostrar(m, 'error', o),
      warning: (m, o) => mostrar(m, 'warning', o),
      info: (m, o) => mostrar(m, 'info', o),
    }),
    [mostrar],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 items-end"
        aria-live="polite"
      >
        {itens.map((t) => {
          const { border, icon, Icon } = ESTILOS[t.type] || ESTILOS.success;
          return (
            <div
              key={t.id}
              role="status"
              className={`cc-toast pointer-events-auto flex items-start gap-3 px-4 py-3.5 bg-surface border ${border} rounded-xl shadow-lg shadow-black/40 w-full sm:w-auto sm:max-w-sm`}
            >
              <Icon size={18} className={`${icon} shrink-0 mt-0.5`} aria-hidden="true" />
              <p className="flex-1 text-sm text-slate-200 leading-snug">{t.message}</p>
              <button
                onClick={() => remover(t.id)}
                aria-label="Fechar aviso"
                className="text-slate-500 hover:text-white transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

