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

type HomeCompetition = {
  id: string;
  title: string;
  subtitle: string;
  matches: Match[];
};

type HomePageProps = {
  onOpenNews: () => void;
  onOpenLeague: () => void;
  onOpenMatch: (match: Match) => void;
  onOpenTeam: (teamName: string) => void;
  search: string;
  setSearch: (value: string) => void;
};

type HomeFilter = "all" | "live" | "upcoming" | "finished" | "tv" | "favorites";

const news = [
  "برنامه جدید مسابقات فوتبال افغانستان اعلام شد",
  "رقابت‌های لیگ برتر افغانستان با حضور تیم‌های جدید",
  "آمادگی تیم‌های هرات برای مسابقات پیش‌رو",
  "برنامه مسابقات فوتسال افغانستان اعلام شد",
];

function buildCompetitions(
  matches: Match[],
): HomeCompetition[] {
  const groups = new Map<string, Match[]>();

  for (const match of matches) {
    const current =
      groups.get(match.leagueName) ?? [];

    current.push(match);
    groups.set(match.leagueName, current);
  }

  return Array.from(groups.entries()).map(
    ([title, competitionMatches]) => ({
      id:
        competitionMatches[0]?.league ??
        title,
      title,
      subtitle: `${competitionMatches.length} matches`,
      matches: competitionMatches,
    }),
  );
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
  onOpenNews,
  onOpenLeague,
  onOpenMatch,
  search,
  setSearch,
}: HomePageProps) {
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

  const [selectedLeague, setSelectedLeague] =
    useState("همه مسابقات");

  const [filter, setFilter] =
    useState<HomeFilter>("all");

  const [sortByTime, setSortByTime] = useState(false);

  const [sportFilter, setSportFilter] =
    useState<"all" | "football" | "futsal">("all");

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
        const saved = localStorage.getItem("varzeshone-favorite-matches");
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem(
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
            selectedLeague === "همه مسابقات" ||
            competition.title ===
              selectedLeague;

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

          if (sortByTime) {
            filteredMatches.sort((a, b) => {
              const timeA = a.time && /^\d{1,2}:\d{2}$/.test(a.time) ? a.time : "99:99";
              const timeB = b.time && /^\d{1,2}:\d{2}$/.test(b.time) ? b.time : "99:99";
              return timeA.localeCompare(timeB);
            });
          }
              },
            );

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
    setSelectedLeague("همه مسابقات");
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

  return (
    <main className="main-layout">

      <aside className="left-sidebar">
        <section className={`card top-leagues ${topLeaguesOpen ? "is-open" : "is-collapsed"}`}>
          <div className="card-title">
            <h2>Top leagues</h2>
            <button
              type="button"
              className="top-leagues-toggle"
              aria-expanded={topLeaguesOpen}
              onClick={() => setTopLeaguesOpen((open) => !open)}
            >
              <span>Top leagues</span>
              <ChevronDown size={17} />
            </button>
          </div>

          <div className="league-list">

            <button
              className={`league-item ${
                selectedLeague ===
                "همه مسابقات"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedLeague(
                  "همه مسابقات",
                )
              }
            >
              <span className="league-icon af-icon">
                AF
              </span>

              <span>
                همه مسابقات
              </span>
            </button>

            {leagues.map((league) => (
              <button
                className={`league-item ${
                  selectedLeague === league.name ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedLeague(league.name);
                  onOpenLeague();
                }}
                key={league.id}
              >
                <span className="league-icon">
                  {league.sport === "football" ? "⚽" : "◉"}
                </span>

                <span>{league.name}</span>
              </button>
            ))}
          </div>
        </section>

        <button className="card all-leagues">
          <span>
            All leagues
          </span>

          <ChevronDown size={15} />
        </button>
      </aside>

      <section className="matches-column">

        <div className="card date-bar">
          <button
            className="circle-button"
            aria-label="Previous day"
            onClick={() => changeSelectedDate(-1)}
          >
            <ChevronLeft size={17} />
          </button>

          <button
            className="today-button"
            onClick={() => setCalendarOpen((open) => !open)}
            aria-expanded={calendarOpen}
            aria-label="Choose match date"
          >
            <span>
              {selectedDate === todayKey
                ? "Today"
                : parseDateKey(selectedDate).toLocaleDateString("en-US", {
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
            aria-label="Next day"
            onClick={() => changeSelectedDate(1)}
          >
            <ChevronRight size={17} />
          </button>

          {calendarOpen && (
            <div className="calendar-popover">
              <div className="calendar-header">
                <button
                  className="calendar-nav"
                  aria-label="Previous month"
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
                  {calendarMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>

                <button
                  className="calendar-nav"
                  aria-label="Next month"
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
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
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
                      aria-label={day.toLocaleDateString("en-US", {
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
                      {day.getDate()}
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
                  Go to today
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
              Live
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
              On TV
            </button>

            <button
              type="button"
              className={`filter-tab ${sortByTime ? "active" : ""}`}
              aria-pressed={sortByTime}
              onClick={() => setSortByTime((current) => !current)}
            >
              <Clock3 size={14} />
              By time
            </button>
          </div>

          <div className="filter-tools">
            <label className="filter-search-field">
              <Search size={15} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search teams or leagues"
                aria-label="Search teams or leagues"
              />
              {search && (
                <button
                  type="button"
                  className="filter-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <button
              type="button"
              className={`filter-advanced-icon ${filterPanelOpen ? "active" : ""}`}
              aria-label="Advanced filters"
              aria-expanded={filterPanelOpen}
              title="Advanced filters"
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
              <h3>Sport</h3>
              <div className="advanced-filter-options">
                {([
                  ["all", "All sports"],
                  ["football", "Football"],
                  ["futsal", "Futsal"],
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
              <h3>Match status</h3>
              <div className="advanced-filter-options">
                {([
                  ["all", "All"],
                  ["live", "Live"],
                  ["upcoming", "Upcoming"],
                  ["finished", "Finished"],
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
                <span>On TV only</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={draftOnlyFavorites}
                  onChange={(event) => setDraftOnlyFavorites(event.target.checked)}
                />
                <Star size={15} />
                <span>Favorites only</span>
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
                Reset
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
                Apply filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="card empty-state">
            <div className="loading-spinner" />

            <h3>
              Loading matches
            </h3>

            <p>
              Please wait...
            </p>
          </div>
        ) : filteredCompetitions.length ===
          0 ? (
          <div className="card empty-state">
            <Search size={30} />

            <h3>
              No matches found
            </h3>

            <p>
              Try changing your search
              or filters.
            </p>

            <button
              className="clear-button"
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredCompetitions.map(
            (competition) => (
              <CompetitionCard
                key={competition.id}
                title={
                  competition.title
                }
                subtitle={
                  competition.subtitle
                }
                matches={
                  competition.matches
                }
                onOpenMatch={
                  onOpenMatch
                }
                favoriteMatchIds={favoriteMatchIds}
                onToggleFavorite={toggleFavorite}
              />
            ),
          )
        )}

      </section>

      <aside className="right-sidebar">

        <section className="card news-card">

          <div className="section-header">
            <h2>
              News
            </h2>

            <button
              onClick={onOpenNews}
            >
              View all
            </button>
          </div>

          <article className="featured-news">

            <div className="featured-image">
              <span>
                VARZESHONE
              </span>
            </div>

            <h3>
              {news[0]}
            </h3>

            <span>
              VarzeshOne · 2 hr. ago
            </span>

          </article>

          {news.slice(1).map(
            (item, index) => (
              <article
                className="news-item"
                key={item}
              >
                <div className="news-image">
                  NEWS
                </div>

                <div>
                  <h3>
                    {item}
                  </h3>

                  <span>
                    VarzeshOne ·{" "}
                    {5 +
                      index * 2}{" "}
                    hr. ago
                  </span>
                </div>
              </article>
            ),
          )}

        </section>

        <section className="card standings-card">

          <div className="section-header">
            <h2>
              Standings
            </h2>

            <button>
              Full table
            </button>
          </div>

          <div className="standings">

            <div className="standing-head">
              <span>#</span>
              <span>Team</span>
              <span>P</span>
              <span>Pts</span>
            </div>

            {[
              [
                "1",
                "Herat FC",
                "5",
                "13",
              ],
              [
                "2",
                "Kabul FC",
                "5",
                "10",
              ],
              [
                "3",
                "Kandahar FC",
                "5",
                "7",
              ],
              [
                "4",
                "Balkh FC",
                "5",
                "4",
              ],
            ].map((row) => (
              <div
                className="standing-row"
                key={row[0]}
              >
                <span>
                  {row[0]}
                </span>

                <strong>
                  {row[1]}
                </strong>

                <span>
                  {row[2]}
                </span>

                <strong>
                  {row[3]}
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
  subtitle,
  matches,
  onOpenMatch,
  favoriteMatchIds,
  onToggleFavorite,
}: {
  title: string;
  subtitle: string;
  matches: Match[];
  onOpenMatch: (match: Match) => void;
  favoriteMatchIds: string[];
  onToggleFavorite: (matchId: string) => void;
}) {
  const [open, setOpen] =
    useState(true);

  return (
    <section className="competition-card card">

      <button
        className="competition-header"
        onClick={() =>
          setOpen(
            (value) =>
              !value,
          )
        }
      >
        <div className="competition-title">

          <span className="competition-icon">
            ⚽
          </span>

          <div>
            <strong>
              {title}
            </strong>

            <span>
              {subtitle}
            </span>
          </div>

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
}: {
  match: Match;
  onOpenMatch: (match: Match) => void;
  isFavorite: boolean;
  onToggleFavorite: (matchId: string) => void;
}) {
  const live =
    match.status === "LIVE";

  const finished =
    match.status === "FT";

  return (
    <article
      className="match-row"
      onClick={() => onOpenMatch(match)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
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
            : ""
        }`}
      >
        {live && (
          <span className="live-dot" />
        )}

        <span>
          {finished ? "FT" : live ? "LIVE" : ""}
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
              {match.homeScore}
            </strong>

            <span>
              -
            </span>

            <strong>
              {match.awayScore}
            </strong>
          </>
        ) : (
          <span className="match-time">
            {match.time}
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
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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












