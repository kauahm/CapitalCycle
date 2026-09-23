import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';

/* ==========================================================================
   Topbar — alinhada a `referencia/dashboard.PNG`

   Medidas da referencia (1901x1080) convertidas para a escala de 1440:

     altura ............ 117 -> 88px  (h-topbar)
     divisor inferior .. 1px em #181b1f (hairline), sem sombra

   Na referencia o fundo da topbar e o MESMO da area principal (#03060d) —
   ela nao e uma faixa elevada. O que a separa do conteudo e so a hairline.
   Antes era `bg-surface` com `shadow-sm`, o que a fazia flutuar sobre a
   pagina; a sombra saiu junto.

   O titulo fica maior e mais pesado, como na imagem, e o bloco de usuario
   traz nome, papel e avatar violeta. O sino NAO volta: ele foi removido do
   produto, e a referencia e historica.
   ========================================================================== */

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { userProfile, currentUser } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('transacoes')) return 'Transações';
    if (path.includes('contas')) return 'Contas';
    if (path.includes('ciclos')) return 'Ciclos e Metas';
    if (path.includes('orcamento')) return 'Orçamento por Categoria';
    if (path.includes('analise-ia')) return 'Capital Advisor';
    if (path.includes('perfil')) return 'Meu Perfil';
    return 'CapitalCycle';
  };

  const nome = userProfile?.nome || 'Usuário';

  return (
    <header
      className="bg-app h-[var(--cc-topbar)] flex items-center justify-between px-6 md:px-[var(--cc-gutter)]
                 md:ml-[var(--cc-sidebar)] w-full md:w-[calc(100%-var(--cc-sidebar))]
                 fixed top-0 z-10 border-b border-hairline"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 text-textSecondary hover:bg-surfaceLight rounded-lg md:hidden transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-[length:var(--cc-fs-titulo)] font-bold text-textMain tracking-tight truncate">
          {getPageTitle()}
        </h2>
      </div>

      {/* Avatar / nome clicável → Meu Perfil.

          O sino de notificacoes foi removido: nao havia sistema de
          notificacoes por tras dele, so um botao inerte. Saiu junto o
          separador vertical, que existia unicamente para aparta-lo do
          bloco de perfil. */}
      <Link
        to="/capital/perfil"
        title="Meu Perfil"
        className="flex items-center gap-3.5 rounded-xl px-2 py-1.5 hover:bg-surfaceLight transition-colors shrink-0"
      >
        <div className="text-right hidden sm:block leading-tight">
          <p className="text-sm font-bold text-textMain">{nome}</p>
          <p className="text-xs text-textSecondary capitalize">{userProfile?.perfil || 'Investidor'}</p>
        </div>
        <Avatar
          fotoPerfil={userProfile?.fotoPerfil}
          photoURL={currentUser?.photoURL}
          nome={nome}
          className="w-10 h-10 rounded-full shrink-0"
          textoClassName="bg-primary text-white text-sm font-bold"
        />
      </Link>
    </header>
  );
}
