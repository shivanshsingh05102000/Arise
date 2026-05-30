/**
 * ARISE Engine — XP (Experience Points) System
 *
 * Exponential levelling curve inspired by classic RPG progression.
 *
 * Core formula:
 *   XP_required(N) = floor(BASE_XP × GROWTH_RATE ^ (N − 1))
 *
 * With BASE_XP = 100 and GROWTH_RATE = 1.15, early levels are forgiving
 * (~100 XP) while the grind to S-Rank becomes punishing (~8,000+ XP).
 * Level 100 is the hard cap — XP required is Infinity (unreachable).
 *
 * Quest XP awards stack multiplicative bonuses on top of a base value
 * derived from difficulty and reps completed.
 */

// ─── Constants ───────────────────────────────────────────────────────

/** Base XP needed for level 1 → 2. */
const BASE_XP = 100;

/** Geometric growth rate per level. 1.15 ≈ +15% per level. */
const GROWTH_RATE = 1.15;

/** Hard level cap. Beyond this, no further levelling is possible. */
const MAX_LEVEL = 100;

/**
 * All bonus constants used in quest XP calculations.
 * Exposed so the UI can display these to the player.
 */
export const XP_BONUSES = {
  /** Multiplier when reps completed === target exactly. */
  EXACT_TARGET_MULTIPLIER: 1.20,
  /** Multiplier when reps completed > target. */
  EXCEED_TARGET_MULTIPLIER: 1.50,
  /** Additive bonus per consecutive streak day (5% = 0.05). */
  STREAK_BONUS_PER_DAY: 0.05,
  /** Maximum streak multiplier cap (50% bonus = 0.50). */
  STREAK_BONUS_CAP: 0.50,
  /** Number of streak days to reach the cap. */
  STREAK_CAP_DAYS: 10,
  /** One-time flat XP for mastering a new exercise variation. */
  NEW_VARIATION_XP: 200,
  /** Flat XP bonus when the player ranks up. */
  RANK_UP_XP: 500,
  /** Fraction of earned XP lost on a failed quest (God Mode). */
  FAIL_PENALTY_FRACTION: 0.25,
  /** Additional flat XP loss after 3+ consecutive fails (God Mode). */
  CONSECUTIVE_FAIL_PENALTY: 100,
  /** Consecutive fail threshold for the additional penalty. */
  CONSECUTIVE_FAIL_THRESHOLD: 3,
} as const;

// ─── Level XP Curve ──────────────────────────────────────────────────

/**
 * Calculate the total XP required to advance from `level` to `level + 1`.
 *
 * Formula: floor(100 × 1.15^(level − 1))
 *
 * At the hard cap (level 100) the function returns `Infinity`, signalling
 * that further levelling is impossible.
 *
 * @param level - Current player level (1-indexed).
 * @returns XP needed to reach the next level, or Infinity at cap.
 *
 * @example
 * ```ts
 * xpRequiredForLevel(1);   // 100
 * xpRequiredForLevel(10);  // 352
 * xpRequiredForLevel(100); // Infinity
 * ```
 */
export function xpRequiredForLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity;
  if (level < 1) return BASE_XP; // Guard for invalid input

  return Math.floor(BASE_XP * Math.pow(GROWTH_RATE, level - 1));
}

// ─── Quest XP Calculation ────────────────────────────────────────────

/** Parameters fed into the quest XP calculator. */
export interface QuestXPParams {
  /** The difficulty multiplier for this exercise / quest (e.g. 1.0–3.0). */
  difficultyMultiplier: number;
  /** Number of reps the player actually completed. */
  repsCompleted: number;
  /** The target rep count for this quest. */
  targetReps: number;
  /** Number of consecutive training days (streak). 0 = no streak. */
  streakDays: number;
  /** Whether the player just mastered a brand-new variation this quest. */
  isNewVariation?: boolean;
  /** Whether the player just ranked up from completing this quest. */
  isRankUp?: boolean;
  /** Whether God Mode is active (enables failure penalties). */
  godMode?: boolean;
  /** Whether this quest was failed. */
  questFailed?: boolean;
  /** Number of consecutive quest failures (for God Mode escalation). */
  consecutiveFails?: number;
}

