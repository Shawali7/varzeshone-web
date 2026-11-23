import type { AppLanguage } from "../i18n/types";
import { demoPlayers } from "./playerData";
import { demoPlayerMatchPerformances } from "./playerMatchData";
import { demoSeasons } from "./seasonData";
import { demoTeams } from "./teamData";
import { leagues, matches } from "./mockData";

type FormResult = "W" | "D" | "L";
type DemoRecord = { isDemo: true };

export type Standing = DemoRecord & {
  position: number;
  leagueId: string;
  seasonId: string;
  teamId: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  gd: number;
  points: number;
  form: FormResult[];
};

export type PlayerStat = DemoRecord & {
  playerId: string;
  teamId: string;
  leagueId: string;
  seasonId: string;
  name: string;
  team: string;
  value: number;
  rating?: number;
};

type AggregatedPlayerStat = PlayerStat & {
  goals: number;
  assists: number;
};

export type LeagueFixture = DemoRecord & {
  id: string;
  matchId: string;
  leagueId: string;
  seasonId: string;
  homeTeamId: string;
  awayTeamId: string;
  round: number;
  date: string;
  home: string;
  away: string;
  time: string;
  status: "FT" | "LIVE" | "UPCOMING";
  homeScore?: number;
  awayScore?: number;
};

export type LeagueTeamStat = DemoRecord & {
  leagueId: string;
  seasonId: string;
  teamId: string;
  team: string;
  played: number;
  wins: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  cleanSheets: number;
};

export type LeagueTransfer = DemoRecord & {
  id: string;
  playerId: string;
  player: string;
  fromTeamId?: string;
  fromTeam: string;
  toTeamId: string;
  toTeam: string;
  type: "Permanent" | "Loan";
};

export type LeagueNews = DemoRecord & {
  id: string;
  leagueId: string;
  seasonId: string;
  title: Record<AppLanguage, string>;
};

export type TeamOfWeekPlayer = DemoRecord & {
  playerId: string;
  teamId: string;
  name: string;
  position: "GK" | "DF" | "MF" | "FW";
};

export type LeagueSeasonSummary = DemoRecord & {
  seasonId: string;
  season: string;
  winnerTeamId?: string;
  winner?: string;
  runnerUpTeamId?: string;
  runnerUp?: string;
};

export type LeagueTeamMembership = DemoRecord & {
  id: string;
  leagueId: string;
  teamId: string;
};

export type LeagueSeasonData = DemoRecord & {
  leagueId: string;
  seasonId: string;
  standings: Standing[];
  fixtures: LeagueFixture[];
  topRated: PlayerStat[];
  topScorers: PlayerStat[];
  topAssists: PlayerStat[];
  teamStats: LeagueTeamStat[];
  transfers: LeagueTransfer[];
  news: LeagueNews[];
  teamOfWeek: TeamOfWeekPlayer[];
  seasons: LeagueSeasonSummary[];
};

export const AVAILABLE_LEAGUE_SEASONS = demoSeasons;

const teamIdsByLeague: Record<string, string[]> = {
  "afghanistan-premier-league": ["herat-fc", "kabul-fc", "kandahar-fc", "balkh-fc", "panjshir-fc", "nangarhar-fc", "badakhshan-fc", "bamyan-fc"],
  "kabul-premier-league": ["kabul-eagles", "kabul-united", "kabul-stars", "kabul-city", "shahr-e-naw-fc", "paghman-fc", "kabul-warriors", "kabul-athletic"],
  "herat-premier-league": ["herat-united", "herat-stars", "jami-fc", "guzara-fc", "injil-fc", "herat-city", "karukh-fc", "kushk-fc"],
  "kandahar-premier-league": ["kandahar-united", "kandahar-stars", "spin-boldak-fc", "daman-fc", "arghandab-fc", "kandahar-city", "panjwayi-fc", "shah-wali-kot-fc"],
  "afghanistan-futsal-league": ["herat-futsal", "kabul-futsal", "balkh-futsal", "kandahar-futsal", "nangarhar-futsal", "panjshir-futsal", "bamyan-futsal", "badakhshan-futsal"],
  "herat-futsal-league": ["jami-futsal", "injil-futsal", "guzara-futsal", "herat-city-futsal", "karukh-futsal", "kushk-futsal", "zinda-jan-futsal"],
  "central-regional-demo-football": ["kabul-eagles", "herat-united", "kandahar-united"],
  "herat-club-demo-futsal": ["herat-futsal-club", "jami-futsal", "injil-futsal"],
};

const teamsById = new Map(demoTeams.map((team) => [team.id, team] as const));
const playersById = new Map(demoPlayers.map((player) => [player.id, player] as const));
const leaguesById = new Map(leagues.map((league) => [league.id, league] as const));

