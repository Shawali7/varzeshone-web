import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Search,
  Star,
  Tv,
} from "lucide-react";

import type { League, Match } from "../types/sports";
import { getLeagues, getMatches } from "../services/sportsService";
import { getDemoLeagueSeasonData } from "../data/leagueData";
import { CURRENT_DEMO_SEASON_ID } from "../data/seasonData";
import { readPreference, writePreference } from "../utils/storage";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

type HomeCompetition = {
  id: string;
  title: string;
  sport: Match["sport"];
  totalMatches: number;
  isDemo: boolean;
  matches: Match[];
};

type HomePageProps = {
  language?: AppLanguage;
  onOpenNews: () => void;
  onOpenLeague: (leagueId: string) => void;
  onOpenMatch: (match: Match) => void;
  onOpenTeam: (teamName: string) => void;
  search: string;
  setSearch: (value: string) => void;
};

type HomeFilter = "all" | "live" | "upcoming" | "finished" | "tv" | "favorites";

function buildCompetitions(
  matches: Match[],
): HomeCompetition[] {
  const groups = new Map<string, Match[]>();

  for (const match of matches) {
    const current =
      groups.get(match.leagueId) ?? [];

    current.push(match);
    groups.set(match.leagueId, current);
  }

  return Array.from(groups.entries()).map(([id, competitionMatches]) => {
    const firstMatch = competitionMatches[0];
    if (!firstMatch) {
      throw new Error(`Demo competition ${id} has no matches`);
    }

    return {
      id,
      title: displayLeagueName(firstMatch.leagueName),
      sport: firstMatch.sport,
      totalMatches: competitionMatches.length,
      isDemo: competitionMatches.every((match) => match.isDemo),
      matches: competitionMatches,
    };
  });
}

function displayLeagueName(name: string): string {
  return name.replace(/\bdemo\b/gi, "").replace(/\s+/g, " ").trim();
}

