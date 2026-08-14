import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useTypewriter from '../hooks/useTypewriter';
import Toast from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import logoPreta from '../assets/logo-black.png';

/* Mesma curva de easing padronizada no resto do projeto */
const EASE = [0.16, 1, 0.3, 1];

/* ---------- Geometria da transição Home → Login ----------
   O painel escuro ocupa 56% da largura na coluna da direita
   (grid 44fr/56fr). Ele começa cobrindo a tela inteira e
   comprime até essa faixa; o conteúdo começa no centro da
   viewport — que fica 22% à esquerda do centro do painel. */
const PANEL_FRACTION = 0.56;
const CONTENT_START_SCALE = 1.35;
const SHRINK_DURATION = 0.95;

// Na volta a cortina cresce um pouco além da tela: com a curva padrão,
// mirar exatamente em 1 faria a cobertura só se completar no rastejo
// final da animação, deixando a tela preta e parada antes de navegar.
const EXPAND_DURATION = 0.9;
const EXPAND_OVERSHOOT = 1.03;

// Distância, em pixels, entre o centro do painel e o centro da viewport.
// Em pixels (e não em vw) para a interpolação não depender de conversão
// de unidade no meio da animação.
const contentOffset = () => -(window.innerWidth * (1 - PANEL_FRACTION)) / 2;

/* Frases da máquina de escrever no painel escuro */
const PHRASES = [
  'Seu futuro financeiro começa aqui.',
  'Metas simples. Resultados reais.',
  'Capital Advisor, sempre com você.',
  'Do primeiro real ao próximo ciclo.',
];

/* Entrada escalonada da coluna do formulário:
   logo → título → campos → botões. Na saída (voltar para a home) a
   ordem se inverte e o ritmo é mais rápido, para o formulário sumir
   antes de a cortina escura reabrir. */
const formGroup = {
  hidden: {},
  show: { transition: { delayChildren: 0.5, staggerChildren: 0.09 } },
  leaving: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const formItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  leaving: { opacity: 0, y: 10, transition: { duration: 0.35, ease: EASE } },
};

