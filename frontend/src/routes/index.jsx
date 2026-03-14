import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

// Componentes de estrutura fixa
import PrivateRoute from "../components/auth/PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";

// --- CARREGAMENTO PREGUIÇOSO (Lazy Load) ---
// HomeFaesb agora é a nossa "Gatekeeper" (Porteira)
const HomeFaesb = lazy(() => import("../pages/public/HomeFaesb"));
const CadastroModulo = lazy(() => import("../pages/public/CadastroTutor"));
const LoginAdmin = lazy(() => import("../pages/public/Login.jsx"));

// Área Administrativa
const PainelAdmin = lazy(() => import("../pages/admin/PainelAdmin"));
const GestaoPix = lazy(() => import("../pages/admin/GestaoPix"));
const ExtratoAuditoria = lazy(() => import("../pages/admin/ExtratoAuditoria"));
const FilaPagamentos = lazy(() => import("../pages/admin/FilaPagamentos")); 

/**
 * Loader de transição elegante com as cores da FAESB
 * Azul: #003366 | Amarelo/Dourado: #FFCC00
 */
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 border-4 border-[#003366] border-t-[#FFCC00] rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-[#003366] uppercase tracking-widest italic animate-pulse">
        Sincronizando Sistema FAESB...
      </p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      /**
       * ROTA RAIZ (/) 
       * Agora aponta para HomeFaesb. Ela verifica se o sistema está aberto
       * e mostra ou o aviso institucional ou o componente CadastroTutor.
       */
      { 
        path: PATHS.PUBLIC.HOME, 
        element: <HomeFaesb /> 
      },
      
      /**
       * ROTA DE CADASTRO (/cadastro)
       * Mantida por segurança ou acesso direto, mas a Home já cuida disso.
       */
      { 
        path: PATHS.PUBLIC.CADASTRO, 
        element: <CadastroModulo /> 
      },
      
      /**
       * LOGIN ADMINISTRATIVO
       */
      { 
        path: PATHS.PUBLIC.LOGIN, 
        element: <LoginAdmin /> 
      },

      /**
       * MÓDULO ADMINISTRATIVO (Protegido)
       */
      {
        path: PATHS.ADMIN.ROOT,
        element: (
          <PrivateRoute allowedRoles={['MASTER']}>
            <AdminLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Navigate to="painel" replace /> },
          { path: "painel", element: <PainelAdmin /> },
          { path: "configuracao-pix", element: <GestaoPix /> },
          
          // Sub-rotas de Tesouraria e Auditoria
          { path: "pagamentos/extrato", element: <ExtratoAuditoria /> },
          { path: "pagamentos/pendentes", element: <FilaPagamentos /> },
        ]
      },

      /**
       * FALLBACK: Qualquer rota inexistente volta para a Home
       */
      { 
        path: "*", 
        element: <Navigate to={PATHS.PUBLIC.HOME} replace /> 
      }
    ]
  }
]);