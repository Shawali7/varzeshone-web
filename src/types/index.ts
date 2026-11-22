import type { SportType } from "./sports";

export type {
  League,
  Match,
  MatchStatus,
  SportType,
} from "./sports";

export type ThemeMode = "light" | "dark" | "system";

export type SearchTab =
  | "all"
  | "teams"
  | "leagues"
  | "players"
  | "matches";

export type MatchFilter =
  | "all"
  | "live"
  | "tv"
  | "time";

/* =========================
   NEWS
========================= */

export type NewsArticle = {
  id: string;
  title: string;
  summary?: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  featured?: boolean;
};

/* =========================
   TEAM
========================= */

export type Team = {
  id: string;
  name: string;
  shortName?: string;
  country: string;
  city?: string;
  sport: SportType;
  logoUrl?: string;

  foundedYear?: number;
  venue?: string;
  coachName?: string;
  isActive?: boolean;
  isDemo?: boolean;
};

/* =========================
   PLAYER
========================= */

export type Player = {
  id: string;
  name: string;
  position?: string;

  // ID of the player's current team
  teamId?: string;

  nationality?: string;
  photoUrl?: string;
  isDemo?: boolean;

  dateOfBirth?: string;
  jerseyNumber?: number;
  heightCm?: number;
  preferredFoot?: "right" | "left" | "both";
  sport?: SportType;
  isActive?: boolean;
};

/* =========================
   TEAM MEMBERSHIP
========================= */

export type MembershipStatus = "active" | "ended";

export type MembershipType =
  | "permanent"
  | "loan"
  | "academy";

export type TeamMembership = {
  id: string;
  playerId: string;
  teamId: string;

  startDate: string;
  endDate?: string;

  status: MembershipStatus;
  type: MembershipType;

  jerseyNumber?: number;
  isDemo?: boolean;
};

/* =========================
   PLAYER TRANSFERS
========================= */

export type TransferType = "permanent" | "loan" | "free";

export type TransferStatus = "completed" | "pending" | "cancelled";

export type PlayerTransfer = {
  id: string;
  playerId: string;
  fromTeamId?: string;
  toTeamId: string;
  transferDate: string;
  type: TransferType;
  status: TransferStatus;
  feeAmount?: number;
  feeCurrency?: string;
  isVerified: boolean;
  isDemo?: boolean;
};

/* =========================
   PLAYER SEASON STATISTICS
========================= */

export type PlayerSeasonStats = {
  id: string;
  playerId: string;
  teamId: string;
  seasonId: string;
  competitionId?: string;
  sport: SportType;

  appearances: number;
  starts: number;
  substituteAppearances: number;
  minutesPlayed: number;

  goals: number;
  assists: number;

  yellowCards: number;
  redCards: number;

  cleanSheets?: number;
  passAccuracy?: number;
  chancesCreated?: number;
  tackles?: number;

  isVerified: boolean;
  isDemo?: boolean;
};


/* =========================
   PLAYER MATCH PERFORMANCE
========================= */

export type PlayerMatchPerformance = {
  id: string;
  playerId: string;
  matchId: string;
  teamId: string;

  started: boolean;
  minutesPlayed: number;
  substituteInMinute?: number;
  substituteOutMinute?: number;

  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;

  isVerified: boolean;
  isDemo?: boolean;
};

/* =========================
   TEAM SEASON STATISTICS
========================= */

export type TeamSeasonStats = {
  id: string;
  teamId: string;
  seasonId: string;
  competitionId: string;
  sport: SportType;

  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;

  isVerified: boolean;
  isDemo?: boolean;
};

/* =========================
   STANDINGS
========================= */

export type StandingsRow = {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};
