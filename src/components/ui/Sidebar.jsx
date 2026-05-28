import { BarChart3, BookOpen, Dumbbell, IdCard } from 'lucide-react'

const items = [
  { id: 'quests', label: 'Quests', icon: Dumbbell },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: IdCard },
]

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="sidebar">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} className={active === id ? 'active' : ''} onClick={() => onChange(id)} title={label}>
          <Icon size={19} />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  )
}
