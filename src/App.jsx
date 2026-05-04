import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import PrivateRoute from './components/shared/PrivateRoute'; // Importando o oficial
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';

// Importando suas páginas financeiras
import DashboardFinanceiro from './pages/admin/DashboardFinanceiro';
import Transacoes from './pages/admin/Transacoes';
import ContasBancarias from './pages/admin/ContasBancarias';
import CiclosInvestimento from './pages/admin/CiclosInvestimento';
import AnaliseIA from './pages/admin/AnaliseIA';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/capital/dashboard" replace />} />

          {/* Rotas Protegidas - O PrivateRoute agora vai funcionar! */}
          <Route path="/capital" element={
            <PrivateRoute> 
              <DashboardLayout />
            </PrivateRoute>
          }>
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