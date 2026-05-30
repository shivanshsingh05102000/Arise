/**
 * ARISE Engine — Plateau Detection & Exercise Swap System
 *
 * Detects when a hunter has stalled at a target and forces progression
 * through exercise variation upgrades. The System does not allow comfort.
 *
 * Plateau Definition:
 *   3+ consecutive SUCCESS days at the SAME target while the hunter is
 *   already using the top set configuration for their current variation.
 *
 * When a plateau is detected the System swaps the exercise to a harder
 * variation and recalculates the target using a drop factor to account
 * for the increased difficulty.
 *
 * Swap Volume Formula:
 *   newTarget = floor(currentTarget × dropFactor)
 *   newSets   = determined by swap type
 *
 * Swap Types:
 *   STANDARD  → incremental upgrade (e.g. standard → diamond push-ups)
 *              drop_factor = 0.70, sets unchanged
 *   MAJOR     → significant upgrade (e.g. standard → archer push-ups)
 *              drop_factor = 0.50, sets − 1
 *   CATEGORY  → entirely new movement (e.g. push-ups → handstand push-ups)
 *              drop_factor = 0.40, 1 set
 */

// ─── Swap Type Enum ─────────────────────────────────────────────────

/**
 * Classification of how dramatic an exercise swap is.
 * Determines the drop factor and set adjustment.
 */
export enum SwapType {
  /**
   * Standard upgrade — incremental difficulty increase.
   * Example: standard push-up → diamond push-up.
   * Drop factor: 0.70 | Sets: unchanged.
   */
  STANDARD = 'STANDARD',

  /**
   * Major upgrade — significant leap in difficulty.
   * Example: standard push-up → archer push-up.
   * Drop factor: 0.50 | Sets: current − 1 (minimum 1).
   */
  MAJOR = 'MAJOR',

  /**
   * New category — completely different movement pattern.
   * Example: push-up → handstand push-up.
   * Drop factor: 0.40 | Sets: always 1.
   */
  CATEGORY = 'CATEGORY',
}

/** Drop factors and set rules for each swap type. */
const SWAP_CONFIG: Readonly<
  Record<SwapType, { dropFactor: number; setRule: 'keep' | 'minus1' | 'reset' }>
> = {
  [SwapType.STANDARD]: { dropFactor: 0.70, setRule: 'keep' },
  [SwapType.MAJOR]: { dropFactor: 0.50, setRule: 'minus1' },
  [SwapType.CATEGORY]: { dropFactor: 0.40, setRule: 'reset' },
};

// ─── Plateau Detection ──────────────────────────────────────────────

/** Minimum consecutive same-target successes to trigger a plateau. */
const PLATEAU_THRESHOLD = 3;

/** Parameters for plateau detection. */
export interface PlateauCheckParams {
  /**
   * Array of recent training results, ordered chronologically
   * (oldest first). Each entry records whether the day was a success
   * and the target that was set for that day.
   */
  recentResults: ReadonlyArray<{
    /** Whether the player succeeded on this day. */
    succeeded: boolean;
    /** The target value that was assigned on this day. */
    target: number;
  }>;

  /**
   * Whether the player is already using the maximum set configuration
   * for their current exercise variation. Plateau only triggers when
   * there is nowhere to grow within the current variation.
   */
  isAtTopSetConfig: boolean;
}

/** Result of a plateau check. */
export interface PlateauCheckResult {
  /** Whether a plateau has been detected. */
  isPlateaued: boolean;
  /** Number of consecutive same-target successes counted. */
  consecutiveSameTargetSuccesses: number;
  /** Explanation for the UI. */
  reason: string;
}

/**
 * Determine whether the hunter has plateaued on their current exercise.
 *
 * A plateau is declared when:
 * 1. The hunter has 3+ consecutive SUCCESS days, AND
 * 2. All those days shared the SAME target value, AND
 * 3. The hunter is at the top set configuration (no more sets to add).
 *
 * @param params - Recent training history and set configuration state.
 * @returns Whether a plateau was detected.
 *
 * @example
 * ```ts
 * checkPlateau({
 *   recentResults: [
 *     { succeeded: true, target: 50 },
 *     { succeeded: true, target: 50 },
 *     { succeeded: true, target: 50 },
 *   ],
 *   isAtTopSetConfig: true,
 * });
 * // → { isPlateaued: true, consecutiveSameTargetSuccesses: 3, ... }
 * ```
 */
