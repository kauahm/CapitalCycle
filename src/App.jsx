import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import HomePage from './pages/HomePage'; // ← NOVO

import DashboardFinanceiro from './pages/admin/DashboardFinanceiro';
import Transacoes from './pages/admin/Transacoes';
import ContasBancarias from './pages/admin/ContasBancarias';
import CiclosInvestimento from './pages/admin/CiclosInvestimento';
import AnaliseIA from './pages/admin/AnaliseIA';

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

          {/* Rotas Protegidas do Sistema Financeiro */}
          <Route
            path="/capital"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardFinanceiro />} />
            <Route path="transacoes" element={<Transacoes />} />
            <Route path="contas" element={<ContasBancarias />} />
            <Route path="ciclos" element={<CiclosInvestimento />} />
            <Route path="analise-ia" element={<AnaliseIA />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
