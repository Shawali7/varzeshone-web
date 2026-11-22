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

type Props = {
  match: Match;
  onBack: () => void;
};

export default function MatchDetails({
  match,
  onBack,
}: Props) {
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
          <span>بازگشت به مسابقات</span>
        </button>

        <div className="details-competition">
          <Trophy size={16} />
          <span>{match.leagueName}</span>
        </div>
      </div>

      <section className="match-hero">

        <div className="match-meta">
          <span>🇦🇫 افغانستان</span>
          <span>•</span>
          <span>
            {match.sport === "football"
              ? "Football"
              : "Futsal"}
          </span>
        </div>

        <div className="match-teams">

          <div className="details-team">
            <div className="large-team-badge">
              <Shield size={34} />
            </div>

            <h2>{match.home}</h2>
            <span>Home</span>
          </div>

          <div className="details-score">

            <div
              className={`details-status ${
                live ? "live" : ""
              }`}
            >
              {live
                ? "LIVE"
                : finished
                  ? "FULL TIME"
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
            <span>Away</span>
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
            <span>Afghanistan</span>
          </div>

        </div>

      </section>

      <nav className="details-tabs">
        <button className="active">
          Overview
        </button>

        <button>
          Timeline
        </button>

        <button>
          Lineups
        </button>

        <button>
          Statistics
        </button>

        <button>
          Table
        </button>
      </nav>

      <div className="details-grid">

        <section className="details-card">

          <div className="details-card-title">
            <Goal size={18} />
            <span>Match events</span>
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
                <span>Goal</span>
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
                <span>Yellow card</span>
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
                <span>Goal</span>
              </div>
            </div>

          </div>

        </section>

        <section className="details-card">

          <div className="details-card-title">
            <Trophy size={18} />
            <span>Match statistics</span>
          </div>

          <div className="stat-row">
            <span>Possession</span>
            <strong>54% - 46%</strong>
          </div>

          <div className="stat-row">
            <span>Shots</span>
            <strong>12 - 8</strong>
          </div>

          <div className="stat-row">
            <span>Shots on target</span>
            <strong>6 - 3</strong>
          </div>

          <div className="stat-row">
            <span>Corners</span>
            <strong>5 - 4</strong>
          </div>

          <div className="stat-row">
            <span>Yellow cards</span>
            <strong>1 - 2</strong>
          </div>

        </section>

      </div>

      <section className="details-card table-card">

        <div className="details-card-title">
          <Trophy size={18} />
          <span>League table</span>
        </div>

        <div className="mini-table">

          <div className="mini-table-row header">
            <span>#</span>
            <span>Team</span>
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
