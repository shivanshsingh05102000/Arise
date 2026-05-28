import { CATEGORY_KEYS, CATEGORY_META } from '../../engine/constants'
import RankBadge from '../ui/RankBadge'
import StatPanel from '../ui/StatPanel'

export default function StatsScreen({ state, derived }) {
  return (
    <div className="screen stats-screen">
      <section className="overview-panel">
        <RankBadge rank={derived.globalRank} large />
        <div><span className="mono">TOTAL XP</span><strong>{state.meta.totalXp}</strong></div>
        <div><span className="mono">DAYS ACTIVE</span><strong>{derived.daysActive}</strong></div>
        <div><span className="mono">COMPLETION RATE</span><strong>{derived.completionRate}%</strong></div>
      </section>
      {derived.deloadAvailable && (
        <div className="deload-box mono">
          [ DELOAD WEEK AVAILABLE ] Research indicates recovery weeks every 4 weeks reduce injury risk and improve long-term adaptation. The System recommends a 40% volume reduction this week. This is not weakness. This is optimization.
        </div>
      )}
      <section className="calendar">
        {derived.calendar.map((day) => <span key={day.date} title={`${day.date} ${day.status}`} className={day.status} />)}
      </section>
      <div className="stat-list">
        {CATEGORY_KEYS.map((key) => <StatPanel key={key} label={CATEGORY_META[key].label} color={CATEGORY_META[key].color} category={state[key]} />)}
      </div>
    </div>
  )
}
