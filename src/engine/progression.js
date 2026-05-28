import { MARTIAL_MOVES, RANKS, STRENGTH_LADDER, XP_BASE, XP_GROWTH } from './constants'

function roundTarget(value, unit) {
  if (unit === 'km') return Math.max(0.1, Math.round(value * 10) / 10)
  return Math.max(1, Math.ceil(value))
}

/**
 * Returns the configured rank tier that contains a level.
 * @param {number} level Current category level.
 * @returns {{name:string,min:number,max:number,multiplier:number,weeklyRate:number}} Rank configuration.
 */
export function rankForLevel(level) {
  return RANKS.find((rank) => level >= rank.min && level <= rank.max) || RANKS[RANKS.length - 1]
}

/**
 * Calculates the XP required to advance from the supplied level to the next level.
 * @param {number} level Current category level.
 * @returns {number} XP required for the next level.
 */
export function xpRequired(level) {
  return Math.round(XP_BASE * Math.pow(XP_GROWTH, level - 1))
}

/**
 * Applies earned XP to a category, handling multiple level-ups and the level cap.
 * Level-up bonus XP is returned only through totalBonusXp; it is not added to the live XP pool.
 * @param {number} currentLevel Current category level.
 * @param {number} currentXp Current XP in the level progress pool.
 * @param {number} earnedXp XP earned by the quest.
 * @returns {{level:number,xp:number,levelsGained:number,totalBonusXp:number}} Updated XP state.
 */
export function applyXpGain(currentLevel, currentXp, earnedXp) {
  let level = Math.min(100, currentLevel)
  let xp = Math.max(0, currentXp + earnedXp)
  let levelsGained = 0

  while (level < 100 && xp >= xpRequired(level)) {
    xp -= xpRequired(level)
    level += 1
    levelsGained += 1
  }

  if (level >= 100) xp = 0
  return { level, xp, levelsGained, totalBonusXp: levelsGained * 500 }
}

/**
 * Calculates quest XP from difficulty, target completion, actual completion, and streak.
 * @param {number} difficulty Difficulty coefficient.
 * @param {number} target Assigned target.
 * @param {number} actual Actual completed amount.
 * @param {number} streakDays Current daily streak.
 * @returns {number} Rounded XP award.
 */
export function calculateQuestXp(difficulty, target, actual, streakDays) {
  let xp = difficulty * actual
  if (actual === target) xp *= 1.2
  if (actual > target) xp *= 1.5
  xp *= 1 + Math.min(streakDays, 10) * 0.05
  return Math.max(1, Math.round(xp))
}

/**
 * Calculates the next target after a successful day using the rank multiplier.
 * @param {number} currentTarget Current target value.
 * @param {number} level Current category level.
 * @param {string} unit Unit type, with km receiving decimal rounding.
 * @returns {number} Next target value.
 */
export function nextTargetOnSuccess(currentTarget, level, unit) {
  const next = currentTarget * rankForLevel(level).multiplier
  return roundTarget(next, unit)
}

/**
 * Applies failure escalation to a category without mutating the original object.
 * @param {object} category Category state.
 * @returns {object} Category state with updated target and failure counters.
 */
export function applyFailure(category) {
  const failures = (category.consecutiveFailures || 0) + 1
  let target = category.target
  if (failures >= 5) target = roundTarget(target * 1.10, category.unit)
  else if (failures >= 3) target = roundTarget(target * 1.05, category.unit)
  return { ...category, target, consecutiveFailures: failures, consecutiveSuccess: 0 }
}

/**
 * Calculates the next plank target and set count after success.
 * @param {number} currentTarget Current plank seconds per assignment.
 * @param {number} currentSets Current set count.
 * @returns {{target:number,sets:number}} Next plank target and sets.
 */
export function nextPlankTarget(currentTarget, currentSets) {
  const total = currentTarget + 5
  if (total > 90) return { target: Math.ceil(total / 2), sets: 2 }
  return { target: total, sets: currentSets }
}

/**
 * Determines whether a strength category has earned a variation upgrade.
 * @param {object} category Strength category state.
 * @returns {{shouldUpgrade:boolean,nextVariationIndex:number}} Upgrade decision.
 */
export function checkVariationUpgrade(category) {
  const nextVariationIndex = (category.variationIndex || 0) + 1
  return {
    shouldUpgrade: category.consecutiveSuccess >= 3 && category.sets >= 3 && nextVariationIndex < STRENGTH_LADDER.length,
    nextVariationIndex,
  }
}

/**
 * Applies a strength variation upgrade using the ladder drop factor.
 * @param {object} category Strength category state.
 * @param {number} ladderIndex New ladder index.
 * @returns {object} Updated strength category.
 */
export function applyVariationUpgrade(category, ladderIndex) {
  const variation = STRENGTH_LADDER[ladderIndex] || STRENGTH_LADDER[category.variationIndex || 0]
  return {
    ...category,
    exercise: variation.name,
    variationIndex: ladderIndex,
    target: roundTarget(category.target * variation.dropFactor, category.unit),
    sets: Math.max(1, category.sets - variation.setsDrop),
    consecutiveSuccess: 0,
  }
}

/**
 * Calculates the active martial arts target, including form-learning days and success bumps.
 * @param {object} category Martial category state.
 * @returns {{target:number,isLearning:boolean}} Active martial target metadata.
 */
export function getMartialTarget(category) {
  const isLearning = category.daysSinceIntro < 2
  const base = isLearning ? Math.floor(category.fullTarget * 0.40) : category.fullTarget
  const bonus = Math.floor((category.consecutiveSuccess || 0) / 3) * 10
  return { target: Math.max(1, base + bonus), isLearning }
}

/**
 * Returns the flat martial move list in rank order.
 * @returns {Array<object>} Martial move records with rank fields.
 */
export function allMartialMoves() {
  return Object.entries(MARTIAL_MOVES).flatMap(([rank, moves]) => moves.map((move) => ({ ...move, rank })))
}
