/**
 * ARISE Engine — Baseline Assessment & Day 1 Target Calculator
 *
 * Before the System can train you, it must measure you.
 *
 * The initial assessment captures the hunter's raw maximums across
 * five categories. Day 1 targets are set at **80% of max** — hard
 * enough to challenge, forgiving enough to not destroy morale on
 * the first day.
 *
 * Exercise-specific rules:
 *   Push-ups:      target = floor(maxReps × 0.8), sets based on tier
 *   Squats:        target = floor(maxReps × 0.8), sets based on tier
 *   Plank:         target = floor(maxSeconds × 0.8), always 1 set
 *   Run:           starting distance based on mile time brackets
 *   Martial Arts:  always starts at 50 reps, 1 set (standardised baseline)
 *
 * Set assignment tiers (push-ups & squats):
 *   0–10 reps:   1 set   (beginner — build volume slowly)
 *   11–25 reps:  2 sets  (intermediate — moderate volume)
 *   26–50 reps:  3 sets  (advanced — solid base)
 *   51+ reps:    4 sets  (elite — high-volume training)
 */

// ─── Constants ──────────────────────────────────────────────────────

/** Fraction of max used for Day 1 targets. */
const DAY1_FRACTION = 0.80;

/** Fixed starting reps for martial arts (standardised baseline). */
const MARTIAL_ARTS_STARTING_REPS = 50;

/**
 * Running distance assignments based on mile time.
 * Faster runners start at longer distances.
 *
 * Brackets (minutes):
 *   ≤ 6:00   → 5.0 km  (competitive runner)
 *   ≤ 8:00   → 3.0 km  (fit)
 *   ≤ 10:00  → 2.0 km  (average)
 *   ≤ 12:00  → 1.5 km  (below average)
 *   > 12:00  → 1.0 km  (beginner)
 */
const RUN_BRACKETS: ReadonlyArray<{ maxMileTimeMinutes: number; distanceKm: number }> = [
  { maxMileTimeMinutes: 6, distanceKm: 5.0 },
  { maxMileTimeMinutes: 8, distanceKm: 3.0 },
  { maxMileTimeMinutes: 10, distanceKm: 2.0 },
  { maxMileTimeMinutes: 12, distanceKm: 1.5 },
];

/** Fallback distance when mile time exceeds all brackets. */
const RUN_FALLBACK_KM = 1.0;

// ─── Types ──────────────────────────────────────────────────────────

/** Raw results from the hunter's initial fitness assessment. */
export interface AssessmentResult {
  /** Maximum push-ups completed in a single set to failure. */
  maxPushUps: number;
  /** Maximum squats completed in a single set to failure. */
  maxSquats: number;
  /** Maximum plank hold in seconds. */
  maxPlankSeconds: number;
  /**
   * Mile run time in minutes (decimal).
   * Example: 8.5 = 8 minutes 30 seconds.
   */
  mileTimeMinutes: number;
  /**
   * Whether the hunter has any martial arts experience.
   * This doesn't affect the starting target (always 50) but may
   * influence future variation unlocks.
   */
  hasMartialArtsExperience?: boolean;
}

/** A single exercise target for Day 1. */
export interface ExerciseTarget {
  /** Exercise identifier. */
  exercise: string;
  /** Target reps, seconds, or distance (km). */
  target: number;
  /** Unit of the target value. */
  unit: 'reps' | 'seconds' | 'km';
  /** Number of sets. */
  sets: number;
}

/** Complete Day 1 training programme. */
export interface Day1Targets {
  pushUps: ExerciseTarget;
  squats: ExerciseTarget;
  plank: ExerciseTarget;
  run: ExerciseTarget;
  martialArts: ExerciseTarget;
}

// ─── Helper Functions ───────────────────────────────────────────────

/**
 * Determine the number of sets based on max reps.
 *
 * Tiers:
 *   0–10   → 1 set
 *   11–25  → 2 sets
 *   26–50  → 3 sets
 *   51+    → 4 sets
 *
 * @param maxReps - The hunter's max reps from assessment.
 * @returns Appropriate number of sets.
 */
function getSetsFromMaxReps(maxReps: number): number {
  if (maxReps <= 10) return 1;
  if (maxReps <= 25) return 2;
  if (maxReps <= 50) return 3;
  return 4;
}

/**
 * Convert a mile time to a starting run distance in km.
 *
 * @param mileTimeMinutes - Mile run time in decimal minutes.
 * @returns Starting distance in km.
 */
function getRunDistanceFromMileTime(mileTimeMinutes: number): number {
  for (const bracket of RUN_BRACKETS) {
    if (mileTimeMinutes <= bracket.maxMileTimeMinutes) {
      return bracket.distanceKm;
    }
  }
  return RUN_FALLBACK_KM;
}

// ─── Main Assessment Function ───────────────────────────────────────

/**
 * Calculate Day 1 training targets from the hunter's baseline assessment.
 *
 * Each exercise target is derived from the assessment with a 20% reduction
 * (80% of max) to create achievable-but-challenging starting points.
 *
 * @param assessment - Raw assessment results from the initial fitness test.
 * @returns Complete Day 1 training programme.
 *
 * @example
 * ```ts
 * const targets = calculateDay1Targets({
 *   maxPushUps: 40,
 *   maxSquats: 60,
 *   maxPlankSeconds: 90,
 *   mileTimeMinutes: 7.5,
 * });
 *
 * // targets.pushUps  → { exercise: 'Push-Ups', target: 32, unit: 'reps', sets: 3 }
 * // targets.squats   → { exercise: 'Squats', target: 48, unit: 'reps', sets: 4 }
 * // targets.plank    → { exercise: 'Plank', target: 72, unit: 'seconds', sets: 1 }
 * // targets.run      → { exercise: 'Run', target: 3.0, unit: 'km', sets: 1 }
 * // targets.martialArts → { exercise: 'Martial Arts', target: 50, unit: 'reps', sets: 1 }
 * ```
 */
export function calculateDay1Targets(assessment: AssessmentResult): Day1Targets {
  const {
    maxPushUps,
    maxSquats,
    maxPlankSeconds,
    mileTimeMinutes,
  } = assessment;

  // ── Push-Ups ──
  const pushUpTarget = Math.max(1, Math.floor(maxPushUps * DAY1_FRACTION));
  const pushUpSets = getSetsFromMaxReps(maxPushUps);

  // ── Squats ──
  const squatTarget = Math.max(1, Math.floor(maxSquats * DAY1_FRACTION));
  const squatSets = getSetsFromMaxReps(maxSquats);

  // ── Plank ──
  const plankTarget = Math.max(1, Math.floor(maxPlankSeconds * DAY1_FRACTION));

  // ── Run ──
  const runDistance = getRunDistanceFromMileTime(mileTimeMinutes);

  // ── Martial Arts (always fixed baseline) ──
  const martialArtsTarget = MARTIAL_ARTS_STARTING_REPS;

  return {
    pushUps: {
      exercise: 'Push-Ups',
      target: pushUpTarget,
      unit: 'reps',
      sets: pushUpSets,
    },
    squats: {
      exercise: 'Squats',
      target: squatTarget,
      unit: 'reps',
      sets: squatSets,
    },
    plank: {
      exercise: 'Plank',
      target: plankTarget,
      unit: 'seconds',
      sets: 1,
    },
    run: {
      exercise: 'Run',
      target: runDistance,
      unit: 'km',
      sets: 1,
    },
    martialArts: {
      exercise: 'Martial Arts',
      target: martialArtsTarget,
      unit: 'reps',
      sets: 1,
    },
  };
}
