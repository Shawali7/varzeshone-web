import { getDemoLeagueSeasonData } from "../data/leagueData";
import type { LeagueSeasonData } from "../data/leagueData";

export const leagueService = {
  async getSeasonData(
    leagueId: string,
    season: string,
  ): Promise<LeagueSeasonData> {
    return getDemoLeagueSeasonData(leagueId, season);
  },
};
