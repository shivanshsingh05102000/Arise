/**
 * ARISE Engine — Daily Progression System
 *
 * Governs how training targets grow day-over-day and how failure
 * is punished. The system uses rank-tiered daily multipliers so
 * early hunters see rapid gains while S-Rank hunters grind for
 * every fraction of a percent.
 *
 * Daily multiplier math:
 *   nextTarget = floor(currentTarget × DAILY_MULTIPLIER[rank])
 *
 * Weekly growth approximations:
 *   E → +8%   D → +7%   C → +5%   B → +4%   A → +3%   S → +2%
 *
 * Failure Penalty Escalation (the System does not forgive):
 *   1–2 consecutive fails: target stays the same (no increase).
 *   3 consecutive fails:   target INCREASES +5%  (shock therapy).
 *   5+ consecutive fails:  target INCREASES +10% (brutal).
 *
 * God Mode — Rank Demotion:
 *   7+ consecutive fails in God Mode → level drops to the max level
 *   of the previous rank tier. An S-Rank hunter demotes to level 90.
 */

import { type Rank, RANKS } from './rank';

// ─── Daily Multipliers ──────────────────────────────────────────────

/**
 * Per-rank daily target multipliers.
 *
 * Each value is applied multiplicatively to the current target after a
 * successful training day. Higher ranks have smaller multipliers because
 * the absolute rep counts are already high — a 1% gain at 200 push-ups
 * is far more than 1% at 20.
 *
 * Weekly growth ≈ multiplier^7  (e.g. 1.011^7 ≈ 1.080 → +8%).
 */
export const DAILY_MULTIPLIERS: Readonly<Record<Rank, number>> = {
  E: 1.011, // ≈ +8% / week
  D: 1.010, // ≈ +7% / week
  C: 1.007, // ≈ +5% / week
  B: 1.006, // ≈ +4% / week
  A: 1.004, // ≈ +3% / week
  S: 1.003, // ≈ +2% / week
};

// ─── Failure Penalty Constants ──────────────────────────────────────

/** Thresholds and multipliers for the failure penalty escalation. */
const FAILURE_TIERS = {
  /** 1–2 fails: target stays flat. */
  FLAT_MAX: 2,
  /** 3–4 fails: shock — target jumps +5%. */
  SHOCK_THRESHOLD: 3,
  SHOCK_MULTIPLIER: 1.05,
  /** 5+ fails: brutal — target jumps +10%. */
  BRUTAL_THRESHOLD: 5,
  BRUTAL_MULTIPLIER: 1.10,
  /** 7+ fails in God Mode: rank demotion. */
  DEMOTION_THRESHOLD: 7,
} as const;

// ─── Next Target Calculation ────────────────────────────────────────

/** Parameters for calculating the next day's training target. */
export interface NextTargetParams {
  /** Current target (rep count, seconds, etc.). */
  currentTarget: number;
  /** The player's current rank letter. */
  rank: Rank;
  /** Whether the player succeeded today. */
  succeeded: boolean;
  /** Running count of consecutive failures (0 if last day was a success). */
  consecutiveFails: number;
}

/** Result of the next-target calculation. */
export interface NextTargetResult {
  /** The new target value for tomorrow. */
  nextTarget: number;
  /** Whether a failure penalty was applied. */
  penaltyApplied: boolean;
  /** Description of what happened, for UI toast / log. */
  reason: string;
}

/**
 * Calculate tomorrow's training target based on today's outcome.
 *
 * On success the target grows by the rank-specific daily multiplier.
 * On failure the target is adjusted according to the escalation tiers.
 *
 * @param params - Today's outcome and current state.
 * @returns The next target and metadata about the decision.
 *
 * @example
 * ```ts
 * // Successful E-Rank day at 50 push-ups
 * calculateNextTarget({ currentTarget: 50, rank: 'E', succeeded: true, consecutiveFails: 0 });
 * // → { nextTarget: 50 (floor(50 * 1.011) = 50), penaltyApplied: false, ... }
 *
 * // 3 consecutive fails at 80 push-ups
 * calculateNextTarget({ currentTarget: 80, rank: 'C', succeeded: false, consecutiveFails: 3 });
 * // → { nextTarget: 84 (floor(80 * 1.05)), penaltyApplied: true, reason: 'Shock...' }
 * ```
 */
export function calculateNextTarget(params: NextTargetParams): NextTargetResult {
  const { currentTarget, rank, succeeded, consecutiveFails } = params;

  if (succeeded) {
    const multiplier = DAILY_MULTIPLIERS[rank];
    const nextTarget = Math.floor(currentTarget * multiplier);

    // Ensure at least +1 when multiplier rounds down to same value
    const finalTarget = nextTarget <= currentTarget ? currentTarget + 1 : nextTarget;

    return {
      nextTarget: finalTarget,
      penaltyApplied: false,
      reason: `Target increased. Daily multiplier ×${multiplier} applied.`,
    };
  }

  // ── Failure path ──
  return applyFailurePenalty({ currentTarget, consecutiveFails });
}

