export const RANKS = [
  { name: 'E', min: 1, max: 20, multiplier: 1.011, weeklyRate: 0.08 },
  { name: 'D', min: 21, max: 40, multiplier: 1.010, weeklyRate: 0.07 },
  { name: 'C', min: 41, max: 60, multiplier: 1.007, weeklyRate: 0.05 },
  { name: 'B', min: 61, max: 75, multiplier: 1.006, weeklyRate: 0.04 },
  { name: 'A', min: 76, max: 90, multiplier: 1.004, weeklyRate: 0.025 },
  { name: 'S', min: 91, max: 100, multiplier: 1.003, weeklyRate: 0.02 },
]

export const STRENGTH_LADDER = [
  { id: 'standard', name: 'Standard Push-Up', dropFactor: 1.00, setsDrop: 0 },
  { id: 'diamond', name: 'Diamond Push-Up', dropFactor: 0.70, setsDrop: 0 },
  { id: 'wide', name: 'Wide Push-Up', dropFactor: 0.70, setsDrop: 0 },
  { id: 'archer', name: 'Archer Push-Up', dropFactor: 0.50, setsDrop: 1 },
  { id: 'decline', name: 'Decline Push-Up', dropFactor: 0.70, setsDrop: 0 },
  { id: 'pike', name: 'Pike Push-Up', dropFactor: 0.60, setsDrop: 0 },
  { id: 'onearm_neg', name: 'One-Arm Negative', dropFactor: 0.40, setsDrop: 1 },
  { id: 'onearm', name: 'One-Arm Push-Up', dropFactor: 0.40, setsDrop: 1 },
]

export const ENDURANCE_LADDER = [
  { id: 'walk_run', name: 'Walk/Run Intervals', targetKm: 1.0 },
  { id: 'run_1k', name: 'Continuous 1km Run', targetKm: 1.0 },
  { id: 'run_3k', name: '3km Run', targetKm: 3.0 },
  { id: 'run_5k', name: '5km Run', targetKm: 5.0 },
  { id: 'run_10k', name: '10km Run', targetKm: 10.0 },
  { id: 'half_marathon', name: 'Half Marathon Pace', targetKm: 21.1 },
  { id: 'marathon', name: 'Marathon', targetKm: 42.2 },
]

export const MARTIAL_MOVES = {
  E: [
    { id: 'jab', name: 'Jab', desc: 'Lead hand straight punch. Snap from guard, rotate fist on contact. 50 reps.' },
    { id: 'cross', name: 'Cross', desc: 'Rear hand power punch. Drive from rear hip, full rotation. 50 reps.' },
    { id: 'roundhouse', name: 'Roundhouse Kick', desc: 'Pivot on support foot. Chamber knee, rotate hip, strike with shin. 30 reps each side.' },
    { id: 'front_kick', name: 'Front Kick', desc: 'Chamber knee to chest. Thrust ball of foot straight forward. 30 reps each side.' },
    { id: 'guard', name: 'Guard Stance', desc: 'Chin down, hands up, weight balanced. Hold for 3 min x 3 sets, moving in place.' },
  ],
  D: [
    { id: 'hook', name: 'Hook', desc: 'Bent arm lateral strike. Elbow parallel to floor, rotate entire body. 50 reps.' },
    { id: 'uppercut', name: 'Uppercut', desc: 'Rising vertical punch from guard. Dip slightly, drive from legs. 50 reps.' },
    { id: 'side_kick', name: 'Side Kick', desc: 'Chamber, pivot 90deg, thrust heel directly out. 30 reps each side.' },
    { id: 'elbow', name: 'Elbow Strike', desc: 'Short range horizontal elbow. Close range, rotate full body weight into it. 40 reps each side.' },
    { id: 'clinch_def', name: 'Clinch Defense', desc: 'Underhook battle drill. 3 min x 3 sets against wall or partner.' },
  ],
  C: [
    { id: 'jab_cross', name: 'Jab-Cross Combo', desc: '1-2 combination. Snap jab immediately followed by rear hand cross. 40 combos.' },
    { id: 'switch_kick', name: 'Switch Kick', desc: 'Explode-switch feet mid-stance, throw rear roundhouse immediately. 25 each side.' },
    { id: 'knee_strike', name: 'Knee Strike', desc: 'Pull clinch, drive knee upward into center mass. 40 reps each side.' },
    { id: 'overhand', name: 'Overhand Right', desc: 'Looping rear hand over opponent guard. 50 reps.' },
    { id: 'teep', name: 'Teep (Push Kick)', desc: 'Flat-footed push kick. Extend leg forward with heel, not ball of foot. 30 reps each side.' },
  ],
  B: [
    { id: 'spin_back', name: 'Spinning Back Kick', desc: 'Pivot 180deg, chamber, thrust rear heel directly back at head height. 20 each side.' },
    { id: 'axe_kick', name: 'Axe Kick', desc: 'Raise leg overhead, hammer heel downward onto target. 20 each side.' },
    { id: 'body_hook', name: 'Body Hook', desc: 'Hook directed at liver/ribs. Drop level, bend knees, drive upward hook into body. 50 reps.' },
    { id: 'double_jab', name: 'Double Jab', desc: 'Two lead hand jabs in sequence before power shot. 40 double-jab combos.' },
    { id: 'catch_counter', name: 'Catch & Counter', desc: 'Catch incoming jab on palm, immediately fire cross. Partner or wall drill. 30 exchanges.' },
  ],
  A: [
    { id: 'spin_heel', name: 'Spinning Heel Kick', desc: 'Full 360 rotation, strike with rear heel at head height. 15 each side.' },
    { id: 'flying_knee', name: 'Flying Knee', desc: 'Jump off lead foot, drive rear knee forward at full extension. 15 each side.' },
    { id: 'combo_flow', name: '4-Strike Combo Flow', desc: 'Jab -> Cross -> Hook -> Low Kick. Fluid chain, no pause. 30 complete combos.' },
  ],
  S: [
    { id: 'shadow_box', name: 'Shadow Boxing Round', desc: '3-minute round. Continuous movement, all learned strikes. 5 rounds.' },
    { id: 'adv_footwork', name: 'Advanced Footwork', desc: 'Lateral cuts, level changes, angle exits. 10 min continuous movement drill.' },
    { id: 'full_combo', name: 'Full Combination Drill', desc: '6+ strike sequences at full speed. 20 full combos per set, 3 sets.' },
  ],
}

