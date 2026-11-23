import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Heart,
  Shield,
  Trophy,
} from "lucide-react";
import type { Match, Player, Team } from "../types";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

type TeamPageProps = {
  team: Team;
  matches: Match[];
  players: Player[];
  language: AppLanguage;
  onOpenPlayer: (player: Player) => void;
  onBack: () => void;
};

type TeamTab = "overview" | "matches" | "statistics" | "squad";

export default function TeamPage({
  team,
  matches,
  players,
  language,
  onOpenPlayer,
  onBack,
}: TeamPageProps) {
  const t = (key: TranslationKey) => translate(language, key);
  const teamName = team.name;
  const [activeTab, setActiveTab] =
    useState<TeamTab>("overview");
  const [isFollowing, setIsFollowing] =
    useState(false);

  const teamMatches = useMemo(
    () =>
      matches
        .filter(
          (match) =>
            match.homeTeamId === team.id ||
            match.awayTeamId === team.id,
        )
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        ),
    [matches, team.id],
  );

  const completedMatches = teamMatches.filter(
    (match) => match.status === "FT",
  );

  const liveMatches = teamMatches.filter(
    (match) => match.status === "LIVE",
  );

  const upcomingMatches = teamMatches.filter(
    (match) => match.status === "UPCOMING",
  );

  const stats = useMemo(() => {
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    completedMatches.forEach((match) => {
      const isHome = match.homeTeamId === team.id;
      const scored = isHome
        ? match.homeScore ?? 0
        : match.awayScore ?? 0;
      const conceded = isHome
        ? match.awayScore ?? 0
        : match.homeScore ?? 0;

      goalsFor += scored;
      goalsAgainst += conceded;

      if (scored > conceded) wins += 1;
      else if (scored === conceded) draws += 1;
      else losses += 1;
    });

    return {
      played: completedMatches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: wins * 3 + draws,
    };
  }, [completedMatches, team.id]);

  const latestLeague = teamMatches[0]?.leagueName ?? t("afghanistan");
  const sport = team?.sport ?? teamMatches[0]?.sport ?? "football";

  const formatDate = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;

    return new Intl.DateTimeFormat(language === "en" ? "en-GB" : language === "fa-AF" ? "fa-AF" : "ps-AF", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsed);
  };

  const renderMatch = (match: Match) => {
    const isHome = match.homeTeamId === team.id;
    const opponent = isHome ? match.away : match.home;
    const scored = isHome
      ? match.homeScore
      : match.awayScore;
    const conceded = isHome
      ? match.awayScore
      : match.homeScore;

    let result = "";
    if (match.status === "FT") {
      if ((scored ?? 0) > (conceded ?? 0)) result = "W";
      else if ((scored ?? 0) < (conceded ?? 0)) result = "L";
      else result = "D";
    }

    return (
      <article className="team-match-row" key={match.id}>
        <div className="team-match-date">
          <span>{formatDate(match.date)}</span>
          <small>{match.leagueName}</small>
        </div>

        <div className="team-match-opponent">
          <span className="team-mini-crest">
            <Shield size={17} />
          </span>
          <div>
            <strong>{opponent}</strong>
            <small>{isHome ? t("matchHome") : t("away")}</small>
          </div>
        </div>

        <div className="team-match-score">
          {match.status === "UPCOMING" ? (
            <strong>{match.time ?? t("tbd")}</strong>
          ) : (
            <strong>
              {scored ?? 0} - {conceded ?? 0}
            </strong>
          )}
          <span className={`team-match-status ${match.status.toLowerCase()}`}>
            {match.status === "FT"
              ? t("fullTime")
              : match.status === "LIVE"
                ? t("live")
                : t("scheduled")}
          </span>
        </div>

        {result && (
          <span className={`team-result-badge ${result.toLowerCase()}`}>
            {result}
          </span>
        )}
      </article>
    );
  };

  return (
    <main className="team-page">
      <div className="team-page-topbar">
        <button className="team-back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          <span>{t("back")}</span>
        </button>
        <span className="team-breadcrumb">{t("teamsBreadcrumb")} / {teamName}</span>
      </div>

      <section className="team-hero-card">
        <div className="team-hero-main">
          <div className="team-hero-logo">
            <Shield size={38} strokeWidth={1.5} />
          </div>

          <div className="team-hero-info">
            <span className="team-eyebrow">
              {sport === "futsal" ? t("futsal").toUpperCase() : t("football").toUpperCase()}
            </span>
            <h1>{teamName}</h1>
            <div className="team-hero-meta">
              <span><MapPinIcon /> {team?.country ?? t("afghanistan")}</span>
              <span><Trophy size={14} /> {latestLeague}</span>
            </div>
          </div>

          <button
            className={`team-follow-button ${isFollowing ? "following" : ""}`}
            onClick={() => setIsFollowing((value) => !value)}
          >
            <Heart size={16} fill={isFollowing ? "currentColor" : "none"} />
            {isFollowing ? t("following") : t("follow")}
          </button>
        </div>

        <div className="team-hero-footer">
          <span><CalendarDays size={15} /> {t("season2026")}</span>
          <span>{sport === "futsal" ? t("futsal") : t("football")}</span>
          {team?.isDemo && <span>{t("demoTeamData")}</span>}
          <span>{team?.country ?? t("afghanistan")}</span>
        </div>
      </section>

      <section className="team-stats-grid">
        <div className="team-stat-card">
          <span>{t("matchesPlayed")}</span>
          <strong>{stats.played}</strong>
          <small>{t("completedMatches")}</small>
        </div>
        <div className="team-stat-card">
          <span>{t("wins")}</span>
          <strong>{stats.wins}</strong>
          <small>{t("victories")}</small>
        </div>
        <div className="team-stat-card">
          <span>{t("draws")}</span>
          <strong>{stats.draws}</strong>
          <small>{t("drawnMatches")}</small>
        </div>
        <div className="team-stat-card">
          <span>{t("losses")}</span>
          <strong>{stats.losses}</strong>
          <small>{t("defeats")}</small>
        </div>
        <div className="team-stat-card">
          <span>{t("points")}</span>
          <strong>{stats.points}</strong>
          <small>{t("calculatedPoints")}</small>
        </div>
      </section>

      <nav className="team-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          {t("overview")}
        </button>
        <button
          className={activeTab === "matches" ? "active" : ""}
          onClick={() => setActiveTab("matches")}
        >
          {t("matches")}
        </button>
        <button
          className={activeTab === "statistics" ? "active" : ""}
          onClick={() => setActiveTab("statistics")}
        >
          {t("statistics")}
        </button>
        <button
          className={activeTab === "squad" ? "active" : ""}
          onClick={() => setActiveTab("squad")}
        >
          {t("squad")}
        </button>
      </nav>

      {activeTab === "overview" && (
        <div className="team-content-grid">
          <section className="team-panel">
            <div className="team-panel-heading">
              <div>
                <h2>{t("recentResults")}</h2>
                <p>{t("recentResultsNote")} {teamName}</p>
              </div>
              <button onClick={() => setActiveTab("matches")}>
                {t("viewAll")}
              </button>
            </div>

            {completedMatches.length > 0 ? (
              <div className="team-match-list">
                {completedMatches.slice(0, 5).map(renderMatch)}
              </div>
            ) : (
              <div className="team-empty-state">
                {t("noCompletedMatches")}
              </div>
            )}
          </section>

          <aside className="team-panel team-side-panel">
            <div className="team-panel-heading">
              <div>
                <h2>{t("seasonSummary")}</h2>
                <p>{t("seasonSummaryNote")}</p>
              </div>
              <BarChart3 size={19} />
            </div>

            <div className="team-summary-line">
              <span>{t("goalsScored")}</span>
              <strong>{stats.goalsFor}</strong>
            </div>
            <div className="team-summary-line">
              <span>{t("goalsConceded")}</span>
              <strong>{stats.goalsAgainst}</strong>
            </div>
            <div className="team-summary-line">
              <span>{t("leagueGoalDifference")}</span>
              <strong>
                {stats.goalDifference > 0 ? "+" : ""}
                {stats.goalDifference}
              </strong>
            </div>
            <div className="team-summary-line">
              <span>{t("liveMatches")}</span>
              <strong>{liveMatches.length}</strong>
            </div>
            <div className="team-summary-line">
              <span>{t("upcomingMatches")}</span>
              <strong>{upcomingMatches.length}</strong>
            </div>
          </aside>
        </div>
      )}

      {activeTab === "matches" && (
        <section className="team-panel">
          <div className="team-panel-heading">
            <div>
              <h2>{t("allMatchesCount")}</h2>
              <p>{t("allMatchesNote")}</p>
            </div>
            <span className="team-count">{teamMatches.length} {t("matchesCount")}</span>
          </div>

          {teamMatches.length > 0 ? (
            <div className="team-match-list">
              {teamMatches.map(renderMatch)}
            </div>
          ) : (
            <div className="team-empty-state">
              {t("noMatchesTeam")}
            </div>
          )}
        </section>
      )}

      {activeTab === "squad" && (
        <section className="team-panel">
          <div className="team-panel-heading">
            <div>
              <h2>{t("squad")}</h2>
              <p>{t("registeredSquad")}</p>
            </div>
            <span className="team-count">{players.length} {t("playerLabel")}</span>
          </div>

          {players.length > 0 ? (
            <div className="team-match-list">
              {players.map((player) => (
                <button
                  className="team-match-row"
                  key={player.id}
                  type="button"
                  onClick={() => onOpenPlayer(player)}
                >
                  <div className="team-match-opponent">
                    <span className="team-mini-crest">
                      <Shield size={17} />
                    </span>
                    <div>
                      <strong>{player.name}</strong>
                      <small>{player.position ?? t("playerLabel")}</small>
                    </div>
                  </div>
                  <div className="team-match-score">
                    <strong>
                      {player.jerseyNumber ? `#${player.jerseyNumber}` : "—"}
                    </strong>
                    <span className="team-match-status">
                      {player.isDemo ? t("demoPlayer") : t("playerLabel")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="team-empty-state">
              {t("noPlayersTeam")}
            </div>
          )}
        </section>
      )}
      {activeTab === "statistics" && (
        <section className="team-panel">
          <div className="team-panel-heading">
            <div>
              <h2>{t("teamStatistics")}</h2>
              <p>{t("teamStatisticsNote")}</p>
            </div>
            <BarChart3 size={19} />
          </div>

          <div className="team-statistics-list">
            {[
              [t("matchesPlayed"), stats.played],
              [t("wins"), stats.wins],
              [t("draws"), stats.draws],
              [t("losses"), stats.losses],
              [t("goalsScored"), stats.goalsFor],
              [t("goalsConceded"), stats.goalsAgainst],
              [t("leagueGoalDifference"), stats.goalDifference],
              [t("points"), stats.points],
            ].map(([label, value]) => (
              <div className="team-summary-line" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function MapPinIcon() {
  return <span className="team-location-dot">●</span>;
}

