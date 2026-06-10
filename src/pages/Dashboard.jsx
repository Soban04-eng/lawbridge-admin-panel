import Navbar from "../components/Navbar.jsx";
import StatsBar from "../components/StatsBar.jsx";
import LawyerTable from "../components/LawyerTable.jsx";

function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Review Queue
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-950">
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
