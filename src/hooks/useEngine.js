import { useCallback, useEffect, useMemo, useState } from 'react'
import { CATEGORY_KEYS, CATEGORY_META, DAILY_QUOTES, SYSTEM_MESSAGES } from '../engine/constants'
import { buildStateFromAssessment } from '../engine/assessment'
import { daysBetween, todayKey } from '../engine/dates'
import { getState, resetState as resetStoredState, saveState } from '../engine/store'
import { applyXpGain, calculateQuestXp, rankForLevel, xpRequired } from '../engine/progression'
import { rolloverStateIfNeeded } from './useNewDay'

function totalLevel(state) {
  return Math.round(CATEGORY_KEYS.reduce((sum, key) => sum + state[key].level, 0) / CATEGORY_KEYS.length)
}

function completionCalendar(state) {
  const days = []
  const now = new Date(`${todayKey()}T00:00:00.000Z`)
  for (let offset = 89; offset >= 0; offset -= 1) {
    const date = new Date(now)
    date.setUTCDate(date.getUTCDate() - offset)
    const key = date.toISOString().slice(0, 10)
    const entries = CATEGORY_KEYS.map((cat) => state[cat].history?.find((entry) => entry.date === key)).filter(Boolean)
    const complete = entries.length === CATEGORY_KEYS.length
    const exceeded = complete && entries.every((entry) => entry.actual > entry.target)
    days.push({ date: key, status: exceeded ? 'exceeded' : complete ? 'complete' : entries.length ? 'partial' : 'empty' })
  }
  return days
}

function completionRate(state) {
  const calendar = completionCalendar(state)
  const active = calendar.filter((day) => day.status !== 'empty')
  if (!active.length) return 0
  return Math.round((active.filter((day) => day.status === 'complete' || day.status === 'exceeded').length / active.length) * 100)
}

function weeklySummary(state) {
  const calendar = completionCalendar(state).slice(-7)
  const daysCompleted = calendar.filter((day) => day.status === 'complete' || day.status === 'exceeded').length
  const totalXp = CATEGORY_KEYS.reduce((sum, key) => sum + (state[key].history || []).slice(-7).reduce((inner, entry) => inner + entry.xpEarned, 0), 0)
  const verdict = daysCompleted >= 6 ? 'HUNTER-GRADE WEEK' : daysCompleted >= 4 ? 'ACCEPTABLE PERFORMANCE' : 'BELOW MINIMUM STANDARD'
  return { daysCompleted, totalXp, verdict }
}

function hasDeloadAvailable(state) {
  const calendar = completionCalendar(state)
  const weeks = [calendar.slice(-21, -14), calendar.slice(-14, -7), calendar.slice(-7)]
  return weeks.every((week) => week.filter((day) => day.status === 'complete' || day.status === 'exceeded').length >= 6)
}