export const demoLeagueTeamMemberships: LeagueTeamMembership[] = Object.entries(teamIdsByLeague)
  .flatMap(([leagueId, teamIds]) => teamIds.map((teamId) => ({
    id: `${leagueId}:${teamId}`,
    leagueId,
    teamId,
    isDemo: true as const,
  })));

const newsTitles: Record<AppLanguage, string[]> = {
  en: [
    "Sample competition preview",
    "Demo clubs prepare for the next round",
    "Example league update",
    "Players to watch in this demo season",
  ],
  "fa-AF": [
    "پیش‌نمایش نمونهٔ رقابت",
    "باشگاه‌های نمایشی برای دور بعد آماده می‌شوند",
    "به‌روزرسانی نمونهٔ لیگ",
    "بازیکنانی برای توجه در فصل نمایشی",
  ],
  "ps-AF": [
    "د بېلګې سیالۍ مخکتنه",
    "ډیمو کلبونه راتلونکي پړاو ته چمتو کېږي",
    "د لیګ بېلګیزه تازه‌کېدنه",
    "په ډیمو فصل کې د پام وړ لوبغاړي",
  ],
};

function getLeagueTeamIds(leagueId: string): string[] {
  const teamIds = teamIdsByLeague[leagueId];
  const league = leaguesById.get(leagueId);
  if (!league || !teamIds) {
    throw new Error(`Unknown demo league: ${leagueId}`);
  }
  for (const teamId of teamIds) {
    const team = teamsById.get(teamId);
    if (!team || team.sport !== league.sport) {
      throw new Error(`Demo league ${leagueId} has an invalid team: ${teamId}`);
    }
  }
  return teamIds;
}

function matchResult(match: (typeof matches)[number], teamId: string): FormResult {
  if (match.homeScore === undefined || match.awayScore === undefined) {
    throw new Error(`Finished demo match ${match.id} is missing a score`);
  }
  const forGoals = match.homeTeamId === teamId ? match.homeScore : match.awayScore;
  const againstGoals = match.homeTeamId === teamId ? match.awayScore : match.homeScore;
  return forGoals > againstGoals ? "W" : forGoals < againstGoals ? "L" : "D";
}

