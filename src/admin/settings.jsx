import { useEffect, useState } from 'react';
import { Menu, Save, Clock, AlertTriangle, BookOpen, QrCode, Lock } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
import '../styles/settings.css';
import { apiRequest } from '../api.js';

const Settings = ({ onNavigate, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Class & Subject Settings
    subjectName: 'Application Development & Emerging Tech',
    classSchedule: '08:00 AM - 10:00 AM',
    roomLocation: 'Lab 3',

    // Attendance Status & QR Availability Schedule
    classStartTime: '08:00', // QR Scanning opens
    classEndTime: '10:00',   // QR Scanning closes

    // Scan Status Time Windows (Minutes past start time)
    presentWindow: '10', // 0 to 10 mins = Present
    lateWindow: '30',    // 11 to 30 mins = Late (Beyond 30 mins = Absent)

    // QR Dynamic Refresh Settings
    autoCloseQr: true,    // Enforce schedule auto-lock
    qrRefreshInterval: '15', // Refresh dynamic code every N seconds during class

    // Low Attendance Warnings (Thresholds)
    lateThreshold: '3',   // Alert after 3 late marks
    absentThreshold: '3', // Alert after 3 absent marks

    // Change Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    apiRequest('settings').then(({ settings: saved }) => {
      if (!saved) return;
      setSettings((current) => ({ ...current, subjectName: saved.name, classSchedule: saved.schedule, roomLocation: saved.room_location, classStartTime: saved.start_time.slice(0, 5), classEndTime: saved.end_time.slice(0, 5), presentWindow: String(saved.present_window), lateWindow: String(saved.late_window), autoCloseQr: Boolean(Number(saved.auto_close_qr)), lateThreshold: String(saved.late_threshold), absentThreshold: String(saved.absent_threshold) }));
    }).catch((error) => alert(error.message));
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (
      settings.newPassword &&
      settings.newPassword !== settings.confirmPassword
    ) {
      alert('New passwords do not match!');
      return;
    }
    try {
      const result = await apiRequest('settings', { method: 'PUT', body: settings });
      alert(result.message);
    } catch (error) { alert(error.message); }
  };

  const handleNavigate = (page) => {
    setIsSidebarOpen(false);
    onNavigate(page);
  };

  return (
    <div className="dashboard-container">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} isOpen={isSidebarOpen} />
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
          <h1>SETTINGS</h1>
        </header>

        <div className="settings-style-1">
          
          {/* Class & Subject Settings */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <BookOpen size={20} /> Class & Subject
            </h3>
            <div className="settings-style-4">
              <div>
                <label className="settings-style-5">Subject Name</label>
                <input
                  type="text"
                  value={settings.subjectName}
                  onChange={(e) => handleChange('subjectName', e.target.value)}
                  className="settings-style-6"
                />
              </div>
              <div>
                <label className="settings-style-5">Class Schedule</label>
                <input
                  type="text"
                  value={settings.classSchedule}
                  onChange={(e) => handleChange('classSchedule', e.target.value)}
                  className="settings-style-6"
                />
              </div>
              <div>
                <label className="settings-style-5">Room / Location</label>
                <input
                  type="text"
                  value={settings.roomLocation}
                  onChange={(e) => handleChange('roomLocation', e.target.value)}
                  className="settings-style-6"
                />
              </div>
            </div>
          </div>

          {/* Attendance Status Times */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <Clock size={20} /> Attendance Status & Class Hours
            </h3>
            <div className="settings-style-4">
              <div className="form-row-2col">
                <div>
                  <label className="settings-style-5">Class Start Time (QR Opens)</label>
                  <input
                    type="time"
                    value={settings.classStartTime}
                    onChange={(e) => handleChange('classStartTime', e.target.value)}
                    className="settings-style-6"
                  />
                  <small className="help-text">QR code generation starts automatically at this time.</small>
                </div>
                <div>
                  <label className="settings-style-5">Class End Time (QR Closes)</label>
                  <input
                    type="time"
                    value={settings.classEndTime}
                    onChange={(e) => handleChange('classEndTime', e.target.value)}
                    className="settings-style-6"
                  />
                  <small className="help-text">QR code generation stops and locks at this time.</small>
                </div>
              </div>
            </div>
          </div>

          {/* Scan Status Time Window */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <Clock size={20} /> Scan Status Time Window
            </h3>
            <div className="settings-style-4">
              <div className="form-row-2col">
                <div>
                  <label className="settings-style-5">Present Radius (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.presentWindow}
                    onChange={(e) => handleChange('presentWindow', e.target.value)}
                    className="settings-style-6"
                  />
                  <small className="help-text">Scans from 0 to this duration after start time are marked Present.</small>
                </div>
                <div>
                  <label className="settings-style-5">Late Radius (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={settings.lateWindow}
                    onChange={(e) => handleChange('lateWindow', e.target.value)}
                    className="settings-style-6"
                  />
                  <small className="help-text">Scans past Present window up to this duration are marked Late.</small>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Schedule & Lifetime Settings */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <QrCode size={20} /> QR Code Duration & Active Schedule
            </h3>
            <div className="settings-style-4">
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="autoCloseQr"
                  checked={settings.autoCloseQr}
                  onChange={(e) => handleChange('autoCloseQr', e.target.checked)}
                  className="checkbox-input"
                />
                <label htmlFor="autoCloseQr" className="checkbox-label">
                  Automatically enable QR code generation only during class start/end times
                </label>
              </div>
            </div>
          </div>

          {/* Low Attendance Warnings */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <AlertTriangle size={20} /> Low Attendance Warnings
            </h3>
            <div className="settings-style-4">
              <div>
                <label className="settings-style-5">Late Count Threshold (Max Times)</label>
                <input
                  type="number"
                  min="1"
                  value={settings.lateThreshold}
                  onChange={(e) => handleChange('lateThreshold', e.target.value)}
                  className="settings-style-6"
                />
                <small className="help-text">Triggers warning alert when student late record exceeds this count (e.g., 3 times).</small>
              </div>
              <div>
                <label className="settings-style-5">Absent Count Threshold (Max Times)</label>
                <input
                  type="number"
                  min="1"
                  value={settings.absentThreshold}
                  onChange={(e) => handleChange('absentThreshold', e.target.value)}
                  className="settings-style-6"
                />
                <small className="help-text">Triggers warning alert when student absent record exceeds this count (e.g., 3 times).</small>
              </div>
            </div>
          </div>

          {/* Security / Change Password */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <Lock size={20} /> Security & Password
            </h3>
            <div className="settings-style-4">
              <div>
                <label className="settings-style-5">Current Password</label>
                <input
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => handleChange('currentPassword', e.target.value)}
                  className="settings-style-6"
                />
              </div>
              <div>
                <label className="settings-style-5">New Password</label>
                <input
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  className="settings-style-6"
                />
              </div>
              <div>
                <label className="settings-style-5">Confirm Password</label>
                <input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="settings-style-6"
                />
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <button onClick={handleSave} className="settings-style-31">
            <Save size={18} />
            Save Settings
          </button>

        </div>
      </main>
    </div>
  );
};

export default Settings;