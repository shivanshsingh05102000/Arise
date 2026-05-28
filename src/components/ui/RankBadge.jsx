const rankColors = {
  E: '#777987',
  D: '#44ff88',
  C: '#00aaff',
  B: '#9966ff',
  A: '#f0c866',
  S: '#ff4455',
}

export default function RankBadge({ rank, large = false }) {
  const name = typeof rank === 'string' ? rank : rank?.name
  return (
    <div className={`rank-badge ${large ? 'large' : ''}`} style={{ '--rank-color': rankColors[name] || rankColors.E }}>
      {name}
    </div>
  )
}
