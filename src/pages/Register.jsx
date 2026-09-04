import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import Toast from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PLAN_LIST as PLANS } from '../components/ui/plans';

// ─── Indicador de etapa (passo 1) ─────────────────────────────────────────────
function EtapaIndicador({ numero, rotulo, ativa = false, concluida = false }) {
  const marcada = ativa || concluida;

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold ${
          marcada ? 'bg-slate-950 text-white' : 'border border-slate-200 text-slate-400'
        }`}
      >
        {concluida ? <Check size={12} strokeWidth={3} /> : numero}
      </span>
      <span className={`text-[0.8rem] ${marcada ? 'font-bold text-slate-950' : 'font-medium text-slate-400'}`}>
        {rotulo}
      </span>
    </div>
  );
}

// ─── Card de plano (passo 1) ──────────────────────────────────────────────────
// O card inteiro é clicável, como antes; o botão interno faz a mesma ação e
// só interrompe a propagação para não disparar o handler duas vezes.
function PlanoCard({ plan, selecionado, onEscolher }) {
  const destaque = plan.featured;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEscolher}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEscolher();
        }
      }}
      className={`cursor-pointer rounded-2xl p-7 text-left transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        destaque
          ? 'border-2 border-primary bg-[#0a0a0f] shadow-[0_20px_60px_-15px_rgba(99,102,241,0.45)]'
          : 'border border-slate-200 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      {/* Nome + selo + seletor */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`text-[0.8rem] font-bold uppercase tracking-[0.15em] ${
              destaque ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {plan.name}
          </span>
          {plan.badge && (
            <span className="rounded-full bg-primary px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white">
              {plan.badge}
            </span>
          )}
        </div>

        <span
          aria-hidden="true"
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full ${
            selecionado
              ? 'bg-primary text-white'
              : destaque
                ? 'border-2 border-slate-700'
                : 'border-2 border-slate-200'
          }`}
        >
          {selecionado && <Check size={15} strokeWidth={3} />}
        </span>
      </div>

      {/* Preço */}
      <div className="mt-5 flex items-baseline gap-2">
        <span className={`text-xl font-bold ${destaque ? 'text-white' : 'text-slate-950'}`}>R$</span>
        <span className={`text-[2.4rem] font-extrabold tracking-tight ${destaque ? 'text-white' : 'text-slate-950'}`}>
          {plan.price}
        </span>
        <span className={`text-base ${destaque ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
      </div>

      {/* Descrição */}
      <p className={`mt-4 text-base leading-relaxed ${destaque ? 'text-slate-400' : 'text-slate-500'}`}>
        {plan.desc}
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEscolher(); }}
        className={`mt-6 h-[3.25rem] w-full rounded-lg text-base font-bold transition-colors ${
          destaque
            ? 'bg-primary text-white hover:bg-indigo-500'
            : 'bg-[#e7e9fb] text-primary hover:bg-[#dcdffa]'
        }`}
      >
        Começar com o {plan.name}
      </button>

      {/* Recursos */}
      <ul className="mt-7 flex flex-col gap-3.5">
        {plan.feats.map((feat) => (
          <li key={feat} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-[1.35rem] w-[1.35rem] flex-none items-center justify-center rounded-full bg-primary text-white"
              aria-hidden="true"
            >
              <Check size={13} strokeWidth={3} />
            </span>
            <span className={`text-base leading-snug ${destaque ? 'text-slate-200' : 'text-slate-700'}`}>
              {feat}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Componente Principal ──────────────────────────────────────────────────────
export default function Register() {
  const location = useLocation();

  // Troca de plano: veio do botão "Trocar plano" em Perfil.jsx, usuário já está logado
  const isChangingPlan = !!location.state?.changePlan;

  // Quando a pessoa já escolheu o plano na home, ele chega no state da
  // rota e a etapa de escolha é pulada. O valor é lido direto no estado
  // inicial (e não num useEffect) para não piscar o passo 1 antes de ir
  // para o 2. Em troca de plano a escolha continua sendo o primeiro passo.
  // O id é validado contra a lista: um plano inexistente no state deixaria
  // a tela de pagamento em branco mais adiante.
  const planFromRoute = PLANS.some((p) => p.id === location.state?.plan)
    ? location.state.plan
    : null;

  // Step 1 = escolha de plano | Step 2 = dados cadastrais
  const [step, setStep] = useState(planFromRoute && !isChangingPlan ? 2 : 1);
  const [selectedPlan, setSelectedPlan] = useState(
    planFromRoute ?? location.state?.currentPlan ?? null
  );

  // Campos do formulário — restaurados do state da rota quando a pessoa
  // volta da tela de pagamento, para não ter que digitar tudo de novo.
  const [name, setName] = useState(location.state?.name ?? '');
  const [email, setEmail] = useState(location.state?.email ?? '');
  const [password, setPassword] = useState(location.state?.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState(location.state?.password ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Esta tela não cria a conta: ela só coleta os dados e encaminha para o
  // pagamento, que é quem chama o cadastro no fim do fluxo.
  const [loading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const navigate = useNavigate();

  // Avança para o step 2 após escolher o plano — ou, em troca de plano, vai
  // direto para o pagamento (não precisa recoletar nome/e-mail/senha)
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    if (isChangingPlan) {
      navigate('/pagamento', { state: { plan: planId, isPlanChange: true, changePlan: true } });
      return;
    }
    setStep(2);
  };

  // Submete o cadastro — agora vai para a tela de pagamento (não cria a conta ainda)
  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ show: true, message: 'As senhas não coincidem.', type: 'error' });
      return;
    }
    if (password.length < 6) {
      setToast({ show: true, message: 'A senha deve ter pelo menos 6 caracteres.', type: 'error' });
      return;
    }

    // Encaminha para a tela de pagamento com os dados do cadastro
    navigate('/pagamento', {
      state: {
        name,
        email,
        password,
        plan: selectedPlan,
        isGoogle: false,
      },
    });
  };

  const chosenPlan = PLANS.find((p) => p.id === selectedPlan);

  /* ── STEP 1: escolha do plano ──────────────────────────────────────────
     Layout próprio, em largura total — diferente do split de duas colunas
     usado no passo 2. */
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[66rem]">

          {/* Cabeçalho: voltar + marca */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft size={20} />
            </button>

            <span className="text-[1.65rem] font-extrabold tracking-tight text-slate-950">
              CapitalCycle
            </span>
          </div>

          {/* Indicador de etapas */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <EtapaIndicador numero={1} rotulo="Escolha o plano" ativa />
            <span className="h-px w-14 bg-slate-200" />
            <EtapaIndicador numero={2} rotulo="Seus dados" />
            <span className="h-px w-14 bg-slate-200" />
            <EtapaIndicador numero={3} rotulo="Pagamento" />
          </div>

          {/* Título */}
          <h1 className="mt-9 text-center text-[3rem] font-extrabold leading-tight tracking-tight text-slate-950">
            Escolha seu plano
          </h1>
          <p className="mt-2 text-center text-lg text-slate-500">
            {isChangingPlan
              ? 'Selecione o novo plano para a sua conta.'
              : 'Selecione o plano ideal para começar sua jornada financeira.'}
          </p>

          {/* Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanoCard
                key={plan.id}
                plan={plan}
                selecionado={selectedPlan === plan.id}
                onEscolher={() => handleSelectPlan(plan.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[54fr_46fr]">

      {/* ── Coluna Esquerda: formulário ── */}
      <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-14">
        <div className="w-full max-w-[27rem]">

          {/* Indicador de etapas */}
          <div className="flex items-center gap-3">
            <EtapaIndicador numero={1} rotulo="Escolha o plano" concluida />
            <span className="h-px w-8 bg-slate-200" />
            <EtapaIndicador numero={2} rotulo="Seus dados" ativa />
            <span className="h-px w-8 bg-slate-200" />
            <EtapaIndicador numero={3} rotulo="Pagamento" />
          </div>

          {/* Voltar para a escolha do plano */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-6 flex items-center gap-1.5 text-[0.8rem] text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Trocar plano
          </button>

          <h1 className="mt-4 text-[2.15rem] font-extrabold leading-none tracking-tight text-slate-950">
            CapitalCycle
          </h1>
          <p className="mt-2.5 text-[0.9rem] text-slate-500">
            Crie sua conta — plano{' '}
            <span className="font-bold uppercase text-slate-950">{chosenPlan?.name}</span>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>

            {/* Nome */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[0.78rem] font-semibold text-slate-800">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                autoComplete="name"
                className="w-full border-b border-slate-200 bg-transparent pb-2.5 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900"
              />
            </div>

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[0.78rem] font-semibold text-slate-800">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                className="w-full border-b border-slate-200 bg-transparent pb-2.5 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900"
              />
            </div>

            {/* Senha — o botão de mostrar/ocultar só aparece quando há algo
                digitado, para o estado vazio ficar limpo como na referência
                sem abrir mão do recurso. */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[0.78rem] font-semibold text-slate-800">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  className="w-full border-b border-slate-200 bg-transparent pb-2.5 pr-10 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-0 top-0 text-slate-400 transition-colors hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                )}
              </div>
            </div>

            {/* Confirmar senha */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[0.78rem] font-semibold text-slate-800">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  className="w-full border-b border-slate-200 bg-transparent pb-2.5 pr-10 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900"
                />
                {confirmPassword && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-0 top-0 text-slate-400 transition-colors hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                )}
              </div>
            </div>

            {/* Termos */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 flex-none cursor-pointer rounded border-slate-300 accent-primary"
              />
              <label htmlFor="terms" className="cursor-pointer text-[0.85rem] leading-relaxed text-slate-600">
                Concordo com os{' '}
                <a href="#" className="text-primary hover:underline">Termos de Uso</a>
                {' '}e a{' '}
                <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
              </label>
            </div>

            {/* Botão */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex h-[3.1rem] w-full items-center justify-center rounded-2xl bg-[#0f1115] text-[0.95rem] font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Continuar para pagamento'}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* ── Coluna Direita: resumo do plano escolhido ── */}
      <div className="relative hidden flex-col items-center justify-center bg-[#05070e] px-10 lg:flex">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-slate-400">
          Seu plano escolhido
        </p>

        {chosenPlan && (
          <div className="mt-7 w-full max-w-[24rem] rounded-2xl border-2 border-primary bg-white p-6 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-slate-600">
                {chosenPlan.name}
              </span>
              <span
                className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-white"
                aria-hidden="true"
              >
                <Check size={13} strokeWidth={3} />
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-950">R$</span>
              <span className="text-[2rem] font-extrabold tracking-tight text-slate-950">
                {chosenPlan.price}
              </span>
              <span className="text-[0.9rem] text-slate-500">{chosenPlan.period}</span>
            </div>

            <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-500">
              {chosenPlan.desc}
            </p>

            <ul className="mt-5 flex flex-col gap-2.5">
              {chosenPlan.feats.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-[1.15rem] w-[1.15rem] flex-none items-center justify-center rounded-full bg-primary text-white"
                    aria-hidden="true"
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[0.85rem] leading-snug text-slate-700">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
