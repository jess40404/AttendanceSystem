import { QrCode } from "lucide-react";
export default function UserCheckin({
  student,
  history,
  saving,
  sessionToken,
  qrSession,
  onCheckIn,
}) {
  const checkedIn = history.some(
    (item) => item.date === new Date().toISOString().slice(0, 10),
  );
  const ready = student && qrSession && sessionToken;
  return (
    <section className="checkin-hub">
      <span className="scan-orbit">
        <QrCode size={70} />
      </span>
      <p className="eyebrow">SECURE ATTENDANCE</p>
      <h2>{ready ? qrSession.classCode || qrSession.subjectName : "Check-in unavailable"}</h2>
      <p>
        {ready
          ? `${qrSession.subjectName} · ${qrSession.schedule}. Your check-in will appear in the administrator attendance records.`
          : !sessionToken
            ? "Scan the current QR code provided by the administrator to start a check-in."
            : !student
              ? "Register your student profile from Home before checking in."
              : "This QR session is no longer active. Scan the current code from the administrator."}
      </p>
      <button
        className="student-primary"
        disabled={!ready || checkedIn || saving}
        onClick={onCheckIn}
      >
        <QrCode size={20} />
        {checkedIn
          ? "Checked in today"
          : saving
            ? "Saving check-in..."
            : "Confirm check-in"}
      </button>
    </section>
  );
}
