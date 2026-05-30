/**
 * ARISE — Exercise Definitions & Progression Ladders
 *
 * Every exercise belongs to a category and a progression group.
 * Within a group, `variationOrder` defines the difficulty ladder.
 * `difficultyDropFactor` is the multiplier applied to target reps
 * when a hunter moves up one rung on the ladder.
 */

// ─── Shared rank type (re-exported for convenience) ─────────────────────────
export type RankName = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export const RANK_ORDER: readonly RankName[] = ['E', 'D', 'C', 'B', 'A', 'S'] as const;

/** Returns true when `current` is at least `required`. */
export function meetsRankRequirement(current: RankName, required: RankName): boolean {
  return RANK_ORDER.indexOf(current) >= RANK_ORDER.indexOf(required);
}

// ─── Types ──────────────────────────────────────────────────────────────────
export type ExerciseCategory = 'strength' | 'legs' | 'core' | 'endurance' | 'martial_arts';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  progressionGroup: string;
  variationOrder: number;
  difficultyDropFactor: number;
  rankRequired: RankName;
  unit: 'reps' | 'seconds' | 'km';
  defaultSets: number;
  description: string;
}

// ─── Strength ladder (push-up group) ────────────────────────────────────────
const PUSHUP_GROUP = 'pushup';

const strengthExercises: Exercise[] = [
  {
    id: 'str_pushup_standard',
    name: 'Standard Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 1,
    difficultyDropFactor: 0.70,
    rankRequired: 'E',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Hands shoulder-width apart, body straight from head to heels. Lower until chest nearly touches the floor, then push back up.',
  },
  {
    id: 'str_pushup_diamond',
    name: 'Diamond Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 2,
    difficultyDropFactor: 0.70,
    rankRequired: 'E',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Form a diamond shape with your index fingers and thumbs beneath your chest. Emphasises triceps and inner chest.',
  },
  {
    id: 'str_pushup_wide',
    name: 'Wide Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 3,
    difficultyDropFactor: 0.70,
    rankRequired: 'D',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Hands placed well outside shoulder width. Targets the outer chest and shoulders with a larger range of motion.',
  },
  {
    id: 'str_pushup_archer',
    name: 'Archer Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 4,
    difficultyDropFactor: 0.50,
    rankRequired: 'D',
    unit: 'reps',
    defaultSets: 3,
    description:
      'One arm extends to the side while the working arm performs the push-up. Builds unilateral strength toward one-arm push-ups.',
  },
  {
    id: 'str_pushup_decline',
    name: 'Decline Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 5,
    difficultyDropFactor: 0.70,
    rankRequired: 'C',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Feet elevated on a bench or step. Shifts more load to the upper chest and anterior deltoids.',
  },
  {
    id: 'str_pushup_pike',
    name: 'Pike Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 6,
    difficultyDropFactor: 0.50,
    rankRequired: 'C',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Hips raised high so your body forms an inverted V. Press straight up to target the shoulders. A precursor to handstand push-ups.',
  },
  {
    id: 'str_pushup_onearm_negative',
    name: 'One-Arm Negative',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 7,
    difficultyDropFactor: 0.40,
    rankRequired: 'B',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Lower yourself slowly on one arm over 3–5 seconds. Use both arms to return to the top. Builds eccentric strength.',
  },
  {
    id: 'str_pushup_onearm',
    name: 'One-Arm Push-Up',
    category: 'strength',
    progressionGroup: PUSHUP_GROUP,
    variationOrder: 8,
    difficultyDropFactor: 0.40,
    rankRequired: 'A',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Full push-up on a single arm with feet wider than shoulder width for balance. The pinnacle of push-up strength.',
  },
];

// ─── Legs ladder (squat group) ──────────────────────────────────────────────
const SQUAT_GROUP = 'squat';

