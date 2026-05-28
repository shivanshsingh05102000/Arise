import { todayKey } from './dates'
import { createDefaultState } from './defaults'

export function buildStateFromAssessment(values, previousState = null, keepHistory = false) {
  const state = createDefaultState()
  const pushups = Number(values.pushups) || 0
  const squats = Number(values.squats) || 0
  const plank = Number(values.plank) || 0
  const mile = Number(values.mile) || 99

  state.meta.initialized = true
  state.meta.name = String(values.name || 'Hunter').trim() || 'Hunter'
  state.meta.date = todayKey()
  state.strength.target = Math.max(1, Math.floor(pushups * 0.8))
  state.legs.target = Math.max(1, Math.floor(squats * 0.8))
  state.core.target = Math.max(10, Math.floor(plank * 0.8))
  state.endurance.target = mile <= 10 ? 1.6 : mile <= 15 ? 1.2 : 1.0
  state.martial.target = 20
  state.martial.fullTarget = 50

  if (keepHistory && previousState) {
    state.meta.totalXp = previousState.meta?.totalXp || 0
    for (const key of ['strength', 'legs', 'core', 'endurance', 'martial']) {
      state[key].history = previousState[key]?.history || []
      state[key].personalRecord = previousState[key]?.personalRecord || null
    }
  }

  return state
}
