import { CATEGORY_KEYS, SYSTEM_MESSAGES } from '../engine/constants'
import { todayKey } from '../engine/dates'
import {
  allMartialMoves,
  applyFailure,
  applyVariationUpgrade,
  checkVariationUpgrade,
  getMartialTarget,
  nextPlankTarget,
  nextTargetOnSuccess,
} from '../engine/progression'

export function rolloverStateIfNeeded(state, addMessage = () => {}) {
  const today = todayKey()
  if (!state.meta.initialized) return { state, changed: false }
  if (state.meta.date === today) return { state, changed: false }

  const yesterdayComplete = CATEGORY_KEYS.every((key) => state[key].completedToday)
  const next = structuredClone(state)
  let lastDayXp = 0

  for (const key of CATEGORY_KEYS) {
    const category = next[key]
    if (category.completedToday) {
      category.consecutiveSuccess = (category.consecutiveSuccess || 0) + 1
      category.consecutiveFailures = 0
      if (key === 'core') {
        const plank = nextPlankTarget(category.target, category.sets)
        category.target = plank.target
        category.sets = plank.sets
      } else if (key === 'martial') {
        category.daysSinceIntro += 1
        const moves = allMartialMoves()
        const index = moves.findIndex((move) => move.id === category.currentMoveId)
        if (category.daysSinceIntro >= 10 && index < moves.length - 1) {
          category.moveHistory = [...(category.moveHistory || []), {
            moveId: category.currentMoveId,
            masteredDate: next.meta.date,
            peakReps: category.personalRecord || category.actualToday,
          }]
          const move = moves[index + 1]
          category.currentMoveId = move.id
          category.currentMoveName = move.name
          category.daysSinceIntro = 0
          category.fullTarget = /30/.test(move.desc) ? 30 : /40/.test(move.desc) ? 40 : 50
          addMessage(SYSTEM_MESSAGES.newMove(move.name), 'level')
        }
        category.target = getMartialTarget(category).target
      } else {
        category.target = nextTargetOnSuccess(category.target, category.level, category.unit)
      }
      if (key === 'strength') {
        const upgrade = checkVariationUpgrade(category)
        if (upgrade.shouldUpgrade) {
          const upgraded = applyVariationUpgrade(category, upgrade.nextVariationIndex)
          Object.assign(category, upgraded)
          addMessage(SYSTEM_MESSAGES.variationUpgrade(upgraded.exercise), 'level')
        }
      }
    } else {
      Object.assign(category, applyFailure(category))
      if (category.consecutiveFailures >= 5) addMessage(SYSTEM_MESSAGES.penaltyEscalate5(), 'failure')
      else if (category.consecutiveFailures >= 3) addMessage(SYSTEM_MESSAGES.penaltyEscalate3(), 'failure')
      else addMessage(SYSTEM_MESSAGES.penaltyHold(), 'warning')
    }
    lastDayXp += category.history?.find((entry) => entry.date === state.meta.date)?.xpEarned || 0
    category.completedToday = false
    category.actualToday = null
  }

  next.meta.date = today
  next.meta.startedAt = next.meta.startedAt || today
  next.meta.lastDayXp = lastDayXp
  next.meta.streak = yesterdayComplete ? (next.meta.streak || 0) + 1 : 0

  return { state: next, changed: true }
}
