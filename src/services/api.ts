import type { League, Match } from "../types/sports";
import type {
  Team,
  Player,
  PlayerMatchPerformance,
  PlayerTransfer,
  TeamMembership,
} from "../types";

import { leagues, matches } from "../data/mockData";
import { demoTeams } from "../data/teamData";
import { demoPlayers } from "../data/playerData";
import { demoPlayerMatchPerformances } from "../data/playerMatchData";
import { demoTransfers } from "../data/transferData";
import { demoMemberships } from "../data/membershipData";
import { getDemoMatchDetails } from "../data/matchDetailData";
import { demoVenues } from "../data/geographyData";
import type { DemoVenue } from "../data/geographyData";

export const staticApi = {
  async getLeagues(): Promise<League[]> {
    return [...leagues];
  },

  async getMatches(): Promise<Match[]> {
    return [...matches];
  },

  async getMatchesByLeague(leagueId: string): Promise<Match[]> {
    return matches.filter((match) => match.leagueId === leagueId);
  },

  async getMatchDetails(matchId: string) {
    return getDemoMatchDetails(matchId);
  },

  async getTeams(): Promise<Team[]> {
    return [...demoTeams];
  },

  async getTeamById(id: string): Promise<Team | undefined> {
    return demoTeams.find((team) => team.id === id);
  },

  async getVenues(): Promise<DemoVenue[]> {
    return [...demoVenues];
  },

  async getVenueById(id: string): Promise<DemoVenue | undefined> {
    return demoVenues.find((venue) => venue.id === id);
  },

  async getPlayers(): Promise<Player[]> {
    return [...demoPlayers];
  },

  async getPlayerById(id: string): Promise<Player | undefined> {
    return demoPlayers.find((player) => player.id === id);
  },

  async getPlayerMatchHistory(playerId: string) {
    const performances = demoPlayerMatchPerformances.filter(
      (item) => item.playerId === playerId,
    );

    return performances
      .map((performance) => {
        const match = matches.find(
          (item) => item.id === performance.matchId,
        );

        if (!match || match.status !== "FT") {
          return undefined;
        }

        return { performance, match };
      })
      .filter(
        (
          item,
        ): item is {
          performance: PlayerMatchPerformance;
          match: Match;
        } => item !== undefined,
      )
      .sort(
        (a, b) =>
          new Date(b.match.date).getTime() -
          new Date(a.match.date).getTime(),
      );
  },

  async getTransfers(): Promise<PlayerTransfer[]> {
    return [...demoTransfers];
  },

  async getPlayerTransferHistory(
    playerId: string,
  ): Promise<PlayerTransfer[]> {
    const transfers = await this.getTransfers();

    return transfers
      .filter((transfer) => transfer.playerId === playerId)
      .sort(
        (a, b) =>
          new Date(b.transferDate).getTime() -
          new Date(a.transferDate).getTime(),
      );
  },

  async getTeamMemberships(): Promise<TeamMembership[]> {
    return [...demoMemberships];
  },

  async getPlayerMembershipHistory(
    playerId: string,
  ): Promise<TeamMembership[]> {
    const memberships = await this.getTeamMemberships();

    return memberships
      .filter((membership) => membership.playerId === playerId)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime(),
      );
  },
};

