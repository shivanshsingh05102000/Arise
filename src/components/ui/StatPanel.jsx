import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import XPBar from './XPBar'

export default function StatPanel({ label, color, category }) {
  const data = (category.history || []).slice(-30)
  const best = Math.max(0, ...(category.history || []).map((entry) => entry.actual))
  return (
    <section className="stat-panel">
      <div className="stat-head">
        <div>
          <span className="category-label" style={{ color }}>{label}</span>
          <h2>{category.exercise || category.currentMoveName}</h2>
        </div>
        <strong>LV {category.level}</strong>
      </div>
      <XPBar level={category.level} xp={category.xp} />
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis stroke="#554e7a" />
            <Tooltip contentStyle={{ background: '#080612', border: '1px solid #4a3a8a', color: '#e8e4ff' }} />
            <Line type="monotone" dataKey="target" stroke="#9990cc" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="actual" stroke={color} dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="stat-grid">
        <span>Target {category.target} {category.unit}</span>
        <span>Best {best} {category.unit}</span>
        <span>Success {category.consecutiveSuccess}</span>
        <span>Failure {category.consecutiveFailures}</span>
      </div>
    </section>
  )
}
