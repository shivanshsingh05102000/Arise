export function createDefaultState() {
  return {
    meta: {
      initialized: false,
      name: 'Hunter',
      date: null,
      streak: 0,
      totalXp: 0,
      lastDayXp: 0,
      startedAt: null,
      lastWeeklyReport: null,
    },
    strength: {
      level: 1, xp: 0, exercise: 'Standard Push-Up', variationIndex: 0, target: 8, sets: 3, unit: 'reps', difficulty: 1.0,
      consecutiveSuccess: 0, consecutiveFailures: 0, completedToday: false, actualToday: null, history: [], personalRecord: null,
    },
    legs: {
      level: 1, xp: 0, exercise: 'Bodyweight Squat', variationIndex: 0, target: 16, sets: 3, unit: 'reps', difficulty: 1.0,
      consecutiveSuccess: 0, consecutiveFailures: 0, completedToday: false, actualToday: null, history: [], personalRecord: null,
    },
    core: {
      level: 1, xp: 0, exercise: 'Plank Hold', target: 30, sets: 1, unit: 'sec', difficulty: 0.8,
      consecutiveSuccess: 0, consecutiveFailures: 0, completedToday: false, actualToday: null, history: [], personalRecord: null,
    },
    endurance: {
      level: 1, xp: 0, exercise: 'Walk/Run Intervals', variationIndex: 0, target: 1.0, sets: 1, unit: 'km', difficulty: 1.2,
      consecutiveSuccess: 0, consecutiveFailures: 0, completedToday: false, actualToday: null, history: [], personalRecord: null,
    },
    martial: {
      level: 1, xp: 0, currentMoveId: 'jab', currentMoveName: 'Jab', daysSinceIntro: 0, target: 20, fullTarget: 50,
      sets: 1, unit: 'reps', difficulty: 0.9, consecutiveSuccess: 0, consecutiveFailures: 0,
      completedToday: false, actualToday: null, history: [], moveHistory: [], personalRecord: null,
    },
  }
}

export function normalizeState(saved, defaults = createDefaultState()) {
  if (!saved || typeof saved !== 'object') return defaults
  if (Array.isArray(saved) || Array.isArray(defaults)) return saved ?? defaults
  const out = { ...defaults }
  for (const [key, value] of Object.entries(saved)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && defaults[key] && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
      out[key] = normalizeState(value, defaults[key])
    } else {
      out[key] = value
    }
  }
  return out
}