// ─── Failure Penalty ────────────────────────────────────────────────

/** Parameters for the failure penalty sub-system. */
export interface FailurePenaltyParams {
  /** Current target value. */
  currentTarget: number;
  /** Running count of consecutive failures (including today). */
  consecutiveFails: number;
}

/**
 * Apply failure penalty escalation to the current target.
 *
 * The System's punishment philosophy:
 * - 1–2 fails: mercy — target holds steady, giving the hunter a chance.
 * - 3 fails:   shock therapy — target jumps +5% to break complacency.
 * - 5+ fails:  brutality — target jumps +10%. Adapt or be destroyed.
 *
 * @param params - Failure state.
 * @returns Adjusted target and explanation.
 */
export function applyFailurePenalty(params: FailurePenaltyParams): NextTargetResult {
  const { currentTarget, consecutiveFails } = params;

  // 1–2 consecutive fails: target stays the same
  if (consecutiveFails <= FAILURE_TIERS.FLAT_MAX) {
    return {
      nextTarget: currentTarget,
      penaltyApplied: false,
      reason: `Target unchanged. ${consecutiveFails} consecutive fail(s) — the System shows mercy.`,
    };
  }

  // 5+ consecutive fails: brutal +10%
  if (consecutiveFails >= FAILURE_TIERS.BRUTAL_THRESHOLD) {
    const nextTarget = Math.floor(currentTarget * FAILURE_TIERS.BRUTAL_MULTIPLIER);
    return {
      nextTarget,
      penaltyApplied: true,
      reason: `BRUTAL PENALTY. ${consecutiveFails} consecutive fails — target increased +10%. The System demands adaptation.`,
    };
  }

  // 3–4 consecutive fails: shock +5%
  const nextTarget = Math.floor(currentTarget * FAILURE_TIERS.SHOCK_MULTIPLIER);
  return {
    nextTarget,
    penaltyApplied: true,
    reason: `SHOCK PENALTY. ${consecutiveFails} consecutive fails — target increased +5%. Arise, or be broken.`,
  };
}

// ─── God Mode Demotion ──────────────────────────────────────────────

/** Parameters for the demotion check. */
export interface DemotionParams {
  /** Player's current level. */
  currentLevel: number;
  /** Running count of consecutive failures. */
  consecutiveFails: number;
  /** Whether God Mode is active. */
  godMode: boolean;
}

/** Result of the demotion check. */
export interface DemotionResult {
  /** Whether a demotion occurred. */
  demoted: boolean;
  /** The new level after demotion (unchanged if no demotion). */
  newLevel: number;
  /** The rank the player was demoted to (undefined if no demotion). */
  demotedToRank?: Rank;
  /** Explanation for the UI. */
  reason: string;
}

/**
 * Check whether the player should be demoted due to consecutive failures
 * in God Mode.
 *
 * Demotion rule: 7+ consecutive fails in God Mode drops the player's
 * level to the **maximum level of the previous rank tier**.
 *
 * An E-Rank hunter (levels 1–20) cannot be demoted further — they are
 * already at the lowest tier.
 *
 * @param params - Current player state.
 * @returns Demotion decision and new level.
 *
 * @example
 * ```ts
 * checkDemotion({ currentLevel: 45, consecutiveFails: 7, godMode: true });
 * // → { demoted: true, newLevel: 40, demotedToRank: 'D', ... }
 *
 * checkDemotion({ currentLevel: 10, consecutiveFails: 10, godMode: true });
 * // → { demoted: false, newLevel: 10, reason: 'Already E-Rank...' }
 * ```
 */
export function checkDemotion(params: DemotionParams): DemotionResult {
  const { currentLevel, consecutiveFails, godMode } = params;

  // Demotion only applies in God Mode with 7+ consecutive fails
  if (!godMode || consecutiveFails < FAILURE_TIERS.DEMOTION_THRESHOLD) {
    return {
      demoted: false,
      newLevel: currentLevel,
      reason: godMode
        ? `${consecutiveFails} consecutive fails — demotion triggers at ${FAILURE_TIERS.DEMOTION_THRESHOLD}.`
        : 'God Mode is not active. No demotion possible.',
    };
  }

  // Find the player's current rank tier index
  const currentTierIndex = RANKS.findIndex(
    (r) => currentLevel >= r.minLevel && currentLevel <= r.maxLevel,
  );

  // E-Rank (index 0) cannot be demoted further
  if (currentTierIndex <= 0) {
    return {
      demoted: false,
      newLevel: currentLevel,
      reason: 'Already at the lowest rank (E). The System cannot break you further.',
    };
  }

  // Demote to the max level of the previous rank tier
  const previousTier = RANKS[currentTierIndex - 1];
  return {
    demoted: true,
    newLevel: previousTier.maxLevel,
    demotedToRank: previousTier.rank,
    reason: `RANK DEMOTION. ${consecutiveFails} consecutive fails in God Mode — demoted to ${previousTier.rank}-Rank (level ${previousTier.maxLevel}). Prove your worth again.`,
  };
}
