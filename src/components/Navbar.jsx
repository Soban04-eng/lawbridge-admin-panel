import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem("lawbridgeAdminSession");
    sessionStorage.removeItem("lawbridgeAdminSession");
    onLogout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#0b573c] bg-[#0f6b4a]/95 backdrop-blur">
        <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 md:grid-cols-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#0f6b4a] shadow-md shadow-emerald-950/20 sm:h-10 sm:w-10">
              ⚖
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-white sm:text-lg">
                LawBridge Admin
              </h1>
              <p className="hidden text-xs font-medium text-emerald-100 sm:block">
                Verification console
              </p>
            </div>
          </div>
          <p className="hidden justify-self-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white md:block">
            Welcome, Admin
          </p>
          <button
            className="justify-self-end rounded-full border border-white/30 bg-white px-4 py-2 text-sm font-black text-[#0f6b4a] shadow-sm transition hover:bg-[#e9f4ef]"
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </button>
        </nav>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/70 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4">
          <section className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-white/20">
            <div className="border-b border-emerald-900/10 bg-[#0f6b4a] px-5 py-4">
              <h2 className="text-lg font-black text-white">Confirm logout</h2>
              <p className="mt-1 text-sm font-medium text-emerald-100">
                Are you sure you want to logout?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                className="rounded-full border border-emerald-900/20 px-4 py-2.5 text-sm font-black text-[#0f6b4a] transition hover:bg-[#e9f4ef]"
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
                type="button"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Navbar;
