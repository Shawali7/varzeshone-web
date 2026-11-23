import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Newspaper,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";
import { readPreference, writePreference } from "../utils/storage";
import { leagueService } from "../services/leagueService";
import type {
  LeagueFixture,
  LeagueSeasonData,
  LeagueTeamStat,
  PlayerStat,
  Standing,
} from "../data/leagueData";
import { AVAILABLE_LEAGUE_SEASONS } from "../data/leagueData";
import type { League } from "../types";

type LeagueTab =
  | "overview"
  | "table"
  | "fixtures"
  | "players"
  | "teams"
  | "transfers"
  | "seasons"
  | "news";

type TranslateLeagueText = (key: TranslationKey) => string;

const tabs: { id: LeagueTab; label: TranslationKey }[] = [
  { id: "overview", label: "leagueOverview" },
  { id: "table", label: "leagueTable" },
  { id: "fixtures", label: "leagueFixtures" },
  { id: "players", label: "leaguePlayerStats" },
  { id: "teams", label: "leagueTeamStats" },
  { id: "transfers", label: "leagueTransfers" },
  { id: "seasons", label: "leagueSeasons" },
  { id: "news", label: "leagueNews" },
];

type LeaguePageProps = {
  league?: League;
  language: AppLanguage;
  tab?: LeagueTab;
  season?: string;
  onTabChange?: (tab: LeagueTab) => void;
  onSeasonChange?: (season: string) => void;
};

type LoadState = {
  requestKey: string;
  status: "ready" | "error";
  data?: LeagueSeasonData;
};

