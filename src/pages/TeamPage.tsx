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

type TeamPageProps = {
  teamName: string;
  team?: Team;
  matches: Match[];
  players: Player[];
  onOpenPlayer: (player: Player) => void;
  onBack: () => void;
};

type TeamTab = "overview" | "matches" | "statistics" | "squad";

export default function TeamPage({
  teamName,
  team,
  matches,
  players,
  onOpenPlayer,
  onBack,
}: TeamPageProps) {
  const [activeTab, setActiveTab] =
    useState<TeamTab>("overview");
  const [isFollowing, setIsFollowing] =
    useState(false);

  const teamMatches = useMemo(
    () =>
      matches
        .filter(
          (match) =>
            match.home === teamName ||
            match.away === teamName,
        )
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        ),
    [matches, teamName],
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
      const isHome = match.home === teamName;
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
  }, [completedMatches, teamName]);

  const latestLeague = teamMatches[0]?.leagueName ?? "Afghanistan";
  const sport = team?.sport ?? teamMatches[0]?.sport ?? "football";

  const formatDate = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsed);
  };

  const renderMatch = (match: Match) => {
    const isHome = match.home === teamName;
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
            <small>{isHome ? "Home" : "Away"}</small>
          </div>
        </div>

        <div className="team-match-score">
          {match.status === "UPCOMING" ? (
            <strong>{match.time ?? "TBD"}</strong>
          ) : (
            <strong>
              {scored ?? 0} - {conceded ?? 0}
            </strong>
          )}
          <span className={`team-match-status ${match.status.toLowerCase()}`}>
            {match.status === "FT"
              ? "Full time"
              : match.status === "LIVE"
                ? "Live"
                : "Upcoming"}
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
          <span>Back</span>
        </button>
        <span className="team-breadcrumb">Teams / {teamName}</span>
      </div>

      <section className="team-hero-card">
        <div className="team-hero-main">
          <div className="team-hero-logo">
            <Shield size={38} strokeWidth={1.5} />
          </div>

          <div className="team-hero-info">
            <span className="team-eyebrow">
              {sport === "futsal" ? "FUTSAL CLUB" : "FOOTBALL CLUB"}
            </span>
            <h1>{teamName}</h1>
            <div className="team-hero-meta">
              <span><MapPinIcon /> {team?.country ?? "Afghanistan"}</span>
              <span><Trophy size={14} /> {latestLeague}</span>
            </div>
          </div>

          <button
            className={`team-follow-button ${isFollowing ? "following" : ""}`}
            onClick={() => setIsFollowing((value) => !value)}
          >
            <Heart size={16} fill={isFollowing ? "currentColor" : "none"} />
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <div className="team-hero-footer">
          <span><CalendarDays size={15} /> 2026 Season</span>
          <span>{sport === "futsal" ? "Futsal" : "Football"}</span>
          {team?.isDemo && <span>Demo team data</span>}
          <span>{team?.country ?? "Afghanistan"}</span>
        </div>
      </section>

      <section className="team-stats-grid">
        <div className="team-stat-card">
          <span>Played</span>
          <strong>{stats.played}</strong>
          <small>Completed matches</small>
        </div>
        <div className="team-stat-card">
          <span>Wins</span>
          <strong>{stats.wins}</strong>
          <small>Victories</small>
        </div>
        <div className="team-stat-card">
          <span>Draws</span>
          <strong>{stats.draws}</strong>
          <small>Drawn matches</small>
        </div>
        <div className="team-stat-card">
          <span>Losses</span>
          <strong>{stats.losses}</strong>
          <small>Defeats</small>
        </div>
        <div className="team-stat-card">
          <span>Points</span>
          <strong>{stats.points}</strong>
          <small>Calculated points</small>
        </div>
      </section>

      <nav className="team-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "matches" ? "active" : ""}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
        <button
          className={activeTab === "statistics" ? "active" : ""}
          onClick={() => setActiveTab("statistics")}
        >
          Statistics
        </button>
        <button
          className={activeTab === "squad" ? "active" : ""}
          onClick={() => setActiveTab("squad")}
        >
          Squad
        </button>
      </nav>

      {activeTab === "overview" && (
        <div className="team-content-grid">
          <section className="team-panel">
            <div className="team-panel-heading">
              <div>
                <h2>Recent results</h2>
                <p>Completed matches for {teamName}</p>
              </div>
              <button onClick={() => setActiveTab("matches")}>
                View all
              </button>
            </div>

            {completedMatches.length > 0 ? (
              <div className="team-match-list">
                {completedMatches.slice(0, 5).map(renderMatch)}
              </div>
            ) : (
              <div className="team-empty-state">
                No completed matches available yet.
              </div>
            )}
          </section>

          <aside className="team-panel team-side-panel">
            <div className="team-panel-heading">
              <div>
                <h2>Season summary</h2>
                <p>Based on available results</p>
              </div>
              <BarChart3 size={19} />
            </div>

            <div className="team-summary-line">
              <span>Goals scored</span>
              <strong>{stats.goalsFor}</strong>
            </div>
            <div className="team-summary-line">
              <span>Goals conceded</span>
              <strong>{stats.goalsAgainst}</strong>
            </div>
            <div className="team-summary-line">
              <span>Goal difference</span>
              <strong>
                {stats.goalDifference > 0 ? "+" : ""}
                {stats.goalDifference}
              </strong>
            </div>
            <div className="team-summary-line">
              <span>Live matches</span>
              <strong>{liveMatches.length}</strong>
            </div>
            <div className="team-summary-line">
              <span>Upcoming matches</span>
              <strong>{upcomingMatches.length}</strong>
            </div>
          </aside>
        </div>
      )}

      {activeTab === "matches" && (
        <section className="team-panel">
          <div className="team-panel-heading">
            <div>
              <h2>All matches</h2>
              <p>Results, live games and upcoming fixtures</p>
            </div>
            <span className="team-count">{teamMatches.length} matches</span>
          </div>

          {teamMatches.length > 0 ? (
            <div className="team-match-list">
              {teamMatches.map(renderMatch)}
            </div>
          ) : (
            <div className="team-empty-state">
              No matches found for this team.
            </div>
          )}
        </section>
      )}

      {activeTab === "squad" && (
        <section className="team-panel">
          <div className="team-panel-heading">
            <div>
              <h2>Squad</h2>
              <p>Players registered in this team</p>
            </div>
            <span className="team-count">{players.length} players</span>
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
                      <small>{player.position ?? "Player"}</small>
                    </div>
                  </div>
                  <div className="team-match-score">
                    <strong>
                      {player.jerseyNumber ? `#${player.jerseyNumber}` : "—"}
                    </strong>
                    <span className="team-match-status">
                      {player.isDemo ? "Demo player" : "Player"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="team-empty-state">
              No player records are available for this team yet.
            </div>
          )}
        </section>
      )}
      {activeTab === "statistics" && (
        <section className="team-panel">
          <div className="team-panel-heading">
            <div>
              <h2>Team statistics</h2>
              <p>Calculated from completed matches only</p>
            </div>
            <BarChart3 size={19} />
          </div>

          <div className="team-statistics-list">
            {[
              ["Matches played", stats.played],
              ["Wins", stats.wins],
              ["Draws", stats.draws],
              ["Losses", stats.losses],
              ["Goals scored", stats.goalsFor],
              ["Goals conceded", stats.goalsAgainst],
              ["Goal difference", stats.goalDifference],
              ["Points", stats.points],
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

