export default function WeeklyReport({ report, onClose }) {
  if (!report) return null
  return (
    <div className="modal-backdrop">
      <section className="weekly-modal">
        <p className="mono">[ WEEKLY REPORT ]</p>
        <h1>{report.verdict}</h1>
        <div className="report-grid">
          <span>Days completed</span><strong>{report.daysCompleted}/7</strong>
          <span>Total XP earned</span><strong>{report.totalXp}</strong>
          <span>System verdict</span><strong>{report.verdict}</strong>
        </div>
        <button className="system-button" onClick={onClose}>ACKNOWLEDGE</button>
      </section>
    </div>
  )
}
