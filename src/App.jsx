import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import HomePage from './pages/HomePage'; // ← NOVO
import Register from './pages/Register';

// Rotas internas carregadas sob demanda (reduz o bundle inicial)
const DashboardFinanceiro = lazy(() => import('./pages/admin/DashboardFinanceiro'));
const Transacoes = lazy(() => import('./pages/admin/Transacoes'));
const ContasBancarias = lazy(() => import('./pages/admin/ContasBancarias'));
const CiclosInvestimento = lazy(() => import('./pages/admin/CiclosInvestimento'));
const AnaliseIA = lazy(() => import('./pages/admin/AnaliseIA'));
const Mercado = lazy(() => import('./pages/admin/Mercado'));

function RouteLoading() {
  return (
    <div className="h-[80vh] flex items-center justify-center text-slate-400">
      Carregando...
    </div>
  );
}

// Protetor de Rotas Inteligente
function PrivateRoute({ children }) {
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
  
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página inicial pública */}
          <Route path="/" element={<HomePage />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Cadastro — deve vir ANTES do wildcard * */}
          <Route path="/cadastro" element={<Register />} />

          {/* Rotas Protegidas do Sistema Financeiro */}
          <Route
            path="/capital"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Suspense fallback={<RouteLoading />}><DashboardFinanceiro /></Suspense>} />
            <Route path="transacoes" element={<Suspense fallback={<RouteLoading />}><Transacoes /></Suspense>} />
            <Route path="contas" element={<Suspense fallback={<RouteLoading />}><ContasBancarias /></Suspense>} />
            <Route path="ciclos" element={<Suspense fallback={<RouteLoading />}><CiclosInvestimento /></Suspense>} />
            <Route path="analise-ia" element={<Suspense fallback={<RouteLoading />}><AnaliseIA /></Suspense>} />
            <Route path="mercado" element={<Suspense fallback={<RouteLoading />}><Mercado /></Suspense>} />
          </Route>

          {/* Wildcard — redireciona qualquer rota desconhecida para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
