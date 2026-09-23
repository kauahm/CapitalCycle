import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Crown, Lock, ShieldCheck, Eye, EyeOff, X, ArrowRight, AlertTriangle, Wallet, Check, Camera, Trash2,
} from 'lucide-react';
import {
  updatePassword, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider, deleteUser,
} from 'firebase/auth';
import { googleProvider } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { getPlan } from '../../components/ui/plans';
import Toast from '../../components/ui/Toast';
import Avatar from '../../components/ui/Avatar';
import { prepararFotoPerfil, mensagemErroFoto, TIPOS_ACEITOS } from '../../utils/imagemPerfil';
import { limparDadosDoUsuario, mensagemFalhaExclusao } from '../../utils/exclusaoConta';

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

// Erros da reautenticação exigida para excluir a conta. Em todos eles nada
// foi apagado, e a mensagem diz isso — é a dúvida imediata de quem vê o erro.
function reauthErrorMessage(code) {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Senha incorreta. A conta não foi excluída.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return 'Confirmação pelo Google cancelada. A conta não foi excluída.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela do Google. Libere o pop-up e tente novamente.';
    case 'auth/user-mismatch':
      return 'A conta do Google confirmada não é a desta sessão.';
    case 'auth/requires-recent-login':
      return 'Sessão expirada. Saia e entre novamente para excluir a conta.';
    default:
      return 'Não foi possível confirmar sua identidade. A conta não foi excluída.';
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

  // ── Foto de perfil ───────────────────────────────
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  const handleEscolherFoto = async (e) => {
    const file = e.target.files?.[0];
    // Limpa o input já: escolher o mesmo arquivo de novo depois de um erro
    // não dispara change se o valor continuar lá.
    e.target.value = '';
    if (!file || salvandoFoto) return;

    setSalvandoFoto(true);
    try {
      const { dataUrl } = await prepararFotoPerfil(file);
      // Só o campo da foto é enviado: updateUserProfile grava com merge, então
      // nome, plano, renda e aceite dos termos ficam intocados.
      await updateUserProfile({ fotoPerfil: dataUrl });
      setToast({ show: true, message: 'Foto de perfil atualizada.', type: 'success' });
    } catch (erro) {
      // Se a gravação falhar, nada foi alterado no perfil — o avatar anterior
      // continua na tela.
      console.error('[Perfil] Falha ao atualizar a foto:', erro?.code || erro?.message);
      setToast({ show: true, message: mensagemErroFoto(erro?.message), type: 'error' });
    } finally {
      setSalvandoFoto(false);
    }
  };

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

  // ── Exclusão da conta (Fase 5B) ──────────────────
  const [delOpen, setDelOpen] = useState(false);
  const [delEmail, setDelEmail] = useState('');
  const [delSenha, setDelSenha] = useState('');
  const [delErro, setDelErro] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  // Trava lógica síncrona: `excluindo` só vale para o visual, e o React agenda
  // a atualização — dois cliques rápidos passariam pelos dois. Aqui não pode.
  const excluirLockRef = useRef(false);

  // Confirmação de intenção: precisa ser o e-mail da conta, sem variação.
  const emailConfere =
    !!currentUser?.email &&
    delEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase();

  const abrirExclusao = () => {
    setDelEmail('');
    setDelSenha('');
    setDelErro(null);
    setDelOpen(true);
  };

  const fecharExclusao = () => {
    // Fechar no meio da rotina deixaria a exclusão correndo sem nada na tela
    // dizendo o que aconteceu.
    if (excluirLockRef.current) return;
    setDelEmail('');
    setDelSenha('');
    setDelErro(null);
    setDelOpen(false);
  };

  // Reautenticação pelo provedor real da conta. A senha só existe enquanto o
  // modal está aberto: não é guardada, nem registrada, nem enviada a lugar
  // nenhum além do próprio Firebase Authentication.
  const reautenticar = async () => {
    if (usaSenha) {
      const credencial = EmailAuthProvider.credential(currentUser.email, delSenha);
      await reauthenticateWithCredential(currentUser, credencial);
    } else {
      await reauthenticateWithPopup(currentUser, googleProvider);
    }
  };

  const handleExcluirConta = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    // Validações locais primeiro: elas não iniciam nada destrutivo, então
    // ainda não é hora de travar.
    if (!emailConfere) {
      setDelErro('Digite o e-mail desta conta exatamente como ele aparece acima.');
      return;
    }
    if (usaSenha && !delSenha) {
      setDelErro('Informe sua senha atual para confirmar.');
      return;
    }

    if (excluirLockRef.current) return;
    excluirLockRef.current = true;
    setExcluindo(true);
    setDelErro(null);

    try {
      // 1. Reautenticar. Se falhar aqui, nenhum documento é tocado.
      try {
        await reautenticar();
      } catch (erro) {
        console.error('[Perfil] Reautenticação recusada:', erro?.code || erro?.message);
        setDelErro(reauthErrorMessage(erro?.code));
        return;
      }

      // 2. Dados do Firestore, na ordem segura.
      await limparDadosDoUsuario(currentUser.uid);

      // 3. Autenticação por último: apagá-la antes tiraria o request.auth de
      // que as regras do Firestore dependem para deixar limpar o resto.
      try {
        await deleteUser(currentUser);
      } catch (erro) {
        if (erro?.code !== 'auth/requires-recent-login') throw erro;
        // A limpeza pode ter demorado o bastante para a sessão deixar de ser
        // recente. Refaz só a reautenticação e tenta de novo apenas o Auth —
        // o Firestore já está limpo e não precisa ser percorrido outra vez.
        await reautenticar();
        await deleteUser(currentUser);
      }

      navigate('/', { replace: true });
    } catch (erro) {
      // Uma etapa falhou: as seguintes não rodaram e o Auth continua de pé,
      // então a pessoa segue autenticada e pode tentar de novo. O que já saiu
      // não volta, e a nova tentativa apaga só o que restou.
      console.error(
        '[Perfil] Falha ao excluir a conta na etapa',
        erro?.etapa || 'auth',
        '-',
        erro?.code || erro?.message,
      );
      setDelErro(erro?.code ? reauthErrorMessage(erro.code) : mensagemFalhaExclusao());
    } finally {
      excluirLockRef.current = false;
      setExcluindo(false);
      setDelSenha('');
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
      <div className="bg-surface border border-hairline rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-6">
          <User size={16} className="text-slate-500" /> Informações da conta
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Nome + avatar */}
          <div className="flex items-center gap-3">
            <Avatar
              fotoPerfil={userProfile?.fotoPerfil}
              photoURL={currentUser?.photoURL}
              nome={nome}
              className="w-12 h-12 rounded-2xl shrink-0"
              textoClassName="bg-indigo-600 text-white text-lg font-bold"
            />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Nome</p>
              <p className="text-white font-bold truncate">{nome}</p>

              {/* Input escondido + label como botão: mantém o controle nativo
                  acessível por teclado sem o visual padrão do navegador. */}
              <input
                id="foto-perfil"
                type="file"
                accept={TIPOS_ACEITOS.join(',')}
                onChange={handleEscolherFoto}
                disabled={salvandoFoto}
                className="sr-only"
              />
              <label
                htmlFor="foto-perfil"
                className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  salvandoFoto
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-indigo-400 hover:text-indigo-300 cursor-pointer'
                }`}
              >
                <Camera size={13} />
                {salvandoFoto ? 'Salvando...' : 'Alterar foto'}
              </label>
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
          <p className="mt-6 pt-4 border-t border-hairline text-xs text-slate-500">
            Membro desde {membroDesde}
          </p>
        )}
      </div>

      {/* ── RENDA MENSAL (Fase 1) ────────────────────── */}
      <div className="bg-surface border border-hairline rounded-2xl p-6">
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
                className="w-full bg-app border border-hairline rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
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
                className="flex items-center gap-1.5 bg-surfaceLight border border-hairline hover:border-indigo-500/40 text-slate-300 text-sm font-bold px-4 py-3 rounded-xl transition-colors"
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
              className="shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surfaceLight border border-hairline hover:border-indigo-500/40 hover:bg-hairline text-white text-sm font-bold transition-colors"
            >
              {userProfile?.renda_mensal ? 'Editar' : 'Definir renda'}
            </button>
          </div>
        )}
      </div>

      {/* ── SEU PLANO + SEGURANÇA ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Seu plano */}
        <div className="bg-surface border border-hairline rounded-2xl p-6 flex flex-col">
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
        <div className="bg-surface border border-hairline rounded-2xl p-6 flex flex-col">
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
                className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl bg-surfaceLight border border-hairline hover:border-indigo-500/40 hover:bg-hairline text-white text-sm font-bold transition-colors"
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

      {/* ── EXCLUIR CONTA ────────────────────────────── */}
      <div className="bg-surface border border-rose-500/25 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-rose-400" /> Zona de perigo
        </h3>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white mb-1">Excluir conta</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Remove sua conta e seus dados financeiros — contas, transações, ciclos, metas,
              aportes e limites de orçamento. A ação é permanente e não pode ser desfeita.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirExclusao}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-sm font-bold transition-colors"
          >
            <Trash2 size={15} /> Excluir conta
          </button>
        </div>
      </div>

      {/* ── MODAL EXCLUIR CONTA ──────────────────────── */}
      {delOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-hairline flex justify-between items-center gap-3">
              <h2 className="text-xl font-bold text-white">Excluir conta</h2>
              <button
                type="button"
                onClick={fecharExclusao}
                disabled={excluindo}
                aria-label="Fechar"
                className="text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleExcluirConta} className="p-6 space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <p className="text-rose-200 text-xs leading-relaxed">
                  Serão removidos: seu perfil, contas, transações, ciclos, metas, aportes e limites
                  de orçamento. Os registros técnicos dos pagamentos simulados permanecem.
                  <strong className="block mt-1 font-bold">Esta ação não pode ser desfeita.</strong>
                </p>
              </div>

              {delErro && (
                <div className="flex gap-2 items-start bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                  <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-rose-300 text-xs leading-relaxed">{delErro}</p>
                </div>
              )}

              <div>
                <label htmlFor="excluir-email" className="block text-xs font-medium text-slate-400 mb-1">
                  Digite <span className="text-slate-200 font-semibold break-all">{email}</span> para confirmar
                </label>
                <input
                  id="excluir-email"
                  type="text"
                  value={delEmail}
                  onChange={(e) => setDelEmail(e.target.value)}
                  disabled={excluindo}
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full bg-app border border-hairline rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none disabled:opacity-50"
                  placeholder="seu e-mail"
                />
              </div>

              {usaSenha ? (
                <div>
                  <label htmlFor="excluir-senha" className="block text-xs font-medium text-slate-400 mb-1">
                    Senha atual
                  </label>
                  <input
                    id="excluir-senha"
                    type="password"
                    value={delSenha}
                    onChange={(e) => setDelSenha(e.target.value)}
                    disabled={excluindo}
                    autoComplete="current-password"
                    className="w-full bg-app border border-hairline rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">
                  Esta conta entra pelo Google. Ao confirmar, o Google abrirá uma janela para você
                  se identificar — sua senha do Google não é digitada aqui.
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={fecharExclusao}
                  disabled={excluindo}
                  className="flex-1 py-3.5 rounded-xl bg-surfaceLight border border-hairline hover:bg-hairline text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={excluindo || !emailConfere || (usaSenha && !delSenha)}
                  className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                >
                  {excluindo ? 'Excluindo conta...' : usaSenha ? 'Excluir conta' : 'Confirmar com o Google'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL TROCAR SENHA ───────────────────────── */}
      {pwdOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-hairline flex justify-between items-center">
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
                    className="w-full bg-app border border-hairline rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
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
                    className="w-full bg-app border border-hairline rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 outline-none"
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
                  className="w-full bg-app border border-hairline rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
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