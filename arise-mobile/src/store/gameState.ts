/**
 * ARISE — Game State Persistence Layer
 *
 * All game state is serialised to JSON and stored under a single
 * AsyncStorage key.  A version suffix allows seamless migrations
 * when the schema evolves.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RankName, ExerciseCategory } from '../data/exercises';

// ─── Storage key ────────────────────────────────────────────────────────────
const STORAGE_KEY = 'arise.game.state.v2';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CategoryState {
  /** ID of the current exercise variation the hunter is training. */
  exerciseId: string;
  /** Target rep / second / km count per set for this exercise. */
  targetReps: number;
  /** Number of sets assigned for today. */
  targetSets: number;
  /** Whether the hunter has finished this category's quest today. */
  completedToday: boolean;
  /** Actual reps/seconds/km achieved today (summed across sets). */
  actualToday: number;
  /** Streak of consecutive days the hunter met the target. */
  consecutiveSuccess: number;
  /** Streak of consecutive days the hunter failed to meet the target. */
  consecutiveFailures: number;
  /** Index within the progression ladder (0-based). */
  variationIndex: number;
  /** Adaptive difficulty multiplier (0–1, applied to base targets). */
  difficulty: number;
}

export interface HistoryEntry {
  date: string; // ISO 8601 date string (YYYY-MM-DD)
  category: ExerciseCategory;
  exerciseId: string;
  targetReps: number;
  actualReps: number;
  sets: number;
  completed: boolean;
  xpEarned: number;
}

export interface AssessmentResults {
  date: string; // ISO 8601 date string
  pushUps: number;
  squats: number;
  plankSeconds: number;
  runKm: number;
  overallScore: number;
  assignedRank: RankName;
}

export interface GameState {
  /** Has the first-time setup (assessment) been completed? */
  initialized: boolean;

  // ── Progression ───────────────────────────────────────────────────────
  level: number;
  rank: RankName;
  totalXp: number;
  /** XP accumulated in the current level. */
  currentXp: number;

  // ── Streaks ───────────────────────────────────────────────────────────
  currentStreak: number;
  bestStreak: number;
  lastQuestDate: string | null; // ISO date (YYYY-MM-DD)
  joinDate: string;             // ISO date

  // ── Punishment system ─────────────────────────────────────────────────
  punishmentActive: boolean;
  consecutiveFailDays: number;

  // ── Per-category state ────────────────────────────────────────────────
  categories: Record<ExerciseCategory, CategoryState>;

  // ── Quest history ─────────────────────────────────────────────────────
  history: HistoryEntry[];

  // ── Initial assessment ────────────────────────────────────────────────
  assessmentResults: AssessmentResults | null;
}

// ─── Defaults ───────────────────────────────────────────────────────────────

function createDefaultCategoryState(exerciseId: string): CategoryState {
  return {
    exerciseId,
    targetReps: 10,
    targetSets: 3,
    completedToday: false,
    actualToday: 0,
    consecutiveSuccess: 0,
    consecutiveFailures: 0,
    variationIndex: 0,
    difficulty: 1.0,
  };
}

/** Build a fresh game state (pre-assessment). */
export function getInitialState(): GameState {
  const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  return {
    initialized: false,

    level: 1,
    rank: 'E',
    totalXp: 0,
    currentXp: 0,

    currentStreak: 0,
    bestStreak: 0,
    lastQuestDate: null,
    joinDate: now,

    punishmentActive: false,
    consecutiveFailDays: 0,

    categories: {
      strength: createDefaultCategoryState('str_pushup_standard'),
      legs: createDefaultCategoryState('leg_squat_bodyweight'),
      core: createDefaultCategoryState('core_plank'),
      endurance: createDefaultCategoryState('end_walk_run'),
      martial_arts: createDefaultCategoryState('ma_jab'),
    },

    history: [],
    assessmentResults: null,
  };
}

// ─── Persistence functions ──────────────────────────────────────────────────

/**
 * Load the game state from AsyncStorage.
 * Returns the persisted state, or a fresh initial state when none exists.
 */
export async function loadGameState(): Promise<GameState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as GameState;
    }
  } catch (error) {
    console.warn('[ARISE] Failed to load game state, returning initial state:', error);
  }
  return getInitialState();
}

/**
 * Persist the full game state to AsyncStorage.
 */
export async function saveGameState(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('[ARISE] Failed to save game state:', error);
    throw error;
  }
}

/**
 * Delete the stored game state and return to a blank slate.
 * Returns the fresh initial state for convenience.
 */
export async function resetGameState(): Promise<GameState> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[ARISE] Failed to reset game state:', error);
    throw error;
  }
  return getInitialState();
}
