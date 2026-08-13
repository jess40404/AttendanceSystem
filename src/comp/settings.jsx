import React, { useState } from 'react';
import { Menu, Save, Bell, Lock, User, Eye } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
const Settings = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'Riverside High School',
    schoolCode: 'RHS-2026',
    attendanceThreshold: '85',
    notificationEmail: 'admin@school.com',
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    requirePassword: true
  });
  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
    console.log(`${field} changed to:`, value);
  };
  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
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
          <h1>Settings</h1>
        </header>

        <div className="settings-style-1">
          {/* School Information */}
          <div className="settings-style-2">
            <h3 className="settings-style-3">
              <User size={20} /> School Information
            </h3>
            <div className="settings-style-4">
              <div>
                <label className="settings-style-5">
                  School Name
                </label>
                <input type="text" value={settings.schoolName} onChange={e => handleChange('schoolName', e.target.value)} className="settings-style-6" />
              </div>
              <div>
                <label className="settings-style-7">
                  School Code
                </label>
                <input type="text" value={settings.schoolCode} onChange={e => handleChange('schoolCode', e.target.value)} className="settings-style-8" />
              </div>
              <div>
                <label className="settings-style-9">
                  Attendance Threshold (%)
                </label>
                <input type="number" value={settings.attendanceThreshold} onChange={e => handleChange('attendanceThreshold', e.target.value)} className="settings-style-10" />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-style-11">
            <h3 className="settings-style-12">
              <Bell size={20} /> Notifications
            </h3>
            <div className="settings-style-13">
              <div>
                <label className="settings-style-14">
                  Notification Email
                </label>
                <input type="email" value={settings.notificationEmail} onChange={e => handleChange('notificationEmail', e.target.value)} className="settings-style-15" />
              </div>
              <div className="settings-style-16">
                <input type="checkbox" checked={settings.emailNotifications} onChange={e => handleChange('emailNotifications', e.target.checked)} className="settings-style-17" />
                <label className="settings-style-18">
                  Send email notifications for attendance alerts
                </label>
              </div>
              <div className="settings-style-19">
                <input type="checkbox" checked={settings.pushNotifications} onChange={e => handleChange('pushNotifications', e.target.checked)} className="settings-style-20" />
                <label className="settings-style-21">
                  Enable push notifications
                </label>
              </div>
            </div>
          </div>

          {/* Display & Security Settings */}
          <div className="settings-style-22">
            <h3 className="settings-style-23">
              <Eye size={20} /> Display & Security
            </h3>
            <div className="settings-style-24">
              <div className="settings-style-25">
                <input type="checkbox" checked={settings.darkMode} onChange={e => handleChange('darkMode', e.target.checked)} className="settings-style-26" />
                <label className="settings-style-27">
                  Dark mode
                </label>
              </div>
              <div className="settings-style-28">
                <input type="checkbox" checked={settings.requirePassword} onChange={e => handleChange('requirePassword', e.target.checked)} className="settings-style-29" />
                <label className="settings-style-30">
                  <Lock size={16} /> Require password on login
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="settings-style-31">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </main>
    </div>;
};
export default Settings;