export default function LeaguePage({
  league,
  language,
  tab,
  season,
  onTabChange,
  onSeasonChange,
}: LeaguePageProps) {
  const [internalTab, setInternalTab] = useState<LeagueTab>("overview");
  const [internalSeason, setInternalSeason] = useState<string>(AVAILABLE_LEAGUE_SEASONS[0].id);
  const [retryCount, setRetryCount] = useState(0);
  const [followState, setFollowState] = useState(() => ({
    leagueId: league?.id ?? "",
    value: league?.id
      ? readPreference(`varzeshone-followed-league:${league.id}`) === "true"
      : false,
  }));
  const [loadState, setLoadState] = useState<LoadState>({
    requestKey: "",
    status: "error",
  });

  const t: TranslateLeagueText = (key) => translate(language, key);
  const currentTab = tab ?? internalTab;
  const currentSeason = AVAILABLE_LEAGUE_SEASONS.find((item) => item.id === season)?.id
    ?? internalSeason;
  const currentSeasonLabel = AVAILABLE_LEAGUE_SEASONS.find((item) => item.id === currentSeason)?.label
    ?? AVAILABLE_LEAGUE_SEASONS[0].label;
  const scopeKey = `${league?.id ?? ""}:${currentSeason}`;
  const requestKey = `${scopeKey}:${retryCount}`;
  const isCurrentRequest = loadState.requestKey === requestKey;
  const isLoading = Boolean(league?.id) && !isCurrentRequest;
  const isError = isCurrentRequest && loadState.status === "error";
  const data = isCurrentRequest && loadState.status === "ready"
    ? loadState.data
    : undefined;
  const sportLabel = league?.sport === "futsal" ? t("futsal") : t("football");
  const country = league?.country ?? "Afghanistan";
  const locationLabel = league?.province ? `${league.province} · ${country}` : country;
  const currentLeagueId = league?.id ?? "";
  const followed = followState.leagueId === currentLeagueId
    ? followState.value
    : currentLeagueId
      ? readPreference(`varzeshone-followed-league:${currentLeagueId}`) === "true"
      : false;
  const changeTab = (nextTab: LeagueTab) => {
    setInternalTab(nextTab);
    onTabChange?.(nextTab);
  };
  const changeSeason = (nextSeason: string) => {
    setInternalSeason(nextSeason);
    onSeasonChange?.(nextSeason);
  };

  useEffect(() => {
    let cancelled = false;

    if (!league?.id) return;

    leagueService.getSeasonData(league.id, currentSeason)
      .then((result) => {
        if (!cancelled) {
          setLoadState({ requestKey, status: "ready", data: result });
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load league data:", error);
        if (!cancelled) {
          setLoadState({ requestKey, status: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [league?.id, requestKey, currentSeason]);

  const news = useMemo(() => data?.news ?? [], [data?.news]);
  const standings = data?.standings ?? [];
  const fixtures = data?.fixtures ?? [];
  const playerStats = data?.topRated ?? [];
  const scorers = data?.topScorers ?? [];
  const assists = data?.topAssists ?? [];

  const changeFollowed = () => {
    const nextFollowed = !followed;
    setFollowState({ leagueId: currentLeagueId, value: nextFollowed });
    if (league?.id) {
      writePreference(
        `varzeshone-followed-league:${league.id}`,
        String(nextFollowed),
      );
    }
  };

  return (
    <main className="league-page" dir={language === "en" ? "ltr" : "rtl"}>
      {isLoading && (
        <p className="league-data-status" role="status">{t("leagueLoading")}</p>
      )}
      {isError && (
        <p className="league-data-status" role="alert">
          {t("leagueLoadError")}
          <button type="button" className="text-button" onClick={() => setRetryCount((count) => count + 1)}>
            {t("retry")}
          </button>
        </p>
      )}

      <section className="league-hero card">
        <div className="league-identity">
          <div className="league-logo">
            {league?.logoUrl ? (
              <img src={league.logoUrl} alt="" />
            ) : (
              <Trophy size={32} aria-hidden="true" />
            )}
          </div>
          <div className="league-information">
            <div className="league-breadcrumb">
              <span>{locationLabel}</span>
              <ChevronRight size={13} aria-hidden="true" />
              <span>{sportLabel}</span>
            </div>
            <h1>{league?.name ?? t("leagueDetails")}</h1>
            <p className="league-location">
              {locationLabel}
              <span className="league-meta-divider" aria-hidden="true">·</span>
              {sportLabel}
              <span className="league-demo-badge">{t("leagueDemoData")}</span>
            </p>
          </div>
        </div>

        <div className="league-season-control">
          <label htmlFor="league-season">{t("leagueSeason")}</label>
          <div className="season-select-wrap">
            <select
              id="league-season"
              value={currentSeason}
              onChange={(event) => changeSeason(event.target.value)}
              aria-label={t("leagueSelectSeason")}
            >
              {AVAILABLE_LEAGUE_SEASONS.map((availableSeason) => (
                <option key={availableSeason.id} value={availableSeason.id}>
                  {availableSeason.label}
                </option>
              ))}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
        </div>

        <div className="league-actions">
          <button
            type="button"
            className={`follow-button ${followed ? "followed" : ""}`}
            onClick={changeFollowed}
            aria-pressed={followed}
          >
            <Heart size={16} fill={followed ? "currentColor" : "none"} />
            {followed ? t("leagueFollowing") : t("leagueFollow")}
          </button>
        </div>
      </section>

      <section className="league-toolbar card">
        <nav className="league-tabs" role="tablist" aria-label={t("leagueDetails")}>
          {tabs.map((item) => (
            <button
              type="button"
              key={item.id}
              id={`league-tab-${item.id}`}
              role="tab"
              aria-selected={currentTab === item.id}
              aria-controls="league-tab-panel"
              tabIndex={currentTab === item.id ? 0 : -1}
              className={currentTab === item.id ? "active" : ""}
              onClick={() => changeTab(item.id)}
            >
              {t(item.label)}
            </button>
          ))}
        </nav>
      </section>

      {!isLoading && !isError && (
        <div
          id="league-tab-panel"
          className="league-tab-panel"
          role="tabpanel"
          aria-labelledby={`league-tab-${currentTab}`}
          tabIndex={0}
        >
          {currentTab === "overview" && (
            <OverviewContent
              season={currentSeasonLabel}
              standings={standings}
              fixtures={fixtures}
              playerStats={playerStats}
              scorers={scorers}
              assists={assists}
              news={news}
              teamOfWeek={data?.teamOfWeek ?? []}
              onOpenTab={changeTab}
              t={t}
              language={language}
            />
          )}
          {currentTab === "table" && (
            <section className="league-content-grid">
              <StandingsCard full season={currentSeasonLabel} standings={standings} t={t} />
            </section>
          )}
          {currentTab === "fixtures" && (
            <section className="league-content-grid">
              <FixturesCard full fixtures={fixtures} t={t} language={language} />
            </section>
          )}
          {currentTab === "players" && (
            <section className="league-content-grid">
              <div className="league-main-column">
                <TopPlayersCard
                  title={t("leagueTopRated")}
                  icon={<Star size={17} />}
                  players={playerStats}
                  ratingMode
                  t={t}
                />
              </div>
              <aside className="league-side-column">
                <TopPlayersCard
                  title={t("leagueTopScorers")}
                  icon={<Target size={17} />}
                  players={scorers}
                  t={t}
                />
                <TopPlayersCard
                  title={t("leagueTopAssists")}
                  icon={<Users size={17} />}
                  players={assists}
                  t={t}
                />
              </aside>
            </section>
          )}
          {currentTab === "teams" && (
            <section className="league-content-grid">
                  <TeamStatsCard teamStats={data?.teamStats ?? []} t={t} />
            </section>
          )}
          {currentTab === "transfers" && (
            <section className="league-content-grid">
              <TransfersCard transfers={data?.transfers ?? []} t={t} />
            </section>
          )}
          {currentTab === "seasons" && (
            <section className="league-content-grid">
              <SeasonsCard
                currentSeason={currentSeason}
                seasons={data?.seasons ?? []}
                onSelectSeason={changeSeason}
                t={t}
              />
            </section>
          )}
          {currentTab === "news" && (
            <section className="league-content-grid">
              <div className="league-main-column">
                <NewsCard full news={news} language={language} t={t} />
              </div>
              <aside className="league-side-column">
                <TeamOfWeekCard players={data?.teamOfWeek ?? []} t={t} />
              </aside>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

function OverviewContent({
  season,
  standings,
  fixtures,
  playerStats,
  scorers,
  assists,
  news,
  teamOfWeek,
  onOpenTab,
  t,
  language,
}: {
  season: string;
  standings: Standing[];
  fixtures: LeagueFixture[];
  playerStats: PlayerStat[];
  scorers: PlayerStat[];
  assists: PlayerStat[];
  news: LeagueSeasonData["news"];
  teamOfWeek: LeagueSeasonData["teamOfWeek"];
  onOpenTab: (tab: LeagueTab) => void;
  t: TranslateLeagueText;
  language: AppLanguage;
}) {
  return (
    <div className="league-content-grid">
      <div className="league-main-column">
        <StandingsCard
          season={season}
          standings={standings}
          onFullTable={() => onOpenTab("table")}
          t={t}
        />
        <FixturesCard
          fixtures={fixtures}
          onAllFixtures={() => onOpenTab("fixtures")}
          t={t}
          language={language}
        />
        <NewsCard
          news={news}
          language={language}
          onViewAll={() => onOpenTab("news")}
          t={t}
        />
      </div>
      <aside className="league-side-column">
        <TopPlayersCard
          title={t("leagueTopRated")}
          icon={<Star size={17} />}
          players={playerStats}
          ratingMode
          onViewAll={() => onOpenTab("players")}
          t={t}
        />
        <TopPlayersCard
          title={t("leagueTopScorers")}
          icon={<Target size={17} />}
          players={scorers}
          onViewAll={() => onOpenTab("players")}
          t={t}
        />
        <TopPlayersCard
          title={t("leagueTopAssists")}
          icon={<Users size={17} />}
          players={assists}
          onViewAll={() => onOpenTab("players")}
          t={t}
        />
        <TeamOfWeekCard players={teamOfWeek} t={t} />
      </aside>
    </div>
  );
}

function StandingsCard({
  full = false,
  season,
  standings,
  onFullTable,
  t,
}: {
  full?: boolean;
  season: string;
  standings: Standing[];
  onFullTable?: () => void;
  t: TranslateLeagueText;
}) {
  const columns: { label: TranslationKey; value: (row: Standing) => string | number }[] = [
    { label: "leaguePlayed", value: (row) => row.played },
    { label: "leagueWins", value: (row) => row.won },
    { label: "leagueDraws", value: (row) => row.drawn },
    { label: "leagueLosses", value: (row) => row.lost },
    { label: "leagueGoalsFor", value: (row) => row.goalsFor },
    { label: "leagueGoalsAgainst", value: (row) => row.goalsAgainst },
    { label: "leagueGoalDifference", value: (row) => row.gd > 0 ? `+${row.gd}` : row.gd },
    { label: "leaguePoints", value: (row) => row.points },
  ];

  return (
    <section className={`card league-section ${full ? "full-width-section" : ""}`}>
      <div className="league-section-header">
        <div>
          <span className="section-kicker">{season}</span>
          <h2>{t("leagueStandings")}</h2>
        </div>
        {!full && (
          <button type="button" className="text-button" onClick={onFullTable}>
            {t("leagueFullTable")} <ChevronRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t("team")}</th>
              {columns.map((column) => <th scope="col" key={column.label}>{t(column.label)}</th>)}
              <th scope="col">{t("leagueForm")}</th>
            </tr>
          </thead>
          <tbody>
            {standings.length === 0 && (
              <tr><td colSpan={11}><span role="status">{t("leagueNoStandings")}</span></td></tr>
            )}
            {standings.map((row) => (
              <tr key={row.teamId}>
                <td><span className={`position ${row.position <= 3 ? "highlight" : ""}`}>{row.position}</span></td>
                <td>
                  <div className="standing-team">
                    <span className="team-logo" aria-hidden="true">{row.team.charAt(0)}</span>
                    <strong>{row.team}</strong>
                  </div>
                </td>
                {columns.map((column) => (
                  <td key={column.label}>{column.label === "leaguePoints" ? <strong>{column.value(row)}</strong> : column.value(row)}</td>
                ))}
                <td>
                  <div className="form-list" aria-label={t("leagueForm")}>
                    {row.form.map((result, index) => (
                      <span key={`${row.teamId}-${index}`} className={`form-${result.toLowerCase()}`}>
                        {t(result === "W" ? "leagueFormWin" : result === "D" ? "leagueFormDraw" : "leagueFormLoss")}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="standings-legend">
        <span><i className="legend-dot champions" />{t("leagueChampionshipQualification")}</span>
        <span><i className="legend-dot continental" />{t("leagueContinentalQualification")}</span>
        <span><i className="legend-dot relegation" />{t("leagueRelegationZone")}</span>
      </div>
    </section>
  );
}

function FixturesCard({
  full = false,
  fixtures,
  onAllFixtures,
  t,
  language,
}: {
  full?: boolean;
  fixtures: LeagueFixture[];
  onAllFixtures?: () => void;
  t: TranslateLeagueText;
  language: AppLanguage;
}) {
  const rounds = useMemo(
    () => [...new Set(fixtures.map((fixture) => fixture.round))].sort((a, b) => a - b),
    [fixtures],
  );
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const currentRound = selectedRound !== null && rounds.includes(selectedRound)
    ? selectedRound
    : rounds[0] ?? 0;
  const activeRoundIndex = rounds.indexOf(currentRound);
  const roundFixtures = fixtures.filter((fixture) => fixture.round === currentRound);
  const locale = language === "en" ? "en-US" : language;
  const dateFormatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: "long" });

  return (
    <section className={`card league-section ${full ? "full-width-section" : ""}`}>
      <div className="league-section-header">
        <div>
          <span className="section-kicker">{t("leagueFixtures")}</span>
          <h2>{t("leagueFixtures")}</h2>
        </div>
        {!full && (
          <button type="button" className="text-button" onClick={onAllFixtures}>
            {t("leagueAllFixtures")} <ChevronRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      {fixtures.length === 0 ? (
        <p className="league-section-empty" role="status">{t("leagueNoFixtures")}</p>
      ) : (
        <>
          <div className="fixture-round">
            <button
              type="button"
              aria-label={t("leaguePreviousRound")}
              disabled={activeRoundIndex <= 0}
              onClick={() => setSelectedRound(rounds[activeRoundIndex - 1])}
            >
              <ChevronLeft size={15} aria-hidden="true" />
            </button>
            <strong>{t("leagueRound")} {currentRound}</strong>
            <button
              type="button"
              aria-label={t("leagueNextRound")}
              disabled={activeRoundIndex < 0 || activeRoundIndex >= rounds.length - 1}
              onClick={() => setSelectedRound(rounds[activeRoundIndex + 1])}
            >
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="fixtures-list">
            {roundFixtures.map((fixture) => {
              const date = new Date(`${fixture.date}T12:00:00`);
              return (
                <article className="fixture-row" key={fixture.id}>
                  <div className="fixture-date">
                    <strong>{dateFormatter.format(date)}</strong>
                    <span>{dayFormatter.format(date)}</span>
                  </div>
                  <div className="fixture-teams">
                    <span>{fixture.home}</span>
                    <span>{fixture.away}</span>
                  </div>
                  <div className="fixture-time">
                    {fixture.status === "FT"
                      ? `${fixture.homeScore ?? 0} - ${fixture.awayScore ?? 0}`
                      : fixture.time}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function TopPlayersCard({
  title,
  icon,
  players,
  ratingMode = false,
  onViewAll,
  t,
}: {
  title: string;
  icon: ReactNode;
  players: PlayerStat[];
  ratingMode?: boolean;
  onViewAll?: () => void;
  t: TranslateLeagueText;
}) {
  return (
    <section className="card league-section">
      <div className="league-section-header compact">
        <div className="section-title-with-icon">{icon}<h2>{title}</h2></div>
        {onViewAll && <button type="button" className="text-button" onClick={onViewAll}>{t("leagueViewAll")}</button>}
      </div>
      <div className="player-list">
        {players.length === 0 && <p className="league-section-empty" role="status">{t("leagueNoPlayerStats")}</p>}
        {players.map((player, index) => (
          <div className="player-row" key={player.playerId}>
            <span className="player-rank">{index + 1}</span>
            <span className="player-avatar" aria-hidden="true">{player.name.charAt(0)}</span>
            <div className="player-info"><strong>{player.name}</strong><span>{player.team}</span></div>
            <strong className="player-value">
              {ratingMode ? player.rating?.toFixed(1) : player.value}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamStatsCard({
  teamStats,
  t,
}: {
  teamStats: LeagueTeamStat[];
  t: TranslateLeagueText;
}) {
  return (
    <section className="card league-section full-width-section">
      <div className="league-section-header">
        <div>
          <span className="section-kicker">{t("leagueDemoData")}</span>
          <div className="section-title-with-icon"><BarChart3 size={17} /><h2>{t("leagueTeamStats")}</h2></div>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="standings-table team-stats-table">
          <thead><tr>
            <th scope="col">#</th>
            <th scope="col">{t("team")}</th>
            <th scope="col">{t("leaguePlayed")}</th>
            <th scope="col">{t("leagueWins")}</th>
            <th scope="col">{t("leagueWinRate")}</th>
            <th scope="col">{t("leagueGoalsFor")}</th>
            <th scope="col">{t("leagueGoalsAgainst")}</th>
            <th scope="col">{t("leagueGoalDifference")}</th>
            <th scope="col">{t("leagueCleanSheets")}</th>
            <th scope="col">{t("leaguePoints")}</th>
          </tr></thead>
          <tbody>
            {teamStats.map((row, index) => (
              <tr key={row.teamId}>
                <td>{index + 1}</td>
                <td><div className="standing-team"><span className="team-logo" aria-hidden="true">{row.team.charAt(0)}</span><strong>{row.team}</strong></div></td>
                <td>{row.played}</td>
                <td>{row.wins}</td>
                <td>{row.played ? `${Math.round((row.wins / row.played) * 100)}%` : "—"}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                <td>{row.cleanSheets}</td>
                <td><strong>{row.points}</strong></td>
              </tr>
            ))}
            {teamStats.length === 0 && <tr><td colSpan={10} role="status">{t("leagueNoStandings")}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TransfersCard({
  transfers,
  t,
}: {
  transfers: LeagueSeasonData["transfers"];
  t: TranslateLeagueText;
}) {
  return (
    <section className="card league-section full-width-section">
      <div className="league-section-header">
        <div className="section-title-with-icon"><ArrowLeftRight size={17} /><h2>{t("leagueTransfers")}</h2></div>
      </div>
      <div className="league-transfer-list">
        {transfers.map((transfer) => (
          <article className="league-transfer-row" key={transfer.id}>
            <span className="player-avatar" aria-hidden="true">{transfer.player.charAt(0)}</span>
            <div className="player-info"><strong>{transfer.player}</strong><span>{transfer.fromTeam} <span aria-hidden="true">→</span> {transfer.toTeam}</span></div>
            <span className="league-transfer-type">{t(transfer.type === "Loan" ? "leagueLoan" : "leaguePermanent")}</span>
          </article>
        ))}
        {transfers.length === 0 && <p className="league-section-empty" role="status">{t("leagueNoTransfers")}</p>}
      </div>
    </section>
  );
}

function SeasonsCard({
  currentSeason,
  seasons,
  onSelectSeason,
  t,
}: {
  currentSeason: string;
  seasons: LeagueSeasonData["seasons"];
  onSelectSeason: (season: string) => void;
  t: TranslateLeagueText;
}) {
  return (
    <section className="card league-section full-width-section">
      <div className="league-section-header">
        <div><span className="section-kicker">{t("leagueDemoData")}</span><h2>{t("leagueCompetitionHistory")}</h2></div>
      </div>
      <div className="season-history-list">
        {seasons.map((item) => (
          <button
            type="button"
            key={item.seasonId}
            className={`season-history-row ${item.seasonId === currentSeason ? "active" : ""}`}
            onClick={() => onSelectSeason(item.seasonId)}
          >
            <div className="season-history-year"><strong>{item.season}</strong><span>{t("leagueSeason")}</span></div>
            <div className="season-history-result"><span className="season-history-label">{t("leagueWinner")}</span><strong>{item.seasonId === AVAILABLE_LEAGUE_SEASONS[0].id ? t("leagueInProgress") : item.winner ?? "—"}</strong></div>
            <div className="season-history-result"><span className="season-history-label">{t("leagueRunnerUp")}</span><strong>{item.seasonId === AVAILABLE_LEAGUE_SEASONS[0].id ? "—" : item.runnerUp ?? "—"}</strong></div>
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function NewsCard({
  full = false,
  news,
  language,
  onViewAll,
  t,
}: {
  full?: boolean;
  news: LeagueSeasonData["news"];
  language: AppLanguage;
  onViewAll?: () => void;
  t: TranslateLeagueText;
}) {
  return (
    <section className={`card league-section ${full ? "full-width-section" : ""}`}>
      <div className="league-section-header">
        <div className="section-title-with-icon"><Newspaper size={17} /><h2>{t("leagueNews")}</h2></div>
        {!full && <button type="button" className="text-button" onClick={onViewAll}>{t("leagueViewAll")}</button>}
      </div>
      <div className="league-news-list">
        {news.map((item, index) => (
          <article className="league-news-item" key={item.id}>
            <div className="news-number">{index + 1}</div>
            <div>
              <h3>{item.title[language]}</h3>
              <span>VarzeshOne · {t("leagueDemoData")}</span>
            </div>
          </article>
        ))}
        {news.length === 0 && <p className="league-section-empty" role="status">{t("noNews")}</p>}
      </div>
    </section>
  );
}

function TeamOfWeekCard({
  players,
  t,
}: {
  players: LeagueSeasonData["teamOfWeek"];
  t: TranslateLeagueText;
}) {
  const goalkeepers = players.filter((player) => player.position === "GK");
  const defenders = players.filter((player) => player.position === "DF");
  const midfielders = players.filter((player) => player.position === "MF");
  const forwards = players.filter((player) => player.position === "FW");
  const positionLabels = { GK: "GK", DF: "DF", MF: "MF", FW: "FW" };

  const renderPlayer = (player: LeagueSeasonData["teamOfWeek"][number]) => (
    <div className="formation-player" key={player.playerId}>
      <span>{positionLabels[player.position]}</span>
      <strong>{player.name}</strong>
    </div>
  );

  return (
    <section className="card league-section team-of-week">
      <div className="league-section-header compact">
        <div className="section-title-with-icon"><Trophy size={17} /><h2>{t("leagueTeamOfWeek")}</h2></div>
      </div>
      <p className="league-demo-note">{t("leagueDemoData")}</p>
      {players.length === 0 ? (
        <p className="league-section-empty" role="status">{t("leagueNoPlayerStats")}</p>
      ) : (
        <div className="team-of-week-visual">
          <div className="formation">
            {goalkeepers.map(renderPlayer)}
            <div className="formation-row">{defenders.map(renderPlayer)}</div>
            <div className="formation-row">{midfielders.map(renderPlayer)}</div>
            <div className="formation-row">{forwards.map(renderPlayer)}</div>
          </div>
        </div>
      )}
    </section>
  );
}