const legsExercises: Exercise[] = [
  {
    id: 'leg_squat_bodyweight',
    name: 'Bodyweight Squat',
    category: 'legs',
    progressionGroup: SQUAT_GROUP,
    variationOrder: 1,
    difficultyDropFactor: 0.70,
    rankRequired: 'E',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Stand with feet shoulder-width apart, squat until thighs are parallel to the ground, then stand back up. Keep your chest up and core tight.',
  },
  {
    id: 'leg_squat_jump',
    name: 'Jump Squat',
    category: 'legs',
    progressionGroup: SQUAT_GROUP,
    variationOrder: 2,
    difficultyDropFactor: 0.70,
    rankRequired: 'D',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Squat down, then explode upward into a jump. Land softly and immediately descend into the next rep. Builds explosive power.',
  },
  {
    id: 'leg_squat_bulgarian',
    name: 'Bulgarian Split Squat',
    category: 'legs',
    progressionGroup: SQUAT_GROUP,
    variationOrder: 3,
    difficultyDropFactor: 0.60,
    rankRequired: 'C',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Rear foot elevated on a bench. Lower the back knee toward the ground while keeping the front knee tracking over the toes. Alternate legs each set.',
  },
  {
    id: 'leg_squat_pistol_negative',
    name: 'Pistol Squat Negative',
    category: 'legs',
    progressionGroup: SQUAT_GROUP,
    variationOrder: 4,
    difficultyDropFactor: 0.50,
    rankRequired: 'B',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Stand on one leg and slowly lower yourself over 3–5 seconds into the bottom of a pistol squat. Use assistance to stand back up.',
  },
  {
    id: 'leg_squat_pistol',
    name: 'Pistol Squat',
    category: 'legs',
    progressionGroup: SQUAT_GROUP,
    variationOrder: 5,
    difficultyDropFactor: 0.40,
    rankRequired: 'A',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Full single-leg squat with the non-working leg extended straight in front. Requires exceptional strength, balance, and mobility.',
  },
];

// ─── Core ladder ────────────────────────────────────────────────────────────
const CORE_GROUP = 'core';

const coreExercises: Exercise[] = [
  {
    id: 'core_plank',
    name: 'Plank Hold',
    category: 'core',
    progressionGroup: CORE_GROUP,
    variationOrder: 1,
    difficultyDropFactor: 0.70,
    rankRequired: 'E',
    unit: 'seconds',
    defaultSets: 3,
    description:
      'Hold a straight-arm or forearm plank with body rigid from head to heels. Engage the core and glutes throughout.',
  },
  {
    id: 'core_side_plank',
    name: 'Side Plank',
    category: 'core',
    progressionGroup: CORE_GROUP,
    variationOrder: 2,
    difficultyDropFactor: 0.70,
    rankRequired: 'D',
    unit: 'seconds',
    defaultSets: 3,
    description:
      'Support your body on one forearm and the side of your foot. Keep hips stacked and body in a straight line. Do both sides.',
  },
  {
    id: 'core_plank_shoulder_tap',
    name: 'Plank with Shoulder Tap',
    category: 'core',
    progressionGroup: CORE_GROUP,
    variationOrder: 3,
    difficultyDropFactor: 0.60,
    rankRequired: 'C',
    unit: 'reps',
    defaultSets: 3,
    description:
      'From a high plank, alternately lift each hand to tap the opposite shoulder while minimising hip rotation. Builds anti-rotation stability.',
  },
  {
    id: 'core_lsit',
    name: 'L-Sit Hold',
    category: 'core',
    progressionGroup: CORE_GROUP,
    variationOrder: 4,
    difficultyDropFactor: 0.50,
    rankRequired: 'B',
    unit: 'seconds',
    defaultSets: 3,
    description:
      'Support yourself on parallel bars or the floor with arms straight and legs extended horizontally. Demands intense hip flexor and abdominal strength.',
  },
  {
    id: 'core_dragon_flag',
    name: 'Dragon Flag Negative',
    category: 'core',
    progressionGroup: CORE_GROUP,
    variationOrder: 5,
    difficultyDropFactor: 0.40,
    rankRequired: 'A',
    unit: 'reps',
    defaultSets: 3,
    description:
      'Lie on a bench, grip behind head, and slowly lower your rigid body from vertical to horizontal. Only shoulders remain on the bench.',
  },
];

// ─── Endurance ladder ───────────────────────────────────────────────────────
const ENDURANCE_GROUP = 'endurance';

