import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Download } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
import '../styles/qrcode.css';
import { apiRequest } from '../api.js';

const QRCode = ({ onNavigate, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [sessionId, setSessionId] = useState('');
  const qrValue = sessionId ? (() => {
    const url = new URL(import.meta.env.VITE_PUBLIC_APP_URL || window.location.href);
    url.search = new URLSearchParams({ session: sessionId }).toString();
    url.hash = '';
    return url.toString();
  })() : '';

  // Update time in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    apiRequest('qr-session', { method: 'POST' }).then((data) => setSessionId(data.sessionId)).catch((error) => alert(error.message));
  }, []);

  const handleRefreshCode = async () => {
    try { const data = await apiRequest('qr-session', { method: 'POST' }); setSessionId(data.sessionId); }
    catch (error) { setSessionId(''); alert(error.message); }
  };

  const handleDownload = async () => {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`;
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `attendance-qr-${sessionId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleNavigate = page => {
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
            aria-label="Back to dashboard"
            onClick={() => handleNavigate('home')}
          >
            <ArrowLeft size={24} />
          </button>
          <h1>QR Code Generator</h1>
        </header>

        <div className="qrcode-style-1">
          {/* QR Code Container */}
          <div className="qrcode-style-2">
            {/* QR Code Image */}
            <div className="qrcode-style-3">
              {sessionId ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`}
                  alt="Scan to open the student attendance portal"
                  className="qrcode-style-4"
                />
              ) : <p>Preparing QR code...</p>}
            </div>

            {/* Real-time Clock */}
            <div className="qrcode-style-5">
              {time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </div>

            {/* Date */}
            <div className="qrcode-style-6">
              {time.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Attendance Note */}
            <div className="qrcode-style-7">
              📱 Scan the QR Code for attendance <br />
              Arrival time:<br />
              4:30 PM - 4:45 PM = PRESENT<br />
              4:46 PM - 5:00 PM = LATE<br />
              5:01 PM - 6:00 PM = ABSENT<br />
            </div>

            {/* Session ID */}
            <div className="qrcode-style-8">
              Session ID: {sessionId}
            </div>

            {/* Action Buttons */}
            <div className="qrcode-style-9">
              <button onClick={handleRefreshCode} className="qrcode-style-10">
                <RefreshCw size={18} />
                Generate New Code
              </button>

              <button onClick={handleDownload} className="qrcode-style-11">
                <Download size={18} />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRCode;
