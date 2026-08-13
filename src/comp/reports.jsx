import React, { useState } from 'react';
import { Menu, Download, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
const Reports = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState('attendance');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-09');
  const handleGenerateReport = () => {
    console.log('Generate report:', {
      reportType,
      startDate,
      endDate
    });
  };
  const handleDownloadReport = () => {
    console.log('Download report');
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
          <h1>Reports</h1>
        </header>

        <div className="reports-style-1">
          {/* Report Filters */}
          <div className="reports-style-2">
            <h3 className="reports-style-3">Generate Report</h3>
            <div className="reports-style-4">
              <div>
                <label className="reports-style-5">
                  Report Type
                </label>
                <select value={reportType} onChange={e => setReportType(e.target.value)} className="reports-style-6">
                  <option value="attendance">Attendance Summary</option>
                  <option value="perStudent">Per Student Report</option>
                  <option value="perClass">Per Class Report</option>
                  <option value="daily">Daily Report</option>
                </select>
              </div>
              <div>
                <label className="reports-style-7">
                  Start Date
                </label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="reports-style-8" />
              </div>
              <div>
                <label className="reports-style-9">
                  End Date
                </label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="reports-style-10" />
              </div>
            </div>
            <button onClick={handleGenerateReport} className="reports-style-11">
              <BarChart3 size={18} />
              Generate Report
            </button>
          </div>

          {/* Sample Reports */}
          <div className="reports-style-12">
            <div className="reports-style-13">
              <div className="reports-style-14">
                <div className="reports-style-15">
                  <Calendar size={24} />
                </div>
                <h4 className="reports-style-16">Weekly Attendance</h4>
              </div>
              <p className="reports-style-17">Aug 1 - Aug 9, 2026</p>
              <button onClick={handleDownloadReport} className="reports-style-18">
                <Download size={18} />
                Download
              </button>
            </div>

            <div className="reports-style-19">
              <div className="reports-style-20">
                <div className="reports-style-21">
                  <TrendingUp size={24} />
                </div>
                <h4 className="reports-style-22">Monthly Report</h4>
              </div>
              <p className="reports-style-23">August 2026</p>
              <button onClick={handleDownloadReport} className="reports-style-24">
                <Download size={18} />
                Download
              </button>
            </div>

            <div className="reports-style-25">
              <div className="reports-style-26">
                <div className="reports-style-27">
                  <BarChart3 size={24} />
                </div>
                <h4 className="reports-style-28">Class Comparison</h4>
              </div>
              <p className="reports-style-29">All Classes</p>
              <button onClick={handleDownloadReport} className="reports-style-30">
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Reports;