export function checkPlateau(params: PlateauCheckParams): PlateauCheckResult {
  const { recentResults, isAtTopSetConfig } = params;

  if (!isAtTopSetConfig) {
    return {
      isPlateaued: false,
      consecutiveSameTargetSuccesses: 0,
      reason: 'Not at top set configuration — sets can still be added before considering a swap.',
    };
  }

  if (recentResults.length === 0) {
    return {
      isPlateaued: false,
      consecutiveSameTargetSuccesses: 0,
      reason: 'No training history available.',
    };
  }

  // Count consecutive same-target successes from the most recent day backwards
  const latestTarget = recentResults[recentResults.length - 1].target;
  let streak = 0;

  for (let i = recentResults.length - 1; i >= 0; i--) {
    const result = recentResults[i];
    if (result.succeeded && result.target === latestTarget) {
      streak++;
    } else {
      break;
    }
  }

  const isPlateaued = streak >= PLATEAU_THRESHOLD;

  return {
    isPlateaued,
    consecutiveSameTargetSuccesses: streak,
    reason: isPlateaued
      ? `PLATEAU DETECTED. ${streak} consecutive successes at target ${latestTarget} with max set config. The System demands evolution.`
      : `${streak}/${PLATEAU_THRESHOLD} consecutive same-target successes. No plateau yet.`,
  };
}

// ─── Swap Target Calculation ────────────────────────────────────────

/** Parameters for calculating the new target after an exercise swap. */
export interface SwapTargetParams {
  /** The current target value before the swap. */
  currentTarget: number;
  /** The current number of sets. */
  currentSets: number;
  /** The type of exercise swap being performed. */
  swapType: SwapType;
}

/** Result of the swap target calculation. */
export interface SwapTargetResult {
  /** The new rep/time target for the harder variation. */
  newTarget: number;
  /** The new number of sets. */
  newSets: number;
  /** The drop factor that was applied. */
  dropFactor: number;
  /** Explanation for the UI. */
  reason: string;
}

/**
 * Calculate the adjusted target and sets when swapping to a harder
 * exercise variation.
 *
 * The drop factor reduces the target to account for increased difficulty:
 * - STANDARD swap: 70% of current target, same sets
 * - MAJOR swap:    50% of current target, sets − 1 (min 1)
 * - CATEGORY swap: 40% of current target, always 1 set
 *
 * The new target is always at least 1 (the System never assigns zero).
 *
 * @param params - Current state and swap classification.
 * @returns Adjusted target and set count.
 *
 * @example
 * ```ts
 * // Standard upgrade: 50 reps × 3 sets → 35 reps × 3 sets
 * calculateSwapTarget({ currentTarget: 50, currentSets: 3, swapType: SwapType.STANDARD });
 * // → { newTarget: 35, newSets: 3, dropFactor: 0.70, ... }
 *
 * // Major upgrade: 50 reps × 4 sets → 25 reps × 3 sets
 * calculateSwapTarget({ currentTarget: 50, currentSets: 4, swapType: SwapType.MAJOR });
 * // → { newTarget: 25, newSets: 3, dropFactor: 0.50, ... }
 *
 * // Category change: 50 reps × 4 sets → 20 reps × 1 set
 * calculateSwapTarget({ currentTarget: 50, currentSets: 4, swapType: SwapType.CATEGORY });
 * // → { newTarget: 20, newSets: 1, dropFactor: 0.40, ... }
 * ```
 */
export function calculateSwapTarget(params: SwapTargetParams): SwapTargetResult {
  const { currentTarget, currentSets, swapType } = params;
  const config = SWAP_CONFIG[swapType];

  // Apply drop factor (minimum target of 1)
  const newTarget = Math.max(1, Math.floor(currentTarget * config.dropFactor));

  // Determine new set count
  let newSets: number;
  switch (config.setRule) {
    case 'keep':
      newSets = currentSets;
      break;
    case 'minus1':
      newSets = Math.max(1, currentSets - 1);
      break;
    case 'reset':
      newSets = 1;
      break;
  }

  const swapLabels: Record<SwapType, string> = {
    [SwapType.STANDARD]: 'Standard upgrade',
    [SwapType.MAJOR]: 'Major upgrade',
    [SwapType.CATEGORY]: 'New category',
  };

  return {
    newTarget,
    newSets,
    dropFactor: config.dropFactor,
    reason: `${swapLabels[swapType]}: target dropped to ${(config.dropFactor * 100).toFixed(0)}% (${currentTarget} → ${newTarget}), sets: ${currentSets} → ${newSets}.`,
  };
}
