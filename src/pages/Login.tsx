import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const { login, error, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <h1 className="text-3xl text-center">Login</h1>
      <div className="flex flex-col gap-2 border rounded px-5 py-2">
        <form className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="border rounded p-2 "
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="passwrd"
              className="border rounded p-2"
              onChange={(e) => setPasswrod(e.target.value)}
              value={password}
              required
            />
          </div>
          {error && (
            <p className="text-red-500">
              {error === "Record not found" ? "User not found" : error}
            </p>
          )}
          <button
            className="bg-black hover:cursor-pointer hover:bg-gray-800 text-white rounded py-2 px-4 mt-1"
            type="button"
            onClick={(e) => handleLogin(e)}
          >
            {isLoading ? "Login..." : "Login"}
          </button>
          <p className="text-center">
            <a href="#" className="underline">
              register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
