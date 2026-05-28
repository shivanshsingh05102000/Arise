import { AnimatePresence, motion } from 'framer-motion'

export default function SystemMessage({ messages }) {
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`system-toast ${message.type}`}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
          >
            {message.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
