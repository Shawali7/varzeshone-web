import type { League, Match, MatchRecord } from "../types/sports";
import { demoTeams } from "./teamData";
import { demoVenues } from "./geographyData";
import { CURRENT_DEMO_SEASON_ID } from "./seasonData";

function getMockDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const leagues: League[] = [
  {
    id: "afghanistan-premier-league",
    name: "Afghanistan Demo Football League",
    country: "Afghanistan",
    sport: "football",
    competitionLevel: "national",
    region: "Afghanistan",
    isDemo: true,
  },
  {
    id: "kabul-premier-league",
    name: "Kabul Demo Football League",
    country: "Afghanistan",
    sport: "football",
    competitionLevel: "provincial",
    province: "Kabul",
    isDemo: true,
  },
  {
    id: "herat-premier-league",
    name: "Herat Demo Football League",
    country: "Afghanistan",
    sport: "football",
    competitionLevel: "provincial",
    province: "Herat",
    isDemo: true,
  },
  {
    id: "kandahar-premier-league",
    name: "Kandahar Demo Football League",
    country: "Afghanistan",
    sport: "football",
    competitionLevel: "provincial",
    province: "Kandahar",
    isDemo: true,
  },
  {
    id: "afghanistan-futsal-league",
    name: "Afghanistan Demo Futsal League",
    country: "Afghanistan",
    sport: "futsal",
    competitionLevel: "national",
    region: "Afghanistan",
    isDemo: true,
  },
  {
    id: "herat-futsal-league",
    name: "Herat Demo Futsal League",
    country: "Afghanistan",
    sport: "futsal",
    competitionLevel: "provincial",
    province: "Herat",
    isDemo: true,
  },
  {
    id: "central-regional-demo-football",
    name: "Central Afghanistan Demo Regional Football",
    country: "Afghanistan",
    sport: "football",
    competitionLevel: "regional",
    region: "Central",
    province: "Kabul",
    isDemo: true,
  },
  {
    id: "herat-club-demo-futsal",
    name: "Herat Demo Futsal Club Competition",
    country: "Afghanistan",
    sport: "futsal",
    competitionLevel: "club",
    province: "Herat",
    city: "Herat",
    isDemo: true,
  },
];

type DemoMatchInput = Pick<MatchRecord, "id" | "leagueId" | "homeTeamId" | "awayTeamId" | "status"> &
  Partial<Pick<MatchRecord, "homeScore" | "awayScore" | "time" | "venueId">>;

