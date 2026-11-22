import {
  demoStandings,
  demoFixtures,
  demoTopRated,
  demoTopScorers,
  demoTopAssists,
} from "../data/leagueData";

import type { Standing, PlayerStat } from "../data/leagueData";

type LeagueFixture = (typeof demoFixtures)[number];

const DEMO_LEAGUE_ID = "afghanistan-premier-league";
const DEMO_SEASON = "2026/2027";

function isDemoScope(leagueId: string, season: string): boolean {
  return leagueId === DEMO_LEAGUE_ID && season === DEMO_SEASON;
}

export const leagueService = {
  async getStandings(
    leagueId: string,
    season: string,
  ): Promise<Standing[]> {
    if (!isDemoScope(leagueId, season)) {
      return [];
    }

    return [...demoStandings];
  },

  async getFixtures(
    leagueId: string,
    season: string,
  ): Promise<LeagueFixture[]> {
    if (!isDemoScope(leagueId, season)) {
      return [];
    }

    return [...demoFixtures];
  },

  async getTopRated(
    leagueId: string,
    season: string,
  ): Promise<PlayerStat[]> {
    if (!isDemoScope(leagueId, season)) {
      return [];
    }

    return [...demoTopRated];
  },

  async getTopScorers(
    leagueId: string,
    season: string,
  ): Promise<PlayerStat[]> {
    if (!isDemoScope(leagueId, season)) {
      return [];
    }

    return [...demoTopScorers];
  },

  async getTopAssists(
    leagueId: string,
    season: string,
  ): Promise<PlayerStat[]> {
    if (!isDemoScope(leagueId, season)) {
      return [];
    }

    return [...demoTopAssists];
  },
};
