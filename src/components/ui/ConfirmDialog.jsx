import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Dialog from './Dialog';
import Button from './Button';

/* Confirmação padronizada. Substitui `window.confirm`, que não segue o tema,
   não é estilizável, bloqueia a aba inteira e some em alguns navegadores
   móveis embutidos. `onConfirm` pode ser assíncrono: o botão mostra o
   progresso e o diálogo não fecha no meio da operação. */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
}) {
  const [executando, setExecutando] = useState(false);

  const confirmar = async () => {
    setExecutando(true);
    try {
      await onConfirm?.();
      onClose?.();
    } finally {
      setExecutando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      tone={tone}
      bloqueado={executando}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={executando}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'dangerSolid' : 'primary'}
            onClick={confirmar}
            loading={executando}
            data-autofocus
          >
            {confirmLabel}
          </Button>
        </>
      )}
    >
      <div className="flex gap-4">
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            tone === 'danger' ? 'bg-rose-500/10 text-rose-400' : 'bg-primary/10 text-primary'
          }`}
        >
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>
    </Dialog>
  );
}
