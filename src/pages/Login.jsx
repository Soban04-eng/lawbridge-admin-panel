import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Login({ isAuthenticated, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (username === "admin" && password === "12345678") {
      onLogin();
      navigate("/dashboard", { replace: true });
      return;
    }

    setError("Invalid username or password.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-6 sm:py-10">
      <section className="w-full max-w-md overflow-hidden rounded-lg bg-[#e9f4ef] shadow-2xl ring-1 ring-emerald-900/10">
        <div className="border-b border-emerald-900/10 bg-white px-5 py-7 sm:px-8 sm:py-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f6b4a] text-lg font-black text-white shadow-lg shadow-emerald-900/20">
            ⚖
          </div>
          <h1 className="text-center text-3xl font-black text-[#0f6b4a] sm:text-4xl">
            LAWBRIDGE
          </h1>
          <p className="mt-2 text-center text-base font-semibold text-[#0f6b4a]">
            Admin Panel
          </p>
          <h2 className="mt-8 text-center text-2xl font-black text-[#0f6b4a]">
            Login to Your Account
          </h2>
        </div>

        <form className="space-y-5 px-5 py-6 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">Username</span>
            <input
              className="mt-2 w-full rounded-md border border-[#7b9288] bg-transparent px-5 py-4 text-[#0f6b4a] outline-none transition placeholder:text-[#6aa18c] focus:border-[#0f6b4a] focus:ring-2 focus:ring-[#0f6b4a]/20"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <input
              className="mt-2 w-full rounded-md border border-[#7b9288] bg-transparent px-5 py-4 text-[#0f6b4a] outline-none transition placeholder:text-[#6aa18c] focus:border-[#0f6b4a] focus:ring-2 focus:ring-[#0f6b4a]/20"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-full bg-[#0f6b4a] px-4 py-4 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#0b573c] focus:outline-none focus:ring-2 focus:ring-[#0f6b4a] focus:ring-offset-2 focus:ring-offset-[#e9f4ef]"
            type="submit"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
