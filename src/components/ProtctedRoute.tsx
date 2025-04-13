import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { JSX } from 'react';

type ProtectedRouteProps = {
  children: JSX.Element
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to={"/login"} replace />
  return children
}