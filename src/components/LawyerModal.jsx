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

function getLawyerId(lawyer) {
  return lawyer.lawyerId || lawyer.lawyerID || lawyer.lawyer_id || "N/A";
}

function getCnic(lawyer) {
  return (
    lawyer.cnic ||
    lawyer.CNIC ||
    lawyer.cnicNo ||
    lawyer.cnicNumber ||
    lawyer.nationalId ||
    lawyer.nationalID ||
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
    <div className="rounded-lg border border-emerald-900/10 bg-[#e9f4ef] p-4">
      <dt className="text-xs font-black uppercase tracking-wide text-[#0f6b4a]/60">
        {label}
      </dt>
      <dd className="mt-2 flex flex-wrap items-center gap-2 break-words text-sm font-bold text-[#0f6b4a]">
        <span>{value}</span>
        {action}
      </dd>
    </div>
  );
}

function LawyerModal({
  lawyer,
  onApprove,
  onClose,
  onCopyCnic,
  onCopyLawyerId,
  onCopyLicence,
  onReject,
}) {
  if (!lawyer) {
    return null;
  }

  const status = getStatus(lawyer);
  const licenceNumber = getLicenceNumber(lawyer);
  const lawyerId = getLawyerId(lawyer);
  const cnic = getCnic(lawyer);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/75 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-white/20">
        <div className="flex items-start justify-between gap-4 border-b border-emerald-900/10 bg-[#0f6b4a] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#0f6b4a] sm:h-12 sm:w-12">
              {getLawyerName(lawyer).slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-100 sm:text-sm">
                Lawyer Profile
              </p>
              <h2 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
                {getLawyerName(lawyer)}
              </h2>
            </div>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-xl font-black text-emerald-100 transition hover:bg-white/10 hover:text-white"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(92vh-144px)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailRow label="Name" value={getLawyerName(lawyer)} />
            <DetailRow label="Email" value={lawyer.email || "N/A"} />
            <DetailRow label="Phone" value={getPhone(lawyer)} />
            <DetailRow
              action={
                licenceNumber !== "N/A" ? (
                  <button
                    className="rounded-full border border-[#0f6b4a]/20 bg-white px-2 py-1 text-xs font-black text-[#0f6b4a] transition hover:bg-[#e9f4ef]"
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
            <DetailRow
              action={
                lawyerId !== "N/A" ? (
                  <button
                    className="rounded-full border border-[#0f6b4a]/20 bg-white px-2 py-1 text-xs font-black text-[#0f6b4a] transition hover:bg-[#e9f4ef]"
                    type="button"
                    onClick={() => onCopyLawyerId(lawyerId)}
                  >
                    Copy
                  </button>
                ) : null
              }
              label="Lawyer ID"
              value={lawyerId}
            />
            <DetailRow
              action={
                cnic !== "N/A" ? (
                  <button
                    className="rounded-full border border-[#0f6b4a]/20 bg-white px-2 py-1 text-xs font-black text-[#0f6b4a] transition hover:bg-[#e9f4ef]"
                    type="button"
                    onClick={() => onCopyCnic(cnic)}
                  >
                    Copy
                  </button>
                ) : null
              }
              label="CNIC"
              value={cnic}
            />
            <DetailRow label="Bar Council" value={getBarCouncil(lawyer)} />
            <DetailRow
              label="Registered Date"
              value={formatRegisteredDate(lawyer.registeredAt)}
            />
          </dl>

          <div className="mt-5 rounded-lg border border-emerald-900/10 bg-[#e9f4ef] p-4">
            <p className="text-xs font-black uppercase tracking-wide text-[#0f6b4a]/60">
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

        <div className="flex flex-col-reverse gap-3 border-t border-emerald-900/10 bg-[#e9f4ef] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            className="rounded-full bg-[#0f6b4a] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#0b573c]"
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
