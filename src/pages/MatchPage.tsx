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
import type {
  MatchEvent,
  MatchDetails,
  MatchFormItem,
  MatchLineupPlayer,
} from "../data/matchDetailData";
import { getMatchDetails } from "../services/matchDetailService";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

type MatchPageProps = {
  match: Match;
  language: AppLanguage;
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
  language,
  onBack,
}: MatchPageProps) {
  const t = (key: TranslationKey) => translate(language, key);
  const [tab, setTab] =
    useState<MatchTab>("overview");

  const [isFollowing, setIsFollowing] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

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
    }).catch(() => {
      if (!cancelled) setDetailsError(match.id);
    });

    return () => {
      cancelled = true;
    };
  }, [match.id]);

  const details =
    detailState?.matchId === match.id
      ? detailState.details
      : undefined;

  const detailsLoading = detailState?.matchId !== match.id && detailsError !== match.id;
  const detailsReady = !detailsLoading && detailsError !== match.id;

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
    ? translate(language, "live").toUpperCase()
    : finished
      ? t("fullTime")
      : match.time ?? t("scheduled");

  const scoreText =
    finished || live
      ? `${homeScore} - ${awayScore}`
      : "-";

  const matchDate = useMemo(
    () => matchDateText(match.date, language),
    [match.date, language],
  );

  return (
    <main className="match-page">

      <div className="match-page-inner">
        {detailsError === match.id && <p role="alert">{t("matchDetailsError")}</p>}

        <div className="match-page-topbar">

          <button
            className="match-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            <span>{t("backToMatches")}</span>
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
                  ? t("football")
                  : t("futsal")}
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
              {isFollowing ? t("following") : t("follow")}
            </button>

          </div>

          <div className="match-meta-row">

            <span>
              <CalendarDays size={14} />
              {matchDate}
            </span>

            <span>
              <Clock3 size={14} />
              {match.time ?? (finished ? t("fullTime") : live ? t("live").toUpperCase() : t("timeTbd"))}
            </span>

            <span>
              <MapPin size={14} />
              {t("afghanistan")}
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
                {t("matchHome")}
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
                {t("away")}
              </span>

            </div>

          </div>

        </section>

        <nav className="match-tabs">

          {[
            ["overview", t("overview")],
            ["commentary", t("commentary")],
            ["lineup", t("lineup")],
            ["stats", t("stats")],
            ["table", t("table")],
            ["h2h", t("headToHead")],
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

        {detailsLoading && <p role="status">{t("loadingMatchDetails")}</p>}

        {detailsReady && tab === "overview" && (
          <Overview
            match={match}
            language={language}
            setTab={setTab}
            stats={details?.stats ?? []}
            events={events}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
            form={form}
          />
        )}

        {detailsReady && tab === "commentary" && (
          <Commentary events={events} language={language} />
        )}

        {detailsReady && tab === "lineup" && (
          <Lineup
            home={match.home}
            away={match.away}
            language={language}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
          />
        )}

        {detailsReady && tab === "stats" && (
          <Stats stats={details?.stats ?? []} language={language} />
        )}

        {detailsReady && tab === "table" && (
          <LeagueTable
            rows={details?.table ?? []}
            language={language}
          />
        )}

        {detailsReady && tab === "h2h" && (
          <HeadToHead
            home={match.home}
            away={match.away}
            language={language}
            details={details?.headToHead}
          />
        )}

      </div>

    </main>
  );
}

function Overview({
  match,
  language,
  setTab,
  events,
  homePlayers,
  awayPlayers,
  form,
  stats,
}: {
  match: Match;
  language: AppLanguage;
  setTab: (tab: MatchTab) => void;
  events: MatchEvent[];
  homePlayers: MatchLineupPlayer[];
  awayPlayers: MatchLineupPlayer[];
  form: MatchFormItem[];
  stats: MatchDetails["stats"];
}) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <div className="match-content-grid">

      <div className="match-main-column">

        <section className="match-card">

          <div className="match-card-header">
            <div>
              <span className="match-section-kicker">
                {t("matchSummary")}
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
              ? t("matchNotStarted")
              : t("finalScoreAvailable")}
          </p>

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>{t("leagueTopRated")}</h2>

            <button
              className="small-action"
              onClick={() => setTab("stats")}
            >
              {t("allStats")}
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
              title={t("statisticsUnavailable")}
              description={t("statisticsNotAdded")}
            />
          )}

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>{t("events")}</h2>

            <span className="match-card-muted">
              {t("timeline")}
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
              title={t("noMatchEvents")}
              description={t("matchEventsNote")}
            />
          )}

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>{t("lineup")}</h2>

            <button
              className="small-action"
              onClick={() => setTab("lineup")}
            >
              {t("fullLineup")}
            </button>
          </div>

          {homePlayers.length > 0 || awayPlayers.length > 0 ? (
            <div className="lineup-preview-grid">
              <LineupTeam name={match.home} players={homePlayers} />
              <LineupTeam name={match.away} players={awayPlayers} />
            </div>
          ) : (
            <EmptyState
              title={t("lineupsUnavailable")}
              description={t("lineupsNote")}
            />
          )}

        </section>

      </div>

      <aside className="match-side-column">

        <section className="match-card">

          <div className="match-card-header">
            <h2>{t("teamForm")}</h2>
          </div>

          {form.length > 0 ? (
            <div className="form-list">
              {form.map((item) => (
                <div className="form-row" key={`${item.matchId}:${item.teamId}`}>
                  <div>
                    <strong>{item.team}</strong>
                    <span>{item.score}</span>
                  </div>
                  <span className={`form-result ${item.result.toLowerCase()}`}>
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("teamFormUnavailable")}
              description={t("teamFormNote")}
            />
          )}

        </section>

        <section className="match-card">

          <div className="match-card-header">
            <h2>{t("matchInformation")}</h2>
          </div>

          <div className="info-list">

            <div>
              <span>{t("competition")}</span>
              <strong>
                {match.leagueName}
              </strong>
            </div>

            <div>
              <span>{t("date")}</span>
              <strong>
                {matchDateText(match.date, language)}
              </strong>
            </div>

            <div>
              <span>{translate(language, "country")}</span>
              <strong>{translate(language, "afghanistan")}</strong>
            </div>

            <div>
              <span>{translate(language, "sportFilter")}</span>
              <strong>
                {match.sport ===
                "football"
                  ? translate(language, "football")
                  : translate(language, "futsal")}
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
  language,
}: {
  events: MatchEvent[];
  language: AppLanguage;
}) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <section className="match-card match-full-card">

      <div className="match-card-header">
        <div>
          <span className="match-section-kicker">
            {t("live")}
          </span>
          <h2>{t("commentary")}</h2>
        </div>

        <span className="match-card-muted">
          {t("timeline")}
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
          title={t("noMatchEvents")}
          description={t("matchEventsNote")}
        />
      )}

    </section>
  );
}

