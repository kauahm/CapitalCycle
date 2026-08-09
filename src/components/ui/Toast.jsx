import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: { border: 'border-emerald-500/30', icon: 'text-emerald-400', Icon: CheckCircle },
    error: { border: 'border-rose-500/30', icon: 'text-rose-400', Icon: XCircle },
    warning: { border: 'border-amber-500/30', icon: 'text-amber-400', Icon: AlertCircle },
  };

  if (!message) return null;

  const { border, icon, Icon } = styles[type] || styles.success;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3.5 bg-[#101623] border ${border} rounded-xl shadow-lg shadow-black/40 max-w-sm`}>
      <Icon size={18} className={`${icon} shrink-0`} />
      <p className="flex-1 text-sm text-slate-200">{message}</p>
      <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}