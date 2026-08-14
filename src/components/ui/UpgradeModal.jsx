import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ArrowRight, X } from 'lucide-react';
import { GATES, getPlan } from './plans';
import { useAuth } from '../../hooks/useAuth';

/**
 * Modal reutilizável de "paywall": avisa que a funcionalidade não está no
 * plano atual do usuário e oferece o CTA de upgrade.
 *
 * Uso:  <UpgradeModal feature="mercado" open={open} onClose={() => setOpen(false)} />
 *
 * A "feature" precisa existir em GATES (src/components/ui/plans.js).
 */
export default function UpgradeModal({ feature, open, onClose }) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const gate = GATES[feature];

  if (!open || !gate) return null;

  const required = getPlan(gate.requiredPlan);

  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#101623] border border-indigo-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1e293b] flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
              <Crown size={20} />
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{gate.title}</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors shrink-0">
              <X size={22} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-400 leading-relaxed">{gate.message}</p>

          <button
            // Quem vê este modal já está logado: precisa entrar no fluxo de
            // TROCA de plano. Sem `changePlan`, o cadastro tentaria criar
            // uma conta nova com um e-mail que já existe.
            onClick={() => navigate('/cadastro', {
              state: { changePlan: true, currentPlan: userProfile?.plan || 'jovem' },
            })}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
          >
            Fazer upgrade para {required.name}
            <ArrowRight size={15} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Agora não
            </button>
          )}
        </div>
      </div>
    </div>
  );
}