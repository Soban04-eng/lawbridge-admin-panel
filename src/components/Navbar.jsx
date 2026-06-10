import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("lawbridgeAdminSession");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 md:grid-cols-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-950/30 sm:h-10 sm:w-10 sm:text-sm">
            LB
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white sm:text-lg">LawBridge Admin</h1>
            <p className="hidden text-xs font-medium text-gray-400 sm:block">Verification console</p>
          </div>
        </div>
        <p className="hidden justify-self-center rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-200 md:block">
          Welcome, Admin
        </p>
        <button
          className="justify-self-end rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-bold text-white transition hover:border-blue-500 hover:bg-blue-600 sm:px-4"
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
