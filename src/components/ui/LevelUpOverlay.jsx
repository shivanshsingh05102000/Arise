import { AnimatePresence, motion } from 'framer-motion'

export default function LevelUpOverlay({ overlay, onClose }) {
  return (
    <AnimatePresence>
      {overlay && (
        <motion.div
          className="level-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="shimmer-field" />
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="level-core">
            <p className="mono">[ LEVEL UP ]</p>
            <h1>{overlay.category}</h1>
            <h2>LEVEL {overlay.level}</h2>
            {overlay.rank && <p className="rank-up">[ RANK UP: {overlay.rank}-RANK ]</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
