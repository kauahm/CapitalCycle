import { Navigate } from 'react-router-dom';

import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';

/* =========================================================
   ÁREA CAPITAL — a guarda de `/capital` e o layout do painel

   É o antigo `PrivateRoute` de `App.jsx` somado ao
   `<DashboardLayout />` que ele envolvia. Os dois vieram para cá
   juntos porque tinham o mesmo problema: `PrivateRoute` chamava
   `useAuth`, e `DashboardLayout` traz `Sidebar` e `Topbar`, que
   também chamam. Enquanto qualquer um deles fosse importado
   estaticamente por `App.jsx`, o Firebase continuaria no bundle da
   rota pública — mesmo com o provider já isolado.

   A lógica de guarda é a mesma, linha por linha: enquanto a sessão
   está sendo resolvida mostra o aviso de carregamento em tela cheia;
   sem usuário, redireciona para `/login`; com usuário, entrega o
   painel.

   O `DashboardLayout` continua sendo quem renderiza o `<Outlet />`,
   então as rotas filhas de `/capital` declaradas em `App.jsx` seguem
   funcionando sem alteração.
   ========================================================= */

export default function AreaCapital() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-bold">
        Carregando CapitalCycle...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
}
