import { useEffect, useState } from "react";
import { Menu, Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import Sidebar from "./sidebar.jsx";
import { apiRequest } from "../api.js";
import "../App.css";
import "../styles/students.css";

const emptyStudent = {
  studentNumber: "",
  name: "",
  email: "",
  enrollment: "",
  year: "",
};

const Students = ({ onNavigate, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyStudent);

  const loadStudents = async (term = search) => {
    try {
      setStudents(
        (await apiRequest("students", { query: { search: term } })).students,
      );
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    apiRequest("students", { query: { search: "" } })
      .then((data) => setStudents(data.students))
      .catch((error) => alert(error.message));
  }, []);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setForm({
      studentNumber: student.studentNumber,
      name: student.name,
      email: student.email,
      enrollment: student.enrollment,
      year: student.year,
    });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student and their attendance records?"))
      return;
    try {
      await apiRequest("students", { method: "DELETE", query: { id } });
      loadStudents();
    } catch (error) {
      alert(error.message);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiRequest("students", {
        method: editingStudent.id ? "PUT" : "POST",
        query: editingStudent.id ? { id: editingStudent.id } : undefined,
        body: form,
      });
      setEditingStudent(null);
      loadStudents();
    } catch (error) {
      alert(error.message);
    }
  };
  const handleNavigate = (page) => {
    setIsSidebarOpen(false);
    onNavigate(page);
  };

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
          <h1>STUDENTS</h1>
          <button
            className="students-style-1"
            onClick={() => {
              setEditingStudent({ id: 0 });
              setForm(emptyStudent);
            }}
          >
            <Plus size={20} /> Add Student
          </button>
        </header>
        <div className="students-style-2">
          <div className="students-style-3">
            <div className="students-style-4">
              <Search size={18} className="students-style-5" />
              <input
                type="text"
                placeholder="Search students..."
                className="students-style-6"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  loadStudents(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="students-style-7">
            <table className="students-style-8">
              <thead>
                <tr className="students-style-9">
                  <th className="students-style-10">Name</th>
                  <th className="students-style-11">Email</th>
                  <th className="students-style-13">Class</th>
                  <th className="students-style-14">Year</th>
                  <th className="students-style-15">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="students-style-16">
                    <td className="students-style-17">{student.name}</td>
                    <td className="students-style-18">
                      <div className="table-cell-content">
                        <Mail size={16} />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td className="students-style-19">
                      <div className="table-cell-content">
                        <Phone size={16} />
                        <span>{student.phone}</span>
                      </div>
                    </td>
                    <td className="students-style-20">{student.enrollment}</td>
                    <td className="students-style-21">{student.year}</td>
                    <td className="students-style-22">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(student)}
                          className="students-style-23"
                          aria-label={`Edit ${student.name}`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="students-style-24"
                          aria-label={`Delete ${student.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {editingStudent && (
          <div className="students-modal-backdrop">
            <form className="students-modal" onSubmit={handleSubmit}>
              <h2>{editingStudent.id ? "Edit Student" : "Add Student"}</h2>
              {[
                ["studentNumber", "Student ID"],
                ["name", "Name"],
                ["email", "Email"],
                ["enrollment", "Class"],
                ["year", "Year"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    required
                    value={form[key]}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.value })
                    }
                  />
                </label>
              ))}
              <div className="students-modal-actions">
                <button type="button" onClick={() => setEditingStudent(null)}>
                  Cancel
                </button>
                <button type="submit">Save Student</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Students;
