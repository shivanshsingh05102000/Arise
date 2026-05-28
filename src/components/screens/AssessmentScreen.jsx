import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const steps = [
  { key: 'name', label: 'HUNTER NAME', placeholder: 'ENTER DESIGNATION', type: 'text' },
  { key: 'pushups', label: 'PUSH-UP MAX (to failure)', subtext: 'Perform max reps without stopping. Record your honest count.', type: 'number' },
  { key: 'squats', label: 'SQUAT MAX (to failure)', subtext: 'Perform max reps without stopping. Record your honest count.', type: 'number' },
  { key: 'plank', label: 'PLANK HOLD', subtext: 'Hold until form breaks. Record seconds.', type: 'number' },
  { key: 'mile', label: '1-MILE TIME', subtext: 'Walk/run 1 mile. Record total minutes.', type: 'number', step: '0.1' },
  { key: 'rpe', label: 'PERCEIVED DIFFICULTY', subtext: 'How hard was the hardest test? 1 = trivial, 10 = maximum effort', type: 'range' },
]

export default function AssessmentScreen({ onSubmit, retake }) {
  const [index, setIndex] = useState(0)
  const [values, setValues] = useState({ name: '', pushups: '', squats: '', plank: '', mile: '', rpe: 7 })
  const [flash, setFlash] = useState(false)
  const step = steps[index]

  async function confirm() {
    if (index < steps.length - 1) {
      setIndex(index + 1)
      return
    }
    setFlash(true)
    await onSubmit(values, retake)
  }

  return (
    <div className={`screen assessment-screen ${flash ? 'flash' : ''}`}>
      <div className="assessment-panel">
        <div className="wizard-top">
          <span className="mono">STEP {index + 1} OF {steps.length}</span>
          {index > 0 && <button className="icon-button" onClick={() => setIndex(index - 1)}><ArrowLeft size={18} /></button>}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="wizard-step">
            <label>{step.label}</label>
            {step.subtext && <p>{step.subtext}</p>}
            {step.type === 'range' ? (
              <div className="range-wrap">
                <input type="range" min="1" max="10" value={values.rpe} onChange={(event) => setValues({ ...values, rpe: event.target.value })} />
                <strong>{values.rpe}</strong>
              </div>
            ) : (
              <input autoFocus type={step.type} step={step.step || '1'} placeholder={step.placeholder || 'ENTER VALUE'} value={values[step.key]} onChange={(event) => setValues({ ...values, [step.key]: event.target.value })} />
            )}
            <button className="system-button" onClick={confirm}>[ CONFIRM ]</button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