const demoSchedule: DemoMatchInput[] = [
  { id: "match-001", leagueId: "afghanistan-premier-league", homeTeamId: "herat-fc", awayTeamId: "kabul-fc", status: "FT", homeScore: 2, awayScore: 1 },
  { id: "match-002", leagueId: "afghanistan-premier-league", homeTeamId: "kandahar-fc", awayTeamId: "balkh-fc", status: "FT", homeScore: 1, awayScore: 1 },
  { id: "match-003", leagueId: "afghanistan-premier-league", homeTeamId: "panjshir-fc", awayTeamId: "nangarhar-fc", status: "UPCOMING", time: "16:00" },
  { id: "match-004", leagueId: "afghanistan-premier-league", homeTeamId: "badakhshan-fc", awayTeamId: "bamyan-fc", status: "UPCOMING", time: "18:30" },

  { id: "match-005", leagueId: "afghanistan-futsal-league", homeTeamId: "herat-futsal", awayTeamId: "kabul-futsal", status: "FT", homeScore: 4, awayScore: 2 },
  { id: "match-006", leagueId: "afghanistan-futsal-league", homeTeamId: "balkh-futsal", awayTeamId: "kandahar-futsal", status: "UPCOMING", time: "20:00" },
  { id: "match-008", leagueId: "kabul-premier-league", homeTeamId: "kabul-eagles", awayTeamId: "kabul-united", status: "FT", homeScore: 1, awayScore: 0 },
  { id: "match-009", leagueId: "kabul-premier-league", homeTeamId: "kabul-stars", awayTeamId: "kabul-city", status: "FT", homeScore: 2, awayScore: 2 },
  { id: "match-010", leagueId: "kabul-premier-league", homeTeamId: "shahr-e-naw-fc", awayTeamId: "paghman-fc", status: "UPCOMING", time: "17:00" },
  { id: "match-011", leagueId: "kabul-premier-league", homeTeamId: "kabul-warriors", awayTeamId: "kabul-athletic", status: "UPCOMING", time: "19:00" },

  { id: "match-012", leagueId: "herat-premier-league", homeTeamId: "herat-united", awayTeamId: "herat-stars", status: "FT", homeScore: 2, awayScore: 1 },
  { id: "match-013", leagueId: "herat-premier-league", homeTeamId: "jami-fc", awayTeamId: "guzara-fc", status: "FT", homeScore: 1, awayScore: 1 },
  { id: "match-014", leagueId: "herat-premier-league", homeTeamId: "injil-fc", awayTeamId: "herat-city", status: "UPCOMING", time: "16:30" },
  { id: "match-015", leagueId: "herat-premier-league", homeTeamId: "karukh-fc", awayTeamId: "kushk-fc", status: "UPCOMING", time: "18:00" },

  { id: "match-016", leagueId: "kandahar-premier-league", homeTeamId: "kandahar-united", awayTeamId: "kandahar-stars", status: "FT", homeScore: 1, awayScore: 2 },
  { id: "match-017", leagueId: "kandahar-premier-league", homeTeamId: "spin-boldak-fc", awayTeamId: "daman-fc", status: "FT", homeScore: 0, awayScore: 0 },
  { id: "match-018", leagueId: "kandahar-premier-league", homeTeamId: "arghandab-fc", awayTeamId: "kandahar-city", status: "UPCOMING", time: "17:30" },
  { id: "match-019", leagueId: "kandahar-premier-league", homeTeamId: "panjwayi-fc", awayTeamId: "shah-wali-kot-fc", status: "UPCOMING", time: "19:30" },

  { id: "match-020", leagueId: "afghanistan-futsal-league", homeTeamId: "nangarhar-futsal", awayTeamId: "panjshir-futsal", status: "FT", homeScore: 3, awayScore: 3 },
  { id: "match-021", leagueId: "afghanistan-futsal-league", homeTeamId: "bamyan-futsal", awayTeamId: "badakhshan-futsal", status: "UPCOMING", time: "21:00" },
  { id: "match-022", leagueId: "herat-futsal-league", homeTeamId: "injil-futsal", awayTeamId: "guzara-futsal", status: "FT", homeScore: 2, awayScore: 2 },
  { id: "match-023", leagueId: "herat-futsal-league", homeTeamId: "herat-city-futsal", awayTeamId: "karukh-futsal", status: "UPCOMING", time: "21:30" },
  { id: "match-024", leagueId: "herat-futsal-league", homeTeamId: "kushk-futsal", awayTeamId: "zinda-jan-futsal", status: "UPCOMING", time: "22:00" },
  { id: "match-025", leagueId: "central-regional-demo-football", homeTeamId: "kabul-eagles", awayTeamId: "herat-united", status: "FT", homeScore: 1, awayScore: 1, venueId: "venue-kabul-demo-sports-ground" },
  { id: "match-026", leagueId: "central-regional-demo-football", homeTeamId: "herat-united", awayTeamId: "kandahar-united", status: "UPCOMING", time: "18:00", venueId: "venue-herat-demo-football-ground" },
  { id: "match-027", leagueId: "herat-club-demo-futsal", homeTeamId: "herat-futsal-club", awayTeamId: "jami-futsal", status: "FT", homeScore: 3, awayScore: 2, venueId: "venue-herat-demo-futsal-hall" },
  { id: "match-028", leagueId: "herat-club-demo-futsal", homeTeamId: "injil-futsal", awayTeamId: "herat-futsal-club", status: "UPCOMING", time: "20:30", venueId: "venue-herat-demo-futsal-hall" },
];

export const demoMatchRecords: MatchRecord[] = demoSchedule.map((input) => {
  const league = leagues.find((item) => item.id === input.leagueId);
  const defaultVenueId =
    league?.sport === "futsal"
      ? (league.province === "Herat" ? "venue-herat-demo-futsal-hall" : "venue-kabul-demo-futsal-hall")
      : (league?.province === "Kandahar"
        ? "venue-kandahar-demo-football-ground"
        : league?.province === "Herat"
          ? "venue-herat-demo-football-ground"
          : league?.province === "Balkh"
            ? "venue-balkh-demo-football-ground"
            : "venue-kabul-demo-sports-ground");

  return {
    ...input,
    seasonId: CURRENT_DEMO_SEASON_ID,
    round: input.status === "FT" ? 1 : 2,
    date: input.status === "FT" ? getMockDate(-1) : getMockDate(0),
    venueId: input.venueId ?? defaultVenueId,
    isDemo: true,
  };
});

const teamsById = new Map(demoTeams.map((team) => [team.id, team] as const));
const leaguesById = new Map(leagues.map((league) => [league.id, league] as const));
const venuesById = new Map(demoVenues.map((venue) => [venue.id, venue] as const));

export const matches: Match[] = demoMatchRecords.map((record) => {
  const homeTeam = teamsById.get(record.homeTeamId);
  const awayTeam = teamsById.get(record.awayTeamId);
  const league = leaguesById.get(record.leagueId);
  const venue = record.venueId ? venuesById.get(record.venueId) : undefined;

  if (!homeTeam || !awayTeam || !league) {
    throw new Error(`Invalid demo match references for ${record.id}`);
  }
  if (homeTeam.sport !== league.sport || awayTeam.sport !== league.sport) {
    throw new Error(`Demo match ${record.id} mixes different sports`);
  }
  if (!record.venueId || !venue) {
    throw new Error(`Invalid demo venue reference for ${record.id}`);
  }

  return {
    ...record,
    home: homeTeam.name,
    away: awayTeam.name,
    leagueName: league.name,
    sport: league.sport,
  };
});
