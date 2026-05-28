import { useState } from 'react'
import RankBadge from '../ui/RankBadge'

export default function ProfileScreen({ state, derived, onRetake, onReset, onUpdateName }) {
  const [name, setName] = useState(state.meta.name)
  const [confirming, setConfirming] = useState(false)
  return (
    <div className="screen profile-screen">
      <section className="hunter-card">
        <RankBadge rank={derived.globalRank} large />
        <div>
          <span className="mono">HUNTER IDENTIFICATION</span>
          <h1>{state.meta.name}</h1>
          <p>GLOBAL LEVEL {derived.globalLevel} / {derived.globalRank.name}-RANK</p>
        </div>
        <div className="id-stats">
          <span>{derived.daysActive} DAYS ACTIVE</span>
          <span>{state.meta.totalXp} TOTAL XP</span>
          <span>{derived.completionRate}% COMPLETION</span>
        </div>
      </section>
      <section className="settings-panel">
        <h2>Settings</h2>
        <label>Hunter name</label>
        <div className="inline-control">
          <input value={name} onChange={(event) => setName(event.target.value)} />
          <button className="system-button" onClick={() => onUpdateName(name)}>SAVE</button>
        </div>
        <button className="system-button" onClick={onRetake}>RESET ASSESSMENT</button>
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          {!confirming ? (
            <button onClick={() => setConfirming(true)}>FULL RESET</button>
          ) : (
            <div className="inline-control"><span className="mono">CONFIRM WIPE?</span><button onClick={onReset}>YES, RESET</button><button onClick={() => setConfirming(false)}>CANCEL</button></div>
          )}
        </div>
      </section>
    </div>
  )
}