export const XP_BASE = 100
export const XP_GROWTH = 1.15

export const CATEGORY_KEYS = ['strength', 'legs', 'core', 'endurance', 'martial']

export const CATEGORY_META = {
  strength: { label: 'Strength', color: '#9966ff', accent: 'purple', icon: 'Dumbbell' },
  legs: { label: 'Legs', color: '#ff6644', accent: 'red', icon: 'Footprints' },
  core: { label: 'Core', color: '#c9a84c', accent: 'gold', icon: 'Shield' },
  endurance: { label: 'Endurance', color: '#00c8ff', accent: 'cyan', icon: 'Activity' },
  martial: { label: 'Martial Arts', color: '#ff44cc', accent: 'magenta', icon: 'Swords' },
}

export const DAILY_QUOTES = [
  'You did not choose to be weak. But you are choosing to stay that way.',
  'The gap between you and the person you want to become is measured in days completed.',
  'Pain is the System updating your software. Do not interrupt the process.',
  'Every hunter who reached S-Rank was once exactly where you are. Most quit here.',
  'The System does not care about your mood. Neither should you.',
  'Discipline is the only stat that transfers to every battlefield.',
  'Your body records every completed quest. It also records every excuse.',
  'A weak day completed beats a perfect day imagined.',
  'Comfort is a debuff. Remove it.',
  'The mirror is not judging you. The data is.',
  'Recovery is permitted. Avoidance is not.',
  'You are not tired. You are undertrained.',
  'The target is not punishment. It is coordinates.',
  'Today is another audit of your intent.',
  'Hunters do not negotiate with assigned work.',
  'If the number looks impossible, good. Adaptation has begun.',
  'No witness is required. The System records everything.',
  'Failure is data. Repeated failure is a decision.',
  'You owe the future version of yourself evidence.',
  'Weakness survives in skipped days.',
  'Rank is not granted. Rank is extracted.',
  'The body follows what the log proves.',
  'Your limits are outdated information.',
  'The quest timer is indifferent.',
  'Complete the protocol. Then rest without guilt.',
  'Tomorrow will be harder if today is avoided.',
]

export const SYSTEM_MESSAGES = {
  questComplete: (xp) => `[ QUEST COMPLETE - +${xp} XP ABSORBED ]`,
  levelUp: (level) => `[ LEVEL UP - YOU ARE NOW LEVEL ${level} ]`,
  rankUp: (rank) => `[ RANK UPGRADE DETECTED - ${rank}-RANK HUNTER ]`,
  penaltyHold: () => `[ FAILURE RECORDED. TARGET HELD. DO NOT MAKE THIS A HABIT. ]`,
  penaltyEscalate3: () => `[ 3 CONSECUTIVE FAILURES. SHOCK ESCALATION APPLIED. +5% TARGET. ]`,
  penaltyEscalate5: () => `[ PROLONGED AVOIDANCE DETECTED. +10% TARGET INCREASE. THE SYSTEM IS WATCHING. ]`,
  streakBonus: (days) => `[ ${days}-DAY STREAK - BONUS XP MULTIPLIER ACTIVE ]`,
  variationUpgrade: (name) => `[ EXERCISE EVOLUTION - NEW VARIATION UNLOCKED: ${name} ]`,
  newMove: (name) => `[ NEW MARTIAL TECHNIQUE ASSIGNED: ${name} ]`,
  allComplete: () => `[ ALL QUESTS COMPLETE. DAILY PROTOCOL SATISFIED. REST. ]`,
  exceeded: () => `[ TARGET EXCEEDED - OUTSTANDING PERFORMANCE. +50% XP BONUS APPLIED. ]`,
  personalRecord: (category) => `[ NEW PERSONAL RECORD - ${category.toUpperCase()} ]`,
  assessmentComplete: () => `[ ASSESSMENT COMPLETE. BASELINE LOCKED. INITIALIZING PROTOCOL. ]`,
}
