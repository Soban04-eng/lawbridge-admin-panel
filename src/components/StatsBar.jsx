import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { onValue, ref } from "firebase/database";
import { db, firestoreDb } from "../firebase.js";

const initialStats = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
};

function UsersIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m8-7.13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm6 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

const statCards = [
  {
    key: "total",
    label: "Total Lawyers",
    Icon: UsersIcon,
    borderClass: "border-l-[#0f6b4a]",
    iconClass: "bg-[#e9f4ef] text-[#0f6b4a] ring-emerald-900/10",
    numberClass: "text-[#0f6b4a]",
  },
  {
    key: "pending",
    label: "Pending Approval",
    Icon: ClockIcon,
    borderClass: "border-l-yellow-500",
    iconClass: "bg-yellow-50 text-yellow-700 ring-yellow-100",
    numberClass: "text-yellow-700",
  },
  {
    key: "approved",
    label: "Approved",
    Icon: CheckIcon,
    borderClass: "border-l-[#0f6b4a]",
    iconClass: "bg-[#e9f4ef] text-[#0f6b4a] ring-emerald-900/10",
    numberClass: "text-[#0f6b4a]",
  },
  {
    key: "rejected",
    label: "Rejected",
    Icon: XIcon,
    borderClass: "border-l-red-500",
    iconClass: "bg-red-50 text-red-700 ring-red-100",
    numberClass: "text-red-700",
  },
];

function hasField(object, field) {
  return Object.prototype.hasOwnProperty.call(object || {}, field);
}

function getApprovalKey(lawyer) {
  return lawyer.uid || lawyer.id;
}

function getStatus(lawyer, approvals) {
  const approval = approvals[getApprovalKey(lawyer)] || {};
  const mergedLawyer = { ...lawyer, ...approval };

  if (!hasField(mergedLawyer, "isApproved")) {
    return "approved";
  }

  if (mergedLawyer.isApproved === true) {
    return "approved";
  }

  if (mergedLawyer.isApproved === false && hasField(mergedLawyer, "rejectedAt")) {
    return "rejected";
  }

  return "pending";
}

function getLawyerStats(lawyers, approvals) {
  return lawyers.reduce(
    (counts, lawyer) => {
      const status = getStatus(lawyer, approvals);

      counts.total += 1;

      if (status === "approved") {
        counts.approved += 1;
      } else if (status === "rejected") {
        counts.rejected += 1;
      } else {
        counts.pending += 1;
      }

      return counts;
    },
    { ...initialStats },
  );
}

function StatsBar() {
  const [stats, setStats] = useState(initialStats);
  const [lawyers, setLawyers] = useState([]);
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

  useEffect(() => {
    setStats(getLawyerStats(lawyers, approvals));
  }, [approvals, lawyers]);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const { Icon } = stat;

        return (
          <article
            className={`rounded-lg border-l-4 bg-white p-5 shadow-sm ring-1 ring-emerald-900/10 transition hover:-translate-y-0.5 hover:shadow-md ${stat.borderClass}`}
            key={stat.label}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-4xl font-black ${stat.numberClass}`}>
                  {stats[stat.key]}
                </p>
                <p className="mt-1 text-sm font-bold text-[#0f6b4a]/70">
                  {stat.label}
                </p>
              </div>
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ring-1 ${stat.iconClass}`}
              >
                <Icon />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default StatsBar;
