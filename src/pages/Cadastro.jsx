import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react'; // Adicionado o ícone User
import logoTopo from '../assets/logo-topo.png';

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Assumindo que seu useAuth tem uma função 'register' ou 'signUp'
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validação de senhas iguais
    if (password !== confirmPassword) {
      setToast({ 
        show: true, 
        message: 'As senhas não coincidem. Tente novamente.', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    
    try {
      // Ajuste os parâmetros conforme a implementação do seu hook/backend
      await register(name, email, password); 
      
      setToast({ 
        show: true, 
        message: 'Conta criada com sucesso!', 
        type: 'success' 
      });
      
      // Redireciona para o login ou dashboard após sucesso
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setToast({ 
        show: true, 
        message: 'Erro ao criar conta. O e-mail pode já estar em uso.', 
        type: 'error' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex grid lg:grid-cols-2 bg-white">
      {/* Coluna Esquerda: Formulário Tela Cheia */}
      <div className="flex flex-col justify-between py-12 px-8 sm:px-12 lg:px-16 xl:px-24">
        
        {/* Container Central do Formulário */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            
          {/* Título */}
          <div className="flex flex-col mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Criar Conta
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Junte-se ao CapitalCycle e assuma o controle.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            
            {/* Campo Nome */}
            <div className="relative border-b-2 border-slate-300 peer focus-within:border-slate-900 transition-colors">
              <User className="absolute left-0 top-3 h-5 w-5 text-slate-400 peer-focus:text-slate-900" />
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

            {/* Campo Confirmar Senha */}
            <div className="relative border-b-2 border-slate-300 peer focus-within:border-slate-900 transition-colors">
              <Lock className="absolute left-0 top-3 h-5 w-5 text-slate-400 peer-focus:text-slate-900" />
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Senha"
                className="block w-full pl-8 pr-10 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"
              />
              <label 
                htmlFor="confirmPassword"
                className="absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm"
              >
                Confirmar Senha
              </label>
            </div>

            {/* Botão Criar Conta */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Criar Conta'}
              </button>
            </div>

            {/* Links Auxiliares (Ir para Login) */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
                  Faça login
                </Link>
              </p>
            </div>

          </form>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-slate-400 font-medium pt-8">
          CapitalCycle © 2024 - TCC Solutions
        </div>
      </div>

      {/* Coluna Direita: Fundo cor da Sidebar e Logo */}
      <div className="hidden lg:flex items-center justify-center bg-slate-900">
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