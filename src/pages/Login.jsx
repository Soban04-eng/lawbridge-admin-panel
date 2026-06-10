import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (username === "admin" && password === "12345678") {
      localStorage.setItem("lawbridgeAdminSession", "true");
      navigate("/dashboard", { replace: true });
      return;
    }

    setError("Invalid username or password.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-lg bg-gray-900 shadow-2xl ring-1 ring-white/10">
        <div className="border-b border-white/10 bg-gray-900 px-8 py-7">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-950/40">
            LB
          </div>
          <h1 className="text-center text-3xl font-bold text-white">
            LawBridge Admin Panel
          </h1>
        </div>

        <form className="space-y-5 px-8 py-8" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-gray-200">Username</span>
            <input
              className="mt-2 w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-200">Password</span>
            <input
              className="mt-2 w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-200 ring-1 ring-red-500/30">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
