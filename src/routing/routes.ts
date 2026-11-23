export const LEAGUE_SECTIONS = [
  "overview",
  "table",
  "fixtures",
  "players",
  "teams",
  "transfers",
  "seasons",
  "news",
] as const;

export type LeagueSection = (typeof LEAGUE_SECTIONS)[number];

export type AppRoute =
  | { type: "home" }
  | { type: "matches" }
  | { type: "news" }
  | { type: "about" }
  | { type: "sign-in" }
  | { type: "register" }
  | { type: "forgot-password" }
  | { type: "terms" }
  | { type: "privacy" }
  | { type: "league"; leagueId: string; section: LeagueSection }
  | { type: "match"; matchId: string }
  | { type: "team"; teamId: string }
  | { type: "player"; playerId: string }
  | { type: "not-found" };

function decodeSegment(segment: string): string | undefined {
  try {
    return decodeURIComponent(segment);
  } catch {
    return undefined;
  }
}

export function resolveRoute(pathname: string): AppRoute {
  const normalizedPath = pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  const segments = normalizedPath.split("/").filter(Boolean).map(decodeSegment);

  if (segments.some((segment) => segment === undefined)) {
    return { type: "not-found" };
  }

  const [first, second, third] = segments as string[];

  if (segments.length === 0) return { type: "home" };
  if (segments.length === 1 && first === "matches") return { type: "matches" };
  if (segments.length === 1 && first === "news") return { type: "news" };
  if (segments.length === 1 && first === "about") return { type: "about" };
  if (segments.length === 1 && first === "sign-in") return { type: "sign-in" };
  if (segments.length === 1 && first === "register") return { type: "register" };
  if (segments.length === 1 && first === "forgot-password") return { type: "forgot-password" };
  if (segments.length === 1 && first === "terms") return { type: "terms" };
  if (segments.length === 1 && first === "privacy") return { type: "privacy" };

  if (first === "league" && second && (segments.length === 2 || segments.length === 3)) {
    const section = third ?? "overview";
    if (LEAGUE_SECTIONS.includes(section as LeagueSection)) {
      return { type: "league", leagueId: second, section: section as LeagueSection };
    }
    return { type: "not-found" };
  }

  if (segments.length === 2 && first === "match" && second) {
    return { type: "match", matchId: second };
  }
  if (segments.length === 2 && first === "team" && second) {
    return { type: "team", teamId: second };
  }
  if (segments.length === 2 && first === "player" && second) {
    return { type: "player", playerId: second };
  }

  return { type: "not-found" };
}

export function leaguePath(leagueId: string, section: LeagueSection = "overview"): string {
  const basePath = `/league/${encodeURIComponent(leagueId)}`;
  return section === "overview" ? basePath : `${basePath}/${section}`;
}

export function entityPath(type: "match" | "team" | "player", id: string): string {
  return `/${type}/${encodeURIComponent(id)}`;
}
