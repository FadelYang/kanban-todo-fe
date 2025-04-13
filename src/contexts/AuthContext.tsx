import { ReactNode, createContext, useContext, useState } from "react";
import { getUrl } from "../utils/getBackEndUrl";

const AuthContext = createContext<any>(null);

const url = getUrl();

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const accessToken = await response.json();
      setAccessToken(accessToken);
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
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
