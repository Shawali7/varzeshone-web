export type SportType = "football" | "futsal";

export type MatchStatus = "FT" | "LIVE" | "UPCOMING";

export type League = {
  id: string;
  name: string;
  country: string;
  sport: SportType;
};

export type Match = {
  id: string;
  status: MatchStatus;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  time?: string;
  sport: SportType;
  league: string;
  leagueName: string;
  date: string;
  onTV?: boolean;
};
