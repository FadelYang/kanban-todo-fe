import { ReactNode, createContext, useContext, useState } from "react";
import { getUrl } from "../utils/getBackEndUrl";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<any>(null);

const url = getUrl();

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate()
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        console.error({response: json?.message});
        setError(json.message)
        return;
      }

      const accessToken = await response.json();
      setAccessToken(accessToken);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await fetch(`${url}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
