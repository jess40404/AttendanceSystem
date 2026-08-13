import React, { useState } from 'react';
import { Menu, Search, Download, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
const Attendance = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([{
    id: 1,
    studentName: 'Juan Dela Cruz',
    class: 'CS 101',
    date: '2026-08-09',
    time: '08:05 AM',
    status: 'Present'
  }, {
    id: 2,
    studentName: 'Maria Santos',
    class: 'IT 204',
    date: '2026-08-09',
    time: '10:15 AM',
    status: 'Late'
  }, {
    id: 3,
    studentName: 'Kyle Reyes',
    class: 'CS 301',
    date: '2026-08-09',
    time: '01:00 PM',
    status: 'Present'
  }]);
  const getStatusIcon = status => {
    switch (status) {
      case 'Present':
        return <CheckCircle size={18} />;
      case 'Late':
        return <Clock size={18} />;
      case 'Absent':
        return <XCircle size={18} />;
      default:
        return null;
    }
  };
  const handleExport = () => {
    console.log('Export attendance records');
  };
  const handleFilter = () => {
    console.log('Open filter options');
  };
  const handleNavigate = page => {
    setIsSidebarOpen(false);
    onNavigate(page);
  };

  return <div className="dashboard-container">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} isOpen={isSidebarOpen} />
      {isSidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation menu" onClick={() => setIsSidebarOpen(false)} />}

      <main className="main-content">
        <header className="dashboard-header">
          <button className="menu-button" type="button" aria-label="Open navigation menu" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <h1>Attendance Records</h1>
          <div className="attendance-style-1">
            <button onClick={handleFilter} className="attendance-style-2">
              <Filter size={20} />
              Filter
            </button>
            <button onClick={handleExport} className="attendance-style-3">
              <Download size={20} />
              Export
            </button>
          </div>
        </header>

        <div className="attendance-style-4">
          <div className="attendance-style-5">
            <div className="attendance-style-6">
              <Search size={18} className="attendance-style-7" />
              <input type="text" placeholder="Search by student name or class..." className="attendance-style-8" />
            </div>
          </div>

          <div className="attendance-style-9">
            <table className="attendance-style-10">
              <thead>
                <tr className="attendance-style-11">
                  <th className="attendance-style-12">Student Name</th>
                  <th className="attendance-style-13">Class</th>
                  <th className="attendance-style-14">Date</th>
                  <th className="attendance-style-15">Time</th>
                  <th className="attendance-style-16">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => <tr key={record.id} className="attendance-style-17">
                    <td className="attendance-style-18">{record.studentName}</td>
                    <td className="attendance-style-19">{record.class}</td>
                    <td className="attendance-style-20">{record.date}</td>
                    <td className="attendance-style-21">{record.time}</td>
                    <td className="attendance-style-22">
                      <div className={`attendance-status-badge attendance-status-${record.status.toLowerCase()}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>;
};
export default Attendance;
