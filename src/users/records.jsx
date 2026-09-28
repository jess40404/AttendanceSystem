export default function UserRecords({ summary }) {
  const rate = Number(summary.rate || 0).toFixed(1);
  return (
    <section className="student-card records-card">
      <p className="eyebrow">ATTENDANCE RECORDS</p>
      <h2>{rate}%</h2>
      <p>
        Your percentage is calculated from recorded attendance: Present = 1,
        Late = 0.5, Absent = 0.
      </p>
      <div className="record-metrics">
        <div>
          <b>{summary.total}</b>
          <span>Total classes</span>
        </div>
        <div>
          <b>{summary.present}</b>
          <span>Present</span>
        </div>
        <div>
          <b>{summary.late}</b>
          <span>Late</span>
        </div>
        <div>
          <b>{summary.absent}</b>
          <span>Absent</span>
        </div>
      </div>
    </section>
  );
}
