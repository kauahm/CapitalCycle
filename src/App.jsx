import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';
import { PageSkeleton } from './components/ui/Skeleton';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Payment from './pages/Payment';

// Rotas internas carregadas sob demanda (reduz o bundle inicial)
const DashboardFinanceiro = lazy(() => import('./pages/admin/DashboardFinanceiro'));
const Transacoes = lazy(() => import('./pages/admin/Transacoes'));
const OpenFinance = lazy(() => import('./pages/admin/OpenFinance'));
const CiclosInvestimento = lazy(() => import('./pages/admin/CiclosInvestimento'));
const OrcamentoCategoria = lazy(() => import('./pages/admin/OrcamentoCategoria'));
const AnaliseIA = lazy(() => import('./pages/admin/AnaliseIA'));
const Perfil = lazy(() => import('./pages/admin/Perfil'));

// Páginas públicas de texto — raramente abertas, então ficam fora do bundle inicial
const Termos = lazy(() => import('./pages/legal/Termos'));
const Privacidade = lazy(() => import('./pages/legal/Privacidade'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteLoading() {
  return (
    <div className="h-[80vh] flex items-center justify-center text-slate-400" role="status">
      Carregando...
    </div>
  );
}

/* Protetor de rotas: o AuthProvider já segura a árvore inteira atrás do
   Splash enquanto a sessão é resolvida, então aqui só resta decidir entre
   deixar passar e mandar para o login. */
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

/* Páginas do painel entram com o esqueleto da própria página, não com um
   spinner solto. */
const painel = (Pagina) => (
  <Suspense fallback={<PageSkeleton />}>
    <Pagina />
  </Suspense>
);

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Página inicial pública */}
              <Route path="/" element={<HomePage />} />

              {/* Acesso e cadastro */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              {/* Tela de pagamento do cadastro — só acessível se houver dados de cadastro no state */}
              <Route path="/pagamento" element={<Payment />} />

              {/* Páginas legais — públicas, sem exigir login */}
              <Route path="/termos" element={<Suspense fallback={<RouteLoading />}><Termos /></Suspense>} />
              <Route path="/privacidade" element={<Suspense fallback={<RouteLoading />}><Privacidade /></Suspense>} />

              {/* Rotas protegidas do painel financeiro */}
              <Route
                path="/capital"
                element={(
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                )}
              >
                <Route index element={<Navigate to="/capital/dashboard" replace />} />
                <Route path="dashboard" element={painel(DashboardFinanceiro)} />
                <Route path="transacoes" element={painel(Transacoes)} />
                <Route path="open-finance" element={painel(OpenFinance)} />
                {/* Antiga aba Contas — links salvos caem no Open Finance */}
                <Route path="contas" element={<Navigate to="/capital/open-finance" replace />} />
                <Route path="ciclos" element={painel(CiclosInvestimento)} />
                <Route path="orcamento" element={painel(OrcamentoCategoria)} />
                <Route path="analise-ia" element={painel(AnaliseIA)} />
                <Route path="perfil" element={painel(Perfil)} />
              </Route>

              {/* Rota desconhecida: página 404 com caminho de volta */}
              <Route path="*" element={<Suspense fallback={<RouteLoading />}><NotFound /></Suspense>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