function formatMatchesShown(
  shown: number,
  total: number,
  locale: string,
  t: (key: TranslationKey) => string,
): string {
  const numberFormat = new Intl.NumberFormat(locale);
  return t("matchesShownOfTotal")
    .replace("{shown}", numberFormat.format(shown))
    .replace("{total}", numberFormat.format(total));
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDate(dateKey: string, amount: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return getDateKey(date);
}

function getCalendarDays(month: Date): Date[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  firstDay.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + index);
    return day;
  });
}
export default function HomePage({
  language = "fa-AF",
  onOpenNews,
  onOpenLeague,
  onOpenMatch,
  search,
  setSearch,
}: HomePageProps) {
  const t = (key: TranslationKey) => translate(language, key);
  const locale = language === "fa-AF" ? "fa-AF" : language === "ps-AF" ? "ps-AF" : "en-US";
  const numberFormat = new Intl.NumberFormat(locale);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [topLeaguesOpen, setTopLeaguesOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getLeagues()
      .then((data) => {
        if (!cancelled) {
          setLeagues(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load homepage leagues:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [loading, setLoading] =
    useState(true);
  const [matchesError, setMatchesError] = useState(false);

  const [selectedLeague, setSelectedLeague] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<HomeFilter>("all");

  const [sortByTime, setSortByTime] = useState(false);

  const [sportFilter, setSportFilter] =
    useState<"all" | "football" | "futsal">("all");
  const [allLeaguesOpen, setAllLeaguesOpen] = useState(false);
  const [leagueSearch, setLeagueSearch] = useState("");

  const filteredAllLeagues = useMemo(() => {
    const query = leagueSearch.trim().toLowerCase();

    return leagues.filter((league) => {
      const matchesSport =
        sportFilter === "all" || league.sport === sportFilter;

      const matchesSearch =
        !query ||
        league.name.toLowerCase().includes(query) ||
        league.country.toLowerCase().includes(query);

      return matchesSport && matchesSearch;
    });
  }, [leagues, leagueSearch, sportFilter]);

  const [filterPanelOpen, setFilterPanelOpen] =
    useState(false);

  const [draftFilter, setDraftFilter] =
    useState<HomeFilter>("all");

  const [draftSportFilter, setDraftSportFilter] =
    useState<"all" | "football" | "futsal">("all");

  const [onlyTV, setOnlyTV] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [draftOnlyTV, setDraftOnlyTV] = useState(false);
  const [draftOnlyFavorites, setDraftOnlyFavorites] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    () => getDateKey(new Date()),
  );

  const [calendarOpen, setCalendarOpen] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const todayKey = getDateKey(new Date());
  const homepageStandings = getDemoLeagueSeasonData(
    "afghanistan-premier-league",
    CURRENT_DEMO_SEASON_ID,
  ).standings.slice(0, 4);
  const standingsLeague = leagues.find(
    (league) => league.id === "afghanistan-premier-league",
  );
  const calendarDays = getCalendarDays(calendarMonth);

  const changeSelectedDate = (amount: number) => {
    const nextDate = shiftDate(selectedDate, amount);
    setSelectedDate(nextDate);

    const nextMonth = parseDateKey(nextDate);
    setCalendarMonth(
      new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1),
    );
  };

  const [favoriteMatchIds, setFavoriteMatchIds] =
    useState<string[]>(() => {
      try {
        const saved = readPreference("varzeshone-favorite-matches");
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    writePreference(
      "varzeshone-favorite-matches",
      JSON.stringify(favoriteMatchIds),
    );
  }, [favoriteMatchIds]);

  const toggleFavorite = (matchId: string) => {
    setFavoriteMatchIds((current) =>
      current.includes(matchId)
        ? current.filter((id) => id !== matchId)
        : [...current, matchId],
    );
  };

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      try {
        setLoading(true);

        const data = await getMatches();

        if (!cancelled) {
          setMatches(data);
        }
      } catch {
        if (!cancelled) setMatchesError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  const competitions = useMemo(
    () => buildCompetitions(matches),
    [matches],
  );

  const filteredCompetitions =
    useMemo(() => {
      return competitions
        .map((competition) => {
          const leagueMatch =
            selectedLeague === null ||
            competition.id === selectedLeague;

          if (!leagueMatch) {
            return null;
          }

          const searchValue =
            search.trim().toLowerCase();

          const filteredMatches =
            competition.matches.filter(
              (match: Match) => {
                const matchesSearch =
                  !searchValue ||
                  match.home
                    .toLowerCase()
                    .includes(searchValue) ||
                  match.away
                    .toLowerCase()
                    .includes(searchValue) ||
                  competition.title
                    .toLowerCase()
                    .includes(searchValue);

                const matchesFilter =
                  filter === "all" ||
                  (filter === "live" &&
                    match.status === "LIVE") ||
                  (filter === "upcoming" &&
                    match.status === "UPCOMING") ||
                  (filter === "finished" &&
                    match.status === "FT") ||
                  (filter === "tv" &&
                    Boolean(match.onTV)) ||
                  (filter === "favorites" &&
                    favoriteMatchIds.includes(match.id));

                const matchesSport =
                  sportFilter === "all" ||
                  match.sport === sportFilter;

                const matchesTV =
                  !onlyTV || Boolean(match.onTV);

                const matchesFavorites =
                  !onlyFavorites ||
                  favoriteMatchIds.includes(match.id);

                const matchesDate = match.date === selectedDate;

                return (
                  matchesSearch &&
                  matchesFilter &&
                  matchesSport &&
                  matchesTV &&
                  matchesFavorites &&
                  matchesDate
                );

              },
            );

          if (sortByTime) {
            const timeValue = (time?: string) => {
              if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return Infinity;
              const [hours, minutes] = time.split(":").map(Number);
              return hours * 60 + minutes;
            };
            filteredMatches.sort((a, b) => timeValue(a.time) - timeValue(b.time));
          }

          if (
            filteredMatches.length === 0
          ) {
            return null;
          }

          return {
            ...competition,
            matches: filteredMatches,
          };
        })
        .filter(
          (
            competition,
          ): competition is HomeCompetition =>
            competition !== null,
        );
    }, [
      competitions,
      selectedLeague,
      filter,
      search,
      selectedDate,
      favoriteMatchIds,
      sportFilter,
      onlyTV,
      onlyFavorites,
      sortByTime,
    ]);

  const clearFilters = () => {
    setSelectedLeague(null);
    setFilter("all");
    setSportFilter("all");
    setDraftFilter("all");
    setDraftSportFilter("all");
    setOnlyTV(false);
    setOnlyFavorites(false);
    setDraftOnlyTV(false);
    setDraftOnlyFavorites(false);
    setFilterPanelOpen(false);
    setSearch("");

    const today = new Date();
    const todayDateKey = getDateKey(today);

    setSelectedDate(todayDateKey);
    setCalendarMonth(
      new Date(today.getFullYear(), today.getMonth(), 1),
    );
    setCalendarOpen(false);
  };

  const visibleMatchesCount = filteredCompetitions.reduce(
    (count, competition) => count + competition.matches.length,
    0,
  );

  const homeNews = [
    { title: t("newsArticle1Title"), time: t("newsTime2Hours") },
    { title: t("newsArticle2Title"), time: t("newsTime4Hours") },
    { title: t("newsArticle3Title"), time: t("newsTime5Hours") },
    { title: t("newsArticle4Title"), time: t("newsTime7Hours") },
  ];

  return (
    <main className="main-layout">

      <aside className="left-sidebar">
        <section className={`card top-leagues ${topLeaguesOpen ? "is-open" : "is-collapsed"}`}>
          <div className="card-title">
            <h2>{t("popularLeagues")}</h2>
            <button
              type="button"
              className="top-leagues-toggle"
              aria-expanded={topLeaguesOpen}
              aria-label={topLeaguesOpen ? t("collapseAll") : t("expandAll")}
              onClick={() => setTopLeaguesOpen((open) => !open)}
            >
              <ChevronDown size={17} />
            </button>
          </div>

          <div className="league-list">

            <button
              className={`league-item ${
                selectedLeague === null
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedLeague(null)
              }
            >
              <span className="league-icon af-icon">
                AF
              </span>

              <span>
                {t("allMatches")}
              </span>
            </button>

            {leagues.map((league) => (
              <button
                className={`league-item ${
                  selectedLeague === league.id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedLeague(league.id);
                  onOpenLeague(league.id);
                }}
                key={league.id}
              >
                <span className="league-icon">
                  {league.sport === "football" ? "⚽" : "◉"}
                </span>

                <span>{displayLeagueName(league.name)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="all-leagues-section">
          <button
            type="button"
            className="card all-leagues"
            aria-expanded={allLeaguesOpen}
            onClick={() => setAllLeaguesOpen((open) => !open)}
          >
            <span>{t("allLeagues")}</span>
            <ChevronDown
              size={15}
              className={allLeaguesOpen ? "rotated" : ""}
            />
          </button>

          {allLeaguesOpen && (
            <div className="all-leagues-panel">
              <div className="all-leagues-search">
                <Search size={16} />
                <input
                  type="search"
                  value={leagueSearch}
                  onChange={(event) => setLeagueSearch(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("search")}
                />
              </div>

              <div className="all-leagues-filters">
                <button
                  type="button"
                  className={sportFilter === "all" ? "active" : ""}
                  onClick={() => setSportFilter("all")}
                >
                  {t("all")}
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

              <div className="all-leagues-results">
                {filteredAllLeagues.length > 0 ? (
                  filteredAllLeagues.map((league) => (
                    <button
                      type="button"
                      className="all-leagues-item"
                      key={league.id}
                      onClick={() => {
                        setSelectedLeague(league.id);
                        setSportFilter(league.sport);
                        setAllLeaguesOpen(false);
                        setLeagueSearch("");
                        onOpenLeague(league.id);
                      }}
                    >
                      <span className="league-icon">
                        {league.sport === "football" ? "⚽" : "◉"}
                      </span>
                      <span className="all-leagues-item-info">
                        <span>{displayLeagueName(league.name)}</span>
                        <small>{league.country}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  ))
                ) : (
                  <p className="all-leagues-empty">
                    {t("noLeaguesFound")}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </aside>

      <section className="matches-column">
        <div className="home-feed-header">
          <div className="home-feed-title">
            <h1>{t("matches")}</h1>
            <p>{t("homeFeedDescription")}</p>
          </div>
          <div className="home-feed-summary">
            <span className="demo-status-badge">{t("demoData")}</span>
            {!loading && !matchesError && (
              <strong aria-live="polite">
                {formatMatchesShown(
                  visibleMatchesCount,
                  matches.length,
                  locale,
                  t,
                )}
              </strong>
            )}
          </div>
        </div>

        <div className="card date-bar">
          <button
            className="circle-button"
            aria-label={t("previousDay")}
            onClick={() => changeSelectedDate(-1)}
          >
            <ChevronLeft size={17} />
          </button>

          <button
            className="today-button"
            onClick={() => setCalendarOpen((open) => !open)}
            aria-expanded={calendarOpen}
            aria-label={t("chooseMatchDate")}
          >
            <span>
              {selectedDate === todayKey
                ? t("today")
                : parseDateKey(selectedDate).toLocaleDateString(locale, {
                    calendar: "gregory",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
            </span>

            <CalendarDays size={15} />
            <ChevronDown size={13} />
          </button>

          <button
            className="circle-button"
            aria-label={t("nextDay")}
            onClick={() => changeSelectedDate(1)}
          >
            <ChevronRight size={17} />
          </button>

          {calendarOpen && (
            <div className="calendar-popover">
              <div className="calendar-header">
                <button
                  className="calendar-nav"
                  aria-label={t("previousMonth")}
                  onClick={() =>
                    setCalendarMonth(
                      (month) =>
                        new Date(
                          month.getFullYear(),
                          month.getMonth() - 1,
                          1,
                        ),
                    )
                  }
                >
                  <ChevronLeft size={17} />
                </button>

                <strong>
                  {calendarMonth.toLocaleDateString(locale, {
                    calendar: "gregory",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>

                <button
                  className="calendar-nav"
                  aria-label={t("nextMonth")}
                  onClick={() =>
                    setCalendarMonth(
                      (month) =>
                        new Date(
                          month.getFullYear(),
                          month.getMonth() + 1,
                          1,
                        ),
                    )
                  }
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              <div className="calendar-weekdays">
                {[t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day) => {
                  const dateKey = getDateKey(day);
                  const isCurrentMonth =
                    day.getMonth() === calendarMonth.getMonth();
                  const isSelected = dateKey === selectedDate;
                  const isToday = dateKey === todayKey;

                  return (
                    <button
                      key={dateKey}
                      className={[
                        "calendar-day",
                        !isCurrentMonth ? "outside-month" : "",
                        isSelected ? "selected" : "",
                        isToday ? "is-today" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-label={day.toLocaleDateString(locale, {
                        calendar: "gregory",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedDate(dateKey);
                        setCalendarMonth(
                          new Date(
                            day.getFullYear(),
                            day.getMonth(),
                            1,
                          ),
                        );
                        setCalendarOpen(false);
                      }}
                    >
                      {numberFormat.format(day.getDate())}
                    </button>
                  );
                })}
              </div>

              <div className="calendar-footer">
                <button
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(todayKey);
                    setCalendarMonth(
                      new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1,
                      ),
                    );
                    setCalendarOpen(false);
                  }}
                >
                  {t("goToToday")}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card filters">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filter === "live" ? "active" : ""}`}
              aria-pressed={filter === "live"}
              onClick={() =>
                setFilter((current) => current === "live" ? "all" : "live")
              }
            >
              <span className="live-dot" />
              {t("live")}
            </button>

            <button
              type="button"
              className={`filter-tab ${filter === "tv" ? "active" : ""}`}
              aria-pressed={filter === "tv"}
              onClick={() =>
                setFilter((current) => current === "tv" ? "all" : "tv")
              }
            >
              <Tv size={14} />
              {t("onTelevision")}
            </button>

            <button
              type="button"
              className={`filter-tab ${sortByTime ? "active" : ""}`}
              aria-pressed={sortByTime}
              onClick={() => setSortByTime((current) => !current)}
            >
              <Clock3 size={14} />
              {t("byTime")}
            </button>
          </div>

          <div className="filter-tools">
            <label className="filter-search-field">
              <Search size={15} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("search")}
              />
              {search && (
                <button
                  type="button"
                  className="filter-search-clear"
                  onClick={() => setSearch("")}
                  aria-label={t("clearSearch")}
                >
                  ×
                </button>
              )}
            </label>

            <button
              type="button"
              className={`filter-advanced-icon ${filterPanelOpen ? "active" : ""}`}
              aria-label={t("advancedFilters")}
              aria-expanded={filterPanelOpen}
              title={t("advancedFilters")}
              onClick={() => {
                if (!filterPanelOpen) {
                  setDraftFilter(
                    filter === "live" || filter === "upcoming" || filter === "finished"
                      ? filter
                      : "all",
                  );
                  setDraftSportFilter(sportFilter);
                  setDraftOnlyTV(filter === "tv" || onlyTV);
                  setDraftOnlyFavorites(filter === "favorites" || onlyFavorites);
                }
                setFilterPanelOpen((current) => !current);
              }}
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
        {filterPanelOpen && (
          <div className="card advanced-filter-panel">
            <div className="advanced-filter-section">
              <h3>{t("sportFilter")}</h3>
              <div className="advanced-filter-options">
                {([
                  ["all", t("allSports")],
                  ["football", t("football")],
                  ["futsal", t("futsal")],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`advanced-filter-option ${draftSportFilter === value ? "active" : ""}`}
                    aria-pressed={draftSportFilter === value}
                    onClick={() => setDraftSportFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="advanced-filter-section">
              <h3>{t("matchStatus")}</h3>
              <div className="advanced-filter-options">
                {([
                  ["all", t("all")],
                  ["live", t("live")],
                  ["upcoming", t("scheduled")],
                  ["finished", t("finished")],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`advanced-filter-option ${draftFilter === value ? "active" : ""}`}
                    aria-pressed={draftFilter === value}
                    onClick={() => setDraftFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="advanced-filter-toggles">
              <label>
                <input
                  type="checkbox"
                  checked={draftOnlyTV}
                  onChange={(event) => setDraftOnlyTV(event.target.checked)}
                />
                <Tv size={15} />
                <span>{t("onTelevision")}</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={draftOnlyFavorites}
                  onChange={(event) => setDraftOnlyFavorites(event.target.checked)}
                />
                <Star size={15} />
                <span>{t("favorites")}</span>
              </label>
            </div>

            <div className="advanced-filter-actions">
              <button
                type="button"
                className="advanced-filter-reset"
                onClick={() => {
                  setDraftFilter("all");
                  setDraftSportFilter("all");
                  setDraftOnlyTV(false);
                  setDraftOnlyFavorites(false);
                  setFilter("all");
                  setSportFilter("all");
                  setOnlyTV(false);
                  setOnlyFavorites(false);
                }}
              >
                {t("reset")}
              </button>

              <button
                type="button"
                className="advanced-filter-apply"
                onClick={() => {
                  setFilter(draftFilter);
                  setSportFilter(draftSportFilter);
                  setOnlyTV(draftOnlyTV);
                  setOnlyFavorites(draftOnlyFavorites);
                  setFilterPanelOpen(false);
                }}
              >
                {t("applyFilters")}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="card empty-state" role="status">
            <div className="loading-spinner" />

            <h3>{t("loadingMatches")}</h3>

            <p>
              {t("pleaseWait")}
            </p>
          </div>
        ) : matchesError ? (
          <div className="card empty-state" role="alert">
            <h3>{t("couldNotLoadMatches")}</h3>
            <p>{t("reloadToTryAgain")}</p>
          </div>
        ) : filteredCompetitions.length ===
          0 ? (
          <div className="card empty-state" role="status">
            <Search size={30} />

            <h3>{t("noMatchesFound")}</h3>

            <p>
              {t("tryChangingFilters")}
            </p>

            <button
              className="clear-button"
              onClick={
                clearFilters
              }
            >
              {t("clearFilters")}
            </button>
          </div>
        ) : (
          filteredCompetitions.map(
            (competition) => (
              <CompetitionCard
                key={competition.id}
                title={competition.title}
                sport={competition.sport}
                totalMatches={competition.totalMatches}
                isDemo={competition.isDemo}
                matches={
                  competition.matches
                }
                onOpenMatch={
                  onOpenMatch
                }
                favoriteMatchIds={favoriteMatchIds}
                onToggleFavorite={toggleFavorite}
                language={language}
              />
            ),
          )
        )}

      </section>

      <aside className="right-sidebar">

        <section className="card news-card">

          <div className="section-header">
            <div className="section-title-group">
              <h2>{t("news")}</h2>
              <span className="demo-status-badge">{t("demoData")}</span>
            </div>

            <button
              onClick={onOpenNews}
            >
              {t("viewAll")}
            </button>
          </div>

          <article className="featured-news">

            <div className="featured-image">
              <span>
                VARZESHONE
              </span>
            </div>

            <h3>
              {homeNews[0].title}
            </h3>

            <span>
              VarzeshOne · {homeNews[0].time}
            </span>

          </article>

          {homeNews.slice(1).map(
            (item) => (
              <article
                className="news-item"
                key={item.title}
              >
                <div className="news-image">
                  {t("news")}
                </div>

                <div>
                  <h3>
                    {item.title}
                  </h3>

                  <span>
                    VarzeshOne · {item.time}
                  </span>
                </div>
              </article>
            ),
          )}

        </section>

        <section className="card standings-card">

          <div className="section-header">
            <div className="section-title-group">
              <h2>{t("standings")}</h2>
              <span className="demo-status-badge">{t("demoData")}</span>
            </div>

            <button onClick={() => onOpenLeague("afghanistan-premier-league")}>
              {t("leagueFullTable")}
            </button>
          </div>

          {standingsLeague && (
            <div className="standings-competition-name">
              {displayLeagueName(standingsLeague.name)}
            </div>
          )}

          <div className="standings">

            <div className="standing-head">
              <span>#</span>
              <span>{t("team")}</span>
              <span>{t("leaguePlayed")}</span>
              <span>{t("leaguePoints")}</span>
            </div>

            {homepageStandings.map((row) => (
              <div
                className="standing-row"
                key={row.teamId}
              >
                <span>
                  {numberFormat.format(row.position)}
                </span>

                <strong>
                  {row.team}
                </strong>

                <span>
                  {numberFormat.format(row.played)}
                </span>

                <strong>
                  {numberFormat.format(row.points)}
                </strong>
              </div>
            ))}

          </div>
        </section>

      </aside>
    </main>
  );
}

function CompetitionCard({
  title,
  sport,
  totalMatches,
  isDemo,
  matches,
  onOpenMatch,
  favoriteMatchIds,
  onToggleFavorite,
  language,
}: {
  title: string;
  sport: Match["sport"];
  totalMatches: number;
  isDemo: boolean;
  matches: Match[];
  onOpenMatch: (match: Match) => void;
  favoriteMatchIds: string[];
  onToggleFavorite: (matchId: string) => void;
  language: AppLanguage;
}) {
  const [open, setOpen] =
    useState(true);
  const t = (key: TranslationKey) => translate(language, key);
  const locale = language === "fa-AF" ? "fa-AF" : language === "ps-AF" ? "ps-AF" : "en-US";

  return (
    <section className="competition-card card">

      <button
        className="competition-header"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (value) =>
              !value,
          )
        }
      >
        <div className="competition-title">

          <span className="competition-icon">
            {sport === "football" ? "⚽" : "◉"}
          </span>

          <div>
            <strong>
              {title}
            </strong>

            <span>
              {formatMatchesShown(matches.length, totalMatches, locale, t)}
            </span>
          </div>

          {isDemo && (
            <span className="demo-status-badge">{t("demoData")}</span>
          )}
        </div>

        <ChevronDown
          size={15}
          className={
            open
              ? "chevron-open"
              : ""
          }
        />
      </button>

      {open && (
        <div className="match-list">
          {matches.map(
            (match) => (
              <MatchRow
                key={match.id}
                match={match}
                onOpenMatch={onOpenMatch}
                isFavorite={favoriteMatchIds.includes(match.id)}
                onToggleFavorite={onToggleFavorite}
                language={language}
              />
            ),
          )}
        </div>
      )}

    </section>
  );
}

function MatchRow({
  match,
  onOpenMatch,
  isFavorite,
  onToggleFavorite,
  language = "fa-AF",
}: {
  match: Match;
  onOpenMatch: (match: Match) => void;
  isFavorite: boolean;
  onToggleFavorite: (matchId: string) => void;
  language?: AppLanguage;
}) {
  const t = (key: TranslationKey) => translate(language, key);
  const live =
    match.status === "LIVE";

  const finished =
    match.status === "FT";
  const upcoming = match.status === "UPCOMING";
  const locale = language === "fa-AF" ? "fa-AF" : language === "ps-AF" ? "ps-AF" : "en-US";
  const numberFormat = new Intl.NumberFormat(locale, { useGrouping: false });
  const formatScore = (score: number | undefined) =>
    score === undefined ? "" : numberFormat.format(score);
  const formatTime = (time: string | undefined) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const zero = numberFormat.format(0);
    return `${numberFormat.format(hours).padStart(2, zero)}:${numberFormat.format(minutes).padStart(2, zero)}`;
  };

  return (
    <article
      className="match-row"
      onClick={() => onOpenMatch(match)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenMatch(match);
        }
      }}
    >

      <div
        className={`match-status ${
          live
            ? "is-live"
            : upcoming
              ? "is-upcoming"
              : ""
        }`}
      >
        {live && (
          <span className="live-dot" />
        )}

        <span>
          {finished
            ? t("ft")
            : live
              ? t("live")
              : upcoming
                ? t("scheduled")
                : ""}
        </span>
      </div>

      <div className="team home-team">
        <span>
          {match.home}
        </span>

        <span className="team-badge">
          H
        </span>
      </div>

      <div className="match-score">

        {finished ||
        live ? (
          <>
            <strong>
              {formatScore(match.homeScore)}
            </strong>

            <span>
              -
            </span>

            <strong>
              {formatScore(match.awayScore)}
            </strong>
          </>
        ) : (
          <span className="match-time">
            {formatTime(match.time)}
          </span>
        )}

      </div>

      <div className="team away-team">

        <span className="team-badge">
          A
        </span>

        <span>
          {match.away}
        </span>

      </div>

      <div className="match-extra">

        {match.onTV && (
          <span className="tv-badge">
            TV
          </span>
        )}

        <button
          type="button"
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          aria-label={isFavorite ? t("removeFavorite") : t("addFavorite")}
          aria-pressed={isFavorite}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(match.id);
          }}
        >
          <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>

      </div>

    </article>
  );
}