const enduranceExercises: Exercise[] = [
  {
    id: 'end_walk_run',
    name: 'Walk/Run Intervals',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 1,
    difficultyDropFactor: 0.80,
    rankRequired: 'E',
    unit: 'km',
    defaultSets: 1,
    description:
      'Alternate between walking and jogging in timed intervals (e.g. 1 min walk, 1 min jog). Builds aerobic base without over-stressing joints.',
  },
  {
    id: 'end_1km',
    name: 'Continuous 1km',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 2,
    difficultyDropFactor: 0.80,
    rankRequired: 'E',
    unit: 'km',
    defaultSets: 1,
    description:
      'Run 1 kilometre continuously at a comfortable pace. Focus on breathing rhythm and maintaining form throughout.',
  },
  {
    id: 'end_3km',
    name: '3km Run',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 3,
    difficultyDropFactor: 0.70,
    rankRequired: 'D',
    unit: 'km',
    defaultSets: 1,
    description:
      'A 3 km steady-state run. Aim to finish without walking. Track your time and work toward consistent improvement.',
  },
  {
    id: 'end_5km',
    name: '5km Run',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 4,
    difficultyDropFactor: 0.70,
    rankRequired: 'C',
    unit: 'km',
    defaultSets: 1,
    description:
      'The classic distance benchmark. Build toward a sub-30-minute finish, then keep pushing your pace.',
  },
  {
    id: 'end_10km',
    name: '10km Run',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 5,
    difficultyDropFactor: 0.60,
    rankRequired: 'B',
    unit: 'km',
    defaultSets: 1,
    description:
      'A serious endurance effort. Requires pacing strategy and mental toughness. Target a steady splits approach.',
  },
  {
    id: 'end_half_marathon',
    name: 'Half-Marathon Pace',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 6,
    difficultyDropFactor: 0.50,
    rankRequired: 'A',
    unit: 'km',
    defaultSets: 1,
    description:
      'Run 21.1 km at a sustainable pace. Nutrition and hydration strategy become critical at this distance.',
  },
  {
    id: 'end_marathon',
    name: 'Marathon Pace',
    category: 'endurance',
    progressionGroup: ENDURANCE_GROUP,
    variationOrder: 7,
    difficultyDropFactor: 0.40,
    rankRequired: 'S',
    unit: 'km',
    defaultSets: 1,
    description:
      'The ultimate test: 42.195 km. Only S-Rank hunters attempt this. Pacing, fuelling, and iron will are required.',
  },
];

// ─── Master exercise list ───────────────────────────────────────────────────
export const EXERCISES: Exercise[] = [
  ...strengthExercises,
  ...legsExercises,
  ...coreExercises,
  ...enduranceExercises,
];

// ─── Lookup helpers ─────────────────────────────────────────────────────────

/** Get a single exercise by its unique id. Returns `undefined` when not found. */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

/** Get all exercises that belong to a given category. */
export function getExercisesForCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISES.filter((e) => e.category === category);
}

/**
 * Return the full ordered progression ladder for a given group name
 * (e.g. "pushup", "squat", "core", "endurance").
 */
export function getProgressionLadder(progressionGroup: string): Exercise[] {
  return EXERCISES
    .filter((e) => e.progressionGroup === progressionGroup)
    .sort((a, b) => a.variationOrder - b.variationOrder);
}

/**
 * Given a current exercise, return the next harder variation in the same
 * progression group, or `undefined` if the hunter is already at the top.
 */
export function getNextVariation(currentExerciseId: string): Exercise | undefined {
  const current = getExerciseById(currentExerciseId);
  if (!current) return undefined;

  const ladder = getProgressionLadder(current.progressionGroup);
  const idx = ladder.findIndex((e) => e.id === currentExerciseId);
  return idx >= 0 && idx < ladder.length - 1 ? ladder[idx + 1] : undefined;
}

/**
 * Given a current exercise, return the previous easier variation in the same
 * progression group, or `undefined` if the hunter is already at the bottom.
 */
export function getPreviousVariation(currentExerciseId: string): Exercise | undefined {
  const current = getExerciseById(currentExerciseId);
  if (!current) return undefined;

  const ladder = getProgressionLadder(current.progressionGroup);
  const idx = ladder.findIndex((e) => e.id === currentExerciseId);
  return idx > 0 ? ladder[idx - 1] : undefined;
}
