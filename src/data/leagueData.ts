export type Standing = {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  gd: number;
  points: number;
  form: ("W" | "D" | "L")[];
  next: string;
};

export type PlayerStat = {
  name: string;
  team: string;
  value: number;
  rating?: number;
};

export const demoStandings: Standing[] = [
  { position: 1, team: "Herat FC", played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 19, goalsAgainst: 7, gd: 12, points: 19, form: ["W", "W", "D", "W", "W"], next: "Bamyan" },
  { position: 2, team: "Kabul FC", played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 16, goalsAgainst: 7, gd: 9, points: 17, form: ["W", "W", "W", "D", "W"], next: "Panjshir" },
  { position: 3, team: "Kandahar FC", played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 14, goalsAgainst: 8, gd: 6, points: 14, form: ["W", "D", "W", "L", "W"], next: "Nangarhar" },
  { position: 4, team: "Balkh FC", played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 12, goalsAgainst: 8, gd: 4, points: 13, form: ["L", "W", "W", "D", "W"], next: "Badakhshan" },
  { position: 5, team: "Nangarhar FC", played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 11, goalsAgainst: 10, gd: 1, points: 11, form: ["D", "W", "L", "W", "D"], next: "Kandahar" },
  { position: 6, team: "Panjshir FC", played: 8, won: 3, drawn: 1, lost: 4, goalsFor: 10, goalsAgainst: 12, gd: -2, points: 10, form: ["W", "L", "L", "W", "D"], next: "Kabul" },
  { position: 7, team: "Badakhshan FC", played: 8, won: 2, drawn: 2, lost: 4, goalsFor: 8, goalsAgainst: 12, gd: -4, points: 8, form: ["D", "L", "W", "L", "D"], next: "Balkh" },
  { position: 8, team: "Bamyan FC", played: 8, won: 1, drawn: 3, lost: 4, goalsFor: 7, goalsAgainst: 13, gd: -6, points: 6, form: ["L", "D", "L", "D", "W"], next: "Herat" },
];

export const demoFixtures = [
  { round: "Round 9", date: "18 Nov", day: "Tuesday", home: "Herat FC", away: "Bamyan FC", time: "15:30" },
  { round: "Round 9", date: "19 Nov", day: "Wednesday", home: "Kabul FC", away: "Panjshir FC", time: "16:00" },
  { round: "Round 9", date: "20 Nov", day: "Thursday", home: "Kandahar FC", away: "Nangarhar FC", time: "15:00" },
  { round: "Round 9", date: "20 Nov", day: "Thursday", home: "Balkh FC", away: "Badakhshan FC", time: "16:30" },
];

export const demoTopRated: PlayerStat[] = [
  { name: "Ahmad Rahimi", team: "Herat FC", value: 8, rating: 8.7 },
  { name: "Farid Ahmadi", team: "Kabul FC", value: 7, rating: 8.4 },
  { name: "Omid Waziri", team: "Kandahar FC", value: 6, rating: 8.2 },
];

export const demoTopScorers: PlayerStat[] = [
  { name: "Ahmad Rahimi", team: "Herat FC", value: 8 },
  { name: "Farid Ahmadi", team: "Kabul FC", value: 7 },
  { name: "Omid Waziri", team: "Kandahar FC", value: 6 },
];

export const demoTopAssists: PlayerStat[] = [
  { name: "Hamid Karimi", team: "Herat FC", value: 6 },
  { name: "Samiullah Noor", team: "Balkh FC", value: 5 },
  { name: "Jawad Akbari", team: "Kabul FC", value: 4 },
];
