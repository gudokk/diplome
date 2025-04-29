import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // Получаем токен из localStorage

  if (!token) {
    // Если токена нет, перенаправляем на страницу логина
    return <Navigate to="/authorization" replace />;
  }

  // Если токен есть — рендерим страницу
  return <>{children}</>;
};

export default PrivateRoute;