export function useEngine() {
  const [state, setState] = useState(null)
  const [messages, setMessages] = useState([])
  const [overlay, setOverlay] = useState(null)
  const [weeklyReport, setWeeklyReport] = useState(null)

  const addMessage = useCallback((text, type = 'success') => {
    const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setMessages((items) => [...items, { id, text, type }])
    setTimeout(() => setMessages((items) => items.filter((item) => item.id !== id)), 3200)
  }, [])

  const persist = useCallback(async (next) => {
    setState(next)
    await saveState(next)
  }, [])

  useEffect(() => {
    let cancelled = false
    getState().then(async (loaded) => {
      const result = rolloverStateIfNeeded(loaded, addMessage)
      const next = result.state
      if (result.changed) await saveState(next)
      const day = new Date().getDay()
      if (next.meta.initialized && (day === 0 || day === 1) && next.meta.lastWeeklyReport !== todayKey()) {
        setWeeklyReport(weeklySummary(next))
      }
      if (!cancelled) setState(next)
    })
    return () => { cancelled = true }
  }, [addMessage])

  const submitAssessment = useCallback(async (values, keepHistory = false) => {
    const next = buildStateFromAssessment(values, state, keepHistory)
    next.meta.startedAt = state?.meta?.startedAt || todayKey()
    await persist(next)
    addMessage(SYSTEM_MESSAGES.assessmentComplete(), 'level')
  }, [addMessage, persist, state])

  const submitQuest = useCallback(async (key, actualValue) => {
    const actual = Number(actualValue)
    if (!state || !Number.isFinite(actual) || actual <= 0) return
    const next = structuredClone(state)
    const category = next[key]
    if (category.completedToday) return

    const target = category.target
    const success = actual >= target
    const xpEarned = success ? calculateQuestXp(category.difficulty, target, actual, next.meta.streak) : 0
    const beforeRank = rankForLevel(category.level).name
    const xpState = success ? applyXpGain(category.level, category.xp, xpEarned) : { level: category.level, xp: category.xp, levelsGained: 0, totalBonusXp: 0 }

    category.completedToday = true
    category.actualToday = actual
    category.level = xpState.level
    category.xp = xpState.xp
    category.personalRecord = Math.max(category.personalRecord || 0, actual)
    category.history = [...(category.history || []), { date: todayKey(), target, actual, xpEarned, complete: success }].slice(-90)
    next.meta.totalXp += xpEarned + xpState.totalBonusXp

    if (success) {
      addMessage(SYSTEM_MESSAGES.questComplete(xpEarned), 'success')
      if (actual > target) addMessage(SYSTEM_MESSAGES.exceeded(), 'success')
      if (actual === category.personalRecord) addMessage(SYSTEM_MESSAGES.personalRecord(CATEGORY_META[key].label), 'level')
    } else {
      addMessage('[ QUEST FAILED - DEFICIENCY RECORDED ]', 'failure')
    }

    if (xpState.levelsGained > 0) {
      const afterRank = rankForLevel(xpState.level).name
      setOverlay({ category: CATEGORY_META[key].label, level: xpState.level, rank: beforeRank !== afterRank ? afterRank : null })
      addMessage(SYSTEM_MESSAGES.levelUp(xpState.level), 'level')
      if (beforeRank !== afterRank) addMessage(SYSTEM_MESSAGES.rankUp(afterRank), 'level')
    }

    if (CATEGORY_KEYS.every((categoryKey) => next[categoryKey].completedToday)) {
      addMessage(SYSTEM_MESSAGES.allComplete(), 'success')
    }

    await persist(next)
  }, [addMessage, persist, state])

  const retakeAssessment = useCallback(async () => {
    if (!state) return
    const next = { ...state, meta: { ...state.meta, initialized: false, retaking: true } }
    await persist(next)
  }, [persist, state])

  const fullReset = useCallback(async () => {
    const next = await resetStoredState()
    setState(next)
  }, [])

  const updateName = useCallback(async (name) => {
    const next = { ...state, meta: { ...state.meta, name: name || 'Hunter' } }
    await persist(next)
  }, [persist, state])

  const markWeeklySeen = useCallback(async () => {
    const next = { ...state, meta: { ...state.meta, lastWeeklyReport: todayKey() } }
    setWeeklyReport(null)
    await persist(next)
  }, [persist, state])

  const derived = useMemo(() => {
    if (!state) return null
    const level = totalLevel(state)
    return {
      globalLevel: level,
      globalRank: rankForLevel(Math.max(...CATEGORY_KEYS.map((key) => state[key].level))),
      averageRank: rankForLevel(level),
      requiredXp: xpRequired(level),
      todayXp: CATEGORY_KEYS.reduce((sum, key) => sum + (state[key].history?.find((entry) => entry.date === todayKey())?.xpEarned || 0), 0),
      dailyQuote: DAILY_QUOTES[daysBetween('2026-01-01', todayKey()) % DAILY_QUOTES.length],
      completionRate: completionRate(state),
      calendar: completionCalendar(state),
      deloadAvailable: hasDeloadAvailable(state),
      daysActive: state.meta.startedAt ? daysBetween(state.meta.startedAt, todayKey()) + 1 : 1,
    }
  }, [state])

  const clearOverlay = useCallback(() => setOverlay(null), [])

  return {
    state,
    derived,
    messages,
    overlay,
    weeklyReport,
    addMessage,
    clearOverlay,
    submitAssessment,
    submitQuest,
    retakeAssessment,
    fullReset,
    updateName,
    markWeeklySeen,
  }
}
