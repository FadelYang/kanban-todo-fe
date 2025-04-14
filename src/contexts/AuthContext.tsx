import { ReactNode, createContext, useContext, useState } from "react";
import { getUrl } from "../utils/getBackEndUrl";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>(null);

const url = getUrl();

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [multipleError, setMultipleError] = useState({})
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Making request to:", `${url}/auth/login`);
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        console.error({ response: json?.message });
        setError(json.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/users/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        console.error({ response: json });
        setMultipleError(json);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      alert("Register success, try lo logged in with your new account")
      navigate("/login", { replace: true });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  const logout = async () => {
    await fetch(`${url}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, error, isLoading, register, multipleError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
