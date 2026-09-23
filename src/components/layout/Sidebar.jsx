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
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ==========================================================================
   Sidebar — alinhada a `referencia/dashboard.PNG`

   Medidas tiradas da referencia (1901x1080) e convertidas para a escala de
   1440, que e a viewport de trabalho do painel (fator 0,7575):

     largura ............ 358 -> 272px  (w-sidebar)
     passo entre itens ... 63 ->  48px
     altura do item ativo. 59 ->  45px
     recuo lateral ....... 11 ->   8px

   O item ativo e um bloco violeta cheio (#5b5fef), de canto arredondado,
   com texto e icone brancos — e nao a barra lateral + fundo translucido que
   existia antes. O resto da navegacao e cinza (#8b8f95) com icones do mesmo
   tom, ganhando branco so no hover.

   O que a referencia mostra e NAO volta
   ------------------------------------
   A imagem e historica e traz dois itens que sairam do produto:
   "Mercado" e a nomenclatura "Contas e Caixas". Nenhum dos dois e
   restaurado — a referencia governa o VISUAL, nao os requisitos. Os itens
   abaixo sao exatamente os sete que o produto tem hoje, com os nomes
   atuais.
   ========================================================================== */

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/capital/dashboard' },
    { icon: Receipt, label: 'Transações', path: '/capital/transacoes' },
    { icon: Landmark, label: 'Contas', path: '/capital/contas' },
    { icon: PieChart, label: 'Ciclos e Metas', path: '/capital/ciclos' },
    { icon: Wallet, label: 'Orçamento por Categoria', path: '/capital/orcamento' },
    { icon: Sparkles, label: 'Capital Advisor (IA)', path: '/capital/analise-ia' },
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
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-[var(--cc-sidebar)] bg-sidebar text-white z-50 flex flex-col
        transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Lockup do topo. Na referencia o nome e travado em duas linhas,
            em caixa alta e com tracking aberto — nao e a logo em imagem. */}
        <div className="h-[var(--cc-topbar)] px-7 flex items-center justify-between shrink-0">
          <Link
            to="/capital/dashboard"
            className="text-[length:var(--cc-fs-logo)] font-extrabold leading-[1.15] tracking-[0.06em] text-white"
          >
            CAPITAL
            <br />
            CYCLE
          </Link>
          <button
            className="md:hidden text-textSecondary hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegacao. `flex-1` empurra o Sair para o rodape sem posicionamento
            absoluto, que era o que fazia o botao encostar na borda. */}
        {/* O recuo do topo e medido: na referencia o item ativo comeca em
            y=146, 29px abaixo do bloco do lockup. Em `vw` isso vale 29px
            em 1901 e 22px em 1440. */}
        <nav className="flex-1 px-3 pt-[1.526vw] space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center gap-3.5 px-4 min-h-[var(--cc-nav-item)] py-2.5 rounded-xl
                  text-[length:var(--cc-fs-nav)] transition-colors
                  ${isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'text-textSecondary font-normal hover:bg-surfaceLight hover:text-white'}
                `}
              >
                <item.icon size={19} className="shrink-0" />
                <span className="leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sair isolado no rodape, como na referencia. */}
        <div className="shrink-0 p-3 border-t border-hairline">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-2.5 rounded-xl text-[length:var(--cc-fs-nav)]
                       text-textSecondary hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={19} className="shrink-0" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
