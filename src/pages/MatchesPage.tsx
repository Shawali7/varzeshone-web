import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

type MatchesPageProps = {
  language: AppLanguage;
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

function formatMatchDate(date: string, language: AppLanguage): string {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : language === "fa-AF" ? "fa-AF" : "ps-AF", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getStatusLabel(match: Match, language: AppLanguage): string {
  if (match.status === "LIVE") return translate(language, "live").toUpperCase();
  if (match.status === "FT") return translate(language, "fullTime").toUpperCase();
  return translate(language, "scheduled").toUpperCase();
}

export default function MatchesPage({
  language,
  onOpenMatch,
}: MatchesPageProps) {
  const t = (key: TranslationKey) => translate(language, key);
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
  const requestId = useRef(0);

  const loadData = useCallback(() => {
    const currentRequest = ++requestId.current;

    Promise.all([getMatches(), getLeagues()])
      .then(([matchData, leagueData]) => {
        if (currentRequest !== requestId.current) return;
        setMatches(matchData);
        setLeagues(leagueData);
      })
      .catch((loadError: unknown) => {
        if (currentRequest !== requestId.current) return;
        console.error("Failed to load matches page:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load match data.",
        );
      })
      .finally(() => {
        if (currentRequest === requestId.current) setLoading(false);
      });

    return () => {
      if (currentRequest === requestId.current) requestId.current++;
    };
  }, []);

  useEffect(() => {
    return loadData();
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
        if (leagueFilter !== "all" && match.leagueId !== leagueFilter) return false;
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
      const group = groups.get(match.leagueId) ?? [];
      group.push(match);
      groups.set(match.leagueId, group);
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
          <span className="matches-page-eyebrow">{t("matchesScores")}</span>
          <h1>{t("matches")}</h1>
          <p>{t("matchesSubtitle")}</p>
        </div>

        <div className="matches-page-total">
          <Trophy size={19} />
          <span>{matches.length} {t("matchesCount")}</span>
        </div>
      </div>

      <section className="matches-page-panel">
        <div className="matches-page-status-tabs" role="tablist" aria-label={t("matchStatus")}>
          {([
            ["all", t("all")],
            ["live", t("live")],
            ["today", t("today")],
            ["upcoming", t("scheduled")],
            ["finished", t("finished")],
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
          <div className="matches-page-sports" aria-label={t("sportFilter")}>
            <button
              type="button"
              className={sportFilter === "all" ? "active" : ""}
              onClick={() => setSportFilter("all")}
            >
              {t("allSports")}
            </button>
            <button
              type="button"
              className={sportFilter === "football" ? "active" : ""}
              onClick={() => setSportFilter("football")}
            >
              {t("football")}
            </button>
            <button
              type="button"
              className={sportFilter === "futsal" ? "active" : ""}
              onClick={() => setSportFilter("futsal")}
            >
              {t("futsal")}
            </button>
          </div>

          <label className="matches-page-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchTeamsCompetitions")}
              aria-label={t("searchTeamsCompetitions")}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label={t("clearSearch")}>
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
              aria-label={t("filterByLeague")}
            >
              <option value="all">{t("allCompetitions")}</option>
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
              aria-label={t("filterByDate")}
            />
          </label>

          <button
            type="button"
            className={`matches-page-filter-button ${tvOnly ? "active" : ""}`}
            onClick={() => setTvOnly((value) => !value)}
            aria-pressed={tvOnly}
          >
            <Tv size={15} />
            {t("onTelevision")}
          </button>

          <button
            type="button"
            className="matches-page-filter-button"
            onClick={() => setSortOrder((value) => value === "asc" ? "desc" : "asc")}
          >
            <SlidersHorizontal size={15} />
            {t("time")} {sortOrder === "asc" ? "↑" : "↓"}
          </button>

          {hasFilters && (
            <button
              type="button"
              className="matches-page-clear"
              onClick={resetFilters}
            >
              <X size={14} />
              {t("clearFilters")}
            </button>
          )}
        </div>
      </section>

      {loading ? (
        <section className="matches-page-state" aria-live="polite">
          <span className="matches-page-spinner" />
          <strong>{t("loadingMatches")}</strong>
          <p>{t("loadingMatchesNote")}</p>
        </section>
      ) : error ? (
        <section className="matches-page-state matches-page-error" role="alert">
          <strong>{t("couldNotLoadMatches")}</strong>
          <p>{error}</p>
          <button type="button" onClick={() => {
            setLoading(true);
            setError("");
            loadData();
          }}>
            <RefreshCw size={15} />
            {t("retry")}
          </button>
        </section>
      ) : filteredMatches.length === 0 ? (
        <section className="matches-page-state">
          <CalendarDays size={34} />
          <strong>{t("noMatchesFound")}</strong>
          <p>{t("noMatchesFilterNote")}</p>
          <button type="button" onClick={resetFilters}>{t("clearFilters")}</button>
        </section>
      ) : (
        <div className="matches-page-groups">
          <div className="matches-page-results-line">
            <span>{filteredMatches.length} {t("matchesFound")}</span>
            <span>{dateFilter ? formatMatchDate(dateFilter, language) : t("allSelectedDates")}</span>
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
                    {group.sport === "futsal" ? t("futsal") : t("football")}
                    {" · "}
                    {group.matches.length} {t("matchesCount")}
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
                      <span className="matches-page-live-label">{t("live").toUpperCase()}</span>
                    ) : match.status === "FT" ? (
                      <span>{t("ft")}</span>
                    ) : (
                      <span className="matches-page-time">
                        <Clock3 size={13} />
                        {match.time ?? t("tbd")}
                      </span>
                    )}
                    <small>{formatMatchDate(match.date, language)}</small>
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
                    {match.onTV && <Tv size={14} aria-label={t("onTelevision")} />}
                    <span className={`matches-page-status ${match.status.toLowerCase()}`}>
                      {getStatusLabel(match, language)}
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
