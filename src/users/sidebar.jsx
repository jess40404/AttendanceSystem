import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  LogOut,
  QrCode,
} from "lucide-react";
const items = [
  ["home", "Home", BarChart3],
  ["subjects", "My Subjects", BookOpen],
  ["history", "Attendance History", CalendarDays],
  ["records", "Attendance Records", ClipboardCheck],
  ["checkin", "Check-in Hub", QrCode],
];
export default function UserSidebar({
  activeView,
  student,
  isOpen,
  onNavigate,
  onLogout,
}) {
  return (
    <aside className={`student-sidebar ${isOpen ? "open" : ""}`}>
      <div className="student-brand">
        <span>
          <BookOpen size={25} />
        </span>
        <div>
          <strong>Class Attendance</strong>
          <small>Student Portal</small>
        </div>
      </div>
      <nav>
        {items.map(([key, label, Icon]) => (
          <button
            key={key}
            className={activeView === key ? "active" : ""}
            onClick={() => onNavigate(key)}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
      <div className="student-account">
        <span className="student-avatar">
          {student?.name?.[0]?.toUpperCase() || "S"}
        </span>
        <div>
          <strong>{student?.name || "New student"}</strong>
          <small>{student?.studentNumber || "Register on Home"}</small>
        </div>
        <button className="icon-button" onClick={onLogout} title="Log out">
          <LogOut size={19} />
        </button>
      </div>
    </aside>
  );
}
