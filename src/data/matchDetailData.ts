import type { Match } from "../types/sports";

export type MatchEvent = {
  minute: string;
  type: "goal" | "card" | "sub";
  team: "home" | "away";
  title: string;
  player: string;
  detail: string;
};

export type MatchLineupPlayer = [
  number: string,
  player: string,
  rating: string,
];

export type MatchFormItem = [
  team: string,
  score: string,
  result: "W" | "D" | "L",
];

export type MatchStat = {
  label: string;
  home: string;
  away: string;
};

export type MatchTableRow = {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export type HeadToHeadMeeting = {
  home: string;
  score: string;
  away: string;
};

export type MatchDetails = {
  events: MatchEvent[];
  homePlayers: MatchLineupPlayer[];
  awayPlayers: MatchLineupPlayer[];
  form: MatchFormItem[];
  stats: MatchStat[];
  table: MatchTableRow[];
  headToHead: {
    homeWins: number;
    draws: number;
    awayWins: number;
    meetings: HeadToHeadMeeting[];
  };
};

// All records below are fictional demo data for UI development.
export const demoMatchDetails: Record<string, MatchDetails> = {
  "match-001": {
    events: [
      {
        minute: "18'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Ahmad Rahimi",
        detail: "Right-footed shot",
      },
      {
        minute: "35'",
        type: "goal",
        team: "away",
        title: "Goal",
        player: "Farid Azizi",
        detail: "Header",
      },
      {
        minute: "72'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Mohammad Noori",
        detail: "Left-footed shot",
      },
    ],
    homePlayers: [
      ["1", "Samiullah", "7.2"],
      ["4", "Ahmad Rahimi", "8.1"],
      ["5", "Mohammad Noori", "7.8"],
      ["8", "Omid Ahmad", "7.0"],
      ["10", "Jawad Hussaini", "7.4"],
    ],
    awayPlayers: [
      ["1", "Naseer", "6.8"],
      ["3", "Farid Azizi", "7.6"],
      ["6", "Karim", "6.9"],
      ["7", "Sayed Ali", "6.7"],
      ["9", "Zubair", "6.5"],
    ],
    form: [
      ["Herat FC", "2-1", "W"],
      ["Kabul FC", "1-1", "D"],
      ["Herat FC", "3-0", "W"],
      ["Kabul FC", "0-2", "L"],
    ],
    stats: [
      { label: "Possession", home: "56%", away: "44%" },
      { label: "Total shots", home: "14", away: "9" },
      { label: "Shots on target", home: "6", away: "3" },
      { label: "Corners", home: "7", away: "4" },
      { label: "Fouls", home: "11", away: "15" },
    ],
    table: [
      { position: 1, team: "Herat FC", played: 3, won: 3, drawn: 0, lost: 0, points: 9 },
      { position: 2, team: "Kabul FC", played: 3, won: 2, drawn: 0, lost: 1, points: 6 },
      { position: 3, team: "Kandahar FC", played: 3, won: 1, drawn: 0, lost: 2, points: 3 },
    ],
    headToHead: {
      homeWins: 2,
      draws: 1,
      awayWins: 1,
      meetings: [
        { home: "Herat FC", score: "2-1", away: "Kabul FC" },
        { home: "Kabul FC", score: "1-1", away: "Herat FC" },
        { home: "Herat FC", score: "3-2", away: "Kabul FC" },
        { home: "Kabul FC", score: "2-0", away: "Herat FC" },
      ],
    },
  },

  "match-002": {
    events: [
      {
        minute: "24'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Hamed",
        detail: "Right-footed shot",
      },
      {
        minute: "39'",
        type: "goal",
        team: "away",
        title: "Goal",
        player: "Bilal",
        detail: "Close-range finish",
      },
    ],
    homePlayers: [
      ["1", "Wahid", "7.0"],
      ["2", "Hamed", "7.8"],
      ["4", "Saber", "6.9"],
      ["8", "Naim", "7.1"],
      ["10", "Ramin", "7.0"],
    ],
    awayPlayers: [
      ["1", "Latif", "7.1"],
      ["3", "Bilal", "7.9"],
      ["5", "Haroon", "6.8"],
      ["7", "Faisal", "7.0"],
      ["11", "Ehsan", "6.9"],
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
    headToHead: {
      homeWins: 1,
      draws: 1,
      awayWins: 1,
      meetings: [
        { home: "Kandahar FC", score: "1-1", away: "Balkh FC" },
        { home: "Balkh FC", score: "0-2", away: "Kandahar FC" },
        { home: "Kandahar FC", score: "1-3", away: "Balkh FC" },
      ],
    },
  },

  "match-005": {
    events: [
      {
        minute: "5'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Ahmad",
        detail: "Futsal finish",
      },
      {
        minute: "9'",
        type: "goal",
        team: "away",
        title: "Goal",
        player: "Omid",
        detail: "Futsal finish",
      },
      {
        minute: "14'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Jawad",
        detail: "Futsal finish",
      },
      {
        minute: "22'",
        type: "goal",
        team: "away",
        title: "Goal",
        player: "Sami",
        detail: "Futsal finish",
      },
      {
        minute: "31'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Farid",
        detail: "Futsal finish",
      },
      {
        minute: "38'",
        type: "goal",
        team: "home",
        title: "Goal",
        player: "Naser",
        detail: "Futsal finish",
      },
    ],
    homePlayers: [
      ["1", "Ahmad", "8.0"],
      ["4", "Jawad", "7.8"],
      ["7", "Farid", "7.6"],
      ["9", "Naser", "7.9"],
    ],
    awayPlayers: [
      ["1", "Omid", "7.1"],
      ["3", "Sami", "7.5"],
      ["5", "Wahid", "6.8"],
      ["8", "Karim", "6.9"],
    ],
    form: [
      ["Herat Futsal", "4-2", "W"],
      ["Kabul Futsal", "2-2", "D"],
    ],
    stats: [
      { label: "Possession", home: "53%", away: "47%" },
      { label: "Total shots", home: "18", away: "12" },
      { label: "Shots on target", home: "10", away: "6" },
      { label: "Corners", home: "5", away: "3" },
      { label: "Fouls", home: "6", away: "8" },
    ],
    table: [],
    headToHead: {
      homeWins: 2,
      draws: 1,
      awayWins: 1,
      meetings: [
        { home: "Herat Futsal", score: "4-2", away: "Kabul Futsal" },
        { home: "Kabul Futsal", score: "2-2", away: "Herat Futsal" },
        { home: "Herat Futsal", score: "3-1", away: "Kabul Futsal" },
        { home: "Kabul Futsal", score: "3-2", away: "Herat Futsal" },
      ],
    },
  },
};

export function getDemoMatchDetails(
  matchId: Match["id"],
): MatchDetails | undefined {
  return demoMatchDetails[matchId];
}