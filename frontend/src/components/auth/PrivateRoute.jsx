import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Importe seu contexto
import { PATHS } from '../../routes/paths';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, authenticated, loading } = useContext(AuthContext); 

  // 1. Enquanto o sistema verifica se há um usuário no localStorage (fase de loading do Context)
  if (loading) {
    return null; // Ou seu <PageLoader />
  }

  // 2. Se não estiver autenticado (Contexto diz que authenticated é false)
  if (!authenticated) {
    return (
      <Navigate 
        to={PATHS.PUBLIC.LOGIN} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 3. Se o usuário existir mas não tiver a permissão necessária
  // Note: Verifique se no seu banco é 'role' ou 'nivelAcesso'
  const userRole = user?.role || user?.nivelAcesso;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={PATHS.PUBLIC.HOME} replace />;
  }

  return children;
};

export default PrivateRoute;