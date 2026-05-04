import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserCircle, Menu, Bell } from 'lucide-react';

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
    return 'CapitalCycle';
  };

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
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{userProfile?.nome || 'Usuário'}</p>
            <p className="text-xs text-indigo-400 capitalize">{userProfile?.perfil || 'Investidor'}</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
}