import React from 'react';
import { Menu, LayoutGrid, BookOpen, Users, Calendar, BarChart3, Settings, User, QrCode } from 'lucide-react';
import '../App.css';
const Sidebar = ({
  onNavigate,
  currentPage,
  isOpen = false
}) => {
  const getActivePage = page => {
    return currentPage === page ? 'active' : '';
  };
  return <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <BookOpen size={24} color="#fff" />
        </div>
        <div className="logo-text">
          <h3>Class Attendance</h3>
          <p>Monitoring System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className={`nav-item ${getActivePage('dashboard')}`} onClick={() => onNavigate('dashboard')}>
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </div>
        <div className={`nav-item ${getActivePage('classes')}`} onClick={() => onNavigate('classes')}>
          <BookOpen size={20} />
          <span>Classes</span>
        </div>
        <div className={`nav-item ${getActivePage('students')}`} onClick={() => onNavigate('students')}>
          <Users size={20} />
          <span>Students</span>
        </div>
        <div className={`nav-item ${getActivePage('attendance')}`} onClick={() => onNavigate('attendance')}>
          <Calendar size={20} />
          <span>Attendance</span>
        </div>
        <div className={`nav-item ${getActivePage('reports')}`} onClick={() => onNavigate('reports')}>
          <BarChart3 size={20} />
          <span>Reports</span>
        </div>
        <div className={`nav-item ${getActivePage('settings')}`} onClick={() => onNavigate('settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className={`user-info ${getActivePage('profile')}`} onClick={() => onNavigate('profile')}>
          <User size={24} />
          <div>
            <p>Admin</p>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>;
};
export default Sidebar;
