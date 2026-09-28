import { BookOpen, Clock3 } from "lucide-react";
export default function UserSubjects({ subjects }) {
  return (
    <section className="student-card">
      <p className="eyebrow">ENROLLMENT</p>
      <h2>My subjects</h2>
      <div className="subject-grid">
        {subjects.map((subject) => (
          <article className="subject-item" key={subject.id}>
            <BookOpen size={22} />
            <div>
              <h3>{subject.classCode}</h3>
              <p>{subject.name}</p>
              <small>
                <Clock3 size={14} /> {subject.schedule}
              </small>
              <small>{subject.roomLocation}</small>
            </div>
          </article>
        ))}
        {!subjects.length && (
          <p className="empty-state">
            Register on the Home page to view your assigned subjects.
          </p>
        )}
      </div>
    </section>
  );
}
