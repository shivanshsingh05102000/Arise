import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function BootScreen({ onBegin }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1000)
    const handler = () => ready && onBegin()
    window.addEventListener('keydown', handler)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handler)
    }
  }, [onBegin, ready])

  return (
    <div className="boot-screen" onClick={() => ready && onBegin()}>
      {ready && (
        <div className="boot-core notification-frame">
          <div className="system-header">
            <span className="notice-icon">!</span>
            <span>NOTIFICATION</span>
          </div>
          <div className="boot-word">
            {'ARISE'.split('').map((letter, index) => (
              <motion.span key={letter} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }}>
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>
            A new hunter has been detected.
          </motion.p>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
            Beginning baseline assessment protocol...
          </motion.p>
          <motion.button className="press-any" initial={{ opacity: 0 }} animate={{ opacity: [0.35, 1, 0.35] }} transition={{ delay: 2.3, repeat: Infinity, duration: 1.4 }}>
            [ PRESS ANY KEY TO BEGIN ]
          </motion.button>
        </div>
      )}
    </div>
  )
}
