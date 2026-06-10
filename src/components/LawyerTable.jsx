import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { onValue, ref, serverTimestamp, update } from "firebase/database";
import { db, firestoreDb } from "../firebase.js";
import LawyerModal from "./LawyerModal.jsx";

const filters = ["All", "Pending", "Approved", "Rejected"];

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-800 ring-yellow-200",
  Approved: "bg-green-50 text-green-800 ring-green-200",
  Rejected: "bg-red-50 text-red-800 ring-red-200",
};

function hasField(object, field) {
  return Object.prototype.hasOwnProperty.call(object || {}, field);
}

function getApprovalKey(lawyer) {
  return lawyer.uid || lawyer.id;
}

function getStatus(lawyer) {
  if (!hasField(lawyer, "isApproved")) {
    return "Approved";
  }

  if (lawyer.isApproved === true) {
    return "Approved";
  }

  if (lawyer.isApproved === false && hasField(lawyer, "rejectedAt")) {
    return "Rejected";
  }

  return "Pending";
}

function getStatusIcon(status) {
  if (status === "Approved") {
    return "🟢";
  }

  if (status === "Rejected") {
    return "🔴";
  }

  return "🟡";
}

function getLawyerName(lawyer) {
  return (
    lawyer.name ||
    lawyer.fullName ||
    [lawyer.firstName, lawyer.lastName].filter(Boolean).join(" ") ||
    "Unknown"
  );
}

function getLicenceNo(lawyer) {
  return (
    lawyer.licenceNo ||
    lawyer.licenseNo ||
    lawyer.licenceNumber ||
    lawyer.licenseNumber ||
    lawyer.barLicenseNumber ||
    "N/A"
  );
}

function getBarCouncil(lawyer) {
  return lawyer.barCouncil || lawyer.barCouncilName || lawyer.council || "N/A";
}

function getRegisteredDate(lawyer) {
  const rawDate =
    lawyer.registeredAt || lawyer.createdAt || lawyer.createdOn || lawyer.date;

  if (!rawDate) {
    return "N/A";
  }

  const date =
    typeof rawDate?.toDate === "function"
      ? rawDate.toDate()
      : typeof rawDate?.seconds === "number"
        ? new Date(rawDate.seconds * 1000)
        : typeof rawDate === "number"
          ? new Date(rawDate)
          : new Date(String(rawDate));

  if (Number.isNaN(date.getTime())) {
    return String(rawDate);
  }

  return date.toLocaleDateString();
}

