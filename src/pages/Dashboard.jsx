import Navbar from "../components/Navbar.jsx";
import StatsBar from "../components/StatsBar.jsx";
import LawyerTable from "../components/LawyerTable.jsx";

function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Review Queue
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-950 sm:text-2xl">
                Lawyer verification
              </h2>
            </div>
            <p className="text-sm font-bold text-gray-500">
              Admin workspace
            </p>
          </div>
        </section>
        <StatsBar />
        <LawyerTable />
      </div>
    </main>
  );
}

export default Dashboard;
