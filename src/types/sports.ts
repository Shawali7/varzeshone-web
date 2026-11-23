export type SportType = "football" | "futsal";

export type MatchStatus = "FT" | "LIVE" | "UPCOMING";

export type CompetitionLevel = "national" | "regional" | "provincial" | "club";

export type Season = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  isDemo: boolean;
};

export type League = {
  id: string;
  name: string;
  country: string;
  sport: SportType;
  competitionLevel: CompetitionLevel;
  region?: string;
  province?: string;
  city?: string;
  isDemo: boolean;
  logoUrl?: string;
};

export type MatchRecord = {
  id: string;
  leagueId: string;
  seasonId: string;
  homeTeamId: string;
  awayTeamId: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  time?: string;
  round: number;
  date: string;
  venueId?: string;
  onTV?: boolean;
  isDemo: boolean;
};

export type Match = MatchRecord & {
  home: string;
  away: string;
  sport: SportType;
  leagueName: string;
};