function Lineup({
  home,
  away,
  language,
  homePlayers,
  awayPlayers,
}: {
  home: string;
  away: string;
  language: AppLanguage;
  homePlayers: MatchLineupPlayer[];
  awayPlayers: MatchLineupPlayer[];
}) {
  return (
    <div className="match-lineup-layout">

      <section className="match-card">

        <div className="match-card-header">
          <h2>{home}</h2>
          
        </div>

        <PlayerList
          players={homePlayers}
          language={language}
        />

      </section>

      <section className="match-card">

        <div className="match-card-header">
          <h2>{away}</h2>
          
        </div>

        <PlayerList
          players={awayPlayers}
          language={language}
        />

      </section>

    </div>
  );
}

function Stats({
  stats,
  language,
}: {
  stats: MatchDetails["stats"];
  language: AppLanguage;
}) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <section className="match-card match-full-card">
      <div className="match-card-header">
        <h2>{t("statistics")}</h2>
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
          title={t("statisticsUnavailable")}
          description={t("statisticsNotAdded")}
        />
      )}
    </section>
  );
}
function LeagueTable({
  rows,
  language,
}: {
  rows: MatchDetails["table"];
  language: AppLanguage;
}) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <section className="match-card match-full-card">
      <div className="match-card-header">
        <div>
          <span className="match-section-kicker">
            {t("competition")}
          </span>
          <h2>{t("leagueTable")}</h2>
        </div>
        <Trophy size={17} />
      </div>

      {rows.length > 0 ? (
        <div className="match-table-wrap">
          <table className="match-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t("team")}</th>
                <th>{t("matchesPlayed")}</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>{t("points")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.teamId}>
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
          title={t("statisticsUnavailable")}
          description={t("statisticsNotAdded")}
        />
      )}
    </section>
  );
}
function HeadToHead({
  home,
  away,
  details,
  language,
}: {
  home: string;
  away: string;
  details: MatchDetails["headToHead"] | undefined;
  language: AppLanguage;
}) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <div className="match-content-grid">
      <div className="match-main-column">
        <section className="match-card">
          <div className="match-card-header">
            <h2>{t("headToHead")}</h2>
          </div>

          {details ? (
            <div className="h2h-summary">
              <div>
                <strong>{details.homeWins}</strong>
                <span>{home} {t("wins")}</span>
              </div>
              <div>
                <strong>{details.draws}</strong>
                <span>{t("draws")}</span>
              </div>
              <div>
                <strong>{details.awayWins}</strong>
                <span>{away} {t("wins")}</span>
              </div>
            </div>
          ) : (
            <p className="match-card-muted">
              {t("statisticsUnavailable")}
            </p>
          )}
        </section>

        <section className="match-card">
          <div className="match-card-header">
            <h2>{t("leagueAllFixtures")}</h2>
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
              title={t("noMatchEvents")}
              description={t("teamFormNote")}
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
  players: MatchLineupPlayer[];
}) {
  return (
    <div className="lineup-team-preview">

      <div className="lineup-team-title">
        <Shield size={15} />
        <strong>{name}</strong>
      </div>

      {players.map(
        ({ number, player, rating, playerId }) => (
          <div
            className="lineup-player-row"
            key={playerId}
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
  language = "en",
}: {
  players: MatchLineupPlayer[];
  language?: AppLanguage;
}) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <div className="player-list-match">

      {players.map(
        ({ number, player, rating, playerId }) => (
          <div
            className="player-match-row"
            key={playerId}
          >
            <span>
              {number}
            </span>

            <div>
              <strong>
                {player}
              </strong>

              <small>
                {t("player")}
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
  language: AppLanguage = "en",
) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return translate(language, "notAvailable");
  return new Intl.DateTimeFormat(
    language === "en" ? "en-GB" : language === "fa-AF" ? "fa-AF" : "ps-AF",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(parsed);
}