/* Ícone oficial do Google (mesmo SVG já usado no Register) */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  // A transição de encolhimento só roda quando se chega pela Home, em
  // telas onde o painel escuro existe (lg+) e sem prefers-reduced-motion.
  // Digitar /login na barra de endereços abre a página no estado final.
  const [intro] = useState(() =>
    location.state?.from === 'home' &&
    !reduceMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 1024px)').matches
  );
  const [shrinking, setShrinking] = useState(intro);
  const [leaving, setLeaving] = useState(false);
  const navigatedRef = useRef(false);

  // Voltar para a home tocando a mesma coreografia ao contrário: o
  // formulário some, a cortina escura reabre da direita para a tela
  // toda e o texto do painel volta ao centro, crescendo. Sem animação
  // (movimento reduzido ou telas sem o painel), navega direto.
  const handleBack = (e) => {
    const animatable = !reduceMotion && window.matchMedia('(min-width: 1024px)').matches;
    if (!animatable || leaving) return;
    e.preventDefault();
    setLeaving(true);
  };

  // Fade curto de página quando o movimento está reduzido, no lugar da
  // transição elaborada.
  const plainFade = location.state?.from === 'home' && reduceMotion;

  const typed = useTypewriter(PHRASES, !reduceMotion, { holdAfterType: 2000 });
  const phrase = reduceMotion ? PHRASES[0] : typed;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, remember);
      navigate('/capital/dashboard');
    } catch (error) {
      console.error("Erro no login:", error);
      setToast({
        show: true,
        message: error.code === 'auth/account-disabled'
          ? 'Esta conta está desativada. Fale com o suporte para reativá-la.'
          : 'Credenciais inválidas ou erro de conexão.',
        type: 'error'
      });
      setLoading(false);
    }
  };

  // Redefinição de senha: usa o e-mail já digitado no formulário.
  const handleResetPassword = async () => {
    if (!email.trim()) {
      setToast({ show: true, message: 'Digite seu e-mail no campo acima para receber o link de redefinição.', type: 'warning' });
      return;
    }
    try {
      await resetPassword(email.trim());
      setToast({ show: true, message: 'Enviamos um link de redefinição para o seu e-mail.', type: 'success' });
    } catch (error) {
      console.error('Erro ao enviar redefinição de senha:', error);
      setToast({
        show: true,
        message: error.code === 'auth/invalid-email'
          ? 'E-mail inválido.'
          : 'Não foi possível enviar o e-mail de redefinição.',
        type: 'error',
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/capital/dashboard');
    } catch (error) {
      console.error("Erro no login com Google:", error);
      if (error.code === 'auth/new-google-user') {
        setToast({ show: true, message: 'Não encontramos uma conta com esse Google. Escolha um plano para se cadastrar.', type: 'warning' });
        navigate('/cadastro');
      } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        setToast({ show: true, message: 'Erro ao entrar com Google. Tente novamente.', type: 'error' });
      }
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={plainFade ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="grid min-h-screen bg-white lg:grid-cols-[44fr_56fr]"
    >
      {/* Cortina escura da transição: cobre a tela e comprime até a
          faixa exata do painel, depois some por cima do painel real
          (mesma cor, então a troca é imperceptível). Anima só
          transform e opacity. */}
      {(shrinking || leaving) && (
        <motion.div
          key={leaving ? 'curtain-out' : 'curtain-in'}
          className="pointer-events-none fixed inset-0 z-40 bg-[#05070e]"
          style={{ transformOrigin: '100% 50%' }}
          initial={leaving ? { scaleX: PANEL_FRACTION, opacity: 1 } : { scaleX: 1, opacity: 1 }}
          animate={leaving ? { scaleX: EXPAND_OVERSHOOT, opacity: 1 } : { scaleX: PANEL_FRACTION, opacity: 0 }}
          transition={
            leaving
              ? { scaleX: { duration: EXPAND_DURATION, ease: EASE } }
              : {
                  scaleX: { duration: SHRINK_DURATION, ease: EASE },
                  opacity: { delay: SHRINK_DURATION - 0.05, duration: 0.35, ease: 'linear' },
                }
          }
          // Navega no instante exato em que a cortina cobre a tela — e não
          // no fim da animação, que é quando ela já parou de se mover.
          onUpdate={(latest) => {
            if (!leaving || navigatedRef.current) return;
            if (latest.scaleX >= 1) {
              navigatedRef.current = true;
              navigate('/', { state: { from: 'login' } });
            }
          }}
          onAnimationComplete={() => { if (!leaving) setShrinking(false); }}
          aria-hidden="true"
        />
      )}

      {/* ── Coluna esquerda: formulário ── */}
      <div className="flex flex-col justify-center px-8 py-6 sm:px-12 lg:px-14 xl:px-20">
        <motion.div
          variants={formGroup}
          initial={intro ? 'hidden' : false}
          animate={leaving ? 'leaving' : 'show'}
          className="mx-auto w-full max-w-xl"
        >

          {/* Voltar para a home + logo (versão escura, para fundo branco) */}
          <motion.div variants={formItem} className="mb-5 flex items-center gap-4">
            <Link
              to="/"
              onClick={handleBack}
              aria-label="Voltar para a home"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
            </Link>

            <img
              src={logoPreta}
              alt="Capital Cycle"
              className="h-11 w-auto object-contain object-left"
            />
          </motion.div>

          <motion.div variants={formItem}>
            <h1 className="text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-slate-950">
              Bem-vindo de volta
            </h1>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-500">
              Acesse sua conta para continuar sua jornada financeira.
            </p>
          </motion.div>

          <form className="mt-6 space-y-3.5" onSubmit={handleLogin}>

            {/* E-mail */}
            <motion.div variants={formItem}>
              <label htmlFor="email" className="mb-1.5 block text-[0.82rem] font-semibold text-slate-800">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  className="h-[3.15rem] w-full rounded-xl border border-slate-200 bg-transparent pl-12 pr-4 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
                />
              </div>
            </motion.div>

            {/* Senha */}
            <motion.div variants={formItem}>
              <label htmlFor="password" className="mb-1.5 block text-[0.82rem] font-semibold text-slate-800">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-[3.15rem] w-full rounded-xl border border-slate-200 bg-transparent pl-12 pr-12 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Lembrar de mim + esqueci a senha */}
            <motion.div variants={formItem} className="flex items-center justify-between pt-0.5 text-[0.85rem]">
              <label htmlFor="remember-me" className="flex cursor-pointer items-center gap-2.5 text-slate-600">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded-md border-slate-300 accent-primary"
                />
                Lembrar de mim
              </label>
              <button
                type="button"
                onClick={handleResetPassword}
                className="font-semibold text-primary transition-colors hover:text-indigo-500"
              >
                Esqueceu a senha?
              </button>
            </motion.div>

            {/* Acessar Sistema */}
            <motion.button
              variants={formItem}
              type="submit"
              disabled={loading}
              className="flex h-[3.15rem] w-full items-center justify-center rounded-full bg-primary text-[0.95rem] font-bold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Acessar Sistema'}
            </motion.button>
          </form>

          {/* Divisor */}
          <motion.div variants={formItem} className="my-4 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[0.8rem] text-slate-400">ou</span>
            <div className="h-px flex-1 bg-slate-200" />
          </motion.div>

          {/* Google */}
          <motion.button
            variants={formItem}
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex h-[3.15rem] w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-transparent text-[0.95rem] font-bold text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <GoogleIcon />
            Continuar com Google
          </motion.button>
        </motion.div>
      </div>

      {/* ── Coluna direita: painel escuro da marca ── */}
      <div className="relative hidden bg-[#05070e] lg:flex lg:items-center lg:justify-center">
        {/* Brilho indigo no canto superior direito */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(99,102,241,0.22),transparent_58%)]"
          aria-hidden="true"
        />

        {/* Enquanto a cortina comprime, este bloco viaja do centro da tela
            até o centro do painel, reduzindo de escala — é o mesmo texto
            que estava grande na Home, não uma troca de elementos. */}
        <motion.div
          initial={intro ? { x: contentOffset(), scale: CONTENT_START_SCALE } : false}
          animate={leaving ? { x: contentOffset(), scale: CONTENT_START_SCALE } : { x: 0, scale: 1 }}
          transition={{ duration: leaving ? EXPAND_DURATION : SHRINK_DURATION, ease: EASE }}
          className={`relative flex flex-col items-center px-12 text-center ${shrinking || leaving ? 'z-50' : 'z-10'}`}
        >
          {/* Frase de apoio com máquina de escrever + cursor piscando */}
          <p className="text-[1.05rem] font-medium text-primary">
            {phrase}
            {!reduceMotion && (
              <motion.span
                className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-primary"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1.05, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
            )}
          </p>

          <h2 className="mt-16 text-[clamp(2.2rem,3.6vw,3.5rem)] font-black uppercase leading-[1.02] tracking-tight text-white">
            <span className="block">Sua jornada</span>
            <span className="block text-primary">Financeira</span>
          </h2>

          <p className="mt-6 max-w-sm text-[1rem] leading-relaxed text-slate-400">
            Controle total do seu capital com inteligência artificial integrada.
          </p>
        </motion.div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </motion.div>
  );
}
