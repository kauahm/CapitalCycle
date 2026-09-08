import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';

/* =========================================================
   ROTAS — a landing e o resto

   A regra que organiza este arquivo:

     `/` não pode importar nada que só o produto autenticado usa.

   `HomePage` é o único import estático. Ela é a primeira coisa que
   um visitante vê e não deve esperar por um chunk. Todo o resto —
   provider de autenticação, Firebase, login, cadastro, pagamento e
   as oito telas do painel — é carregado sob demanda.

   Antes, `AuthProvider` envolvia o `<BrowserRouter />` inteiro e
   `Login`, `Register`, `Payment` e `DashboardLayout` eram importados
   de forma estática. O efeito era que abrir a página inicial baixava
   462 KB de Firebase e 125 KB de framer-motion que aquela página
   nunca usa.

   `ComAuth` é uma rota de layout SEM caminho próprio: ela não
   participa do casamento de URL, só embrulha os filhos no provider.
   Por causa disso, todos os caminhos abaixo continuam absolutos e
   idênticos aos de antes — `/login`, `/cadastro`, `/pagamento`,
   `/capital/...` — e nenhum redirecionamento mudou.
   ========================================================= */

/* Fronteira do Firebase: tudo daqui para baixo depende de sessão. */
const ComAuth = lazy(() => import('./routes/ComAuth'));
const AreaCapital = lazy(() => import('./routes/AreaCapital'));

/* Rotas públicas que não são a landing. Não estavam em `lazy` e não
   havia razão para isso: `Payment` sozinho tem 810 linhas, incluindo
   a geração do payload PIX, e nada disso serve a quem só quer ler a
   página inicial. */
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Payment = lazy(() => import('./pages/Payment'));

/* Rotas internas carregadas sob demanda (reduz o bundle inicial) */
const DashboardFinanceiro = lazy(() => import('./pages/admin/DashboardFinanceiro'));
const Transacoes = lazy(() => import('./pages/admin/Transacoes'));
const ContasBancarias = lazy(() => import('./pages/admin/ContasBancarias'));
const CiclosInvestimento = lazy(() => import('./pages/admin/CiclosInvestimento'));
const OrcamentoCategoria = lazy(() => import('./pages/admin/OrcamentoCategoria'));
const AnaliseIA = lazy(() => import('./pages/admin/AnaliseIA'));
const Mercado = lazy(() => import('./pages/admin/Mercado'));
const Perfil = lazy(() => import('./pages/admin/Perfil'));

function RouteLoading() {
  return (
    <div className="h-[80vh] flex items-center justify-center text-slate-400">
      Carregando...
    </div>
  );
}

/* Espera pelo chunk da área autenticada. Usa a mesma tela em fundo
   escuro que a guarda de `/capital` já mostrava enquanto resolvia a
   sessão, para que sair da landing seja um estado só, e não dois
   avisos de carregamento diferentes em sequência. */
function BootLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-bold">
      Carregando CapitalCycle...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Página inicial pública — sem provider, sem Firebase */}
        <Route path="/" element={<HomePage />} />

        {/* Rota de layout sem caminho: só embrulha os filhos no
            AuthProvider. Os caminhos abaixo seguem absolutos. */}
        <Route
          element={
            <Suspense fallback={<BootLoading />}>
              <ComAuth />
            </Suspense>
          }
        >
          {/* Login */}
          <Route path="/login" element={<Suspense fallback={<BootLoading />}><Login /></Suspense>} />

          {/* Cadastro — deve vir ANTES do wildcard * */}
          <Route path="/cadastro" element={<Suspense fallback={<BootLoading />}><Register /></Suspense>} />

          {/* Tela de pagamento do cadastro — só acessível se houver dados de cadastro no state */}
          <Route path="/pagamento" element={<Suspense fallback={<BootLoading />}><Payment /></Suspense>} />

          {/* Rotas Protegidas do Sistema Financeiro */}
          <Route
            path="/capital"
            element={
              <Suspense fallback={<BootLoading />}>
                <AreaCapital />
              </Suspense>
            }
          >
            <Route path="dashboard" element={<Suspense fallback={<RouteLoading />}><DashboardFinanceiro /></Suspense>} />
            <Route path="transacoes" element={<Suspense fallback={<RouteLoading />}><Transacoes /></Suspense>} />
            <Route path="contas" element={<Suspense fallback={<RouteLoading />}><ContasBancarias /></Suspense>} />
            <Route path="ciclos" element={<Suspense fallback={<RouteLoading />}><CiclosInvestimento /></Suspense>} />
            <Route path="orcamento" element={<Suspense fallback={<RouteLoading />}><OrcamentoCategoria /></Suspense>} />
            <Route path="analise-ia" element={<Suspense fallback={<RouteLoading />}><AnaliseIA /></Suspense>} />
            <Route path="mercado" element={<Suspense fallback={<RouteLoading />}><Mercado /></Suspense>} />
            <Route path="perfil" element={<Suspense fallback={<RouteLoading />}><Perfil /></Suspense>} />
          </Route>
        </Route>

        {/* Wildcard — redireciona qualquer rota desconhecida para home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
