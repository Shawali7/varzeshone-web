import type { League, Match } from "../types/sports";
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
    name: "Afghanistan Premier League",
    country: "Afghanistan",
    sport: "football",
  },
  {
    id: "kabul-premier-league",
    name: "Kabul Premier League",
    country: "Afghanistan",
    sport: "football",
  },
  {
    id: "herat-premier-league",
    name: "Herat Premier League",
    country: "Afghanistan",
    sport: "football",
  },
  {
    id: "kandahar-premier-league",
    name: "Kandahar Premier League",
    country: "Afghanistan",
    sport: "football",
  },
  {
    id: "afghanistan-futsal-league",
    name: "Afghanistan Futsal League",
    country: "Afghanistan",
    sport: "futsal",
  },
  {
    id: "herat-futsal-league",
    name: "Herat Futsal League",
    country: "Afghanistan",
    sport: "futsal",
  },
];

export const matches: Match[] = [
  {
    id: "match-001",
    status: "FT",
    home: "Herat FC",
    away: "Kabul FC",
    homeScore: 2,
    awayScore: 1,
    sport: "football",
    league: "afghanistan-premier-league",
    leagueName: "Afghanistan Premier League",
    date: getMockDate(-1),
    onTV: true,
  },
  {
    id: "match-002",
    status: "LIVE",
    home: "Kandahar FC",
    away: "Balkh FC",
    homeScore: 1,
    awayScore: 1,
    sport: "football",
    league: "afghanistan-premier-league",
    leagueName: "Afghanistan Premier League",
    date: getMockDate(0),
    onTV: true,
  },
  {
    id: "match-003",
    status: "UPCOMING",
    home: "Panjshir FC",
    away: "Nangarhar FC",
    time: "16:00",
    sport: "football",
    league: "afghanistan-premier-league",
    leagueName: "Afghanistan Premier League",
    date: getMockDate(0),
  },
  {
    id: "match-004",
    status: "UPCOMING",
    home: "Herat United",
    away: "Kabul Stars",
    time: "18:30",
    sport: "football",
    league: "herat-premier-league",
    leagueName: "Herat Premier League",
    date: getMockDate(0),
  },
  {
    id: "match-005",
    status: "FT",
    home: "Herat Futsal",
    away: "Kabul Futsal",
    homeScore: 4,
    awayScore: 2,
    sport: "futsal",
    league: "afghanistan-futsal-league",
    leagueName: "Afghanistan Futsal League",
    date: getMockDate(-1),
    onTV: true,
  },
  {
    id: "match-006",
    status: "UPCOMING",
    home: "Balkh Futsal",
    away: "Kandahar Futsal",
    time: "20:00",
    sport: "futsal",
    league: "afghanistan-futsal-league",
    leagueName: "Afghanistan Futsal League",
    date: getMockDate(1),
  },
  {
    id: "match-007",
    status: "UPCOMING",
    home: "Herat Futsal Club",
    away: "Kabul Futsal Club",
    time: "21:30",
    sport: "futsal",
    league: "herat-futsal-league",
    leagueName: "Herat Futsal League",
    date: getMockDate(2),
  },
];