function getSearchText(lawyer) {
  return [
    getLawyerName(lawyer),
    lawyer.email,
    getLicenceNo(lawyer),
    getBarCouncil(lawyer),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function LawyerTable() {
  const [lawyers, setLawyers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [toast, setToast] = useState("");
  const [approvals, setApprovals] = useState({});

  useEffect(() => {
    const unsubscribeFirestore = onSnapshot(collection(firestoreDb, "lawyers"), (snapshot) => {
      const nextLawyers = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setLawyers(nextLawyers);
    });

    const approvalsRef = ref(db, "lawyers/");
    const unsubscribeDatabase = onValue(approvalsRef, (snapshot) => {
      setApprovals(snapshot.val() || {});
    });

    return () => {
      unsubscribeFirestore();
      unsubscribeDatabase();
    };
  }, []);

  const mergedLawyers = useMemo(
    () =>
      lawyers.map((lawyer) => ({
        ...lawyer,
        ...(approvals[getApprovalKey(lawyer)] || {}),
        id: lawyer.id,
      })),
    [approvals, lawyers],
  );

  const pendingCount = useMemo(
    () => mergedLawyers.filter((lawyer) => getStatus(lawyer) === "Pending").length,
    [mergedLawyers],
  );

  const filteredLawyers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return mergedLawyers.filter((lawyer) => {
      const status = getStatus(lawyer);
      const matchesFilter =
        activeFilter === "All" || status.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        getSearchText(lawyer).includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, mergedLawyers, searchQuery]);

  const showSuccessToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const copyLicenceNumber = async (licenceNumber) => {
    if (!licenceNumber || licenceNumber === "N/A") {
      showSuccessToast("No licence number available.");
      return;
    }

    try {
      await navigator.clipboard.writeText(licenceNumber);
      showSuccessToast("Licence number copied.");
    } catch {
      showSuccessToast("Unable to copy licence number.");
    }
  };

  const approveLawyer = async (lawyer) => {
    await update(ref(db, `lawyers/${getApprovalKey(lawyer)}`), {
      isApproved: true,
      rejectedAt: null,
    });
    setSelectedLawyer(null);
    showSuccessToast("Lawyer approved successfully.");
  };

  const rejectLawyer = async (lawyer) => {
    await update(ref(db, `lawyers/${getApprovalKey(lawyer)}`), {
      isApproved: false,
      rejectedAt: serverTimestamp(),
    });
    setSelectedLawyer(null);
    showSuccessToast("Lawyer rejected successfully.");
  };

  return (
    <>
      {toast && (
        <div className="fixed left-3 right-3 top-3 z-[60] rounded-lg bg-[#0f6b4a] px-4 py-3 text-center text-sm font-bold text-white shadow-xl ring-1 ring-white/10 sm:left-auto sm:right-4 sm:top-4 sm:text-left">
          {toast}
        </div>
      )}

      <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-emerald-900/10">
        <div className="border-b border-emerald-900/10 bg-white px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-[#0f6b4a]">
                Lawyer Applications
              </h2>
              <p className="mt-1 text-sm font-medium text-[#0f6b4a]/70">
                {filteredLawyers.length} visible of {mergedLawyers.length} profiles
              </p>
            </div>
            <input
              className="w-full rounded-lg border border-[#7b9288] bg-[#f6fbf8] px-4 py-3 text-sm font-medium text-[#0f6b4a] outline-none transition placeholder:text-[#6aa18c] focus:border-[#0f6b4a] focus:bg-white focus:ring-2 focus:ring-[#0f6b4a]/20 lg:max-w-md"
              type="search"
              placeholder="Search by name, email, licence number, or bar council"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition sm:px-4 ${
                    isActive
                      ? "bg-[#0f6b4a] text-white shadow-sm"
                      : "bg-[#e9f4ef] text-[#0f6b4a] hover:bg-[#dbece5]"
                  }`}
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                >
                  <span>{filter}</span>
                  {filter === "Pending" && pendingCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-black text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {filteredLawyers.map((lawyer, index) => {
            const status = getStatus(lawyer);
            const licenceNumber = getLicenceNo(lawyer);

            return (
              <article
                className="rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm"
                key={lawyer.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f6b4a] text-xs font-black text-white">
                      {getLawyerName(lawyer).slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black text-[#0f6b4a]">
                        {getLawyerName(lawyer)}
                      </p>
                      <p className="truncate text-sm font-medium text-[#0f6b4a]/70">
                        {lawyer.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#0f6b4a]/40">
                    #{index + 1}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#0f6b4a]/60">
                      Licence No
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#0f6b4a]">{licenceNumber}</span>
                      {licenceNumber !== "N/A" && (
                        <button
                          className="rounded-full border border-[#0f6b4a]/20 bg-white px-2 py-1 text-xs font-bold text-[#0f6b4a] transition hover:bg-[#e9f4ef]"
                          type="button"
                          onClick={() => copyLicenceNumber(licenceNumber)}
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[#0f6b4a]/60">
                        Bar Council
                      </p>
                      <p className="mt-1 font-bold text-[#0f6b4a]">
                        {getBarCouncil(lawyer)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[#0f6b4a]/60">
                        Registered
                      </p>
                      <p className="mt-1 font-bold text-[#0f6b4a]">
                        {getRegisteredDate(lawyer)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-black ring-1 ${statusStyles[status]}`}
                    >
                      <span className="mr-1.5">{getStatusIcon(status)}</span>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    className="rounded-full bg-[#0f6b4a] px-2 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#0b573c]"
                    type="button"
                    onClick={() => approveLawyer(lawyer)}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="rounded-md bg-red-600 px-2 py-2 text-xs font-black text-white shadow-sm transition hover:bg-red-700"
                    type="button"
                    onClick={() => rejectLawyer(lawyer)}
                  >
                    ✗ Reject
                  </button>
                  <button
                    className="rounded-full bg-[#167f5a] px-2 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#0f6b4a]"
                    type="button"
                    onClick={() => setSelectedLawyer(lawyer)}
                  >
                    👁 View
                  </button>
                </div>
              </article>
            );
          })}

          {filteredLawyers.length === 0 && (
            <div className="rounded-lg border border-emerald-900/10 bg-[#e9f4ef] px-4 py-10 text-center text-sm font-bold text-[#0f6b4a]">
              No lawyers found.
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[1120px] divide-y divide-emerald-900/10 text-left text-sm">
            <thead className="bg-[#e9f4ef] text-xs font-black uppercase tracking-wide text-[#0f6b4a]">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Licence No</th>
                <th className="px-5 py-4">Bar Council</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/10">
              {filteredLawyers.map((lawyer, index) => {
                const status = getStatus(lawyer);
                const licenceNumber = getLicenceNo(lawyer);

                return (
                  <tr
                    className="bg-white text-[#0f6b4a] transition odd:bg-white even:bg-[#f6fbf8] hover:bg-[#e9f4ef]"
                    key={lawyer.id}
                  >
                    <td className="px-5 py-4 font-bold text-[#0f6b4a]/60">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f6b4a] text-xs font-black text-white">
                          {getLawyerName(lawyer).slice(0, 1).toUpperCase()}
                        </span>
                        <span className="font-black text-[#0f6b4a]">
                          {getLawyerName(lawyer)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#0f6b4a]/75">
                      {lawyer.email || "N/A"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0f6b4a]">
                          {licenceNumber}
                        </span>
                        {licenceNumber !== "N/A" && (
                          <button
                            className="rounded-full border border-[#0f6b4a]/20 bg-white px-2 py-1 text-xs font-bold text-[#0f6b4a] transition hover:bg-[#e9f4ef]"
                            type="button"
                            onClick={() => copyLicenceNumber(licenceNumber)}
                            title="Copy licence number"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{getBarCouncil(lawyer)}</td>
                    <td className="px-5 py-4 font-medium">{getRegisteredDate(lawyer)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-black ring-1 ${statusStyles[status]}`}
                      >
                        <span className="mr-1.5">{getStatusIcon(status)}</span>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-full bg-[#0f6b4a] px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#0b573c]"
                          type="button"
                          onClick={() => approveLawyer(lawyer)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="rounded-md bg-red-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-red-700"
                          type="button"
                          onClick={() => rejectLawyer(lawyer)}
                        >
                          ✗ Reject
                        </button>
                        <button
                          className="rounded-full bg-[#167f5a] px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#0f6b4a]"
                          type="button"
                          onClick={() => setSelectedLawyer(lawyer)}
                        >
                          👁 View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLawyers.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-12 text-center text-sm font-bold text-[#0f6b4a]"
                    colSpan="8"
                  >
                    No lawyers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <LawyerModal
        lawyer={selectedLawyer}
        onApprove={approveLawyer}
        onClose={() => setSelectedLawyer(null)}
        onCopyLicence={copyLicenceNumber}
        onReject={rejectLawyer}
      />
    </>
  );
}

export default LawyerTable;
