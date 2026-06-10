import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("lawbridgeAdminSession");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white shadow-md shadow-blue-950/30">
            LB
          </span>
          <div>
            <h1 className="text-lg font-bold text-white">LawBridge Admin</h1>
            <p className="text-xs font-medium text-gray-400">Verification console</p>
          </div>
        </div>
        <p className="hidden justify-self-center rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-200 md:block">
          Welcome, Admin
        </p>
        <button
          className="justify-self-end rounded-md border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:border-blue-500 hover:bg-blue-600"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