/** Breakdown of the XP award so the UI can animate each bonus line. */
export interface QuestXPResult {
  /** Raw base XP before any bonuses. */
  baseXP: number;
  /** Multiplier applied for hitting / exceeding target (1.0 if neither). */
  targetMultiplier: number;
  /** Additive streak multiplier (e.g. 0.25 for a 5-day streak). */
  streakMultiplier: number;
  /** Flat bonus for new variation mastery. */
  variationBonus: number;
  /** Flat bonus for ranking up. */
  rankUpBonus: number;
  /** Total XP deducted (God Mode failures). Always ≥ 0. */
  penalty: number;
  /** Net XP awarded (may be negative in extreme God Mode scenarios). */
  totalXP: number;
}

/**
 * Calculate the XP earned (or lost) from a single quest attempt.
 *
 * **Base XP** = difficultyMultiplier × repsCompleted
 *
 * **Target bonuses** (mutually exclusive — exceed trumps exact):
 * - Hit exact target:  ×1.20
 * - Exceed target:     ×1.50
 *
 * **Streak bonus**: +5% per consecutive day, capped at +50% (10 days).
 * Applied additively on top of the target multiplier.
 *
 * **Flat bonuses** (added after multiplication):
 * - New variation mastered: +200 XP
 * - Rank-up milestone:     +500 XP
 *
 * **God Mode deductions** (only when godMode === true):
 * - Failed quest: lose 25% of what you *would* have earned.
 * - 3+ consecutive fails: lose an additional 100 XP flat.
 *
 * @param params - Quest completion parameters.
 * @returns Detailed XP breakdown.
 */
export function calculateQuestXP(params: QuestXPParams): QuestXPResult {
  const {
    difficultyMultiplier,
    repsCompleted,
    targetReps,
    streakDays,
    isNewVariation = false,
    isRankUp = false,
    godMode = false,
    questFailed = false,
    consecutiveFails = 0,
  } = params;

  // ── Base XP ──
  const baseXP = difficultyMultiplier * repsCompleted;

  // ── Target multiplier (mutually exclusive) ──
  let targetMultiplier = 1.0;
  if (repsCompleted > targetReps && targetReps > 0) {
    targetMultiplier = XP_BONUSES.EXCEED_TARGET_MULTIPLIER;
  } else if (repsCompleted === targetReps && targetReps > 0) {
    targetMultiplier = XP_BONUSES.EXACT_TARGET_MULTIPLIER;
  }

  // ── Streak multiplier (additive, capped) ──
  const streakMultiplier = Math.min(
    streakDays * XP_BONUSES.STREAK_BONUS_PER_DAY,
    XP_BONUSES.STREAK_BONUS_CAP,
  );

  // ── Combined multiplicative XP ──
  const multipliedXP = baseXP * targetMultiplier * (1 + streakMultiplier);

  // ── Flat bonuses ──
  const variationBonus = isNewVariation ? XP_BONUSES.NEW_VARIATION_XP : 0;
  const rankUpBonus = isRankUp ? XP_BONUSES.RANK_UP_XP : 0;

  // ── Subtotal before penalties ──
  const subtotal = multipliedXP + variationBonus + rankUpBonus;

  // ── God Mode failure penalties ──
  let penalty = 0;
  if (godMode && questFailed) {
    // Lose 25% of what you would have earned
    penalty = subtotal * XP_BONUSES.FAIL_PENALTY_FRACTION;

    // Escalation: 3+ consecutive fails → additional 100 XP flat
    if (consecutiveFails >= XP_BONUSES.CONSECUTIVE_FAIL_THRESHOLD) {
      penalty += XP_BONUSES.CONSECUTIVE_FAIL_PENALTY;
    }

    penalty = Math.floor(penalty);
  }

  const totalXP = Math.floor(subtotal - penalty);

  return {
    baseXP: Math.floor(baseXP),
    targetMultiplier,
    streakMultiplier,
    variationBonus,
    rankUpBonus,
    penalty,
    totalXP,
  };
}
