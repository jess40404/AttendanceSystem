import { useEffect, useState } from 'react';
import { Menu, Search, Download, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
import '../styles/attendance.css';
import { apiRequest } from '../api.js';

const Attendance = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  useEffect(() => {
    apiRequest('attendance', { query: { search } }).then((data) => setAttendanceRecords(data.attendance)).catch((error) => alert(error.message));
  }, [search]);
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
  const visibleRecords = statusFilter === 'All'
    ? attendanceRecords
    : attendanceRecords.filter((record) => record.status === statusFilter);
  const handleExport = () => {
    const rows = [['Student Name', 'Class', 'Date', 'Time', 'Status'], ...visibleRecords.map((record) => [record.studentName, record.class, record.date, record.time, record.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'attendance-records.csv'; link.click(); URL.revokeObjectURL(link.href);
  };
  const handleFilter = () => {
    setStatusFilter(statusFilter === 'All' ? 'Present' : statusFilter === 'Present' ? 'Late' : 'All');
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
          <h1>ATTENDANCE RECORDS</h1>
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
              <input type="text" placeholder="Search by student name or class..." className="attendance-style-8" value={search} onChange={(event) => setSearch(event.target.value)} />
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
                {visibleRecords.map(record => <tr key={record.id} className="attendance-style-17">
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
