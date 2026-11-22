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
  stats?: PlayerStats;
  onBack: () => void;
};

export default function PlayerPage({
  player,
  teamName,
  teams,
  transfers,
  stats,
  onBack,
}: PlayerPageProps) {
  const [matchHistoryState, setMatchHistoryState] = useState<{
    playerId: string;
    history: PlayerMatchHistoryItem[];
    loading: boolean;
  }>({
    playerId: player.id,
    history: [],
    loading: true,
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
          });
        }
      })
      .catch(() => {
        if (isActive) {
          setMatchHistoryState({
            playerId: player.id,
            history: [],
            loading: false,
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
    { label: "Appearances", value: calculatedStats.appearances, icon: Activity },
    { label: "Starts", value: calculatedStats.starts, icon: Shield },
    { label: "Minutes played", value: calculatedStats.minutesPlayed, icon: CalendarDays },
    { label: "Goals", value: calculatedStats.goals, icon: Target },
    { label: "Assists", value: calculatedStats.assists, icon: Trophy },
    { label: "Yellow cards", value: calculatedStats.yellowCards, icon: Activity },
    { label: "Red cards", value: calculatedStats.redCards, icon: Shield },
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
          <span>Back</span>
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
              PLAYER PROFILE
              {player.isDemo && <span className="player-demo-label">DEMO · NOT REAL</span>}
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
            <h2>Player information</h2>
            <span>PROFILE</span>
          </div>

          <div className="player-information-grid">
            <div className="player-information-item">
              <UserRound size={19} />
              <div>
                <small>Full name</small>
                <strong>{player.name}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <Activity size={19} />
              <div>
                <small>Position</small>
                <strong>{player.position || "Not available"}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <Shield size={19} />
              <div>
                <small>Current team</small>
                <strong>{teamName || "Not available"}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <MapPin size={19} />
              <div>
                <small>Nationality</small>
                <strong>{player.nationality || "Not available"}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <CalendarDays size={19} />
              <div>
                <small>Date of birth</small>
                <strong>{player.dateOfBirth || "Not available"}</strong>
              </div>
            </div>

            <div className="player-information-item">
              <Shield size={19} />
              <div>
                <small>Jersey number</small>
                <strong>
                  {player.jerseyNumber !== undefined
                    ? `#${player.jerseyNumber}`
                    : "Not available"}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Activity size={19} />
              <div>
                <small>Height</small>
                <strong>
                  {player.heightCm !== undefined
                    ? `${player.heightCm} cm`
                    : "Not available"}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Footprints size={19} />
              <div>
                <small>Preferred foot</small>
                <strong>
                  {player.preferredFoot === "right"
                    ? "Right"
                    : player.preferredFoot === "left"
                      ? "Left"
                      : player.preferredFoot === "both"
                        ? "Both"
                        : "Not available"}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Trophy size={19} />
              <div>
                <small>Sport</small>
                <strong>
                  {player.sport === "football"
                    ? "Football"
                    : player.sport === "futsal"
                      ? "Futsal"
                      : "Not available"}
                </strong>
              </div>
            </div>

            <div className="player-information-item">
              <Activity size={19} />
              <div>
                <small>Player status</small>
                <strong>
                  {player.isActive === undefined
                    ? "Not available"
                    : player.isActive
                      ? "Active"
                      : "Inactive"}
                </strong>
              </div>
            </div>
          </div>
        </section>

                <section className="player-section player-season-section">
          <div className="player-section-heading">
            <div>
              <h2>Season statistics</h2>
              <p className="player-season-subtitle">Player performance overview</p>
            </div>
            <span>SEASON</span>
          </div>

          {hasStats ? (
            <>
              {hasDemoStats && (
                <div className="player-season-demo-note">
                  <span className="player-season-demo-dot"></span>
                  DEMO DATA · NOT VERIFIED
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
              <strong>Statistics are not available yet</strong>
              <p>
                Player statistics will appear here when match participation
                records become available.
              </p>
            </div>
          )}
        </section>

        <section className="player-section player-analysis-section">
          <div className="player-section-heading">
            <div>
              <h2>Performance analysis</h2>
              <p className="player-analysis-subtitle">
                Attacking, playing time and discipline
              </p>
            </div>
            <span>ANALYSIS</span>
          </div>

          {hasStats ? (
            <>
              {hasDemoStats && (
                <div className="player-analysis-demo">
                  DEMO DATA · NOT VERIFIED
                </div>
              )}

              <div className="player-analysis-grid">
                <article className="player-analysis-card player-analysis-attacking">
                  <div className="player-analysis-card-heading">
                    <div className="player-analysis-icon">
                      <Target size={19} />
                    </div>
                    <span>ATTACKING</span>
                  </div>

                  <div className="player-analysis-main-value">
                    <strong>{performanceMetrics.goalContributions}</strong>
                    <span>Goal contributions</span>
                  </div>

                  <div className="player-analysis-breakdown">
                    <div>
                      <span>Goals</span>
                      <strong>{calculatedStats.goals}</strong>
                    </div>
                    <div>
                      <span>Assists</span>
                      <strong>{calculatedStats.assists}</strong>
                    </div>
                  </div>
                </article>

                <article className="player-analysis-card player-analysis-time">
                  <div className="player-analysis-card-heading">
                    <div className="player-analysis-icon">
                      <Activity size={19} />
                    </div>
                    <span>PLAYING TIME</span>
                  </div>

                  <div className="player-analysis-main-value">
                    <strong>{performanceMetrics.averageMinutes}</strong>
                    <span>Average minutes per appearance</span>
                  </div>

                  <div className="player-analysis-progress-label">
                    <span>Starting rate</span>
                    <strong>{performanceMetrics.startRate}%</strong>
                  </div>

                  <div
                    className="player-analysis-progress"
                    role="progressbar"
                    aria-label="Starting rate"
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
                    <span>DISCIPLINE</span>
                  </div>

                  <div className="player-analysis-breakdown player-analysis-cards">
                    <div>
                      <span>Yellow cards</span>
                      <strong>{calculatedStats.yellowCards}</strong>
                    </div>
                    <div>
                      <span>Red cards</span>
                      <strong>{calculatedStats.redCards}</strong>
                    </div>
                  </div>
                </article>
              </div>
            </>
          ) : (
            <div className="player-empty-state">
              <Trophy size={28} />
              <strong>Performance analysis coming soon</strong>
              <p>
                Detailed attacking, playing time and discipline analysis will
                appear when match statistics become available.
              </p>
            </div>
          )}
        </section>
        <section className="player-section player-history-section">
          <div className="player-section-heading">
            <h2>Transfer history</h2>
            <span>TRANSFERS</span>
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
                    ? "Loan"
                    : transfer.type === "free"
                      ? "Free transfer"
                      : "Permanent";

                const transferStatus =
                  transfer.status === "completed"
                    ? "Completed"
                    : transfer.status === "pending"
                      ? "Pending"
                      : "Cancelled";

  return (
                  <article className="player-transfer-card" key={transfer.id}>
                    <div className="player-transfer-route">
                      <div>
                        <small>FROM</small>
                        <strong>{fromTeam?.name || "Free agent"}</strong>
                      </div>

                      <span aria-hidden="true">→</span>

                      <div>
                        <small>TO</small>
                        <strong>{toTeam?.name || "Unknown team"}</strong>
                      </div>
                    </div>

                    <div className="player-transfer-details">
                      <span>{transferType}</span>
                      <span>
                        {new Date(transfer.transferDate).toLocaleDateString()}
                      </span>
                      <span>{transferStatus}</span>

                      {transfer.feeAmount !== undefined && (
                        <span>
                          Fee: {transfer.feeAmount.toLocaleString()}
                          {transfer.feeCurrency
                            ? ` ${transfer.feeCurrency}`
                            : ""}
                        </span>
                      )}

                      {transfer.isVerified && (
                        <span>Verified</span>
                      )}

                      {transfer.isDemo && (
                        <span className="player-demo-label">
                          DEMO · NOT VERIFIED
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
                <strong>No transfer history available</strong>
                <p>
                  Verified transfer records will appear here when official
                  player transfer information becomes available.
                </p>
                <span>TRANSFER RECORDS · NOT AVAILABLE</span>
              </div>
            </div>
          )}
        </section>

        <section className="player-section player-history-section">
          <div className="player-section-heading">
            <h2>Match history</h2>
            <span>RECENT MATCHES</span>
          </div>

          {matchHistoryLoading ? (
            <div className="player-empty-state">
              <Activity size={28} />
              <strong>Loading match history...</strong>
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
                      {new Date(`${match.date}T00:00:00`).toLocaleDateString()}
                    </time>
                  </div>

                  <div className="player-match-details">
                    <span>{performance.started ? "Started" : "Substitute"}</span>
                    <span>{performance.minutesPlayed} min</span>
                    <span>{performance.goals} goals</span>
                    <span>{performance.assists} assists</span>
                    {performance.yellowCards > 0 && (
                      <span>{performance.yellowCards} yellow cards</span>
                    )}
                    {performance.redCards > 0 && (
                      <span>{performance.redCards} red cards</span>
                    )}
                    {performance.isVerified && <span>Verified</span>}
                    {performance.isDemo && (
                      <span className="player-demo-label">DEMO DATA</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="player-empty-state">
              <CalendarDays size={28} />
              <strong>No match history available</strong>
              <p>
                Match appearances will appear here when player participation
                records are added to the static data.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}









