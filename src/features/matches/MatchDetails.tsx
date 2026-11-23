import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Flag,
  Goal,
  Shield,
  Trophy,
} from "lucide-react";
import type { Match } from "../../types/sports";
import { translate } from "../../i18n";
import type { AppLanguage } from "../../i18n";

type Props = {
  match: Match;
  language?: AppLanguage;
  onBack: () => void;
};

export default function MatchDetails({
  match,
  language = "fa-AF",
  onBack,
}: Props) {
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const finished = match.status === "FT";
  const live = match.status === "LIVE";

  return (
    <div className="match-details">

      <div className="details-topbar">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          <span>{t("backToMatches")}</span>
        </button>

        <div className="details-competition">
          <Trophy size={16} />
          <span>{match.leagueName}</span>
        </div>
      </div>

      <section className="match-hero">

        <div className="match-meta">
          <span>🇦🇫 {t("afghanistan")}</span>
          <span>•</span>
          <span>
            {match.sport === "football"
              ? t("football")
              : t("futsal")}
          </span>
        </div>

        <div className="match-teams">

          <div className="details-team">
            <div className="large-team-badge">
              <Shield size={34} />
            </div>

            <h2>{match.home}</h2>
            <span>{t("matchHome")}</span>
          </div>

          <div className="details-score">

            <div
              className={`details-status ${
                live ? "live" : ""
              }`}
            >
              {live
                ? t("live").toUpperCase()
                : finished
                  ? t("fullTime").toUpperCase()
                  : match.time}
            </div>

            {finished || live ? (
              <strong>
                {match.homeScore} - {match.awayScore}
              </strong>
            ) : (
              <strong className="upcoming-score">
                -
              </strong>
            )}

            {live && (
              <span className="live-minute">
                67'
              </span>
            )}

          </div>

          <div className="details-team">
            <div className="large-team-badge">
              <Shield size={34} />
            </div>

            <h2>{match.away}</h2>
            <span>{t("away")}</span>
          </div>

        </div>

        <div className="match-info">

          <div>
            <CalendarDays size={16} />
            <span>17 Nov 2026</span>
          </div>

          <div>
            <Clock3 size={16} />
            <span>
              {match.time ?? "Full Time"}
            </span>
          </div>

          <div>
            <Flag size={16} />
            <span>{t("afghanistan")}</span>
          </div>

        </div>

      </section>

      <nav className="details-tabs">
        <button className="active">
          {t("overview")}
        </button>

        <button>
          {t("timeline")}
        </button>

        <button>
          {t("lineup")}
        </button>

        <button>
          {t("statistics")}
        </button>

        <button>
          {t("table")}
        </button>
      </nav>

      <div className="details-grid">

        <section className="details-card">

          <div className="details-card-title">
            <Goal size={18} />
            <span>{t("matchEvents")}</span>
          </div>

          <div className="timeline">

            <div className="timeline-item home">
              <span className="minute">
                23'
              </span>

              <div className="event-icon goal">
                ⚽
              </div>

              <div>
                <strong>{match.home}</strong>
                <span>{t("goal")}</span>
              </div>
            </div>

            <div className="timeline-item away">
              <span className="minute">
                41'
              </span>

              <div className="event-icon card">
                🟨
              </div>

              <div>
                <strong>{match.away}</strong>
                <span>{t("yellowCard")}</span>
              </div>
            </div>

            <div className="timeline-item home">
              <span className="minute">
                58'
              </span>

              <div className="event-icon goal">
                ⚽
              </div>

              <div>
                <strong>{match.home}</strong>
                <span>{t("goal")}</span>
              </div>
            </div>

          </div>

        </section>

        <section className="details-card">

          <div className="details-card-title">
            <Trophy size={18} />
            <span>{t("statistics")}</span>
          </div>

          <div className="stat-row">
            <span>{t("possession")}</span>
            <strong>54% - 46%</strong>
          </div>

          <div className="stat-row">
            <span>{t("shots")}</span>
            <strong>12 - 8</strong>
          </div>

          <div className="stat-row">
            <span>{t("shotsOnTarget")}</span>
            <strong>6 - 3</strong>
          </div>

          <div className="stat-row">
            <span>{t("corners")}</span>
            <strong>5 - 4</strong>
          </div>

          <div className="stat-row">
            <span>{t("yellowCards")}</span>
            <strong>1 - 2</strong>
          </div>

        </section>

      </div>

      <section className="details-card table-card">

        <div className="details-card-title">
          <Trophy size={18} />
          <span>{t("leagueTable")}</span>
        </div>

        <div className="mini-table">

          <div className="mini-table-row header">
            <span>#</span>
            <span>{t("team")}</span>
            <span>MP</span>
            <span>W</span>
            <span>D</span>
            <span>L</span>
            <span>PTS</span>
          </div>

          <div className="mini-table-row">
            <span>1</span>
            <strong>{match.home}</strong>
            <span>5</span>
            <span>4</span>
            <span>1</span>
            <span>0</span>
            <strong>13</strong>
          </div>

          <div className="mini-table-row">
            <span>2</span>
            <strong>{match.away}</strong>
            <span>5</span>
            <span>3</span>
            <span>1</span>
            <span>1</span>
            <strong>10</strong>
          </div>

        </div>

      </section>

    </div>
  );
}
