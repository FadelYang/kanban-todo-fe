import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkIsPasswordSame, setCheckIsPasswordSame] = useState(true);
  const { register, multipleError, isLoading } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (error) {
      console.error(error);
      alert("Something went wrong" + error)
    }
  };

  useEffect(() => {
    setCheckIsPasswordSame(false);
    if (password !== confirmPassword) {
      setCheckIsPasswordSame(false);
    } else {
      setCheckIsPasswordSame(true)
    }
  }, [password, confirmPassword]);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <h1 className="text-3xl text-center">Register</h1>
      <div className="flex flex-col gap-2 border rounded px-5 py-2">
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => handleRegister(e)}
        >
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
            {multipleError && (
              <p className="text-red-500">{multipleError[0]?.message}</p>
            )}
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
            {multipleError && (
              <p className="text-red-500">{multipleError[1]?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Same Password</label>
            <input
              type="password"
              id="passwrd"
              className="border rounded p-2"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </div>
          {!checkIsPasswordSame && (
            <p className="text-red-500">
              {"This password not same"}
            </p>
          )}
          <button
            className="bg-black hover:cursor-pointer hover:bg-gray-800 text-white rounded py-2 px-4 mt-1"
            type="submit"
          >
            {isLoading ? "Register..." : "Register"}
          </button>
          <p className="text-center">
            <a href="/login" className="underline">
              login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
