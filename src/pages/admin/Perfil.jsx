import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Crown, Lock, ShieldCheck, Eye, EyeOff, X, ArrowRight, AlertTriangle, Wallet, Check, Camera, Trash2, Sparkles,
} from 'lucide-react';
import {
  updatePassword, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider, deleteUser,
} from 'firebase/auth';
import { googleProvider } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getPlan } from '../../components/ui/plans';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Dialog from '../../components/ui/Dialog';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input } from '../../components/ui/Field';
import { formatarMoeda, parseValor } from '../../utils/moeda';
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

const TituloBloco = ({ icon: Icon, children, tone = 'text-slate-500' }) => (
  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-5">
    <Icon size={16} className={tone} aria-hidden="true" /> {children}
  </h3>
);

export default function Perfil() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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

  // ── Renda mensal ─────────────────────────────────
  const [editandoRenda, setEditandoRenda] = useState(false);
  const [rendaInput, setRendaInput] = useState(String(userProfile?.renda_mensal ?? ''));
  const [salvandoRenda, setSalvandoRenda] = useState(false);

  // ── Foto de perfil ───────────────────────────────
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  // ── Advisor: contexto financeiro ─────────────────
  const [salvandoAdvisor, setSalvandoAdvisor] = useState(false);
  const usarDadosAdvisor = Boolean(userProfile?.advisorContexto);

  const handleEscolherFoto = async (e) => {
    const file = e.target.files?.[0];
    // Limpa o input já: escolher o mesmo arquivo de novo depois de um erro
    // não dispara change se o valor continuar lá.
    e.target.value = '';
    if (!file || salvandoFoto) return;

    setSalvandoFoto(true);
    try {
      const { dataUrl } = await prepararFotoPerfil(file);
      // Só o campo da foto é enviado: updateUserProfile grava com merge.
      await updateUserProfile({ fotoPerfil: dataUrl });
      toast.success('Foto de perfil atualizada.');
    } catch (erro) {
      console.error('[Perfil] Falha ao atualizar a foto:', erro?.code || erro?.message);
      toast.error(mensagemErroFoto(erro?.message));
    } finally {
      setSalvandoFoto(false);
    }
  };

  const abrirEdicaoRenda = () => {
    setRendaInput(String(userProfile?.renda_mensal ?? '').replace('.', ','));
    setEditandoRenda(true);
  };

  const salvarRenda = async (e) => {
    e.preventDefault();
    const valor = parseValor(rendaInput);
    if (Number.isNaN(valor) || valor < 0) {
      toast.error('Informe um valor de renda válido.');
      return;
    }
    setSalvandoRenda(true);
    try {
      await updateUserProfile({ renda_mensal: Math.round(valor * 100) / 100 });
      setEditandoRenda(false);
      toast.success('Renda mensal atualizada.');
    } catch (erro) {
      toast.error('Não foi possível salvar a renda mensal.');
    } finally {
      setSalvandoRenda(false);
    }
  };

  const alternarAdvisor = async () => {
    setSalvandoAdvisor(true);
    try {
      await updateUserProfile({ advisorContexto: !usarDadosAdvisor });
      toast.success(!usarDadosAdvisor ? 'O Capital Advisor passa a usar um resumo dos seus dados.' : 'O Capital Advisor deixa de receber seus dados.');
    } catch (erro) {
      toast.error('Não foi possível salvar a preferência.');
    } finally {
      setSalvandoAdvisor(false);
    }
  };

  // ── Exclusão da conta ────────────────────────────
  const [delOpen, setDelOpen] = useState(false);
  const [delEmail, setDelEmail] = useState('');
  const [delSenha, setDelSenha] = useState('');
  const [delErro, setDelErro] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  // Trava lógica síncrona: `excluindo` só vale para o visual.
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
    if (excluirLockRef.current) return;
    setDelEmail('');
    setDelSenha('');
    setDelErro(null);
    setDelOpen(false);
  };

  // Reautenticação pelo provedor real da conta. A senha só existe enquanto o
  // modal está aberto: não é guardada nem enviada a lugar nenhum além do
  // próprio Firebase Authentication.
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
        await reautenticar();
        await deleteUser(currentUser);
      }

      navigate('/', { replace: true });
    } catch (erro) {
      console.error('[Perfil] Falha ao excluir a conta na etapa', erro?.etapa || 'auth', '-', erro?.code || erro?.message);
      setDelErro(erro?.code ? reauthErrorMessage(erro.code) : mensagemFalhaExclusao());
    } finally {
      excluirLockRef.current = false;
      setExcluindo(false);
      setDelSenha('');
    }
  };

  const abrirModalSenha = () => {
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmar('');
    setPwdError(null);
    setShowSenha(false);
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
      if (usaSenha) {
        const credencial = EmailAuthProvider.credential(currentUser.email, senhaAtual);
        await reauthenticateWithCredential(currentUser, credencial);
      }
      await updatePassword(currentUser, novaSenha);
      setPwdOpen(false);
      toast.success('Senha alterada com sucesso.');
    } catch (erro) {
      setPwdError(passwordErrorMessage(erro?.code || erro?.message));
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader>Informações da conta, plano, preferências e segurança.</PageHeader>

      {/* ── Informações da conta ── */}
      <div className="cc-card p-6">
        <TituloBloco icon={User}>Informações da conta</TituloBloco>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <Avatar
              fotoPerfil={userProfile?.fotoPerfil}
              photoURL={currentUser?.photoURL}
              nome={nome}
              className="w-14 h-14 rounded-2xl shrink-0"
              textoClassName="bg-primary text-white text-lg font-bold"
            />
            <div className="min-w-0">
              <p className="cc-label mb-1">Nome</p>
              <p className="text-textMain font-bold truncate">{nome}</p>
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
                  salvandoFoto ? 'text-slate-500 cursor-not-allowed' : 'text-indigo-300 hover:text-indigo-200 cursor-pointer'
                }`}
              >
                <Camera size={13} aria-hidden="true" />
                {salvandoFoto ? 'Salvando...' : 'Alterar foto'}
              </label>
            </div>
          </div>

          <div className="min-w-0">
            <p className="cc-label mb-1 flex items-center gap-1.5"><Mail size={12} /> E-mail da conta</p>
            <p className="text-textMain font-medium truncate">{email}</p>
          </div>

          <div>
            <p className="cc-label mb-1 flex items-center gap-1.5"><Crown size={12} /> Plano atual</p>
            <Badge tone="primary" icon={Crown} className="px-3 py-1.5 text-xs rounded-full">{plan.name}</Badge>
          </div>
        </div>

        {membroDesde && (
          <p className="mt-6 pt-4 border-t border-hairline text-xs text-slate-500">Membro desde {membroDesde}</p>
        )}
      </div>

      {/* ── Renda mensal ── */}
      <div className="cc-card p-6">
        <TituloBloco icon={Wallet}>Renda mensal</TituloBloco>

        {editandoRenda ? (
          <form onSubmit={salvarRenda} className="flex flex-col sm:flex-row items-start sm:items-end gap-3" noValidate>
            <Field label="Valor (R$)" className="flex-1 w-full">
              <Input autoFocus type="text" inputMode="decimal" value={rendaInput} onChange={(e) => setRendaInput(e.target.value)} placeholder="0,00" />
            </Field>
            <div className="flex gap-2 shrink-0">
              <Button type="submit" icon={Check} loading={salvandoRenda}>Salvar</Button>
              <Button variant="secondary" icon={X} onClick={() => setEditandoRenda(false)}>Cancelar</Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-4">
            {userProfile?.renda_mensal ? (
              <p className="text-2xl font-extrabold text-textMain tabular-nums">{formatarMoeda(userProfile.renda_mensal)}</p>
            ) : (
              <p className="text-sm text-textSecondary">Defina sua renda mensal para ver economia do mês e % da renda comprometida no Dashboard.</p>
            )}
            <Button variant="secondary" onClick={abrirEdicaoRenda} className="shrink-0">
              {userProfile?.renda_mensal ? 'Editar' : 'Definir renda'}
            </Button>
          </div>
        )}
      </div>

      {/* ── Plano + Segurança ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--cc-gap-card)]">
        <div className="cc-card p-6 flex flex-col">
          <TituloBloco icon={Crown}>Seu plano</TituloBloco>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-extrabold text-textMain">{plan.name}</p>
              {plan.badge && <Badge tone="primary" className="mt-1 uppercase tracking-wide text-[10px]">{plan.badge}</Badge>}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">R$ {plan.price}</p>
              <p className="text-xs text-slate-500">/ano</p>
            </div>
          </div>
          <p className="text-sm text-textSecondary leading-relaxed mt-2">{plan.desc}</p>
          <Button
            className="mt-5 w-full"
            icon={ArrowRight}
            onClick={() => navigate('/cadastro', { state: { changePlan: true, currentPlan: planId } })}
          >
            Trocar plano
          </Button>
        </div>

        <div className="cc-card p-6 flex flex-col">
          <TituloBloco icon={ShieldCheck}>Segurança</TituloBloco>
          {usaSenha ? (
            <>
              <p className="text-sm text-textSecondary leading-relaxed mb-5">
                Sua senha é gerenciada pelo Firebase Authentication e nunca é armazenada no nosso banco de dados.
              </p>
              <Button variant="secondary" icon={Lock} onClick={abrirModalSenha} className="mt-auto w-full">
                Trocar senha
              </Button>
            </>
          ) : (
            <p className="text-sm text-textSecondary leading-relaxed">
              Esta conta foi criada com o Google e não possui senha própria para alteração.
            </p>
          )}
        </div>
      </div>

      {/* ── Preferência do Advisor ── */}
      <div className="cc-card p-6">
        <TituloBloco icon={Sparkles}>Capital Advisor</TituloBloco>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-textMain mb-1">Usar meus dados nas respostas</p>
            <p className="text-sm text-textSecondary leading-relaxed">
              Quando ligado, um resumo agregado (totais do mês por categoria, saldos por tipo de conta e estado das metas)
              acompanha cada pergunta. Lançamentos individuais nunca são enviados. Você pode desligar quando quiser.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={usarDadosAdvisor}
            aria-label="Usar meus dados nas respostas do Capital Advisor"
            onClick={alternarAdvisor}
            disabled={salvandoAdvisor}
            className={`relative shrink-0 inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 ${usarDadosAdvisor ? 'bg-primary' : 'bg-hairline'}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${usarDadosAdvisor ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* ── Zona de perigo ── */}
      <div className="cc-card p-6 border-rose-500/25">
        <TituloBloco icon={AlertTriangle} tone="text-rose-400">Zona de perigo</TituloBloco>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-textMain mb-1">Excluir conta</p>
            <p className="text-sm text-textSecondary leading-relaxed">
              Remove sua conta e seus dados financeiros — contas, transações, ciclos, metas,
              aportes e limites de orçamento. A ação é permanente e não pode ser desfeita.
            </p>
          </div>
          <Button variant="danger" icon={Trash2} onClick={abrirExclusao} className="shrink-0">Excluir conta</Button>
        </div>
      </div>

      {/* ── Modal excluir conta ── */}
      <Dialog
        open={delOpen}
        onClose={fecharExclusao}
        bloqueado={excluindo}
        title="Excluir conta"
        tone="danger"
        footer={(
          <>
            <Button variant="secondary" onClick={fecharExclusao} disabled={excluindo}>Cancelar</Button>
            <Button
              type="submit"
              form="form-excluir"
              variant="dangerSolid"
              loading={excluindo}
              disabled={!emailConfere || (usaSenha && !delSenha)}
            >
              {excluindo ? 'Excluindo conta...' : usaSenha ? 'Excluir conta' : 'Confirmar com o Google'}
            </Button>
          </>
        )}
      >
        <form id="form-excluir" onSubmit={handleExcluirConta} className="space-y-4" noValidate>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
            <p className="text-rose-200 text-xs leading-relaxed">
              Serão removidos: seu perfil, contas, transações, ciclos, metas, aportes e limites
              de orçamento. Os registros técnicos dos pagamentos simulados permanecem.
              <strong className="block mt-1 font-bold">Esta ação não pode ser desfeita.</strong>
            </p>
          </div>

          {delErro && (
            <div className="flex gap-2 items-start bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3" role="alert">
              <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
              <p className="text-rose-300 text-xs leading-relaxed">{delErro}</p>
            </div>
          )}

          <Field label={<>Digite <span className="text-slate-200 font-semibold break-all">{email}</span> para confirmar</>}>
            <Input
              data-autofocus
              type="text"
              value={delEmail}
              onChange={(e) => setDelEmail(e.target.value)}
              disabled={excluindo}
              autoComplete="off"
              spellCheck="false"
              placeholder="seu e-mail"
              className="focus:border-rose-500 focus:ring-rose-500/20"
            />
          </Field>

          {usaSenha ? (
            <Field label="Senha atual">
              <Input
                type="password"
                value={delSenha}
                onChange={(e) => setDelSenha(e.target.value)}
                disabled={excluindo}
                autoComplete="current-password"
                placeholder="••••••••"
                className="focus:border-rose-500 focus:ring-rose-500/20"
              />
            </Field>
          ) : (
            <p className="text-xs text-textSecondary leading-relaxed">
              Esta conta entra pelo Google. Ao confirmar, o Google abrirá uma janela para você
              se identificar — sua senha do Google não é digitada aqui.
            </p>
          )}
        </form>
      </Dialog>

      {/* ── Modal trocar senha ── */}
      <Dialog
        open={pwdOpen}
        onClose={() => !loadingPwd && setPwdOpen(false)}
        bloqueado={loadingPwd}
        title="Trocar senha"
        size="sm"
        footer={(
          <>
            <Button variant="secondary" onClick={() => setPwdOpen(false)} disabled={loadingPwd}>Cancelar</Button>
            <Button type="submit" form="form-senha" loading={loadingPwd}>Alterar senha</Button>
          </>
        )}
      >
        <form id="form-senha" onSubmit={handleTrocarSenha} className="space-y-4" noValidate>
          {pwdError && (
            <div className="flex gap-2 items-start bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3" role="alert">
              <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
              <p className="text-rose-300 text-xs leading-relaxed">{pwdError}</p>
            </div>
          )}

          {usaSenha && (
            <Field label="Senha atual">
              <Input data-autofocus type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
            </Field>
          )}

          <Field label="Nova senha" hint="Mínimo de 6 caracteres.">
            <div className="relative">
              <Input
                type={showSenha ? 'text' : 'password'}
                minLength={6}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoComplete="new-password"
                placeholder="Crie uma nova senha"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field label="Confirmar nova senha">
            <Input type={showSenha ? 'text' : 'password'} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} autoComplete="new-password" placeholder="Repita a nova senha" />
          </Field>
        </form>
      </Dialog>
    </div>
  );
}
