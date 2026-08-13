import './App.css'
import { useState } from 'react'
import Dashboard from './comp/dashboard.jsx'
import Classes from './comp/classes.jsx'
import Students from './comp/students.jsx'
import Attendance from './comp/attendance.jsx'
import Reports from './comp/reports.jsx'
import Settings from './comp/settings.jsx'
import Profile from './comp/profile.jsx'
import QRCode from './comp/qrcode.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'classes':
        return <Classes onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'students':
        return <Students onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'attendance':
        return <Attendance onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'reports':
        return <Reports onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'settings':
        return <Settings onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'profile':
        return <Profile onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'qrcode':
        return <QRCode onNavigate={setCurrentPage} currentPage={currentPage} />
      default:
        return <Dashboard onNavigate={setCurrentPage} currentPage={currentPage} />
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  )
}

export default App
