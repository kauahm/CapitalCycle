import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Crown, Lock, ShieldCheck, Eye, EyeOff, X, ArrowRight, AlertTriangle, Wallet, Check,
} from 'lucide-react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { getPlan } from '../../components/ui/plans';
import Toast from '../../components/ui/Toast';

// Mapa de erros do Firebase Authentication para mensagens amigáveis
function passwordErrorMessage(code) {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Senha atual incorreta.';
    case 'auth/weak-password':
      return 'A nova senha deve ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
    case 'auth/requires-recent-login':
      return 'Sessão expirada. Saia e entre novamente para continuar.';
    default:
      return 'Não foi possível alterar a senha. Tente novamente.';
  }
}

// createdAt pode vir como Timestamp do Firestore ou Date (Google). Suporta ambos.
function formatCreatedAt(valor) {
  if (!valor) return null;
  const d = valor?.toDate ? valor.toDate() : new Date(valor);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Perfil() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // ── Dados reais da conta ─────────────────────────
  const planId = userProfile?.plan || 'jovem';
  const plan = getPlan(planId);

  const nome = userProfile?.nome || 'Usuário';
  const email = currentUser?.email || userProfile?.email || '';
  const inicial = nome.trim().charAt(0).toUpperCase();
  const membroDesde = formatCreatedAt(userProfile?.createdAt);

  // Só dá para trocar senha em contas que possuem senha (não vale para Google).
  // Contas legadas podem ter providerData vazio — trata como senha.
  const provedores = currentUser?.providerData?.map((p) => p.providerId) || [];
  const usaSenha = provedores.length === 0 || provedores.includes('password');

  // ── Modal trocar senha ───────────────────────────
  const [pwdOpen, setPwdOpen] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // ── Renda mensal (Fase 1) ────────────────────────
  // Valor fixo, editável a qualquer momento — sem histórico por mês nesta fase.
  const [editandoRenda, setEditandoRenda] = useState(false);
  const [rendaInput, setRendaInput] = useState(String(userProfile?.renda_mensal ?? ''));
  const [salvandoRenda, setSalvandoRenda] = useState(false);

  const abrirEdicaoRenda = () => {
    setRendaInput(String(userProfile?.renda_mensal ?? ''));
    setEditandoRenda(true);
  };

  const salvarRenda = async (e) => {
    e.preventDefault();
    const valor = parseFloat(rendaInput.replace(',', '.'));
    if (Number.isNaN(valor) || valor < 0) {
      setToast({ show: true, message: 'Informe um valor de renda válido.', type: 'error' });
      return;
    }
    setSalvandoRenda(true);
    try {
      await updateUserProfile({ renda_mensal: valor });
      setEditandoRenda(false);
      setToast({ show: true, message: 'Renda mensal atualizada.', type: 'success' });
    } catch (erro) {
      setToast({ show: true, message: 'Não foi possível salvar a renda mensal.', type: 'error' });
    } finally {
      setSalvandoRenda(false);
    }
  };

  const abrirModal = () => {
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmar('');
    setPwdError(null);
    setPwdOpen(true);
  };

  const handleTrocarSenha = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (usaSenha && !senhaAtual) { setPwdError('Informe sua senha atual.'); return; }
    if (novaSenha.length < 6) { setPwdError('A nova senha deve ter pelo menos 6 caracteres.'); return; }
    if (novaSenha !== confirmar) { setPwdError('A confirmação não confere com a nova senha.'); return; }

    setLoadingPwd(true);
    setPwdError(null);
    try {
      // Reautentica para atender ao requisito de "login recente" do Firebase
      if (usaSenha) {
        const credencial = EmailAuthProvider.credential(currentUser.email, senhaAtual);
        await reauthenticateWithCredential(currentUser, credencial);
      }
      // Alteração real no provedor de autenticação
      await updatePassword(currentUser, novaSenha);
      setPwdOpen(false);
      setToast({ show: true, message: 'Senha alterada com sucesso.', type: 'success' });
    } catch (erro) {
      setPwdError(passwordErrorMessage(erro?.code || erro?.message));
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-sm text-slate-400">Informações da conta, plano e segurança.</p>
      </div>

      {/* ── INFORMAÇÕES DA CONTA ─────────────────────── */}
      <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-6">
          <User size={16} className="text-slate-500" /> Informações da conta
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Nome + avatar */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold uppercase shrink-0">
              {inicial}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Nome</p>
              <p className="text-white font-bold truncate">{nome}</p>
            </div>
          </div>

          {/* E-mail */}
          <div className="min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
              <Mail size={12} /> E-mail da conta
            </p>
            <p className="text-white font-medium truncate">{email}</p>
          </div>

          {/* Plano atual */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
              <Crown size={12} /> Plano atual
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Crown size={12} /> {plan.name}
            </span>
          </div>
        </div>

        {membroDesde && (
          <p className="mt-6 pt-4 border-t border-[#1e293b] text-xs text-slate-500">
            Membro desde {membroDesde}
          </p>
        )}
      </div>

      {/* ── RENDA MENSAL (Fase 1) ────────────────────── */}
      <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
          <Wallet size={16} className="text-slate-500" /> Renda mensal
        </h3>

        {editandoRenda ? (
          <form onSubmit={salvarRenda} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1">Valor (R$)</label>
              <input
                autoFocus
                type="number"
                step="0.01"
                min="0"
                value={rendaInput}
                onChange={(e) => setRendaInput(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                placeholder="0,00"
              />
            </div>
            <div className="flex gap-2 shrink-0 sm:mt-6">
              <button
                type="submit"
                disabled={salvandoRenda}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
              >
                <Check size={15} /> {salvandoRenda ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => setEditandoRenda(false)}
                className="flex items-center gap-1.5 bg-[#1a2234] border border-[#1e293b] hover:border-indigo-500/40 text-slate-300 text-sm font-bold px-4 py-3 rounded-xl transition-colors"
              >
                <X size={15} /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              {userProfile?.renda_mensal ? (
                <p className="text-2xl font-extrabold text-white tabular-nums">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(userProfile.renda_mensal)}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Defina sua renda mensal para ver economia do mês e % da renda comprometida no Dashboard.
                </p>
              )}
            </div>
            <button
              onClick={abrirEdicaoRenda}
              className="shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1a2234] border border-[#1e293b] hover:border-indigo-500/40 hover:bg-[#1e293b] text-white text-sm font-bold transition-colors"
            >
              {userProfile?.renda_mensal ? 'Editar' : 'Definir renda'}
            </button>
          </div>
        )}
      </div>

      {/* ── SEU PLANO + SEGURANÇA ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Seu plano */}
        <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
            <Crown size={16} className="text-slate-500" /> Seu plano
          </h3>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-extrabold text-white">{plan.name}</p>
              {plan.badge && (
                <span className="inline-block mt-1 text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {plan.badge}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">R$ {plan.price}</p>
              <p className="text-xs text-slate-500">/ano</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mt-2">{plan.desc}</p>

          <button
            onClick={() => navigate('/cadastro', { state: { changePlan: true, currentPlan: planId } })}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
          >
            Trocar plano <ArrowRight size={15} />
          </button>
        </div>

        {/* Segurança */}
        <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-slate-500" /> Segurança
          </h3>

          {usaSenha ? (
            <>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Sua senha é gerenciada pelo Firebase Authentication e nunca é armazenada no nosso banco de dados.
              </p>
              <button
                onClick={abrirModal}
                className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a2234] border border-[#1e293b] hover:border-indigo-500/40 hover:bg-[#1e293b] text-white text-sm font-bold transition-colors"
              >
                <Lock size={15} /> Trocar senha
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed">
              Esta conta foi criada com o Google e não possui senha própria para alteração.
            </p>
          )}
        </div>
      </div>

      {/* ── MODAL TROCAR SENHA ───────────────────────── */}
      {pwdOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Trocar senha</h2>
              <button onClick={() => setPwdOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleTrocarSenha} className="p-6 space-y-4">
              {pwdError && (
                <div className="flex gap-2 items-start bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                  <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-rose-300 text-xs leading-relaxed">{pwdError}</p>
                </div>
              )}

              {usaSenha && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Senha atual</label>
                  <input
                    type="password"
                    required
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nova senha</label>
                <div className="relative">
                  <input
                    type={showSenha ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 outline-none"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Confirmar nova senha</label>
                <input
                  type={showSenha ? 'text' : 'password'}
                  required
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                  placeholder="Repita a nova senha"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPwd}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                {loadingPwd ? 'Alterando...' : 'Alterar senha'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
}