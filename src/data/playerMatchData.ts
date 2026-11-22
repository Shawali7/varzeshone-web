import type { PlayerMatchPerformance } from "../types";

/**
 * Static player match performance data.
 * Demo records are examples only, not verified real-world statistics.
 */
export const demoPlayerMatchPerformances: PlayerMatchPerformance[] = [
  {
    id: "demo-performance-001",
    playerId: "demo-player-02",
    matchId: "match-001",
    teamId: "kabul-fc",
    started: true,
    minutesPlayed: 90,
    goals: 1,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    isVerified: false,
    isDemo: true,
  },
];