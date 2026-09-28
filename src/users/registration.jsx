import { useState } from "react";
import { Save, UserRound } from "lucide-react";
const empty = {
  studentNumber: "",
  name: "",
  email: "",
  phone: "",
  enrollment: "",
  year: "",
};
export default function Registration({ student, saving, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    student
      ? {
          studentNumber: student.studentNumber,
          name: student.name,
          email: student.email,
          phone: student.phone || "",
          enrollment: student.enrollment,
          year: student.year,
        }
      : empty,
  );
  const fields = [
    ["studentNumber", "Student number"],
    ["name", "Full name"],
    ["email", "School email"],
    ["phone", "Phone number"],
    ["enrollment", "Class code"],
    ["year", "Year level"],
  ];
  return (
    <section className="student-card registration-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">
            {student ? "PROFILE DETAILS" : "STUDENT REGISTRATION"}
          </p>
          <h2>{student ? "Update your profile" : "Register to begin"}</h2>
        </div>
        <UserRound size={24} />
      </div>
      <p className="registration-help">
        Your details are saved in both the administrator records and the student
        portal database.
      </p>
      <form
        className="registration-form"
        onSubmit={(event) => {
          event.preventDefault();
          Promise.resolve(onSave(form)).then((saved) => {
            if (saved) onClose();
          });
        }}
      >
        {fields.map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              required={key !== "phone"}
              type={key === "email" ? "email" : "text"}
              value={form[key]}
              onChange={(event) =>
                setForm({ ...form, [key]: event.target.value })
              }
            />
          </label>
        ))}
        <button className="student-primary" disabled={saving}>
          <Save size={18} />
          {saving ? "Saving..." : student ? "Save profile" : "Register student"}
        </button>
      </form>
    </section>
  );
}
