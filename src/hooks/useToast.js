import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/** Acesso ao provedor de toasts: toast.success('...'), toast.error('...'), etc. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}
