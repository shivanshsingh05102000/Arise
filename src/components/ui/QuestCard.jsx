import { Check, Skull, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calculateQuestXp } from '../../engine/progression'

export default function QuestCard({ categoryKey, meta, category, streak, onSubmit }) {
  const [actual, setActual] = useState('')
  const completed = category.completedToday
  const preview = useMemo(() => {
    const value = Number(actual)
    if (!Number.isFinite(value) || value <= 0) return calculateQuestXp(category.difficulty, category.target, category.target, streak)
    if (value < category.target) return 0
    return calculateQuestXp(category.difficulty, category.target, value, streak)
  }, [actual, category, streak])
  const failed = completed && category.actualToday < category.target
  const target = category.unit === 'km'
    ? `${category.target} km`
    : `${category.sets} x ${category.target} ${category.unit}`

  return (
    <article className={`quest-card ${completed ? failed ? 'failed' : 'complete' : ''}`} style={{ '--accent': meta.color }}>
      <div className="quest-accent" />
      <div className="quest-head">
        <span className="category-label">{meta.label}</span>
        <span className={`status ${completed ? failed ? 'failed' : 'complete' : 'pending'}`}>
          {completed ? failed ? 'FAILED' : 'COMPLETE' : 'PENDING'}
        </span>
      </div>
      <h2>{categoryKey === 'martial' ? category.currentMoveName : category.exercise}</h2>
      <div className="target-line">{target}</div>
      {categoryKey === 'martial' && category.daysSinceIntro < 2 && <div className="learning">[ FORM LEARNING ] Today is about form, not volume.</div>}
      {category.consecutiveFailures === 2 && <div className="warning-badge"><TriangleAlert size={14} /> WARNING: ESCALATION IN 1 DAY</div>}
      <div className="quest-stats">
        <span>SUCCESS {category.consecutiveSuccess}</span>
        <span>FAIL {category.consecutiveFailures}</span>
        <span>PR: {category.personalRecord || 0} {category.unit}</span>
      </div>
      <div className="quest-input">
        <input disabled={completed} value={completed ? category.actualToday : actual} onChange={(event) => setActual(event.target.value)} type="number" min="0" step={category.unit === 'km' ? '0.1' : '1'} placeholder="ACTUAL" />
        <button disabled={completed} onClick={() => onSubmit(categoryKey, actual)}>
          {completed ? failed ? <Skull size={16} /> : <Check size={16} /> : 'SUBMIT'}
        </button>
      </div>
      <div className="xp-preview">+{completed ? category.history?.at(-1)?.xpEarned || 0 : preview} XP</div>
    </article>
  )
}
