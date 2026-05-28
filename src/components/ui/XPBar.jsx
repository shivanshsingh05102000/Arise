import { xpRequired } from '../../engine/progression'

export default function XPBar({ level, xp, label }) {
  const required = xpRequired(level)
  const percent = Math.min(100, (xp / required) * 100)
  return (
    <div className="xp-wrap">
      <div className="xp-track">
        <div className="xp-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="xp-meta">
        <span>{label || `LEVEL ${level}`}</span>
        <span>{xp} / {required} XP</span>
      </div>
    </div>
  )
}
