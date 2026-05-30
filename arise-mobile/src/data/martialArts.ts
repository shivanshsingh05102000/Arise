/**
 * ARISE — Martial Arts Move Definitions
 *
 * Moves are unlocked progressively as the hunter ranks up.
 * Each move belongs to a combat sub-category (strike, kick, combo, defense, footwork).
 */

import { type RankName, RANK_ORDER, meetsRankRequirement } from './exercises';

// ─── Types ──────────────────────────────────────────────────────────────────
export type MartialArtsCategory = 'strike' | 'kick' | 'combo' | 'defense' | 'footwork';

export interface MartialArtsMove {
  id: string;
  name: string;
  rankRequired: RankName;
  description: string;
  targetReps: number;
  category: MartialArtsCategory;
}

// ─── E-Rank Moves ───────────────────────────────────────────────────────────
const eRankMoves: MartialArtsMove[] = [
  {
    id: 'ma_jab',
    name: 'Jab',
    rankRequired: 'E',
    category: 'strike',
    targetReps: 20,
    description:
      'Lead-hand straight punch. Snap your fist forward from your guard, rotating the forearm so the palm faces down at full extension. Retract immediately. Speed over power.',
  },
  {
    id: 'ma_cross',
    name: 'Cross',
    rankRequired: 'E',
    category: 'strike',
    targetReps: 20,
    description:
      'Rear-hand straight punch. Rotate your rear hip and shoulder forward, driving the fist in a straight line to the target. Keep the lead hand guarding your chin.',
  },
  {
    id: 'ma_roundhouse_kick',
    name: 'Roundhouse Kick',
    rankRequired: 'E',
    category: 'kick',
    targetReps: 15,
    description:
      'Pivot on the support foot, swing the rear leg in a horizontal arc, and strike with the shin or instep. Rotate the hips fully through the target for maximum power.',
  },
  {
    id: 'ma_front_kick',
    name: 'Front Kick',
    rankRequired: 'E',
    category: 'kick',
    targetReps: 15,
    description:
      'Lift the knee high, then extend the leg to push or snap the ball of the foot into the target. A versatile technique for keeping distance or striking the midsection.',
  },
  {
    id: 'ma_guard_stance',
    name: 'Guard Stance',
    rankRequired: 'E',
    category: 'defense',
    targetReps: 10,
    description:
      'Stand with feet staggered, knees slightly bent, hands up protecting the chin. Elbows tight to the body, chin tucked. Hold and practise shifting weight. The foundation of all combat.',
  },
];

// ─── D-Rank Moves ───────────────────────────────────────────────────────────
const dRankMoves: MartialArtsMove[] = [
  {
    id: 'ma_hook',
    name: 'Hook',
    rankRequired: 'D',
    category: 'strike',
    targetReps: 15,
    description:
      'A short, arcing punch thrown with the lead or rear hand. Keep the elbow at 90°, rotate the hips and pivot the lead foot to generate torque. Targets the jaw and temple.',
  },
  {
    id: 'ma_uppercut',
    name: 'Uppercut',
    rankRequired: 'D',
    category: 'strike',
    targetReps: 15,
    description:
      'Drop the hand slightly, bend the knees, then drive upward through the legs and hips. The fist travels vertically to strike under the chin or to the body.',
  },
  {
    id: 'ma_side_kick',
    name: 'Side Kick',
    rankRequired: 'D',
    category: 'kick',
    targetReps: 12,
    description:
      'Chamber the knee across the body, then thrust the heel outward while leaning the torso away for counterbalance. A powerful linear kick for stopping opponents at range.',
  },
  {
    id: 'ma_elbow_strike',
    name: 'Elbow Strike',
    rankRequired: 'D',
    category: 'strike',
    targetReps: 15,
    description:
      'Close-range devastating strike. Swing the elbow horizontally, diagonally, or vertically using hip rotation. The hardest bone in the body becomes the weapon.',
  },
  {
    id: 'ma_clinch_defense',
    name: 'Clinch Defense',
    rankRequired: 'D',
    category: 'defense',
    targetReps: 10,
    description:
      'When grabbed in a clinch, pummel for underhooks, control posture by pulling the opponent's head down, and create angles to escape or deliver knees. Drill entries and exits.',
  },
];

// ─── C-Rank Moves ───────────────────────────────────────────────────────────
const cRankMoves: MartialArtsMove[] = [
  {
    id: 'ma_jab_cross_combo',
    name: 'Jab-Cross Combo',
    rankRequired: 'C',
    category: 'combo',
    targetReps: 12,
    description:
      'The fundamental two-punch combination. Jab to measure distance, immediately follow with a cross. Focus on smooth weight transfer and returning to guard between shots.',
  },
  {
    id: 'ma_switch_kick',
    name: 'Switch Kick',
    rankRequired: 'C',
    category: 'kick',
    targetReps: 10,
    description:
      'Quickly switch your stance and immediately throw a roundhouse or front kick with the newly-rear leg. The switch generates extra momentum and disguises the attack.',
  },
  {
    id: 'ma_knee_strike',
    name: 'Knee Strike',
    rankRequired: 'C',
    category: 'strike',
    targetReps: 12,
    description:
      'Drive the knee upward into the target using hip thrust. Can be thrown straight, diagonally, or from the clinch. Devastating at close range. Pull the opponent into the strike.',
  },
  {
    id: 'ma_overhand',
    name: 'Overhand',
    rankRequired: 'C',
    category: 'strike',
    targetReps: 10,
    description:
      'A looping power punch thrown over the opponent's guard. Drop the level slightly, then arc the rear fist over and down. Highly effective against taller opponents.',
  },
  {
    id: 'ma_teep',
    name: 'Teep',
    rankRequired: 'C',
    category: 'kick',
    targetReps: 12,
    description:
      'The "push kick" of Muay Thai. Extend the foot straight out from a high chamber, pushing the opponent back to maintain range. Use the ball or sole of the foot.',
  },
];

