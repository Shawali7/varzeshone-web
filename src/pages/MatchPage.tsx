import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  Shield,
  Trophy,
} from "lucide-react";

import type { Match } from "../types";
import type { MatchEvent, MatchDetails } from "../data/matchDetailData";
import { getMatchDetails } from "../services/matchDetailService";

type MatchPageProps = {
  match: Match;
  onBack: () => void;
};

type MatchTab =
  | "overview"
  | "commentary"
  | "lineup"
  | "stats"
  | "table"
  | "h2h";

export default function MatchPage({
  match,
  onBack,
}: MatchPageProps) {
  const [tab, setTab] =
    useState<MatchTab>("overview");

  const [isFollowing, setIsFollowing] = useState(false);

  const [detailState, setDetailState] = useState<{
    matchId: Match["id"];
    details: MatchDetails | undefined;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMatchDetails(match.id).then((details) => {
      if (!cancelled) {
        setDetailState({
          matchId: match.id,
          details,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [match.id]);

  const details =
    detailState?.matchId === match.id
      ? detailState.details
      : undefined;

  const events: MatchEvent[] = details?.events ?? [];
  const homePlayers = details?.homePlayers ?? [];
  const awayPlayers = details?.awayPlayers ?? [];
  const form = details?.form ?? [];

  const finished =
    match.status === "FT";

  const live =
    match.status === "LIVE";

  const homeScore =
    match.homeScore ?? 0;

  const awayScore =
    match.awayScore ?? 0;

  const statusText = live
    ? "LIVE"
    : finished
      ? "Full time"
      : match.time ?? "Upcoming";

  const scoreText =
    finished || live
      ? `${homeScore} - ${awayScore}`
      : "-";

  const matchDate = useMemo(
    () =>
      new Intl.DateTimeFormat(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      ).format(new Date(match.date)),
    [match.date],
  );

  return (
    <main className="match-page">

      <div className="match-page-inner">

        <div className="match-page-topbar">

          <button
            className="match-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            <span>Back to matches</span>
          </button>

          <div className="match-page-competition">
            <Trophy size={15} />
            <span>{match.leagueName}</span>
          </div>

        </div>

        <section className="match-hero-card">

          <div className="match-hero-header">

            <div>
              <span className="match-kicker">
                {match.sport === "football"
                  ? "Football"
                  : "Futsal"}
              </span>

              <h1>
                {match.home} vs {match.away}
              </h1>
            </div>

            <button
              className={`match-follow-button ${isFollowing ? "active" : ""}`}
              onClick={() => setIsFollowing((current) => !current)}
              aria-pressed={isFollowing}
            >
              <Heart size={15} fill={isFollowing ? "currentColor" : "none"} />
              {isFollowing ? "Following" : "Follow"}
            </button>

          </div>

          <div className="match-meta-row">

            <span>
              <CalendarDays size={14} />
              {matchDate}
            </span>

            <span>
              <Clock3 size={14} />
              {match.time ?? "Full time"}
            </span>

            <span>
              <MapPin size={14} />
              Afghanistan
            </span>

          </div>

          <div className="match-scoreboard">

            <div className="match-team-block home">

              <div className="match-team-logo">
                <Shield size={34} />
              </div>

              <strong>
                {match.home}
              </strong>

              <span>
                Home
              </span>

            </div>

            <div className="match-score-block">

              <span
                className={`match-status-pill ${
                  live ? "live" : ""
                }`}
              >
                {live && (
                  <i className="live-dot" />
                )}
                {statusText}
              </span>

              <strong className="match-main-score">
                {scoreText}
              </strong>



            </div>

            <div className="match-team-block away">

              <div className="match-team-logo">
                <Shield size={34} />
              </div>

              <strong>
                {match.away}
              </strong>

              <span>
                Away
              </span>

            </div>

          </div>

        </section>

        <nav className="match-tabs">

          {[
            ["overview", "Overview"],
            ["commentary", "Commentary"],
            ["lineup", "Lineup"],
            ["stats", "Stats"],
            ["table", "Table"],
            ["h2h", "Head-to-Head"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={
                tab === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab(
                  value as MatchTab,
                )
              }
            >
              {label}
            </button>
          ))}

        </nav>

        {tab === "overview" && (
          <Overview
            match={match}
            setTab={setTab}
            stats={details?.stats ?? []}
            events={events}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
            form={form}
          />
        )}

        {tab === "commentary" && (
          <Commentary events={events} />
        )}

        {tab === "lineup" && (
          <Lineup
            home={match.home}
            away={match.away}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
          />
        )}

        {tab === "stats" && (
          <Stats stats={details?.stats ?? []} />
        )}

        {tab === "table" && (
          <LeagueTable
            rows={details?.table ?? []}
          />
        )}

        {tab === "h2h" && (
          <HeadToHead
            home={match.home}
            away={match.away}
            details={details?.headToHead}
          />
        )}

      </div>

    </main>
  );
}

function Overview({
  match,
  setTab,
  events,
  homePlayers,
  awayPlayers,
  form,
  stats,
}: {
  match: Match;
  setTab: (tab: MatchTab) => void;
  events: MatchEvent[];
  homePlayers: string[][];
  awayPlayers: string[][];
  form: string[][];
  stats: MatchDetails["stats"];
}) {
  return (
    <div className="match-content-grid">

      <div className="match-main-column">

        <section className="match-card">

          <div className="match-card-header">
            <div>
              <span className="match-section-kicker">
                Match summary
              </span>

              <h2>
                {match.home} vs {match.away}
              </h2>
            </div>

            <strong className="match-main-score">
              {match.status === "UPCOMING"
                ? "VS"
                : `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`}
            </strong>
          </div>

          <p className="match-review">
            {match.status === "UPCOMING"
              ? "The match has not started yet. Match information will appear here when available."
              : "The final score is available. Detailed match analysis will be added when verified data is available."}
          </p>

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>Top stats</h2>

            <button
              className="small-action"
              onClick={() => setTab("stats")}
            >
              All stats
            </button>
          </div>

          {stats.length > 0 ? (
            <div className="top-stats-grid">
              {stats.slice(0, 6).map((stat) => (
                <StatCompare
                  key={stat.label}
                  label={stat.label}
                  home={stat.home}
                  away={stat.away}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Statistics unavailable"
              description="Verified match statistics have not been added yet."
            />
          )}

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>Events</h2>

            <span className="match-card-muted">
              Match timeline
            </span>
          </div>

          {events.length > 0 ? (
            <div className="match-events">
              {events.map((event: MatchEvent, index: number) => (
                <div
                  className={`match-event ${event.team}`}
                  key={`${event.minute}-${index}`}
                >
                  <span className="event-minute">{event.minute}</span>
                  <span className={`event-symbol ${event.type}`}>
                    {event.type === "goal" ? "⚽" : event.type === "card" ? "🟨" : "↕"}
                  </span>
                  <div className="event-copy">
                    <strong>{event.title}</strong>
                    <span>{event.player}</span>
                    <small>{event.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No match events"
              description="Goals, cards and substitutions will appear here when verified event data is available."
            />
          )}

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>Lineups</h2>

            <button
              className="small-action"
              onClick={() => setTab("lineup")}
            >
              Full lineup
            </button>
          </div>

          {homePlayers.length > 0 || awayPlayers.length > 0 ? (
            <div className="lineup-preview-grid">
              <LineupTeam name={match.home} players={homePlayers} />
              <LineupTeam name={match.away} players={awayPlayers} />
            </div>
          ) : (
            <EmptyState
              title="Lineups not available"
              description="Starting players and formations will appear here after official lineups are published."
            />
          )}

        </section>

      </div>

      <aside className="match-side-column">

        <section className="match-card">

          <div className="match-card-header">
            <h2>Team form</h2>
          </div>

          {form.length > 0 ? (
            <div className="form-list">
              {form.map(([team, score, result]) => (
                <div className="form-row" key={team}>
                  <div>
                    <strong>{team}</strong>
                    <span>{score}</span>
                  </div>
                  <span className={`form-result ${result.toLowerCase()}`}>
                    {result}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Team form unavailable"
              description="Recent results for both teams will appear here when available."
            />
          )}

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>Match information</h2>
          </div>

          <div className="info-list">

            <div>
              <span>Competition</span>
              <strong>
                {match.leagueName}
              </strong>
            </div>

            <div>
              <span>Date</span>
              <strong>
                {matchDateText(match.date)}
              </strong>
            </div>

            <div>
              <span>Country</span>
              <strong>Afghanistan</strong>
            </div>

            <div>
              <span>Sport</span>
              <strong>
                {match.sport ===
                "football"
                  ? "Football"
                  : "Futsal"}
              </strong>
            </div>

          </div>

        </section>



      </aside>

    </div>
  );
}

function Commentary({
  events,
}: {
  events: MatchEvent[];
}) {
  return (
    <section className="match-card match-full-card">

      <div className="match-card-header">
        <div>
          <span className="match-section-kicker">
            Live updates
          </span>
          <h2>Commentary</h2>
        </div>

        <span className="match-card-muted">
          Timeline
        </span>
      </div>

      {events.length > 0 ? (
        <div className="commentary-list">
          {events.map((event, index) => (
            <div className="commentary-row" key={`${event.minute}-${index}`}>
              <strong>{event.minute}</strong>
              <div>
                <span>{event.title}</span>
                <p>{event.player} · {event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No commentary available"
          description="Match commentary will appear here when verified updates are available."
        />
      )}

    </section>
  );
}

function Lineup({
  home,
  away,
  homePlayers,
  awayPlayers,
}: {
  home: string;
  away: string;
  homePlayers: string[][];
  awayPlayers: string[][];
}) {
  return (
    <div className="match-lineup-layout">

      <section className="match-card">

        <div className="match-card-header">
          <h2>{home}</h2>
          
        </div>

        <PlayerList
          players={homePlayers}
        />

      </section>

      <section className="match-card">

        <div className="match-card-header">
          <h2>{away}</h2>
          
        </div>

        <PlayerList
          players={awayPlayers}
        />

      </section>

    </div>
  );
}

function Stats({
  stats,
}: {
  stats: MatchDetails["stats"];
}) {
  return (
    <section className="match-card match-full-card">
      <div className="match-card-header">
        <h2>Match statistics</h2>
      </div>
      {stats.length > 0 ? (
        <div className="full-stats">
          {stats.map((stat) => (
            <StatCompare
              key={stat.label}
              label={stat.label}
              home={stat.home}
              away={stat.away}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Statistics unavailable"
          description="Detailed match statistics will appear here when verified data is available."
        />
      )}
    </section>
  );
}
function LeagueTable({
  rows,
}: {
  rows: MatchDetails["table"];
}) {
  return (
    <section className="match-card match-full-card">
      <div className="match-card-header">
        <div>
          <span className="match-section-kicker">
            Competition
          </span>
          <h2>League table</h2>
        </div>
        <Trophy size={17} />
      </div>

      {rows.length > 0 ? (
        <div className="match-table-wrap">
          <table className="match-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.position}>
                  <td>{row.position}</td>
                  <td><strong>{row.team}</strong></td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                  <td><strong>{row.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="League table unavailable"
          description="Competition standings will appear here when official table data is available."
        />
      )}
    </section>
  );
}
function HeadToHead({
  home,
  away,
  details,
}: {
  home: string;
  away: string;
  details: MatchDetails["headToHead"] | undefined;
}) {
  return (
    <div className="match-content-grid">
      <div className="match-main-column">
        <section className="match-card">
          <div className="match-card-header">
            <h2>Head-to-Head</h2>
          </div>

          {details ? (
            <div className="h2h-summary">
              <div>
                <strong>{details.homeWins}</strong>
                <span>{home} wins</span>
              </div>
              <div>
                <strong>{details.draws}</strong>
                <span>Draws</span>
              </div>
              <div>
                <strong>{details.awayWins}</strong>
                <span>{away} wins</span>
              </div>
            </div>
          ) : (
            <p className="match-card-muted">
              No head-to-head data available.
            </p>
          )}
        </section>

        <section className="match-card">
          <div className="match-card-header">
            <h2>Previous meetings</h2>
          </div>

          {details?.meetings && details.meetings.length > 0 ? (
            <div className="h2h-list">
              {details.meetings.map((meeting, index: number) => (
                <div key={`${meeting.home}-${meeting.score}-${index}`}>
                  <span>{meeting.home}</span>
                  <strong>{meeting.score}</strong>
                  <span>{meeting.away}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No previous meetings"
              description="Previous results between these teams will appear here when available."
            />
          )}
        </section>
      </div>
    </div>
  );
}
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="match-empty-state">
      <CalendarDays size={20} aria-hidden="true" />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

function StatCompare({
  label,
  home,
  away,
}: {
  label: string;
  home: string;
  away: string;
}) {
  return (
    <div className="stat-compare">

      <div className="stat-values">
        <strong>{home}</strong>

        <span>{label}</span>

        <strong>{away}</strong>
      </div>

      <div className="stat-bar">
        <span />
      </div>

    </div>
  );
}

function LineupTeam({
  name,
  players,
}: {
  name: string;
  players: string[][];
}) {
  return (
    <div className="lineup-team-preview">

      <div className="lineup-team-title">
        <Shield size={15} />
        <strong>{name}</strong>
      </div>

      {players.map(
        ([number, player, rating]) => (
          <div
            className="lineup-player-row"
            key={number}
          >
            <span>{number}</span>

            <strong>
              {player}
            </strong>

            <b>{rating}</b>
          </div>
        ),
      )}

    </div>
  );
}

function PlayerList({
  players,
}: {
  players: string[][];
}) {
  return (
    <div className="player-list-match">

      {players.map(
        ([number, player, rating]) => (
          <div
            className="player-match-row"
            key={number}
          >
            <span>
              {number}
            </span>

            <div>
              <strong>
                {player}
              </strong>

              <small>
                Player
              </small>
            </div>

            <b>{rating}</b>

          </div>
        ),
      )}

    </div>
  );
}

function matchDateText(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
}







