import { Check } from 'lucide-react'
import { ENDURANCE_LADDER, MARTIAL_MOVES, STRENGTH_LADDER } from '../../engine/constants'

export default function LibraryScreen({ state }) {
  const mastered = new Map((state.martial.moveHistory || []).map((move) => [move.moveId, move]))
  return (
    <div className="screen library-screen">
      <h1>Movement Archive</h1>
      <section className="library-section">
        <h2>Strength Ladder</h2>
        <div className="library-grid">
          {STRENGTH_LADDER.map((move, index) => <Move key={move.id} name={move.name} desc={`Drop factor ${move.dropFactor}`} status={index === state.strength.variationIndex ? 'ACTIVE' : index < state.strength.variationIndex ? 'MASTERED' : 'LOCKED'} />)}
        </div>
      </section>
      <section className="library-section">
        <h2>Endurance Ladder</h2>
        <div className="library-grid">
          {ENDURANCE_LADDER.map((move, index) => <Move key={move.id} name={move.name} desc={`${move.targetKm} km target`} status={index === state.endurance.variationIndex ? 'ACTIVE' : index < state.endurance.variationIndex ? 'MASTERED' : 'LOCKED'} />)}
        </div>
      </section>
      <section className="library-section">
        <h2>Martial Arts</h2>
        {Object.entries(MARTIAL_MOVES).map(([rank, moves]) => (
          <div key={rank}>
            <h3>{rank}-RANK PHASE</h3>
            <div className="library-grid">
              {moves.map((move) => <Move key={move.id} name={move.name} desc={move.desc} rank={rank} mastered={mastered.get(move.id)} status={move.id === state.martial.currentMoveId ? 'ACTIVE' : mastered.has(move.id) ? 'MASTERED' : 'LOCKED'} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function Move({ name, desc, status, mastered, rank }) {
  return (
    <article className={`move-card ${status.toLowerCase()}`}>
      <div className="move-status">{status === 'MASTERED' && <Check size={14} />} {status}</div>
      <h3>{name}</h3>
      {rank && <span className="mono">{rank}-RANK</span>}
      <p>{desc}</p>
      {mastered && <small>MASTERED {mastered.masteredDate}</small>}
    </article>
  )
}
