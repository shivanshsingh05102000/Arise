import { Flame } from 'lucide-react'
import { CATEGORY_KEYS, CATEGORY_META } from '../../engine/constants'
import { displayDate } from '../../engine/dates'
import RankBadge from '../ui/RankBadge'
import XPBar from '../ui/XPBar'
import QuestCard from '../ui/QuestCard'

function minutesToReset() {
  const now = new Date()
  const reset = new Date(now)
  reset.setHours(24, 0, 0, 0)
  return Math.max(0, Math.ceil((reset - now) / 60000))
}

export default function QuestScreen({ state, derived, onSubmit }) {
  const resetMinutes = minutesToReset()
  return (
    <div className="screen quest-screen">
      <header className="quest-top">
        <div className="hunter-block">
          <RankBadge rank={derived.globalRank} />
          <div><span className="mono">HUNTER</span><h1>{state.meta.name}</h1></div>
        </div>
        <div className="date-block mono">{displayDate()}</div>
        <div className="streak-block mono">{state.meta.streak > 0 && <Flame size={16} />} ◆ {state.meta.streak} DAY STREAK</div>
      </header>
      {resetMinutes <= 30 && <div className="midnight-warning mono">[ DAILY RESET IN {resetMinutes} MINUTES ]</div>}
      <XPBar level={derived.globalLevel} xp={Math.round(CATEGORY_KEYS.reduce((sum, key) => sum + state[key].xp, 0) / CATEGORY_KEYS.length)} label={`GLOBAL LEVEL ${derived.globalLevel}`} />
      <section className="quest-grid">
        {CATEGORY_KEYS.map((key) => (
          <QuestCard key={key} categoryKey={key} meta={CATEGORY_META[key]} category={state[key]} streak={state.meta.streak} onSubmit={onSubmit} />
        ))}
      </section>
      <footer className="daily-footer">
        <strong>TODAY'S ABSORBED XP: {derived.todayXp}</strong>
        <p className="mono">"{derived.dailyQuote}"</p>
      </footer>
    </div>
  )
}
