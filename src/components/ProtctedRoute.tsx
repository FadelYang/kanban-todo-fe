import { JSX, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUrl } from '../utils/getBackEndUrl';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const url = getUrl();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${url}/auth/check`, {
          credentials: "include",
        });
        setIsAuthenticated(res.ok);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};
