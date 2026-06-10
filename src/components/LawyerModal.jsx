const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-800 ring-yellow-200",
  Approved: "bg-green-50 text-green-800 ring-green-200",
  Rejected: "bg-red-50 text-red-800 ring-red-200",
};

function hasField(object, field) {
  return Object.prototype.hasOwnProperty.call(object || {}, field);
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
  return lawyer.name || lawyer.fullName || "N/A";
}

function getPhone(lawyer) {
  return lawyer.phone || lawyer.phoneNo || lawyer.mobile || lawyer.mobileNo || "";
}

function getLicenceNumber(lawyer) {
  return (
    lawyer.licenceNumber ||
    lawyer.licenceNo ||
    lawyer.licenseNumber ||
    lawyer.licenseNo ||
    "N/A"
  );
}

function getBarCouncil(lawyer) {
  return lawyer.barCouncil || lawyer.barCouncilName || lawyer.council || "N/A";
}

function formatRegisteredDate(value) {
  if (!value) {
    return "N/A";
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString();
  }

  if (typeof value === "object" && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toLocaleString();
  }

  const date = typeof value === "number" ? new Date(value) : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

function DetailRow({ action, label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <dt className="text-xs font-black uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-2 flex flex-wrap items-center gap-2 break-words text-sm font-bold text-gray-950">
        <span>{value}</span>
        {action}
      </dd>
    </div>
  );
}

function LawyerModal({ lawyer, onApprove, onClose, onCopyLicence, onReject }) {
  if (!lawyer) {
    return null;
  }

  const status = getStatus(lawyer);
  const licenceNumber = getLicenceNumber(lawyer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/75 px-4 py-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-white/20">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 bg-gray-950 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">
              {getLawyerName(lawyer).slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
                Lawyer Profile
              </p>
              <h2 className="mt-1 text-2xl font-black text-white">
                {getLawyerName(lawyer)}
              </h2>
            </div>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-xl font-black text-gray-400 transition hover:bg-white/10 hover:text-white"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailRow label="Name" value={getLawyerName(lawyer)} />
            <DetailRow label="Email" value={lawyer.email || "N/A"} />
            <DetailRow label="Phone" value={getPhone(lawyer)} />
            <DetailRow
              action={
                licenceNumber !== "N/A" ? (
                  <button
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-black text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    type="button"
                    onClick={() => onCopyLicence(licenceNumber)}
                  >
                    Copy
                  </button>
                ) : null
              }
              label="Licence Number"
              value={licenceNumber}
            />
            <DetailRow label="Bar Council" value={getBarCouncil(lawyer)} />
            <DetailRow
              label="Registered Date"
              value={formatRegisteredDate(lawyer.registeredAt)}
            />
          </dl>

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-500">
              Current Status
            </p>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-black ring-1 ${statusStyles[status]}`}
            >
              <span className="mr-2">{getStatusIcon(status)}</span>
              {status}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
            type="button"
            onClick={() => onApprove(lawyer)}
          >
            ✓ Approve
          </button>
          <button
            className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
            type="button"
            onClick={() => onReject(lawyer)}
          >
            ✗ Reject
          </button>
        </div>
      </section>
    </div>
  );
}

export default LawyerModal;
