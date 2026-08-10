import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Eye, EyeOff, User, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import Toast from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PLAN_LIST as PLANS } from '../components/ui/plans';

// ─── Componente Principal ──────────────────────────────────────────────────────
export default function Register() {
  // Step 1 = escolha de plano | Step 2 = dados cadastrais
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const location = useLocation();

  // Campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Troca de plano: veio do botão "Trocar plano" em Perfil.jsx, usuário já está logado
  const isChangingPlan = !!location.state?.changePlan;

  useEffect(() => {
    if (location.state?.plan) {
      setSelectedPlan(location.state.plan);
      if (!isChangingPlan) setStep(2);
    } else if (location.state?.currentPlan) {
      setSelectedPlan(location.state.currentPlan);
    }
  }, []);

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

  // Google: vai para a tela de pagamento (sem popup ainda) — o popup
  // será aberto APÓS o usuário escolher e "pagar" (apenas simulação)
  const handleGoogleRegister = () => {
    navigate('/pagamento', {
      state: {
        plan: selectedPlan,
        isGoogle: true,
      },
    });
  };

  const chosenPlan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <div className="min-h-screen flex grid lg:grid-cols-2 bg-white">

      {/* ── Coluna Esquerda: conteúdo principal ── */}
      <div className="flex flex-col justify-between py-12 px-8 sm:px-12 lg:px-16 xl:px-24">

        {/* Indicador de etapas */}
        <div className="flex items-center gap-3 mb-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 1
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {step > 1 ? <Check size={12} /> : '1'}
            </div>
            <span className={`text-xs font-semibold ${step === 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              Escolha o plano
            </span>
          </div>

          <div className="flex-1 h-px bg-slate-200 max-w-[40px]" />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-semibold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              Seus dados
            </span>
          </div>

          <div className="flex-1 h-px bg-slate-200 max-w-[40px]" />

          {/* Step 3 (indicativo, sem número forte) */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-200 text-slate-400">
              3
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Pagamento
            </span>
          </div>
        </div>

        {/* ── STEP 1: Escolha de plano ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                CapitalCycle
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                {isChangingPlan ? 'Escolha o novo plano para sua conta' : 'Escolha o plano ideal para você'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 group focus:outline-none ${
                    plan.featured
                      ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-widest ${plan.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-xs font-medium ${plan.featured ? 'text-slate-400' : 'text-slate-400'}`}>R$</span>
                        <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                        <span className={`text-xs ${plan.featured ? 'text-slate-400' : 'text-slate-400'}`}>/mês</span>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className={`mt-1 transition-transform group-hover:translate-x-1 ${plan.featured ? 'text-white' : 'text-slate-400'}`}
                    />
                  </div>

                  <p className={`text-xs leading-relaxed mb-3 ${plan.featured ? 'text-slate-300' : 'text-slate-500'}`}>
                    {plan.desc}
                  </p>

                  <ul className="flex flex-col gap-1.5">
                    {plan.feats.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={11} className={plan.featured ? 'text-emerald-400' : 'text-emerald-600'} />
                        <span className={`text-xs ${plan.featured ? 'text-slate-300' : 'text-slate-600'}`}>{feat}</span>
                      </li>
                    ))}
                    {plan.feats.length > 3 && (
                      <li className={`text-xs ${plan.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                        + {plan.feats.length - 3} recursos incluídos
                      </li>
                    )}
                  </ul>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              Já tem conta?{' '}
              <a href="/login" className="font-semibold text-slate-900 hover:underline">
                Fazer login
              </a>
            </p>
          </div>
        )}

        {/* ── STEP 2: Formulário de dados ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            {/* Botão voltar + título */}
            <div className="mb-10">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-900 transition-colors mb-6 font-medium"
              >
                <ArrowLeft size={14} />
                Trocar plano
              </button>

              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                CapitalCycle
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                Crie sua conta — plano{' '}
                <span className="font-bold text-slate-900">{chosenPlan?.name}</span>
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleRegister}>

              {/* Nome */}
              <div className="relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors">
                <User className="absolute left-0 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  className="block w-full pl-8 pr-3 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"
                />
                <label
                  htmlFor="name"
                  className="absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm"
                >
                  Nome completo
                </label>
              </div>

              {/* E-mail */}
              <div className="relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors">
                <Mail className="absolute left-0 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="block w-full pl-8 pr-3 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"
                />
                <label
                  htmlFor="email"
                  className="absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm"
                >
                  E-mail
                </label>
              </div>

              {/* Senha */}
              <div className="relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors">
                <Lock className="absolute left-0 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="block w-full pl-8 pr-10 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"
                />
                <label
                  htmlFor="password"
                  className="absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm"
                >
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirmar Senha */}
              <div className="relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors">
                <Lock className="absolute left-0 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar senha"
                  className="block w-full pl-8 pr-10 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm"
                >
                  Confirmar senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Termos */}
              <div className="flex items-start gap-3 text-sm">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"
                />
                <label htmlFor="terms" className="text-slate-600 leading-relaxed">
                  Concordo com os{' '}
                  <a href="#" className="font-semibold text-slate-900 hover:underline">Termos de Uso</a>
                  {' '}e a{' '}
                  <a href="#" className="font-semibold text-slate-900 hover:underline">Política de Privacidade</a>
                </label>
              </div>

              {/* Botão */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Continuar para pagamento'}
                </button>
              </div>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">ou</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Botão Google */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
              </svg>
              Continuar com Google
            </button>

            <p className="text-center text-xs text-slate-400 mt-6">
              Já tem conta?{' '}
              <a href="/login" className="font-semibold text-slate-900 hover:underline">
                Fazer login
              </a>
            </p>
          </div>
        )}

        {/* Rodapé */}
        <div className="text-center text-xs text-slate-400 font-medium pt-8">
          CapitalCycle © 2026 - TCC Solutions
        </div>
      </div>

      {/* ── Coluna Direita: slate-900 com resumo do plano ── */}
      <div className="hidden lg:flex items-center justify-center bg-slate-900">
        <div className="text-center flex flex-col items-center px-12 max-w-sm w-full">

          {step === 1 && (
            /* Estado inicial: mostra comparação visual dos planos */
            <div className="w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">
                Compare os planos
              </p>
              <div className="flex flex-col gap-3 w-full">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-xl p-5 text-left border ${
                      plan.featured
                        ? 'bg-indigo-600/20 border-indigo-500/40'
                        : 'bg-slate-800/60 border-slate-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {plan.name}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">R$</span>
                        <span className="text-2xl font-extrabold text-white">{plan.price}</span>
                        <span className="text-xs text-slate-500">/mês</span>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {plan.feats.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={10} className="text-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-slate-400">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-6">
                Pagamento seguro · Cancele quando quiser
              </p>
            </div>
          )}

          {step === 2 && chosenPlan && (
            /* Resumo do plano escolhido */
            <div className="w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">
                Seu plano escolhido
              </p>

              <div
                className={`rounded-2xl p-6 text-left border w-full ${
                  chosenPlan.featured
                    ? 'bg-indigo-600/20 border-indigo-500/40'
                    : 'bg-slate-800/60 border-slate-700/50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        {chosenPlan.name}
                      </span>
                      {chosenPlan.badge && (
                        <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          {chosenPlan.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-slate-500">R$</span>
                      <span className="text-4xl font-extrabold text-white">{chosenPlan.price}</span>
                      <span className="text-sm text-slate-500">/mês</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Check size={14} className="text-emerald-400" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {chosenPlan.desc}
                </p>

                <div className="border-t border-slate-700/50 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Incluído no plano
                  </p>
                  <ul className="flex flex-col gap-2">
                    {chosenPlan.feats.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
              >
                Trocar de plano
              </button>

              <p className="text-[10px] text-slate-600 mt-4">
                Pagamento seguro · Cancele quando quiser · Sem fidelidade
              </p>
            </div>
          )}
        </div>
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
