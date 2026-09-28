import { CalendarDays, Clock3, Menu } from "lucide-react";
const titles = {
  home: "Home",
  subjects: "My Subjects",
  history: "Attendance History",
  records: "Attendance Records",
  checkin: "Check-in Hub",
};
export default function UserHeader({ view, onOpenMenu }) {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <header className="student-header">
      <div>
        <button
          className="student-menu"
          onClick={onOpenMenu}
          aria-label="Open navigation"
        >
          <Menu />
        </button>
        <h1>{titles[view]}</h1>
      </div>
      <div className="student-clock">
        <CalendarDays size={18} />
        <span>{date}</span>
        <i />
        <Clock3 size={18} />
        <span>{time}</span>
      </div>
    </header>
  );
}
