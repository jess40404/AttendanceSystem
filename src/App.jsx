import './App.css'
import { useState } from 'react'
import Login from './admin/login.jsx'
import Signup from './admin/signup.jsx'
import Home from './admin/home.jsx'
import Students from './admin/students.jsx'
import Attendance from './admin/attendance.jsx'
import Reports from './admin/reports.jsx'
import Settings from './admin/settings.jsx'
import Profile from './admin/profile.jsx'
import QRCode from './admin/qrcode.jsx'

import Users from './users.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const requestedPage = new URLSearchParams(window.location.search).get('page')
    return requestedPage === 'users' ? 'users' : 'home'
  })

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} currentPage={currentPage} />
      case 'signup':
        return <Signup onNavigate={setCurrentPage} />
      case 'home':
        return <Home onNavigate={setCurrentPage} currentPage={currentPage} />
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
      case 'users':
        return <Users onNavigate={setCurrentPage} currentPage={currentPage} />
      default:
        return <Home onNavigate={setCurrentPage} currentPage={currentPage} />
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  )
}

export default App
