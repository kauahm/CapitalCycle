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
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-semibold text-white">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-white transition-colors" title="Notificações">
          <Bell size={19} />
        </button>
        <div className="h-6 w-px bg-[#1e293b]"></div>
        {/* Avatar / nome clicável → Meu Perfil */}
        <Link
          to="/capital/perfil"
          title="Meu Perfil"
          className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-[#1a2234] transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">{nome}</p>
            <p className="text-xs text-slate-500 capitalize leading-tight">{userProfile?.perfil || 'Investidor'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs font-semibold uppercase shrink-0">
            {inicial}
          </div>
        </Link>
      </div>
    </header>
  );
}