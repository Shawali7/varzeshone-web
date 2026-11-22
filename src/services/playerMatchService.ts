import type { Match } from "../types/sports";
import type { PlayerMatchPerformance } from "../types";
import { staticApi } from "./api";

export type PlayerMatchHistoryItem = {
  performance: PlayerMatchPerformance;
  match: Match;
};

export async function getPlayerMatchHistory(
  playerId: string,
): Promise<PlayerMatchHistoryItem[]> {
  return staticApi.getPlayerMatchHistory(playerId);
}