function buildStandings(leagueId: string, seasonId: string): Standing[] {
  const completedMatches = matches
    .filter((match) => match.leagueId === leagueId && match.seasonId === seasonId && match.status === "FT")
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  if (completedMatches.length === 0) return [];

  const rows = new Map<string, Standing>(getLeagueTeamIds(leagueId).map((teamId): [string, Standing] => {
    const team = teamsById.get(teamId);
    if (!team) throw new Error(`Missing demo team: ${teamId}`);
    return [teamId, {
      position: 0,
      leagueId,
      seasonId,
      teamId,
      team: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      gd: 0,
      points: 0,
      form: [] as FormResult[],
      isDemo: true as const,
    }];
  }));

  for (const match of completedMatches) {
    if (match.homeScore === undefined || match.awayScore === undefined) {
      throw new Error(`Finished demo match ${match.id} is missing a score`);
    }
    const home = rows.get(match.homeTeamId);
    const away = rows.get(match.awayTeamId);
    if (!home || !away) throw new Error(`Demo match ${match.id} includes a non-member team`);
    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    const result = matchResult(match, match.homeTeamId);
    if (result === "W") {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (result === "L") {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
    home.form.push(result);
    away.form.push(result === "W" ? "L" : result === "L" ? "W" : "D");
  }

  return [...rows.values()]
    .map((row) => ({ ...row, gd: row.goalsFor - row.goalsAgainst, form: row.form.slice(-5) }))
    .sort((a, b) =>
      b.points - a.points ||
      b.gd - a.gd ||
      b.goalsFor - a.goalsFor ||
      a.team.localeCompare(b.team),
    )
    .map((row, index) => ({ ...row, position: index + 1 }));
}

function buildFixtures(leagueId: string, seasonId: string): LeagueFixture[] {
  return matches
    .filter((match) => match.leagueId === leagueId && match.seasonId === seasonId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((match) => ({
      id: `fixture:${match.id}`,
      matchId: match.id,
      leagueId,
      seasonId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      round: match.round,
      date: match.date,
      home: match.home,
      away: match.away,
      time: match.time ?? (match.status === "FT" ? "FT" : "TBD"),
      status: match.status,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      isDemo: true,
    }));
}

function buildPlayerStats(leagueId: string, seasonId: string): AggregatedPlayerStat[] {
  const seasonMatches = new Map<string, (typeof matches)[number]>(
    matches
      .filter((match) => match.leagueId === leagueId && match.seasonId === seasonId)
      .map((match): [string, (typeof matches)[number]] => [match.id, match]),
  );
  const totals = new Map<string, { goals: number; assists: number; ratings: number[] }>();

  for (const performance of demoPlayerMatchPerformances) {
    const match = seasonMatches.get(performance.matchId);
    if (!match) continue;
    const player = playersById.get(performance.playerId);
    const team = teamsById.get(performance.teamId);
    if (!player || !team || player.teamId !== performance.teamId) {
      throw new Error(`Invalid demo player performance: ${performance.id}`);
    }
    const total = totals.get(player.id) ?? { goals: 0, assists: 0, ratings: [] };
    total.goals += performance.goals;
    total.assists += performance.assists;
    if (performance.rating !== undefined) total.ratings.push(performance.rating);
    totals.set(player.id, total);
  }

  return [...totals.entries()].flatMap(([playerId, total]) => {
    const player = playersById.get(playerId);
    const team = player?.teamId ? teamsById.get(player.teamId) : undefined;
    if (!player || !team) throw new Error(`Missing demo player/team reference: ${playerId}`);
    const rating = total.ratings.length
      ? total.ratings.reduce((sum, value) => sum + value, 0) / total.ratings.length
      : undefined;
    return [{
      playerId,
      teamId: team.id,
      leagueId,
      seasonId,
      name: player.name,
      team: team.name,
      value: total.goals,
      rating,
      isDemo: true as const,
      goals: total.goals,
      assists: total.assists,
    }];
  });
}

function toPlayerStat(
  stat: ReturnType<typeof buildPlayerStats>[number],
  value: number,
): PlayerStat {
  return {
    playerId: stat.playerId,
    teamId: stat.teamId,
    leagueId: stat.leagueId,
    seasonId: stat.seasonId,
    name: stat.name,
    team: stat.team,
    value,
    rating: stat.rating,
    isDemo: true,
  };
}

function toPosition(position?: string): TeamOfWeekPlayer["position"] {
  if (position === "Goalkeeper") return "GK";
  if (position === "Defender") return "DF";
  if (position === "Midfielder") return "MF";
  return "FW";
}

export function getDemoLeagueSeasonData(
  leagueId: string,
  seasonId: string,
): LeagueSeasonData {
  getLeagueTeamIds(leagueId);
  if (!demoSeasons.some((season) => season.id === seasonId)) {
    throw new Error(`Unknown demo season: ${seasonId}`);
  }

  const standings = buildStandings(leagueId, seasonId);
  const fixtures = buildFixtures(leagueId, seasonId);
  const playerStats = buildPlayerStats(leagueId, seasonId);
  const teamStats = standings.map((row) => ({
    leagueId,
    seasonId,
    teamId: row.teamId,
    team: row.team,
    played: row.played,
    wins: row.won,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.gd,
    points: row.points,
    cleanSheets: matches.filter((match) =>
      match.leagueId === leagueId &&
      match.seasonId === seasonId &&
      match.status === "FT" &&
      match.homeScore !== undefined &&
      match.awayScore !== undefined &&
      ((match.homeTeamId === row.teamId && match.awayScore === 0) ||
        (match.awayTeamId === row.teamId && match.homeScore === 0)),
    ).length,
    isDemo: true as const,
  }));
  const scorers = playerStats
    .filter((stat) => stat.goals > 0)
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .map((stat) => toPlayerStat(stat, stat.goals));
  const assists = playerStats
    .filter((stat) => stat.assists > 0)
    .sort((a, b) => b.assists - a.assists || a.name.localeCompare(b.name))
    .map((stat) => toPlayerStat(stat, stat.assists));
  const topRated = playerStats
    .filter((stat) => stat.rating !== undefined)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name))
    .map((stat) => toPlayerStat(stat, 0));
  const teamOfWeek = playerStats
    .filter((stat) => stat.rating !== undefined)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8)
    .map((stat) => ({
      playerId: stat.playerId,
      teamId: stat.teamId,
      name: stat.name,
      position: toPosition(playersById.get(stat.playerId)?.position),
      isDemo: true as const,
    }));
  const leagueNews = newsTitles.en.map((_, index) => ({
    id: `demo-news:${leagueId}:${seasonId}:${index + 1}`,
    leagueId,
    seasonId,
    title: {
      en: newsTitles.en[index],
      "fa-AF": newsTitles["fa-AF"][index],
      "ps-AF": newsTitles["ps-AF"][index],
    },
    isDemo: true as const,
  }));
  const seasons = demoSeasons.map((season) => ({
    seasonId: season.id,
    season: season.label,
    isDemo: true as const,
  }));

  return {
    leagueId,
    seasonId,
    standings,
    fixtures,
    topRated,
    topScorers: scorers,
    topAssists: assists,
    teamStats,
    transfers: [],
    news: leagueNews,
    teamOfWeek,
    seasons,
    isDemo: true,
  };
}
