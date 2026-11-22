import type { Match } from "../types/sports";
import type { MatchDetails } from "../data/matchDetailData";
import { staticApi } from "./api";

export async function getMatchDetails(
  matchId: Match["id"],
): Promise<MatchDetails | undefined> {
  return staticApi.getMatchDetails(matchId);
}
