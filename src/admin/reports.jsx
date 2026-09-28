import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Menu,
  XCircle,
} from "lucide-react";
import Sidebar from "./sidebar.jsx";
import "../App.css";
import "../styles/reports.css";
import { apiRequest } from "../api.js";

const mockAttendanceLogs = [
  {
    id: 1,
    studentId: "2024-0001",
    name: "John Doe",
    date: "2026-08-01",
    time: "01:45 PM",
    subject: "CCSIT 207",
    status: "On Time",
  },
  {
    id: 2,
    studentId: "2024-0002",
    name: "Jane Smith",
    date: "2026-08-01",
    time: "01:52 PM",
    subject: "CCSIT 207",
    status: "Late",
  },
  {
    id: 3,
    studentId: "2024-0003",
    name: "Miguel Reyes",
    date: "2026-08-01",
    time: "01:53 PM",
    subject: "CCSIT 207",
    status: "On Time",
  },
  {
    id: 4,
    studentId: "2024-0004",
    name: "Angela Pascual",
    date: "2026-08-02",
    time: "01:40 PM",
    subject: "CCSIT 207",
    status: "On Time",
  },
  {
    id: 5,
    studentId: "2024-0001",
    name: "John Doe",
    date: "2026-08-02",
    time: "02:10 PM",
    subject: "CCSIT 207",
    status: "Late",
  },
  {
    id: 6,
    studentId: "2024-0002",
    name: "Jane Smith",
    date: "2026-08-05",
    time: "01:44 PM",
    subject: "CCSIT 207",
    status: "On Time",
  },
  {
    id: 7,
    studentId: "2024-0003",
    name: "Miguel Reyes",
    date: "2026-08-08",
    time: "01:46 PM",
    subject: "CCSIT 207",
    status: "On Time",
  },
];

const mockStudents = [
  { id: "2024-0001", name: "John Doe" },
  { id: "2024-0002", name: "Jane Smith" },
  { id: "2024-0003", name: "Miguel Reyes" },
  { id: "2024-0004", name: "Angela Pascual" },
];

void mockAttendanceLogs;
void mockStudents;

const Reports = ({ onNavigate, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState("attendance");
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-09");
  const [activeReport, setActiveReport] = useState({
    type: "attendance",
    start: "2026-08-01",
    end: "2026-08-09",
  });
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    Promise.all([
      apiRequest("reports", { query: { start: startDate, end: endDate } }),
      apiRequest("students"),
    ]).then(([report, studentData]) => {
      setAttendanceLogs(report.logs);
      setStudents(studentData.students.map((student) => ({ id: student.studentNumber, name: student.name })));
    }).catch((error) => alert(error.message));
  }, [startDate, endDate]);

  const handleGenerateReport = () => {
    setActiveReport({
      type: reportType,
      start: startDate,
      end: endDate,
    });
  };

  const handleNavigate = (page) => {
    setIsSidebarOpen(false);
    onNavigate(page);
  };

  // Filter logs according to active date range
  const filteredLogs = attendanceLogs.filter((log) => {
    return log.date >= activeReport.start && log.date <= activeReport.end;
  });

  // Aggregated student metrics for "Attendance Summary"
  const summaryData = students.map((student) => {
    const studentLogs = filteredLogs.filter(
      (l) => l.studentId === student.id
    );
    const present = studentLogs.filter((l) => l.status === "On Time").length;
    const late = studentLogs.filter((l) => l.status === "Late").length;
    const totalSessions = 5; // Total expected class sessions in date range
    const absent = Math.max(0, totalSessions - (present + late));
    const attendanceRate = Math.round(
      ((present + late) / totalSessions) * 100
    );

    return {
      ...student,
      present,
      late,
      absent,
      rate: `${attendanceRate}%`,
    };
  });

  // Group logs by date for "Daily Report"
  const groupedDailyLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <Sidebar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isOpen={isSidebarOpen}
      />
      {isSidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="dashboard-header">
          <button
            className="menu-button"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <h1>REPORTS</h1>
        </header>

        <div className="reports-style-1">
          {/* Report Filters */}
          <div className="reports-style-2">
            <h3 className="reports-style-3">Generate Report</h3>
            <div className="reports-style-4">
              <div>
                <label className="reports-style-5">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="reports-style-6"
                >
                  <option value="attendance">Attendance Summary</option>
                  <option value="daily">Daily Report</option>
                </select>
              </div>
              <div>
                <label className="reports-style-7">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="reports-style-8"
                />
              </div>
              <div>
                <label className="reports-style-9">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="reports-style-10"
                />
              </div>
            </div>
            <button onClick={handleGenerateReport} className="reports-style-11">
              <BarChart3 size={18} />
              Generate Report
            </button>
          </div>

          {/* Dynamic Report Content Section */}
          <div className="report-results-wrapper">
            <div className="report-results-header">
              <div>
                <h2>
                  {activeReport.type === "attendance"
                    ? "Attendance Summary Report"
                    : "Daily Attendance Logs"}
                </h2>
                <p className="report-date-range">
                  <Calendar size={15} /> Range: {activeReport.start} to{" "}
                  {activeReport.end}
                </p>
              </div>
              <span className="record-badge">
                {filteredLogs.length} Records Found
              </span>
            </div>

            {/* Render Attendance Summary View */}
            {activeReport.type === "attendance" && (
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Present</th>
                      <th>Late</th>
                      <th>Absent</th>
                      <th>Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.length > 0 ? (
                      summaryData.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <code className="student-id-tag">{row.id}</code>
                          </td>
                          <td className="font-semibold">{row.name}</td>
                          <td>
                            <span className="stat-pill success">
                              <CheckCircle2 size={13} /> {row.present}
                            </span>
                          </td>
                          <td>
                            <span className="stat-pill warning">
                              <Clock size={13} /> {row.late}
                            </span>
                          </td>
                          <td>
                            <span className="stat-pill danger">
                              <XCircle size={13} /> {row.absent}
                            </span>
                          </td>
                          <td className="font-bold">{row.rate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">
                          No attendance records found for this date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Render Daily Report View */}
            {activeReport.type === "daily" && (
              <div className="daily-tables-container">
                {Object.keys(groupedDailyLogs).length > 0 ? (
                  Object.keys(groupedDailyLogs).map((date) => (
                    <div key={date} className="daily-group-card">
                      <div className="daily-group-title">
                        <Calendar size={16} />
                        <h3>{date}</h3>
                      </div>
                      <div className="table-responsive">
                        <table className="report-table">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Student ID</th>
                              <th>Student Name</th>
                              <th>Subject</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedDailyLogs[date].map((log) => (
                              <tr key={log.id}>
                                <td>{log.time}</td>
                                <td>
                                  <code className="student-id-tag">
                                    {log.studentId}
                                  </code>
                                </td>
                                <td className="font-semibold">{log.name}</td>
                                <td>{log.subject}</td>
                                <td>
                                  <span
                                    className={`status-pill ${
                                      log.status === "Late"
                                        ? "late-pill"
                                        : "ontime-pill"
                                    }`}
                                  >
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data-card">
                    No daily logs found within the selected timeframe.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;