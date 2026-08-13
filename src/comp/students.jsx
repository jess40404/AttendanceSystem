import React, { useState } from 'react';
import { Menu, Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
const Students = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState([{
    id: 1,
    name: 'Juan Dela Cruz',
    email: 'juan.cruz@student.com',
    phone: '09123456789',
    enrollment: 'CS101',
    year: '1st Year'
  }, {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@student.com',
    phone: '09987654321',
    enrollment: 'IT204',
    year: '2nd Year'
  }, {
    id: 3,
    name: 'Kyle Reyes',
    email: 'kyle.reyes@student.com',
    phone: '09555123456',
    enrollment: 'CS301',
    year: '3rd Year'
  }]);
  const handleEdit = id => {
    console.log('Edit student:', id);
  };
  const handleDelete = id => {
    setStudents(students.filter(s => s.id !== id));
    console.log('Deleted student:', id);
  };
  const handleAddStudent = () => {
    console.log('Add new student');
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
          <h1>Students</h1>
          <button className="btn-primary students-style-1" onClick={handleAddStudent}>
            <Plus size={20} />
            Add Student
          </button>
        </header>

        <div className="students-style-2">
          <div className="students-style-3">
            <div className="students-style-4">
              <Search size={18} className="students-style-5" />
              <input type="text" placeholder="Search students..." className="students-style-6" />
            </div>
          </div>

          <div className="students-style-7">
            <table className="students-style-8">
              <thead>
                <tr className="students-style-9">
                  <th className="students-style-10">Name</th>
                  <th className="students-style-11">Email</th>
                  <th className="students-style-12">Phone</th>
                  <th className="students-style-13">Class</th>
                  <th className="students-style-14">Year</th>
                  <th className="students-style-15">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => <tr key={student.id} className="students-style-16">
                    <td className="students-style-17">{student.name}</td>
                    <td className="students-style-18">
                      <Mail size={16} /> {student.email}
                    </td>
                    <td className="students-style-19">
                      <Phone size={16} /> {student.phone}
                    </td>
                    <td className="students-style-20">{student.enrollment}</td>
                    <td className="students-style-21">{student.year}</td>
                    <td className="students-style-22">
                      <button onClick={() => handleEdit(student.id)} className="students-style-23">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="students-style-24">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>;
};
export default Students;
