const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export default function UserHistory({ history }) {
  return (
    <section className="student-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">STUDENT DATABASE RECORDS</p>
          <h2>Attendance history</h2>
        </div>
        <span className="record-count">{history.length} records</span>
      </div>
      <div className="student-table-wrap">
        <table className="student-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Time in</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.date)}</td>
                <td>
                  <b>{item.classCode}</b>
                  <small>{item.subjectName}</small>
                </td>
                <td>{item.time || "—"}</td>
                <td>
                  <span className={`status-tag ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {!history.length && (
              <tr>
                <td colSpan="4" className="empty-state">
                  No attendance history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
