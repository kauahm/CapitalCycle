import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import logoTopo from '../assets/logo-topo.png'; // Importando a logo

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/capital/dashboard');
    } catch (error) {
      console.error("Erro no login:", error);
      setToast({ 
        show: true, 
        message: 'Credenciais inválidas ou erro de conexão.', 
        type: 'error' 
      });
      setLoading(false);
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
    <div className="min-h-screen flex grid lg:grid-cols-2 bg-white">
      {/* Coluna Esquerda: Formulário Tela Cheia (Sem bordas) */}
      <div className="flex flex-col justify-between py-12 px-8 sm:px-12 lg:px-16 xl:px-24">
        
        {/* Container Central do Formulário */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            
          {/* Título */}
          <div className="flex flex-col mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              CapitalCycle
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Acesse sua conta para continuar
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleLogin}>
            
            {/* Campo E-mail */}
            <div className="relative border-b-2 border-slate-300 peer focus-within:border-slate-900 transition-colors">
              <Mail className="absolute left-0 top-3 h-5 w-5 text-slate-400 peer-focus:text-slate-900" />
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

            {/* Campo Senha */}
            <div className="relative border-b-2 border-slate-300 peer focus-within:border-slate-900 transition-colors">
              <Lock className="absolute left-0 top-3 h-5 w-5 text-slate-400 peer-focus:text-slate-900" />
              <input
                type={showPassword ? "text" : "password"}
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
              {/* Ícone para mostrar/esconder senha */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Links Auxiliares */}
            <div className="flex justify-between items-center text-sm mt-4">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-slate-700">Lembrar de mim</label>
              </div>
              <a href="#" className="font-medium text-slate-900 hover:text-slate-700">
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão Entrar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Acessar Sistema'}
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
            onClick={handleGoogleLogin}
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
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-slate-400 font-medium pt-8">
          CapitalCycle © 2026 - TCC Solutions
        </div>
      </div>

      {/* Coluna Direita: Fundo cor da Sidebar (slate-900) e espaço para a Logo */}
      <div className="hidden lg:flex items-center justify-center bg-slate-900">
        
        {/* Espaço com a Logo do TCC */}
        <div className="text-center flex flex-col items-center">
          <img 
        src={logoTopo} 
        alt="CapitalCycle Logo" 
        className="w-[500px] h-auto object-contain mb-2 hover:scale-105 transition-transform duration-300"
      />
          
        </div>
        
      </div>

      {/* Toast Notification */}
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