import type { Season } from "../types/sports";

export const demoSeasons: Season[] = [
  { id: "season-2026-2027", label: "2026/2027", startYear: 2026, endYear: 2027, isDemo: true },
  { id: "season-2025-2026", label: "2025/2026", startYear: 2025, endYear: 2026, isDemo: true },
  { id: "season-2024-2025", label: "2024/2025", startYear: 2024, endYear: 2025, isDemo: true },
  { id: "season-2023-2024", label: "2023/2024", startYear: 2023, endYear: 2024, isDemo: true },
  { id: "season-2022-2023", label: "2022/2023", startYear: 2022, endYear: 2023, isDemo: true },
];

export const CURRENT_DEMO_SEASON_ID = demoSeasons[0].id;
