import { useEffect, useState } from 'react'
import { Maximize2, Minus, X } from 'lucide-react'
import { ErrorBoundary } from './components/ErrorBoundary'
import AssessmentScreen from './components/screens/AssessmentScreen'
import BootScreen from './components/screens/BootScreen'
import LibraryScreen from './components/screens/LibraryScreen'
import ProfileScreen from './components/screens/ProfileScreen'
import QuestScreen from './components/screens/QuestScreen'
import StatsScreen from './components/screens/StatsScreen'
import LevelUpOverlay from './components/ui/LevelUpOverlay'
import Sidebar from './components/ui/Sidebar'
import SystemMessage from './components/ui/SystemMessage'
import WeeklyReport from './components/ui/WeeklyReport'
import { useEngine } from './hooks/useEngine'

function Titlebar() {
  return (
    <div className="titlebar">
      <div className="wordmark">ARISE</div>
      <div className="window-controls">
        <button onClick={() => window.arise?.minimize()}><Minus size={15} /></button>
        <button onClick={() => window.arise?.maximize()}><Maximize2 size={14} /></button>
        <button className="close" onClick={() => window.arise?.close()}><X size={16} /></button>
      </div>
    </div>
  )
}

export default function App() {
  const engine = useEngine()
  const [screen, setScreen] = useState('quests')
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    if (!engine.overlay) return undefined
    const timer = setTimeout(engine.clearOverlay, 3000)
    return () => clearTimeout(timer)
  }, [engine.overlay, engine.clearOverlay])

  if (!engine.state || !engine.derived) return <div className="boot-screen"><div className="mono">[ LOADING SYSTEM CORE ]</div></div>

  if (!engine.state.meta.initialized && !bootDone) {
    return <BootScreen onBegin={() => setBootDone(true)} />
  }

  if (!engine.state.meta.initialized) {
    return (
      <>
        <Titlebar />
        <ErrorBoundary>
          <AssessmentScreen onSubmit={engine.submitAssessment} retake={engine.state.meta.retaking} />
        </ErrorBoundary>
        <SystemMessage messages={engine.messages} />
      </>
    )
  }

  const screens = {
    quests: <QuestScreen state={engine.state} derived={engine.derived} onSubmit={engine.submitQuest} />,
    stats: <StatsScreen state={engine.state} derived={engine.derived} />,
    library: <LibraryScreen state={engine.state} />,
    profile: <ProfileScreen state={engine.state} derived={engine.derived} onRetake={engine.retakeAssessment} onReset={engine.fullReset} onUpdateName={engine.updateName} />,
  }

  return (
    <div className="app-shell">
      <Titlebar />
      <Sidebar active={screen} onChange={setScreen} />
      <main className="content">
        <ErrorBoundary key={screen}>{screens[screen]}</ErrorBoundary>
      </main>
      <SystemMessage messages={engine.messages} />
      <LevelUpOverlay overlay={engine.overlay} onClose={engine.clearOverlay} />
      <WeeklyReport report={engine.weeklyReport} onClose={engine.markWeeklySeen} />
    </div>
  )
}
