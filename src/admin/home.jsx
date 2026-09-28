import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Menu,
  QrCode,
  Radio,
  Users,
} from "lucide-react";
import Sidebar from "./sidebar.jsx";
import "../styles/home.css";

const logs = [
  ["01:45 PM", "JD", "John Doe", "Checked in at 1:45 PM", "violet", "On Time"],
  ["01:52 PM", "JS", "Jane Smith", "Checked in at 1:52 PM", "orange", "Late"],
  [
    "01:53 PM",
    "MR",
    "Miguel Reyes",
    "Checked in at 1:53 PM",
    "blue",
    "On Time",
  ],
  [
    "01:54 PM",
    "AP",
    "Angela Pascual",
    "Checked in at 1:54 PM",
    "indigo",
    "On Time",
  ],
];

export default function Home({ onNavigate, currentPage }) {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const navigate = (page) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  const dateLabel = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="attendance-shell">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        isOpen={menuOpen}
      />

      {menuOpen && (
        <button
          className="attendance-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="attendance-main">
        <header className="attendance-header">
          <div className="attendance-header-title">
            <button
              className="attendance-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={25} />
            </button>
            <h1>HOME</h1>
          </div>

          <div className="attendance-clock">
            <CalendarDays size={22} />
            <span>{dateLabel}</span>
            <i />
            <Clock3 size={22} />
            <span>{timeLabel}</span>
            <i />
            <button
              aria-label="Open QR check-in"
              onClick={() => navigate("qrcode")}
            >
              <QrCode size={23} />
            </button>
          </div>
        </header>

        <div className="attendance-content">
          {/* Top Row: Welcome Card + Check-in Status Card */}
          <div className="attendance-top-grid">
            <section className="welcome-card">
              <h2>Hello Admin! 👋</h2>
              <p>Here's what's happening in your school today.</p>

              <div className="class-highlight">
                <span className="class-book">
                  <BookOpen size={40} />
                </span>

                <div>
                  <h3>CCSIT 207 - SIA</h3>
                  <p>4:30 - 6:00 AM</p>
                </div>

                <span className="ongoing-pill">Ongoing</span>
              </div>
            </section>

            <section className="checkin-card top-checkin-card">
              <div className="checkin-card-header">
                <span className="stat-icon purple">
                  <BarChart3 size={48} />
                </span>

                <div className="checkin-title-wrapper">
                  <div className="status-live-pill">
                    <span className="pulse-dot" /> Live Scanner
                  </div>
                  <small>
                    <Clock3 size={14} /> Closes in 12 mins
                  </small>
                </div>
              </div>

              <div className="checkin-card-body">
                <div className="checkin-metrics">
                  <div>
                    <p>Check-in Status</p>
                    <h3>QR Window Active</h3>
                  </div>
                  <span className="percentage-badge">93.3% Complete</span>
                </div>

                <div className="checkin-progress-bar">
                  <div className="progress-fill" style={{ width: "93.3%" }} />
                </div>

                <div className="checked-details">
                  <div className="checked">
                    <Users size={22} />
                    <span>
                      <b>28 / 30</b> Verified Students
                    </span>
                  </div>
                  <span className="pending-tag">2 Pending</span>
                </div>
              </div>
            </section>
          </div>

          {/* Second Row: 3-Column Grid */}
          <div className="attendance-second-grid">
            {/* 1. Total Students Enrolled */}
            <button
              className="stat-card horizontal-card"
              onClick={() => navigate("students")}
            >
              <div className="stat-card-left">
                <span className="stat-icon purple large-icon">
                  <Users size={48} />
                </span>
              </div>

              <div className="stat-card-right">
                <p>Total Students Enrolled</p>
                <strong>30</strong>
              </div>
            </button>

            {/* 2. Total Attendance */}
            <button
              className="stat-card horizontal-card"
              onClick={() => navigate("attendance")}
            >
              <div className="stat-card-left">
                <span className="stat-icon blue large-icon">
                  <CalendarDays size={48} />
                </span>
              </div>

              <div className="stat-card-right">
                <p>Today's Attendance</p>
                <strong>28</strong>
                <small className="positive">↑ 5 vs yesterday</small>
              </div>
            </button>

            {/* 3. Attendance Summary */}
            <section className="summary-card compact-summary">
              <div className="card-heading">
                <h2>
                  <BarChart3 size={20} />
                  Attendance Summary
                </h2>
              </div>

              <div className="summary-bars compact-bars">
                <div>
                  <span>Present</span>
                  <span className="bar-track">
                    <i className="present" style={{ width: "93%" }} />
                  </span>
                  <b>28</b>
                </div>

                <div>
                  <span>Late</span>
                  <span className="bar-track">
                    <i className="late" style={{ width: "23%" }} />
                  </span>
                  <b>2</b>
                </div>

                <div>
                  <span>Absent</span>
                  <span className="bar-track">
                    <i className="absent" style={{ width: "11%" }} />
                  </span>
                  <b>0</b>
                </div>
              </div>
            </section>
          </div>

          {/* Third Row: Full Width Real-time Logs */}
          <div className="attendance-full-row">
            <section className="logs-card full-logs-card">
              <div className="card-heading">
                <h2>
                  <Radio size={25} />
                  Real-time Logs
                </h2>
                <span className="live">
                  <i />
                  Live
                </span>
              </div>

              <div className="logs-list">
                {logs.map(([at, initials, name, text, color, status]) => (
                  <div className="log-row" key={name}>
                    <time>{at}</time>
                    <i
                      className={`
                          log-dot
                          ${status === "Late" ? "late" : ""}
                        `}
                    />
                    <span
                      className={`
                          avatar
                          ${color}
                        `}
                    >
                      {initials}
                    </span>

                    <div>
                      <b>{name}</b>
                      <p>{text}</p>
                    </div>

                    <span
                      className={`
                          status
                          ${status === "Late" ? "late" : ""}
                        `}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="all-logs"
                onClick={() => navigate("attendance")}
              >
                View All Logs
                <ChevronRight />
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}