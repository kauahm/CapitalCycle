import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  PieChart,
  Wallet,
  Sparkles,
  LogOut,
  BarChart2,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logoTopo from '../../assets/logo-topo.png';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/capital/dashboard' },
    { icon: Receipt, label: 'Transações', path: '/capital/transacoes' },
    { icon: Landmark, label: 'Contas e Caixas', path: '/capital/contas' },
    { icon: PieChart, label: 'Ciclos e Metas', path: '/capital/ciclos' },
    { icon: Wallet, label: 'Orçamento por Categoria', path: '/capital/orcamento' },
    { icon: Sparkles, label: 'Capital Advisor (IA)', path: '/capital/analise-ia' },
    { path: '/capital/mercado', icon: BarChart2, label: 'Mercado' },
    { icon: User, label: 'Meu Perfil', path: '/capital/perfil' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 border-r border-slate-800
      `}>
        {/* Cabeçalho com Logo */}
        <div className="p-6 flex items-center justify-between">
          <img src={logoTopo} alt="CapitalCycle" className="h-9 w-auto object-contain" />
          <button className="md:hidden text-slate-500 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Links do Menu */}
        <nav className="mt-2 px-3 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-lg text-sm font-medium border-l-2 transition-colors
                  ${isActive
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Botão de Sair (Fixo no rodapé) */}
        <div className="absolute bottom-0 w-full p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full pl-3.5 pr-4 py-2.5 text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}