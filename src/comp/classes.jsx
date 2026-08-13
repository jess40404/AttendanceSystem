import React, { useState } from 'react';
import { Menu, Search, Plus, Edit, Trash2, Users, Clock } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
const Classes = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([{
    id: 1,
    name: 'CS 101 - Introduction to Programming',
    instructor: 'Prof. Jane Smith',
    time: '8:00 AM - 9:30 AM',
    room: 'A101'
  }, {
    id: 2,
    name: 'IT 204 - Database Systems',
    instructor: 'Prof. Mark Johnson',
    time: '10:00 AM - 11:30 AM',
    room: 'B205'
  }, {
    id: 3,
    name: 'CS 301 - Data Structures',
    instructor: 'Prof. Jane Smith',
    time: '1:00 PM - 2:30 PM',
    room: 'A101'
  }]);
  const handleEdit = id => {
    console.log('Edit class:', id);
  };
  const handleDelete = id => {
    setClasses(classes.filter(c => c.id !== id));
    console.log('Deleted class:', id);
  };
  const handleAddClass = () => {
    console.log('Add new class');
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
          <h1>Classes</h1>
          <button className="btn-primary classes-style-1" onClick={handleAddClass}>
            <Plus size={20} />
            Add Class
          </button>
        </header>

        <div className="classes-style-2">
          <div className="classes-style-3">
            <div className="classes-style-4">
              <Search size={18} className="classes-style-5" />
              <input type="text" placeholder="Search classes..." className="classes-style-6" />
            </div>
          </div>

          <div className="classes-style-7">
            <table className="classes-style-8">
              <thead>
                <tr className="classes-style-9">
                  <th className="classes-style-10">Class Name</th>
                  <th className="classes-style-11">Instructor</th>
                  <th className="classes-style-12">Time</th>
                  <th className="classes-style-14">Room</th>
                  <th className="classes-style-15">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => <tr key={cls.id} className="classes-style-16">
                    <td className="classes-style-17">{cls.name}</td>
                    <td className="classes-style-18">{cls.instructor}</td>
                    <td className="classes-style-19">
                      <Clock size={16} /> {cls.time}
                    </td>
                   
                    <td className="classes-style-21">{cls.room}</td>
                    <td className="classes-style-22">
                      <button onClick={() => handleEdit(cls.id)} className="classes-style-23">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="classes-style-24">
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
export default Classes;
