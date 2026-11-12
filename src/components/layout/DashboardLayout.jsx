import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Trocar de página fecha o menu móvel e leva o conteúdo ao topo: sem
  // isso, a próxima tela abria rolada na posição em que a anterior ficou.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.getElementById('cc-main')?.scrollTo?.({ top: 0 });
  }, [location.pathname]);

  // Esc fecha o menu móvel, como em qualquer camada sobreposta.
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  return (
    <div className="cc-panel flex h-screen bg-app overflow-clip font-sans text-slate-100">
      <a href="#cc-main" className="cc-skip-link">Pular para o conteúdo</a>

      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Recuos medidos na referencia (1901x1080 -> escala 1440):
            a coluna de conteudo comeca 55px depois da sidebar e o primeiro
            bloco fica 43px abaixo da topbar. Aqui isso vira `md:px-10`
            (40px) e o `pt` que soma a altura da topbar fixa ao respiro.

            Sem `max-w-7xl`: na referencia o conteudo ocupa toda a largura
            util entre a sidebar e a margem direita, e o teto de 1280px
            deixava uma faixa morta a direita em telas largas. */}
        <main
          id="cc-main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto px-4 md:px-[var(--cc-gutter)] pb-10 outline-none
                     pt-[calc(var(--cc-topbar)+1.5rem)]
                     md:pt-[calc(var(--cc-topbar)+var(--cc-gutter))]
                     md:ml-[var(--cc-sidebar)]"
        >
          <div key={location.pathname} className="cc-rise">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
