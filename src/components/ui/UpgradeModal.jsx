import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';
import Dialog from './Dialog';
import Button from './Button';
import { GATES, getPlan } from './plans';
import { useAuth } from '../../hooks/useAuth';

/**
 * Modal reutilizável de "paywall": avisa que a funcionalidade não está no
 * plano atual do usuário e oferece o CTA de upgrade.
 *
 * Uso:  <UpgradeModal feature="contas" open={open} onClose={() => setOpen(false)} />
 *
 * A "feature" precisa existir em GATES (src/components/ui/plans.js).
 */
export default function UpgradeModal({ feature, open, onClose }) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const gate = GATES[feature];

  if (!gate) return null;

  const required = getPlan(gate.requiredPlan);

  return (
    <Dialog open={open} onClose={onClose} title={gate.title} size="sm">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 text-indigo-300 flex items-center justify-center shrink-0">
          <Crown size={20} />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{gate.message}</p>
      </div>

      <div className="mt-6 space-y-2">
        <Button
          className="w-full"
          size="lg"
          icon={ArrowRight}
          // Quem vê este modal já está logado: precisa entrar no fluxo de
          // TROCA de plano. Sem `changePlan`, o cadastro tentaria criar
          // uma conta nova com um e-mail que já existe.
          onClick={() => navigate('/cadastro', {
            state: { changePlan: true, currentPlan: userProfile?.plan || 'jovem' },
          })}
        >
          Fazer upgrade para {required.name}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Agora não
        </Button>
      </div>
    </Dialog>
  );
}
