import { useEffect, useState } from "react";

import {
  ArrowLeft,
  UserRound,
  Shield,
  MapPin,
  CalendarDays,
  Footprints,
  Trophy,
  Target,
  Activity,
} from "lucide-react";

import type { Player, PlayerTransfer, Team } from "../types";
import { getPlayerMatchHistory } from "../services/playerMatchService";
import type { PlayerMatchHistoryItem } from "../services/playerMatchService";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

type PlayerStats = {
  appearances?: number;
  minutesPlayed?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  passAccuracy?: number;
  chancesCreated?: number;
  tackles?: number;
};

type PlayerPageProps = {
  player: Player;
  teamName?: string;
  teams: Team[];
  transfers: PlayerTransfer[];
  language: AppLanguage;
  stats?: PlayerStats;
  onBack: () => void;
};

export default function PlayerPage({
  player,
  teamName,
  teams,
  transfers,
  language,
  stats,
  onBack,
}: PlayerPageProps) {
  const t = (key: TranslationKey) => translate(language, key);
  const [matchHistoryState, setMatchHistoryState] = useState<{
    playerId: string;
    history: PlayerMatchHistoryItem[];
    loading: boolean;
    error: boolean;
  }>({
    playerId: player.id,
    history: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    let isActive = true;

    getPlayerMatchHistory(player.id)
      .then((history) => {
        if (isActive) {
          setMatchHistoryState({
            playerId: player.id,
            history,
            loading: false,
            error: false,
          });
        }
      })
      .catch(() => {
        if (isActive) {
          setMatchHistoryState({
            playerId: player.id,
            history: [],
            loading: false,
            error: true,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [player.id]);

  const matchHistory =
    matchHistoryState.playerId === player.id
      ? matchHistoryState.history
      : [];

  const matchHistoryLoading =
    matchHistoryState.playerId !== player.id ||
    matchHistoryState.loading;
  const matchHistoryError = matchHistoryState.playerId === player.id && matchHistoryState.error;
  const hasStats =
    Boolean(stats && Object.values(stats).some((value) => value !== undefined)) ||
    matchHistory.length > 0;

  const calculatedStats = {
    appearances: stats?.appearances ?? matchHistory.length,
    starts: matchHistory.filter((item) => item.performance.started).length,
    minutesPlayed:
      stats?.minutesPlayed ??
      matchHistory.reduce((sum, item) => sum + item.performance.minutesPlayed, 0),
    goals:
      stats?.goals ??
      matchHistory.reduce((sum, item) => sum + item.performance.goals, 0),
    assists:
      stats?.assists ??
      matchHistory.reduce((sum, item) => sum + item.performance.assists, 0),
    yellowCards:
      stats?.yellowCards ??
      matchHistory.reduce((sum, item) => sum + item.performance.yellowCards, 0),
    redCards:
      stats?.redCards ??
      matchHistory.reduce((sum, item) => sum + item.performance.redCards, 0),
  };

  const hasDemoStats =
    player.isDemo || matchHistory.some((item) => item.performance.isDemo);

  const statCards = [
    { label: t("appearances"), value: calculatedStats.appearances, icon: Activity },
    { label: t("starts"), value: calculatedStats.starts, icon: Shield },
    { label: t("minutesPlayed"), value: calculatedStats.minutesPlayed, icon: CalendarDays },
    { label: t("goals"), value: calculatedStats.goals, icon: Target },
    { label: t("assists"), value: calculatedStats.assists, icon: Trophy },
    { label: t("yellowCards"), value: calculatedStats.yellowCards, icon: Activity },
    { label: t("redCards"), value: calculatedStats.redCards, icon: Shield },
  ];
  const performanceMetrics = {
    goalContributions: calculatedStats.goals + calculatedStats.assists,
    averageMinutes:
      calculatedStats.appearances > 0
        ? Math.round(calculatedStats.minutesPlayed / calculatedStats.appearances)
        : 0,
    startRate:
      calculatedStats.appearances > 0
        ? Math.round((calculatedStats.starts / calculatedStats.appearances) * 100)
        : 0,
  };
  return (
    <main className="player-page">
      <div className="player-page-container">
        <button className="player-back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>{t("back")}</span>
        </button>

        <section className="player-hero">
          <div className="player-photo">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
              />
            ) : (
              <UserRound size={76} strokeWidth={1.2} />
            )}
          </div>

          <div className="player-hero-info">
            <span className="player-eyebrow">
              {t("playerProfile").toUpperCase()}
              {player.isDemo && <span className="player-demo-label">{t("demoNotReal")}</span>}
            </span>

            <h1>{player.name}</h1>

            {player.position && (
              <span className="player-position">
                {player.position}
              </span>
            )}

            <div className="player-meta">
              {teamName && (
                <span>
                  <Shield size={15} />
                  {teamName}
                </span>
              )}

              {player.nationality && (
                <span>
                  <MapPin size={15} />
                  {player.nationality}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="player-section">
          <div className="player-section-heading">
            <h2>{t("playerInformation")}</h2>
            <span>{t("profile").toUpperCase()}</span>
          </div>

          <div className="player-information-grid">
            <div className="player-information-item">
              <UserRound size={19} />
              <div>
                <small>{t("fullName")}</small>
                <strong>{player.name}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <Activity size={19} />
              <div>
                <small>{t("position")}</small>
                <strong>{player.position || t("notAvailable")}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <Shield size={19} />
              <div>
                <small>{t("currentTeam")}</small>
                <strong>{teamName || t("notAvailable")}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <MapPin size={19} />
              <div>
                <small>{t("nationality")}</small>
                <strong>{player.nationality || t("notAvailable")}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <CalendarDays size={19} />
              <div>
                <small>{t("dateOfBirth")}</small>
                <strong>{player.dateOfBirth || t("notAvailable")}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <Shield size={19} />
              <div>
                <small>{t("jerseyNumber")}</small>
                <strong>
                  {player.jerseyNumber !== undefined
                    ? `#${player.jerseyNumber}`
                    : t("notAvailable")}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Activity size={19} />
              <div>
                <small>{t("height")}</small>
                <strong>
                  {player.heightCm !== undefined
                    ? `${player.heightCm} cm`
                    : t("notAvailable")}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Footprints size={19} />
              <div>
                <small>{t("preferredFoot")}</small>
                <strong>
                  {player.preferredFoot === "right"
                    ? t("rightFoot")
                    : player.preferredFoot === "left"
                      ? t("leftFoot")
                      : player.preferredFoot === "both"
                        ? t("bothFeet")
                        : t("notAvailable")}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Trophy size={19} />
              <div>
                <small>{t("football")}</small>
                <strong>
                  {player.sport === "football"
                    ? t("football")
                    : player.sport === "futsal"
                      ? t("futsal")
                      : t("notAvailable")}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Activity size={19} />
              <div>
                <small>{t("playerStatus")}</small>
                <strong>
                  {player.isActive === undefined
                    ? t("notAvailable")
                    : player.isActive
                      ? t("active")
                      : t("inactive")}
                </strong>
              </div>
            </div>
          </div>
        </section>

                <section className="player-section player-season-section">
          <div className="player-section-heading">
            <div>
              <h2>{t("seasonStatistics")}</h2>
              <p className="player-season-subtitle">{t("performanceOverview")}</p>
            </div>
            <span>{t("season").toUpperCase()}</span>
          </div>

          {hasStats ? (
            <>
              {hasDemoStats && (
                <div className="player-season-demo-note">
                  <span className="player-season-demo-dot"></span>
                  {t("demoNotVerified")}
                </div>
              )}

              <div className="player-stat-grid">
                {statCards.map((stat) => {
                  const Icon = stat.icon;

  return (
                    <div className="player-stat-card" key={stat.label}>
                      <div className="player-stat-icon">
                        <Icon size={19} />
                      </div>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="player-empty-state">
              <Activity size={28} />
              <strong>{t("statisticsComingSoon")}</strong>
              <p>
                {t("statisticsComingSoonNote")}
              </p>
            </div>
          )}
        </section>

        <section className="player-section player-analysis-section">
          <div className="player-section-heading">
            <div>
              <h2>{t("performanceAnalysis")}</h2>
              <p className="player-analysis-subtitle">
                {t("performanceAnalysisNote")}
              </p>
            </div>
            <span>{t("analysis").toUpperCase()}</span>
          </div>

          {hasStats ? (
            <>
              {hasDemoStats && (
                <div className="player-analysis-demo">
                  {t("demoNotVerified")}
                </div>
              )}

              <div className="player-analysis-grid">
                <article className="player-analysis-card player-analysis-attacking">
                  <div className="player-analysis-card-heading">
                    <div className="player-analysis-icon">
                      <Target size={19} />
                    </div>
                    <span>{t("attacking").toUpperCase()}</span>
                  </div>

                  <div className="player-analysis-main-value">
                    <strong>{performanceMetrics.goalContributions}</strong>
                    <span>{t("goalContributions")}</span>
                  </div>

                  <div className="player-analysis-breakdown">
                    <div>
                      <span>{t("goals")}</span>
                      <strong>{calculatedStats.goals}</strong>
                    </div>
                    <div>
                      <span>{t("assists")}</span>
                      <strong>{calculatedStats.assists}</strong>
                    </div>
                  </div>
                </article>

                <article className="player-analysis-card player-analysis-time">
                  <div className="player-analysis-card-heading">
                    <div className="player-analysis-icon">
                      <Activity size={19} />
                    </div>
                    <span>{t("playingTime").toUpperCase()}</span>
                  </div>

                  <div className="player-analysis-main-value">
                    <strong>{performanceMetrics.averageMinutes}</strong>
                    <span>{t("averageMinutes")}</span>
                  </div>

                  <div className="player-analysis-progress-label">
                    <span>{t("startingRate")}</span>
                    <strong>{performanceMetrics.startRate}%</strong>
                  </div>

                  <div
                    className="player-analysis-progress"
                    role="progressbar"
                    aria-label={t("startingRate")}
                    aria-valuenow={performanceMetrics.startRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span
                      style={{
                        width: `${performanceMetrics.startRate}%`,
                      }}
                    />
                  </div>
                </article>

                <article className="player-analysis-card player-analysis-discipline">
                  <div className="player-analysis-card-heading">
                    <div className="player-analysis-icon">
                      <Shield size={19} />
                    </div>
                    <span>{t("discipline").toUpperCase()}</span>
                  </div>

                  <div className="player-analysis-breakdown player-analysis-cards">
                    <div>
                      <span>{t("yellowCards")}</span>
                      <strong>{calculatedStats.yellowCards}</strong>
                    </div>
                    <div>
                      <span>{t("redCards")}</span>
                      <strong>{calculatedStats.redCards}</strong>
                    </div>
                  </div>
                </article>
              </div>
            </>
          ) : (
            <div className="player-empty-state">
              <Trophy size={28} />
              <strong>{t("analysisComingSoon")}</strong>
              <p>
                {t("analysisComingSoonNote")}
              </p>
            </div>
          )}
        </section>
        <section className="player-section player-history-section">
          <div className="player-section-heading">
            <h2>{t("transferHistory")}</h2>
            <span>{t("transfers").toUpperCase()}</span>
          </div>

          {transfers.length > 0 ? (
            <div className="player-transfer-list">
              {transfers.map((transfer) => {
                const fromTeam = transfer.fromTeamId
                  ? teams.find((team) => team.id === transfer.fromTeamId)
                  : undefined;

                const toTeam = teams.find(
                  (team) => team.id === transfer.toTeamId
                );

                const transferType =
                  transfer.type === "loan"
                    ? t("leagueLoan")
                    : transfer.type === "free"
                      ? t("freeTransfer")
                      : t("permanent");

                const transferStatus =
                  transfer.status === "completed"
                    ? t("completed")
                    : transfer.status === "pending"
                      ? t("pending")
                      : t("cancelledStatus");

  return (
                  <article className="player-transfer-card" key={transfer.id}>
                    <div className="player-transfer-route">
                      <div>
                        <small>{t("from").toUpperCase()}</small>
                        <strong>{fromTeam?.name || t("freeAgent")}</strong>
                      </div>

                      <span aria-hidden="true">→</span>

                      <div>
                        <small>{t("to").toUpperCase()}</small>
                        <strong>{toTeam?.name || t("unknownTeam")}</strong>
                      </div>
                    </div>

                    <div className="player-transfer-details">
                      <span>{transferType}</span>
                      <span>
                        {new Date(`${transfer.transferDate}T00:00:00`).toLocaleDateString(
                          language === "fa-AF" ? "fa-AF" : language === "ps-AF" ? "ps-AF" : "en-US",
                        )}
                      </span>
                      <span>{transferStatus}</span>

                      {transfer.feeAmount !== undefined && (
                        <span>
                          {t("fee")}: {transfer.feeAmount.toLocaleString(
                            language === "fa-AF" ? "fa-AF" : language === "ps-AF" ? "ps-AF" : "en-US",
                          )}
                          {transfer.feeCurrency
                            ? ` ${transfer.feeCurrency}`
                            : ""}
                        </span>
                      )}

                      {transfer.isVerified && (
                        <span>{t("verified")}</span>
                      )}

                      {transfer.isDemo && (
                        <span className="player-demo-label">
                          {t("demoNotVerified")}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="player-transfer-empty">
              <div className="player-transfer-empty-icon">
                <CalendarDays size={25} />
              </div>
              <div className="player-transfer-empty-content">
                <strong>{t("noTransferHistory")}</strong>
                <p>
                  {t("noTransferHistoryNote")}
                </p>
                <span>{t("transferRecordsNotAvailable")}</span>
              </div>
            </div>
          )}
        </section>

        <section className="player-section player-history-section">
          <div className="player-section-heading">
            <h2>{t("matchHistory")}</h2>
            <span>{t("recentMatches").toUpperCase()}</span>
          </div>

          {matchHistoryLoading ? (
            <div className="player-empty-state" role="status">
              <Activity size={28} />
              <strong>{t("loadingMatchHistory")}</strong>
            </div>
          ) : matchHistoryError ? (
            <div className="player-empty-state" role="alert">
              <strong>{t("matchHistoryError")}</strong>
              <p>{t("matchHistoryErrorNote")}</p>
            </div>
          ) : matchHistory.length > 0 ? (
            <div className="player-match-list">
              {matchHistory.map(({ performance, match }) => (
                <article className="player-match-card" key={performance.id}>
                  <div className="player-match-main">
                    <div className="player-match-teams">
                      <span>{match.home}</span>
                      <strong>
                        {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
                      </strong>
                      <span>{match.away}</span>
                    </div>

                    <time>
                      {new Date(`${match.date}T00:00:00`).toLocaleDateString(
                        language === "fa-AF" ? "fa-AF" : language === "ps-AF" ? "ps-AF" : "en-US",
                      )}
                    </time>
                  </div>

                  <div className="player-match-details">
                    <span>{performance.started ? t("started") : t("substitute")}</span>
                    <span>{performance.minutesPlayed} {t("minutes")}</span>
                    <span>{performance.goals} {t("goals")}</span>
                    <span>{performance.assists} {t("assists")}</span>
                    {performance.yellowCards > 0 && (
                      <span>{performance.yellowCards} {t("yellowCards")}</span>
                    )}
                    {performance.redCards > 0 && (
                      <span>{performance.redCards} {t("redCards")}</span>
                    )}
                    {performance.isVerified && <span>{t("verified")}</span>}
                    {performance.isDemo && (
                      <span className="player-demo-label">{t("demoDataNotice").split("—")[0].trim()}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="player-empty-state">
              <CalendarDays size={28} />
              <strong>{t("noMatchHistory")}</strong>
              <p>{t("noMatchHistoryNote")}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}









