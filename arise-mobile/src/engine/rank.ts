/**
 * ARISE Engine — Rank System
 *
 * Solo Leveling-inspired rank tiers from E (weakest) to S (strongest).
 * Each rank maps to a contiguous level range. A hunter's rank is derived
 * solely from their current level.
 *
 * Rank Thresholds:
 *   E: 1–20  |  D: 21–40  |  C: 41–60  |  B: 61–75  |  A: 76–90  |  S: 91–100
 *
 * The level bands narrow at higher ranks — climbing from A to S is
 * intentionally brutal, mirroring the exponential difficulty curve.
 */

/** Union type of all valid rank letters. */
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

/** Metadata for a single rank tier. */
export interface RankInfo {
  /** The rank letter. */
  rank: Rank;
  /** Human-readable display name. */
  name: string;
  /** Minimum level (inclusive) to enter this rank. */
  minLevel: number;
  /** Maximum level (inclusive) within this rank. */
  maxLevel: number;
  /** Hex colour associated with this rank for UI theming. */
  color: string;
}

/**
 * Ordered array of all rank tiers, from lowest (E) to highest (S).
 * Iteration order matters — `getRankFromLevel` scans top-down for the
 * first tier whose minLevel the player has reached.
 */
export const RANKS: readonly RankInfo[] = [
  { rank: 'E', name: 'E-Rank Hunter', minLevel: 1, maxLevel: 20, color: '#808080' },
  { rank: 'D', name: 'D-Rank Hunter', minLevel: 21, maxLevel: 40, color: '#4CAF50' },
  { rank: 'C', name: 'C-Rank Hunter', minLevel: 41, maxLevel: 60, color: '#2196F3' },
  { rank: 'B', name: 'B-Rank Hunter', minLevel: 61, maxLevel: 75, color: '#FF9800' },
  { rank: 'A', name: 'A-Rank Hunter', minLevel: 76, maxLevel: 90, color: '#FF3333' },
  { rank: 'S', name: 'S-Rank Hunter', minLevel: 91, maxLevel: 100, color: '#FFD700' },
] as const;

/** Quick lookup map: rank letter → hex colour string. */
const RANK_COLOR_MAP: Record<Rank, string> = {
  E: '#808080',
  D: '#4CAF50',
  C: '#2196F3',
  B: '#FF9800',
  A: '#FF3333',
  S: '#FFD700',
};

/** Quick lookup map: rank letter → display name. */
const RANK_NAME_MAP: Record<Rank, string> = {
  E: 'E-Rank Hunter',
  D: 'D-Rank Hunter',
  C: 'C-Rank Hunter',
  B: 'B-Rank Hunter',
  A: 'A-Rank Hunter',
  S: 'S-Rank Hunter',
};

/**
 * Derive the rank letter from a numeric level.
 *
 * The RANKS array is scanned in **reverse** (highest first) so the first
 * tier whose `minLevel` is ≤ the player's level is the correct match.
 *
 * @param level - Player level, clamped to [1, 100].
 * @returns The corresponding Rank letter.
 *
 * @example
 * ```ts
 * getRankFromLevel(1);   // 'E'
 * getRankFromLevel(45);  // 'C'
 * getRankFromLevel(100); // 'S'
 * ```
 */
export function getRankFromLevel(level: number): Rank {
  const clamped = Math.max(1, Math.min(100, Math.floor(level)));

  // Walk backwards — first tier whose minLevel we've passed is our rank.
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (clamped >= RANKS[i].minLevel) {
      return RANKS[i].rank;
    }
  }

  // Fallback (should never reach here with valid input).
  return 'E';
}

/**
 * Get the hex colour string for a given rank.
 *
 * @param rank - A valid Rank letter.
 * @returns Hex colour string (e.g. `'#FFD700'` for S-Rank).
 */
export function getRankColor(rank: Rank): string {
  return RANK_COLOR_MAP[rank];
}

/**
 * Get the human-readable display name for a given rank.
 *
 * @param rank - A valid Rank letter.
 * @returns Display name (e.g. `'S-Rank Hunter'`).
 */
export function getRankName(rank: Rank): string {
  return RANK_NAME_MAP[rank];
}

/**
 * Get the full RankInfo object for a given rank letter.
 *
 * @param rank - A valid Rank letter.
 * @returns The corresponding RankInfo, or undefined if invalid.
 */
export function getRankInfo(rank: Rank): RankInfo | undefined {
  return RANKS.find((r) => r.rank === rank);
}
