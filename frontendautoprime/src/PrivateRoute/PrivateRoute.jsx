import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("accessToken");

  // Se o token não existir, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Se estiver autenticado, renderiza o componente solicitado
  return children;
};

export default PrivateRoute;
