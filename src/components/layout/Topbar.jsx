import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { userProfile } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('transacoes')) return 'Transações';
    if (path.includes('contas')) return 'Contas e Caixas';
    if (path.includes('ciclos')) return 'Ciclos e Metas';
    if (path.includes('analise-ia')) return 'Capital Advisor';
    if (path.includes('mercado')) return 'Mercado';
    if (path.includes('perfil')) return 'Meu Perfil';
    return 'CapitalCycle';
  };

  const nome = userProfile?.nome || 'Usuário';
  const inicial = nome.trim().charAt(0).toUpperCase();

  return (
    <header className="bg-[#101623] shadow-sm h-16 flex items-center justify-between px-6 md:ml-64 w-full md:w-[calc(100%-16rem)] fixed top-0 z-10 border-b border-[#1e293b]">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 text-slate-400 hover:bg-[#1a2234] rounded-lg md:hidden transition-colors">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-white">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#101623]"></span>
        </button>
        <div className="h-6 w-px bg-[#1e293b]"></div>
        {/* Avatar / nome clicável → Meu Perfil */}
        <Link
          to="/capital/perfil"
          title="Meu Perfil"
          className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-[#1a2234] transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{nome}</p>
            <p className="text-xs text-indigo-400 capitalize">{userProfile?.perfil || 'Investidor'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
            {inicial}
          </div>
        </Link>
      </div>
    </header>
  );
}