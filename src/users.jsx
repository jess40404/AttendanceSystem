import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { apiRequest } from "./api.js";
import UserSidebar from "./users/sidebar.jsx";
import UserHeader from "./users/header.jsx";
import UserHome from "./users/home.jsx";
import UserSubjects from "./users/subjects.jsx";
import UserHistory from "./users/history.jsx";
import UserRecords from "./users/records.jsx";
import UserCheckin from "./users/checkin.jsx";
import "./users.css";

export default function StudentDashboard() {
  const [view, setView] = useState("home"),
    [menuOpen, setMenuOpen] = useState(false),
    [studentId, setStudentId] = useState(
      () => localStorage.getItem("studentId") || "",
    ),
    [sessionToken, setSessionToken] = useState(
      () => new URLSearchParams(window.location.search).get("session") || "",
    );
  const [qrSession, setQrSession] = useState(null);
  const [student, setStudent] = useState(null),
    [history, setHistory] = useState([]),
    [subjects, setSubjects] = useState([]),
    [summary, setSummary] = useState({
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
      rate: 0,
    });
  const [notice, setNotice] = useState(""),
    [saving, setSaving] = useState(false);
  const loadPortal = useCallback(
    async (id = studentId) => {
      if (!id) return;
      try {
        const data = await apiRequest("student-portal", {
          query: { studentId: id },
        });
        if (localStorage.getItem("studentId") !== String(id)) return;
        setStudent(data.student);
        setHistory(data.history);
        setSubjects(data.subjects);
        setSummary(data.summary);
      } catch (error) {
        if (localStorage.getItem("studentId") !== String(id)) return;
        setNotice(error.message);
      }
    },
    [studentId],
  );
  useEffect(() => {
    const request = window.setTimeout(() => {
      loadPortal();
    }, 0);
    return () => window.clearTimeout(request);
  }, [loadPortal]);
  useEffect(() => {
    if (!sessionToken) return;
    let cancelled = false;
    apiRequest("qr-session", { query: { token: sessionToken } })
      .then((data) => {
        if (!cancelled) setQrSession(data.session);
      })
      .catch((error) => {
        if (!cancelled) {
          setQrSession(null);
          setNotice(error.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionToken]);
  const saveRegistration = async (form) => {
    try {
      setSaving(true);
      const result = await apiRequest("student-register", {
        method: "POST",
        body: { ...form, id: student?.id },
      });
      const id = String(result.student.id);
      localStorage.setItem("studentId", id);
      setStudentId(id);
      setStudent(result.student);
      setNotice("Your student profile has been saved.");
      await loadPortal(id);
      return true;
    } catch (error) {
      setNotice(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };
  const checkIn = async () => {
    if (!student || !qrSession || !sessionToken) return;
    try {
      setSaving(true);
      const result = await apiRequest("student-checkin", {
        method: "POST",
        body: { studentId: student.id, sessionToken },
      });
      setNotice(result.message);
      await loadPortal();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("studentId");
    const url = new URL(window.location.href);
    url.searchParams.delete("session");
    window.history.replaceState({}, "", url);
    setStudentId("");
    setSessionToken("");
    setQrSession(null);
    setStudent(null);
    setHistory([]);
    setSubjects([]);
    setSummary({ total: 0, present: 0, late: 0, absent: 0, rate: 0 });
    setNotice("");
    setView("home");
    setMenuOpen(false);
  };
  const pageProps = {
    student,
    subjects,
    history,
    summary,
    saving,
    sessionToken,
    qrSession,
    needsRegistration: !studentId,
    onCheckIn: checkIn,
    onSaveRegistration: saveRegistration,
  };
  const page =
    view === "subjects" ? (
      <UserSubjects subjects={subjects} />
    ) : view === "history" ? (
      <UserHistory history={history} />
    ) : view === "records" ? (
      <UserRecords summary={summary} />
    ) : view === "checkin" ? (
      <UserCheckin {...pageProps} />
    ) : (
      <UserHome {...pageProps} onNavigate={setView} />
    );
  return (
    <div className="student-portal">
      <UserSidebar
        activeView={view}
        student={student}
        isOpen={menuOpen}
        onNavigate={(next) => {
          setView(next);
          setMenuOpen(false);
        }}
        onLogout={logout}
      />
      {menuOpen && (
        <button
          className="student-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="student-main">
        <UserHeader view={view} onOpenMenu={() => setMenuOpen(true)} />
        <div className="student-content">
          {notice && (
            <div className="student-notice">
              <CheckCircle2 size={18} />
              {notice}
              <button onClick={() => setNotice("")}>
                <X size={16} />
              </button>
            </div>
          )}
          {page}
        </div>
      </main>
    </div>
  );
}
