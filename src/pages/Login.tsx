import { useState } from 'react';
import { getUrl } from '../utils/getBackEndUrl';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");

  const handleLogin = async () => {
    const url = getUrl();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        })
      });
    } catch (error) {
      
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <h1 className="text-3xl text-center">Login</h1>
      <div className="flex flex-col gap-2 border rounded px-5 py-2">
        <form className="flex flex-col gap-2" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="border rounded"
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
              className="border rounded"
              onChange={(e) => setPasswrod(e.target.value)}
              value={password}
              required
            />
          </div>
          <button
            className="bg-black hover:cursor-pointer hover:bg-gray-800 text-white rounded py-2 px-4 mt-1"
            type="submit"
          >
            Login
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
