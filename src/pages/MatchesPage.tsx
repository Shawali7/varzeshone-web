import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  SlidersHorizontal,
  Tv,
  Trophy,
  RefreshCw,
  X,
} from "lucide-react";

import type { League, Match, SportType } from "../types/sports";
import { getLeagues, getMatches } from "../services/sportsService";

type MatchesPageProps = {
  onOpenMatch: (match: Match) => void;
};

type StatusFilter = "all" | "live" | "today" | "upcoming" | "finished";
type SportFilter = "all" | SportType;

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMatchDateKey(match: Match): string {
  const parsed = new Date(`${match.date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? match.date : getDateKey(parsed);
}

function formatMatchDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getStatusLabel(match: Match): string {
  if (match.status === "LIVE") return "LIVE";
  if (match.status === "FT") return "FULL TIME";
  return "UPCOMING";
}

export default function MatchesPage({
  onOpenMatch,
}: MatchesPageProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sportFilter, setSportFilter] = useState<SportFilter>("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [tvOnly, setTvOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadData = useCallback(() => {
    let cancelled = false;

    Promise.all([getMatches(), getLeagues()])
      .then(([matchData, leagueData]) => {
        if (cancelled) return;
        setMatches(matchData);
        setLeagues(leagueData);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        console.error("Failed to load matches page:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load match data.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const today = getDateKey(new Date());

  const counts = useMemo(() => ({
    all: matches.length,
    live: matches.filter((match) => match.status === "LIVE").length,
    today: matches.filter((match) => getMatchDateKey(match) === today).length,
    upcoming: matches.filter((match) => match.status === "UPCOMING").length,
    finished: matches.filter((match) => match.status === "FT").length,
  }), [matches, today]);

  const filteredMatches = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return matches
      .filter((match) => {
        if (statusFilter === "live" && match.status !== "LIVE") return false;
        if (statusFilter === "today" && getMatchDateKey(match) !== today) return false;
        if (statusFilter === "upcoming" && match.status !== "UPCOMING") return false;
        if (statusFilter === "finished" && match.status !== "FT") return false;

        if (sportFilter !== "all" && match.sport !== sportFilter) return false;
        if (leagueFilter !== "all" && match.league !== leagueFilter) return false;
        if (dateFilter && getMatchDateKey(match) !== dateFilter) return false;
        if (tvOnly && !match.onTV) return false;

        if (query) {
          const searchable = [
            match.home,
            match.away,
            match.leagueName,
          ].join(" ").toLocaleLowerCase();

          if (!searchable.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aTime = new Date(
          `${a.date}T${a.time ?? "23:59"}:00`,
        ).getTime();
        const bTime = new Date(
          `${b.date}T${b.time ?? "23:59"}:00`,
        ).getTime();

        return sortOrder === "asc"
          ? aTime - bTime
          : bTime - aTime;
      });
  }, [
    matches,
    statusFilter,
    sportFilter,
    leagueFilter,
    dateFilter,
    search,
    tvOnly,
    sortOrder,
    today,
  ]);

  const groupedMatches = useMemo(() => {
    const groups = new Map<string, Match[]>();

    filteredMatches.forEach((match) => {
      const group = groups.get(match.league) ?? [];
      group.push(match);
      groups.set(match.league, group);
    });

    return Array.from(groups.entries()).map(([leagueId, items]) => ({
      leagueId,
      title: items[0]?.leagueName ?? leagueId,
      sport: items[0]?.sport ?? "football",
      matches: items,
    }));
  }, [filteredMatches]);

  const resetFilters = () => {
    setStatusFilter("all");
    setSportFilter("all");
    setLeagueFilter("all");
    setDateFilter("");
    setSearch("");
    setTvOnly(false);
    setSortOrder("asc");
  };

  const hasFilters =
    statusFilter !== "all" ||
    sportFilter !== "all" ||
    leagueFilter !== "all" ||
    Boolean(dateFilter) ||
    Boolean(search) ||
    tvOnly;

  return (
    <main className="matches-page">
      <div className="matches-page-heading">
        <div>
          <span className="matches-page-eyebrow">VARZESHONE · SCORES</span>
          <h1>Matches</h1>
          <p>Live scores, fixtures and results from football and futsal.</p>
        </div>

        <div className="matches-page-total">
          <Trophy size={19} />
          <span>{matches.length} matches</span>
        </div>
      </div>

      <section className="matches-page-panel">
        <div className="matches-page-status-tabs" role="tablist" aria-label="Match status">
          {([
            ["all", "All"],
            ["live", "Live"],
            ["today", "Today"],
            ["upcoming", "Upcoming"],
            ["finished", "Finished"],
          ] as [StatusFilter, string][]).map(([value, label]) => (
            <button
              type="button"
              key={value}
              role="tab"
              aria-selected={statusFilter === value}
              className={statusFilter === value ? "active" : ""}
              onClick={() => setStatusFilter(value)}
            >
              {value === "live" && <span className="matches-page-live-dot" />}
              {label}
              <span className="matches-page-tab-count">{counts[value]}</span>
            </button>
          ))}
        </div>

        <div className="matches-page-toolbar">
          <div className="matches-page-sports" aria-label="Sport filter">
            <button
              type="button"
              className={sportFilter === "all" ? "active" : ""}
              onClick={() => setSportFilter("all")}
            >
              All sports
            </button>
            <button
              type="button"
              className={sportFilter === "football" ? "active" : ""}
              onClick={() => setSportFilter("football")}
            >
              Football
            </button>
            <button
              type="button"
              className={sportFilter === "futsal" ? "active" : ""}
              onClick={() => setSportFilter("futsal")}
            >
              Futsal
            </button>
          </div>

          <label className="matches-page-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams or competitions"
              aria-label="Search teams or competitions"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </label>
        </div>

        <div className="matches-page-filters">
          <label className="matches-page-select">
            <Trophy size={15} />
            <select
              value={leagueFilter}
              onChange={(event) => setLeagueFilter(event.target.value)}
              aria-label="Filter by league"
            >
              <option value="all">All competitions</option>
              {leagues
                .filter((league) => sportFilter === "all" || league.sport === sportFilter)
                .map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="matches-page-select">
            <CalendarDays size={15} />
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter by date"
            />
          </label>

          <button
            type="button"
            className={`matches-page-filter-button ${tvOnly ? "active" : ""}`}
            onClick={() => setTvOnly((value) => !value)}
            aria-pressed={tvOnly}
          >
            <Tv size={15} />
            On TV
          </button>

          <button
            type="button"
            className="matches-page-filter-button"
            onClick={() => setSortOrder((value) => value === "asc" ? "desc" : "asc")}
          >
            <SlidersHorizontal size={15} />
            Time {sortOrder === "asc" ? "↑" : "↓"}
          </button>

          {hasFilters && (
            <button
              type="button"
              className="matches-page-clear"
              onClick={resetFilters}
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      {loading ? (
        <section className="matches-page-state" aria-live="polite">
          <span className="matches-page-spinner" />
          <strong>Loading matches</strong>
          <p>Getting the latest fixtures and results...</p>
        </section>
      ) : error ? (
        <section className="matches-page-state matches-page-error" role="alert">
          <strong>Could not load matches</strong>
          <p>{error}</p>
          <button type="button" onClick={loadData}>
            <RefreshCw size={15} />
            Try again
          </button>
        </section>
      ) : filteredMatches.length === 0 ? (
        <section className="matches-page-state">
          <CalendarDays size={34} />
          <strong>No matches found</strong>
          <p>There are no matches for the selected filters.</p>
          <button type="button" onClick={resetFilters}>Clear filters</button>
        </section>
      ) : (
        <div className="matches-page-groups">
          <div className="matches-page-results-line">
            <span>{filteredMatches.length} matches found</span>
            <span>{dateFilter ? formatMatchDate(dateFilter) : "All selected dates"}</span>
          </div>

          {groupedMatches.map((group) => (
            <section className="matches-page-group" key={group.leagueId}>
              <header className="matches-page-group-header">
                <div className="matches-page-group-icon">
                  <Trophy size={17} />
                </div>
                <div>
                  <strong>{group.title}</strong>
                  <span>
                    {group.sport === "futsal" ? "Futsal" : "Football"}
                    {" · "}
                    {group.matches.length} matches
                  </span>
                </div>
              </header>

              {group.matches.map((match) => (
                <button
                  type="button"
                  className="matches-page-match"
                  key={match.id}
                  onClick={() => onOpenMatch(match)}
                >
                  <span className="matches-page-match-date">
                    {match.status === "LIVE" ? (
                      <span className="matches-page-live-label">LIVE</span>
                    ) : match.status === "FT" ? (
                      <span>FT</span>
                    ) : (
                      <span className="matches-page-time">
                        <Clock3 size={13} />
                        {match.time ?? "TBD"}
                      </span>
                    )}
                    <small>{formatMatchDate(match.date)}</small>
                  </span>

                  <span className="matches-page-teams">
                    <span>{match.home}</span>
                    <span>{match.away}</span>
                  </span>

                  <span className="matches-page-score">
                    {match.status === "UPCOMING" ? (
                      <span className="matches-page-vs">
                        {match.time ?? "–"}
                      </span>
                    ) : (
                      <>
                        <b>{match.homeScore ?? 0}</b>
                        <b>{match.awayScore ?? 0}</b>
                      </>
                    )}
                  </span>

                  <span className="matches-page-match-meta">
                    {match.onTV && <Tv size={14} aria-label="On TV" />}
                    <span className={`matches-page-status ${match.status.toLowerCase()}`}>
                      {getStatusLabel(match)}
                    </span>
                  </span>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}