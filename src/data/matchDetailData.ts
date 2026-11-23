import type { Match } from "../types/sports";
import { getDemoLeagueSeasonData } from "./leagueData";
import { demoPlayers } from "./playerData";
import { demoTeams } from "./teamData";
import { matches } from "./mockData";

export type MatchEvent = {
  minute: string;
  type: "goal" | "card" | "sub";
  team: "home" | "away";
  teamId: string;
  playerId: string;
  title: string;
  player: string;
  detail: string;
};

export type MatchLineupPlayer = {
  playerId: string;
  teamId: string;
  number: string;
  player: string;
  rating: string;
};

export type MatchFormItem = {
  matchId: string;
  teamId: string;
  team: string;
  score: string;
  result: "W" | "D" | "L";
};

export type MatchStat = {
  label: string;
  home: string;
  away: string;
};

export type MatchTableRow = {
  position: number;
  leagueId: string;
  seasonId: string;
  teamId: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export type HeadToHeadMeeting = {
  matchId: string;
  homeTeamId: string;
  home: string;
  score: string;
  awayTeamId: string;
  away: string;
};

export type MatchDetails = {
  isDemo: true;
  venueId?: string;
  events: MatchEvent[];
  homePlayers: MatchLineupPlayer[];
  awayPlayers: MatchLineupPlayer[];
  form: MatchFormItem[];
  stats: MatchStat[];
  table: MatchTableRow[];
  headToHead?: {
    homeWins: number;
    draws: number;
    awayWins: number;
    meetings: HeadToHeadMeeting[];
  };
};

const demoMatchDetails: Record<string, MatchDetails> = {
  "match-001": {
    isDemo: true,
    events: [
      { minute: "18'", type: "goal", team: "home", teamId: "herat-fc", playerId: "demo-player-01", title: "Goal", player: "Ahmad Rahimi", detail: "Right-footed shot" },
      { minute: "35'", type: "goal", team: "away", teamId: "kabul-fc", playerId: "demo-player-02", title: "Goal", player: "Farid Ahmadi", detail: "Header" },
      { minute: "72'", type: "goal", team: "home", teamId: "herat-fc", playerId: "demo-player-01", title: "Goal", player: "Ahmad Rahimi", detail: "Left-footed shot" },
    ],
    homePlayers: [
      { playerId: "demo-player-01", teamId: "herat-fc", number: "9", player: "Ahmad Rahimi", rating: "8.4" },
    ],
    awayPlayers: [
      { playerId: "demo-player-02", teamId: "kabul-fc", number: "10", player: "Farid Ahmadi", rating: "7.1" },
    ],
    form: [],
    stats: [
      { label: "Possession", home: "56%", away: "44%" },
      { label: "Total shots", home: "14", away: "9" },
      { label: "Shots on target", home: "6", away: "3" },
      { label: "Corners", home: "7", away: "4" },
      { label: "Fouls", home: "11", away: "15" },
    ],
    table: [],
  },
  "match-002": {
    isDemo: true,
    events: [
      { minute: "24'", type: "goal", team: "home", teamId: "kandahar-fc", playerId: "player-omid-waziri", title: "Goal", player: "Omid Waziri", detail: "Right-footed shot" },
      { minute: "39'", type: "goal", team: "away", teamId: "balkh-fc", playerId: "player-hamid-karimi", title: "Goal", player: "Hamid Karimi", detail: "Close-range finish" },
    ],
    homePlayers: [
      { playerId: "player-omid-waziri", teamId: "kandahar-fc", number: "8", player: "Omid Waziri", rating: "7.3" },
    ],
    awayPlayers: [
      { playerId: "player-hamid-karimi", teamId: "balkh-fc", number: "4", player: "Hamid Karimi", rating: "7.0" },
    ],
    form: [],
    stats: [
      { label: "Possession", home: "51%", away: "49%" },
      { label: "Total shots", home: "8", away: "7" },
      { label: "Shots on target", home: "3", away: "3" },
      { label: "Corners", home: "4", away: "5" },
      { label: "Fouls", home: "9", away: "10" },
    ],
    table: [],
  },
  "match-005": {
    isDemo: true,
    events: [
      { minute: "5'", type: "goal", team: "home", teamId: "herat-futsal", playerId: "demo-player-04", title: "Goal", player: "Demo Futsal Player 01", detail: "Futsal finish" },
      { minute: "9'", type: "goal", team: "away", teamId: "kabul-futsal", playerId: "player-futsal-ahmadi", title: "Goal", player: "Demo Futsal Player 02", detail: "Futsal finish" },
      { minute: "14'", type: "goal", team: "home", teamId: "herat-futsal", playerId: "demo-player-04", title: "Goal", player: "Demo Futsal Player 01", detail: "Futsal finish" },
      { minute: "22'", type: "goal", team: "away", teamId: "kabul-futsal", playerId: "player-futsal-ahmadi", title: "Goal", player: "Demo Futsal Player 02", detail: "Futsal finish" },
      { minute: "31'", type: "goal", team: "home", teamId: "herat-futsal", playerId: "demo-player-04", title: "Goal", player: "Demo Futsal Player 01", detail: "Futsal finish" },
      { minute: "38'", type: "goal", team: "home", teamId: "herat-futsal", playerId: "demo-player-04", title: "Goal", player: "Demo Futsal Player 01", detail: "Futsal finish" },
    ],
    homePlayers: [
      { playerId: "demo-player-04", teamId: "herat-futsal", number: "7", player: "Demo Futsal Player 01", rating: "8.2" },
    ],
    awayPlayers: [
      { playerId: "player-futsal-ahmadi", teamId: "kabul-futsal", number: "10", player: "Demo Futsal Player 02", rating: "7.8" },
    ],
    form: [],
    stats: [
      { label: "Possession", home: "53%", away: "47%" },
      { label: "Total shots", home: "18", away: "12" },
      { label: "Shots on target", home: "10", away: "6" },
      { label: "Corners", home: "5", away: "3" },
      { label: "Fouls", home: "6", away: "8" },
    ],
    table: [],
  },
};

const playersById = new Map(demoPlayers.map((player) => [player.id, player] as const));
const teamsById = new Map(demoTeams.map((team) => [team.id, team] as const));

function getResult(homeScore: number, awayScore: number, isHome: boolean): "W" | "D" | "L" {
  const scored = isHome ? homeScore : awayScore;
  const conceded = isHome ? awayScore : homeScore;
  return scored > conceded ? "W" : scored < conceded ? "L" : "D";
}

export function getDemoMatchDetails(matchId: Match["id"]): MatchDetails | undefined {
  if (!Object.hasOwn(demoMatchDetails, matchId)) return undefined;
  const match = matches.find((item) => item.id === matchId);
  if (!match) return undefined;
  const base = demoMatchDetails[matchId];
  const leagueData = getDemoLeagueSeasonData(match.leagueId, match.seasonId);
  const events = base.events.map((event) => {
    const player = playersById.get(event.playerId);
    if (!player || player.teamId !== event.teamId ||
      (event.teamId !== match.homeTeamId && event.teamId !== match.awayTeamId)) {
      throw new Error(`Invalid player reference in demo event for ${match.id}`);
    }
    return {
      ...event,
      team: event.teamId === match.homeTeamId ? "home" as const : "away" as const,
      player: player.name,
    };
  });
  const hydrateLineup = (players: MatchLineupPlayer[], expectedTeamId: string) =>
    players.map((lineupPlayer) => {
      const player = playersById.get(lineupPlayer.playerId);
      if (!player || player.teamId !== expectedTeamId || lineupPlayer.teamId !== expectedTeamId) {
        throw new Error(`Invalid player reference in demo lineup for ${match.id}`);
      }
      return { ...lineupPlayer, player: player.name };
    });
  const matchHomeTeam = teamsById.get(match.homeTeamId);
  const matchAwayTeam = teamsById.get(match.awayTeamId);
  if (!matchHomeTeam || !matchAwayTeam) throw new Error(`Missing teams for demo match ${match.id}`);
  const form = matches
    .filter((item) =>
      item.leagueId === match.leagueId &&
      item.seasonId === match.seasonId &&
      item.status === "FT" &&
      (item.homeTeamId === match.homeTeamId || item.awayTeamId === match.homeTeamId ||
        item.homeTeamId === match.awayTeamId || item.awayTeamId === match.awayTeamId),
    )
    .map((item) => {
      if (item.homeScore === undefined || item.awayScore === undefined) {
        throw new Error(`Finished demo match ${item.id} is missing a score`);
      }
      if (!teamsById.has(item.homeTeamId) || !teamsById.has(item.awayTeamId)) {
        throw new Error(`Missing team for demo match ${item.id}`);
      }
      const records: MatchFormItem[] = [];
      if (item.homeTeamId === match.homeTeamId || item.awayTeamId === match.homeTeamId) {
        const isHome = item.homeTeamId === match.homeTeamId;
        records.push({
          matchId: item.id,
          teamId: match.homeTeamId,
          team: matchHomeTeam.name,
          score: `${isHome ? item.homeScore : item.awayScore}-${isHome ? item.awayScore : item.homeScore}`,
          result: getResult(item.homeScore, item.awayScore, isHome),
        });
      }
      if (item.homeTeamId === match.awayTeamId || item.awayTeamId === match.awayTeamId) {
        const isHome = item.homeTeamId === match.awayTeamId;
        records.push({
          matchId: item.id,
          teamId: match.awayTeamId,
          team: matchAwayTeam.name,
          score: `${isHome ? item.homeScore : item.awayScore}-${isHome ? item.awayScore : item.homeScore}`,
          result: getResult(item.homeScore, item.awayScore, isHome),
        });
      }
      return records;
    })
    .flat()
    .slice(-10);
  const headToHeadMeetings = matches
    .filter((item) =>
      item.id !== match.id &&
      item.status === "FT" &&
      ((item.homeTeamId === match.homeTeamId && item.awayTeamId === match.awayTeamId) ||
        (item.homeTeamId === match.awayTeamId && item.awayTeamId === match.homeTeamId)),
    )
    .map((item) => ({
      matchId: item.id,
      homeTeamId: item.homeTeamId,
      home: item.home,
      score: `${item.homeScore ?? 0}-${item.awayScore ?? 0}`,
      awayTeamId: item.awayTeamId,
      away: item.away,
    }));
  const previousMeetings = headToHeadMeetings.length
    ? {
        homeWins: headToHeadMeetings.filter((item) =>
          (item.homeTeamId === match.homeTeamId && Number(item.score.split("-")[0]) > Number(item.score.split("-")[1])) ||
          (item.awayTeamId === match.homeTeamId && Number(item.score.split("-")[1]) > Number(item.score.split("-")[0])),
        ).length,
        draws: headToHeadMeetings.filter((item) => item.score.split("-")[0] === item.score.split("-")[1]).length,
        awayWins: headToHeadMeetings.filter((item) =>
          (item.homeTeamId === match.awayTeamId && Number(item.score.split("-")[0]) > Number(item.score.split("-")[1])) ||
          (item.awayTeamId === match.awayTeamId && Number(item.score.split("-")[1]) > Number(item.score.split("-")[0])),
        ).length,
        meetings: headToHeadMeetings,
      }
    : undefined;

  return {
    ...base,
    venueId: match.venueId,
    events,
    homePlayers: hydrateLineup(base.homePlayers, match.homeTeamId),
    awayPlayers: hydrateLineup(base.awayPlayers, match.awayTeamId),
    form,
    table: leagueData.standings.map((row) => ({
      position: row.position,
      leagueId: row.leagueId,
      seasonId: row.seasonId,
      teamId: row.teamId,
      team: row.team,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      points: row.points,
    })),
    headToHead: previousMeetings,
  };
}
