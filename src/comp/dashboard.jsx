import React, { useState, useEffect } from 'react';
import { Menu, Calendar, Users, BarChart3, QrCode, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import { Book, Graph, Info, Warning } from '@phosphor-icons/react';
import Sidebar from './sidebar.jsx';
import '../App.css';
const Dashboard = ({
  onNavigate,
  currentPage
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = page => {
    setIsSidebarOpen(false);
    onNavigate(page);
  };

  // Update time in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate calendar days
  const getDaysInMonth = date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  const monthName = currentDate.toLocaleString('default', {
    month: 'long'
  });
  const year = currentDate.getFullYear();
  return <div className="dashboard-container">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} isOpen={isSidebarOpen} />
      {isSidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation menu" onClick={() => setIsSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-title">
            <button className="menu-button" type="button" aria-label="Open navigation menu" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h1>ATTENDANCE</h1>
          </div>
          <div className="header-right">
            <div className="date-time">
              <Calendar size={16} />
              <span>{currentDate.toLocaleDateString('en-US', {
                weekday: 'long'
              }).split(',')[0]}</span>
              <span>{currentDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</span>
              <span className="time">
                {time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
              </span>
            </div>
            <QrCode onClick={() => onNavigate('qrcode')} size={20} className="dashboard-style-2" />
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div>
            <h2>Hello Admin!</h2>
            <p>Here's what's happening in your school today.</p>
          </div>
          <div className="welcome-illustration">
            <Book size={80} weight="fill" color="#2d7a4f" />
          </div>
        </section>

        {/* Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon total-students">
              <Users size={24} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Students</p>
              <h3 className="metric-value">30</h3>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon today-attendance">
              <div className="circular-progress">
                <svg viewBox="0 0 100 100" className="progress-circle">
                  <circle cx="50" cy="50" r="45" className="progress-bg" />
                  <circle cx="50" cy="50" r="45" className="progress-fill dashboard-today-progress" />
                </svg>
                <span className="progress-text">92.4%</span>
              </div>
            </div>
            <div className="metric-content">
              <p className="metric-label">Today's Attendance</p>
              <p className="metric-change">↑ 5.6% from yesterday</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon classes-today">
              <BookOpen size={24} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Classes Today</p>
              <h3 className="metric-value">1</h3>
              <p className="metric-change">1 ongoing</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon overall-attendance">
              <TrendingUp size={24} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Overall Attendance</p>
              <h3 className="metric-value">89.7%</h3>
              <p className="metric-change">↑ 3.8% from last month</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid-3col">
          {/* Attendance Overview - Calendar */}
          <section className="attendance-overview-card">
            <div className="section-header">
              <h3>🌿 Attendance Overview</h3>
              <select className="week-selector" onChange={e => console.log('Week changed:', e.target.value)}>
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="compact-calendar">
              <div className="calendar-header">
                <h4>{currentDate.toLocaleString('default', {
                  month: 'short'
                })} {currentDate.getFullYear()}</h4>
              </div>
              <div className="calendar-weekdays-compact">
                <div className="weekday">S</div>
                <div className="weekday">M</div>
                <div className="weekday">T</div>
                <div className="weekday">W</div>
                <div className="weekday">T</div>
                <div className="weekday">F</div>
                <div className="weekday">S</div>
              </div>
              <div className="calendar-days-compact">
                {Array.from({
                length: 35
              }, (_, i) => {
                const dayNum = i - new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 1;
                const isActive = dayNum > 0 && dayNum <= getDaysInMonth(currentDate);
                const isToday = isActive && dayNum === currentDate.getDate();
                return <div key={i} className={`calendar-day-compact ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`} onClick={() => isActive && console.log('Date selected:', dayNum)}>
                      {isActive ? dayNum : ''}
                    </div>;
              })}
              </div>
            </div>
          </section>

          {/* Today's Classes */}
          <section className="todays-classes-card">
            <div className="section-header">
              <h3>📚 Today's Classes</h3>
              <a href="#" className="view-all" onClick={e => {
              e.preventDefault();
              console.log('View all classes');
            }}>View all →</a>
            </div>
            <div className="classes-list-compact">
              <div className="class-item-compact">
                <div className="class-icon ongoing">
                  <BookOpen size={18} />
                </div>
                <div className="class-details-compact">
                  <h4>CCSIT 207 - SIA</h4>
                  <p className="class-time">4:30 - 6:00 AM</p>
                </div>
                <span className="badge-compact ongoing">Ongoing</span>
              </div>
            </div>
          </section>

          {/* Attendance Summary */}
          <section className="attendance-summary-card">
            <div className="section-header">
              <h3>📊 Attendance Summary</h3>
            </div>
            <div className="summary-content-compact">
              <div className="pie-chart-compact">
                <svg viewBox="0 0 100 100" className="pie-svg-compact">
                  <circle cx="50" cy="50" r="40" className="pie-segment present dashboard-pie-present" />
                  <circle cx="50" cy="50" r="40" className="pie-segment late dashboard-pie-late" />
                  <circle cx="50" cy="50" r="40" className="pie-segment absent dashboard-pie-absent" />
                </svg>
                <div className="pie-center-compact">
                  <p className="total-number-compact">30</p>
                </div>
              </div>
              <div className="summary-legend-compact">
                <div className="legend-item-compact">
                  <span className="legend-dot present"></span>
                  <span>Present (15)</span>
                </div>
                <div className="legend-item-compact">
                  <span className="legend-dot late"></span>
                  <span>Late (5)</span>
                </div>
                <div className="legend-item-compact">
                  <span className="legend-dot absent"></span>
                  <span>Absent (10)</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Message */}
        <div className="dashboard-footer">
          <div className="footer-content">
            <p>💚 Keep it up! Every attendance counts. ^^</p>
          </div>
        </div>
      </main>
    </div>;
};
export default Dashboard;
