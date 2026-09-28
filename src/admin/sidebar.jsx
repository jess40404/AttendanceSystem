import {
  LayoutGrid,
  BookOpen,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
} from "lucide-react";

import "../styles/sidebar.css";

const Sidebar = ({
  onNavigate,
  currentPage,
  isOpen = false,
}) => {
  const getActivePage = (page) => {
    return currentPage === page ? "active" : "";
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <BookOpen size={31} />
        </div>

        <div className="logo-text">
          <h2>Class Attendance</h2>
          <p>Monitoring System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${getActivePage("home")}`}
          onClick={() => onNavigate("home")}
        >
          <LayoutGrid size={28} />
          <span>Home</span>
        </div>

        <div
          className={`nav-item ${getActivePage("students")}`}
          onClick={() => onNavigate("students")}
        >
          <Users size={28} />
          <span>Students</span>
        </div>

        <div
          className={`nav-item ${getActivePage("attendance")}`}
          onClick={() => onNavigate("attendance")}
        >
          <CalendarDays size={28} />
          <span>Attendance</span>
        </div>

        <div
          className={`nav-item ${getActivePage("reports")}`}
          onClick={() => onNavigate("reports")}
        >
          <BarChart3 size={28} />
          <span>Reports</span>
        </div>

        <div
          className={`nav-item ${getActivePage("settings")}`}
          onClick={() => onNavigate("settings")}
        >
          <Settings size={28} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div
          className={`user-info ${getActivePage("profile")}`}
          onClick={() => onNavigate("profile")}
        >
          <span className="user-icon">
            <Users size={28} />
          </span>

          <div className="user-text">
            <p>Admin</p>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;