// ─── B-Rank Moves ───────────────────────────────────────────────────────────
const bRankMoves: MartialArtsMove[] = [
  {
    id: 'ma_spinning_back_kick',
    name: 'Spinning Back Kick',
    rankRequired: 'B',
    category: 'kick',
    targetReps: 8,
    description:
      'Pivot 180° on the lead foot, spot your target over the rear shoulder, and thrust the heel straight back. Generates tremendous force through rotational momentum.',
  },
  {
    id: 'ma_axe_kick',
    name: 'Axe Kick',
    rankRequired: 'B',
    category: 'kick',
    targetReps: 8,
    description:
      'Swing the leg high in an arc, then drive the heel straight down onto the target's collarbone or shoulder. Requires exceptional flexibility and timing.',
  },
  {
    id: 'ma_body_hook',
    name: 'Body Hook',
    rankRequired: 'B',
    category: 'strike',
    targetReps: 12,
    description:
      'Drop your level and throw a tight hook to the opponent's ribs or liver. Bend at the knees—not the waist—to change elevation while maintaining your guard.',
  },
  {
    id: 'ma_double_jab',
    name: 'Double Jab',
    rankRequired: 'B',
    category: 'combo',
    targetReps: 10,
    description:
      'Two rapid jabs in succession—the first to blind, the second to connect. Step forward on the second jab to close distance. Set up the power shot that follows.',
  },
  {
    id: 'ma_catch_counter',
    name: 'Catch & Counter',
    rankRequired: 'B',
    category: 'defense',
    targetReps: 8,
    description:
      'Catch or parry an incoming kick, momentarily trapping the opponent's leg, then immediately counter with a strike or sweep before they can recover balance.',
  },
];

// ─── A-Rank Moves ───────────────────────────────────────────────────────────
const aRankMoves: MartialArtsMove[] = [
  {
    id: 'ma_spinning_heel_kick',
    name: 'Spinning Heel Kick',
    rankRequired: 'A',
    category: 'kick',
    targetReps: 6,
    description:
      'A full 360° spin delivering the heel to the target's head. Requires precise timing and spatial awareness. One of the most spectacular and dangerous kicks in martial arts.',
  },
  {
    id: 'ma_flying_knee',
    name: 'Flying Knee',
    rankRequired: 'A',
    category: 'strike',
    targetReps: 6,
    description:
      'Leap forward off the rear foot, driving the lead knee upward into the target while airborne. Commit fully—this is an all-or-nothing finishing technique.',
  },
  {
    id: 'ma_combination_flows',
    name: 'Combination Flows (4+ Strikes)',
    rankRequired: 'A',
    category: 'combo',
    targetReps: 8,
    description:
      'Chain four or more strikes (punches, elbows, knees, kicks) into a fluid combination. Each strike sets up the next through weight transfer and angle changes. Creativity is key.',
  },
];

// ─── S-Rank Moves ───────────────────────────────────────────────────────────
const sRankMoves: MartialArtsMove[] = [
  {
    id: 'ma_full_combo_drills',
    name: 'Full Combination Drills',
    rankRequired: 'S',
    category: 'combo',
    targetReps: 5,
    description:
      'Extended multi-round combination drills incorporating strikes, kicks, knees, elbows, and defensive transitions. Simulate real fight scenarios with maximum intensity and variety.',
  },
  {
    id: 'ma_shadow_boxing',
    name: 'Shadow Boxing Rounds',
    rankRequired: 'S',
    category: 'combo',
    targetReps: 5,
    description:
      'Three-minute rounds of free-form shadow boxing. Visualise an opponent, use the full arsenal of techniques, practise footwork angles, and maintain guard discipline throughout.',
  },
  {
    id: 'ma_advanced_footwork',
    name: 'Advanced Footwork Patterns',
    rankRequired: 'S',
    category: 'footwork',
    targetReps: 5,
    description:
      'Complex movement drills: lateral slides, pivot sequences, in-and-out bursts, diamond steps, and angle changes. Move smoothly in all directions while maintaining a fighting stance.',
  },
];

// ─── Master list ────────────────────────────────────────────────────────────
export const MARTIAL_ARTS_MOVES: MartialArtsMove[] = [
  ...eRankMoves,
  ...dRankMoves,
  ...cRankMoves,
  ...bRankMoves,
  ...aRankMoves,
  ...sRankMoves,
];

// ─── Lookup helpers ─────────────────────────────────────────────────────────

/** Get all moves that require exactly the given rank. */
export function getMovesForRank(rank: RankName): MartialArtsMove[] {
  return MARTIAL_ARTS_MOVES.filter((m) => m.rankRequired === rank);
}

/**
 * Get every move the hunter has unlocked up to (and including) their current rank.
 * Results are ordered from lowest to highest rank requirement.
 */
export function getUnlockedMoves(currentRank: RankName): MartialArtsMove[] {
  return MARTIAL_ARTS_MOVES.filter((m) => meetsRankRequirement(currentRank, m.rankRequired))
    .sort(
      (a, b) =>
        RANK_ORDER.indexOf(a.rankRequired) - RANK_ORDER.indexOf(b.rankRequired),
    );
}
