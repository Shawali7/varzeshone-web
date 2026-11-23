import type { League, Match } from "../types/sports";
import { staticApi } from "./api";
import type { DemoVenue } from "../data/geographyData";

export async function getLeagues(): Promise<League[]> {
  return staticApi.getLeagues();
}

export async function getMatches(): Promise<Match[]> {
  return staticApi.getMatches();
}

export async function getMatchesByLeague(
  leagueId: string,
): Promise<Match[]> {
  return staticApi.getMatchesByLeague(leagueId);
}

export async function getVenues(): Promise<DemoVenue[]> {
  return staticApi.getVenues();
}
