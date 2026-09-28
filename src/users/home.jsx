import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  QrCode,
  UserRound,
  X,
} from "lucide-react";
import Registration from "./registration.jsx";
import "./home.css";

const date = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function UserHome({
  student,
  subjects,
  history,
  summary,
  saving,
  sessionToken,
  qrSession,
  needsRegistration,
  onCheckIn,
  onSaveRegistration,
  onNavigate,
}) {
  const [registrationOpen, setRegistrationOpen] = useState(
    () => Boolean(sessionToken && needsRegistration),
  );
  const registrationDialog = useRef(null);
  const subject = subjects[0];

  useEffect(() => {
    const dialog = registrationDialog.current;
    if (!dialog) return;

    if (registrationOpen && !dialog.open) dialog.showModal();
    if (!registrationOpen && dialog.open) dialog.close();
  }, [registrationOpen]);

  const checkedIn = history.some(
    (item) => item.date === new Date().toISOString().slice(0, 10),
  );
  const rate = Number(summary.rate || 0).toFixed(1);

  // Active session status check
  const hasActiveSession = Boolean(qrSession);

  return (
    <>
      <section className="student-welcome">
        <div className="welcome-header">
          <div className="welcome-text">
            <p className="eyebrow">STUDENT DASHBOARD</p>
            <h2>Hello, {student?.name?.split(" ")[0] || "Student"} 👋</h2>
          </div>

          <button
            className="student-primary registration-trigger"
            onClick={() => setRegistrationOpen(true)}
          >
            <UserRound size={18} />
            {student ? "Edit profile" : "Register"}
          </button>
        </div>

        <p className="welcome-subtext">
          Register your profile, view classes, and keep your attendance up to date.
        </p>
      </section>

      <dialog
        className="registration-dialog"
        ref={registrationDialog}
        aria-label={student ? "Edit student profile" : "Student registration"}
        onClose={() => setRegistrationOpen(false)}
      >
        <button
          className="registration-dialog-close"
          type="button"
          aria-label="Close registration"
          onClick={() => setRegistrationOpen(false)}
        >
          <X size={19} />
        </button>
        {registrationOpen && (
          <Registration
            student={student}
            saving={saving}
            onSave={onSaveRegistration}
            onClose={() => setRegistrationOpen(false)}
          />
        )}
      </dialog>

      <div className="student-dashboard-grid">
        <section className="student-card">
          <p className="eyebrow">CURRENT ACTIVE CLASS</p>
          <div className="class-main">
            <span className="class-icon">
              <BookOpen size={27} />
            </span>
            <div>
              <h3>{subject?.classCode || "Register to see a class"}</h3>
              <p>
                {subject?.name || "Your class will appear after registration"}
              </p>
              <small>
                <Clock3 size={14} />{" "}
                {subject?.schedule || "Schedule unavailable"}
              </small>
            </div>
            <b className="live-pill">{hasActiveSession ? "Open" : "Scan QR"}</b>
          </div>
          <button
            className="student-primary"
            disabled={!student || !hasActiveSession || checkedIn || saving}
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              const sessionId = urlParams.get("session") || qrSession;
              onCheckIn(sessionId);
            }}
          >
            <QrCode size={20} />
            {checkedIn
              ? "Checked in today"
              : !student
                ? "Register to check in"
                : !hasActiveSession
                  ? "Scan admin QR to check in"
                  : "Check in now"}
          </button>
        </section>

        <section className="student-card score-card">
          <div className="card-heading">
            <h3>Attendance score</h3>
            <BarChart3 size={22} />
          </div>
          <div className="score-number">
            {rate}
            <small>%</small>
          </div>
          <p>Present = 1 · Late = 0.5 · Absent = 0</p>
          <div className="score-breakdown">
            <span>
              <b>{summary.present}</b>Present
            </span>
            <span>
              <b>{summary.late}</b>Late
            </span>
            <span>
              <b>{summary.absent}</b>Absent
            </span>
          </div>
        </section>
      </div>

      <div className="home-detail-grid">
        <section className="student-card recent-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">LATEST ACTIVITY</p>
              <h3>Recent check-ins</h3>
            </div>
            <button onClick={() => onNavigate("history")}>View history</button>
          </div>
          {history.slice(0, 4).map((item) => (
            <div className="recent-row" key={item.id}>
              <span className={`status-icon ${item.status.toLowerCase()}`}>
                <CheckCircle2 size={18} />
              </span>
              <div>
                <b>{item.classCode}</b>
                <p>
                  {date(item.date)} · {item.time || "No check-in time"}
                </p>
              </div>
              <span className={`status-tag ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          ))}
          {!history.length && (
            <p className="empty-state">No attendance has been recorded yet.</p>
          )}
        </section>
      </div>
    </>
  );
}