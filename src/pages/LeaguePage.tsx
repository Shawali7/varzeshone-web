import { useEffect, useMemo, useState } from "react";
import { leagueService } from "../services/leagueService";
import type { Standing, PlayerStat } from "../data/leagueData";
import type { League } from "../types";

import {
  ChevronDown,
  ChevronRight,
  Heart,
  Newspaper,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";

type LeagueTab =
  | "overview"
  | "table"
  | "fixtures"
  | "players"
  | "teams"
  | "transfers"
  | "seasons"
  | "news";

const leagueNews = [
  "برنامه هفته نهم لیگ برتر افغانستان اعلام شد",
  "آمادگی تیم‌های هرات برای ادامه رقابت‌ها",
  "جدول لیگ برتر افغانستان به‌روزرسانی شد",
  "رقابت حساس کابل و پنجشیر در هفته نهم",
  "تیم‌های قندهار و ننگرهار آماده دیدار مهم خود هستند",
];

const tabs: {
  id: LeagueTab;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "table", label: "Table" },
  { id: "fixtures", label: "Fixtures" },
  { id: "players", label: "Player stats" },
  { id: "teams", label: "Team stats" },
  { id: "transfers", label: "Transfers" },
  { id: "seasons", label: "Seasons" },
  { id: "news", label: "News" },
];

type LeaguePageProps = {
  league?: League;
};

function getLeagueProvince(name: string): string {
  const value = name.toLowerCase();

  if (value.includes("herat")) return "Herat Province";
  if (value.includes("kabul")) return "Kabul Province";
  if (value.includes("kandahar")) return "Kandahar Province";

  return "Nationwide · Afghanistan";
}

function getLeagueSport(name: string): string {
  return name.toLowerCase().includes("futsal")
    ? "Futsal"
    : "Football";
}

export default function LeaguePage({
  league,
}: LeaguePageProps) {
  const leagueName = league?.name ?? "Afghanistan Premier League";
  const leagueSport = league
    ? league.sport === "futsal" ? "Futsal" : "Football"
    : getLeagueSport(leagueName);
  const [tab, setTab] =
    useState<LeagueTab>("overview");

  const [season, setSeason] =
    useState("2026/2027");

  const [followed, setFollowed] =
    useState(false);

  const [leagueData, setLeagueData] = useState<{
    standings: Standing[];
    fixtures: Awaited<ReturnType<typeof leagueService.getFixtures>>;
    topRated: PlayerStat[];
    topScorers: PlayerStat[];
    topAssists: PlayerStat[];
  }>({
    standings: [],
    fixtures: [],
    topRated: [],
    topScorers: [],
    topAssists: [],
  });

  const [loadedScopeKey, setLoadedScopeKey] = useState<string | null>(null);
  const [errorScopeKey, setErrorScopeKey] = useState<string | null>(null);

  const scopeKey = `${league?.id ?? ""}:${season}`;
  const isCurrentScopeLoaded = loadedScopeKey === scopeKey;
  const isCurrentScopeError = errorScopeKey === scopeKey;
  const leagueLoading = Boolean(league?.id) &&
    !isCurrentScopeLoaded &&
    !isCurrentScopeError;
  const leagueError = isCurrentScopeError;

  const displayedLeagueData = isCurrentScopeLoaded
    ? leagueData
    : {
        standings: [],
        fixtures: [],
        topRated: [],
        topScorers: [],
        topAssists: [],
      };

  useEffect(() => {
    let cancelled = false;


    async function loadLeagueData() {
      if (!league?.id) {
        return;
      }

      try {
        const [
          standings,
          fixtures,
          topRated,
          topScorers,
          topAssists,
        ] = await Promise.all([
          leagueService.getStandings(league.id, season),
          leagueService.getFixtures(league.id, season),
          leagueService.getTopRated(league.id, season),
          leagueService.getTopScorers(league.id, season),
          leagueService.getTopAssists(league.id, season),
        ]);

        if (!cancelled) {
          setLeagueData({
            standings,
            fixtures,
            topRated,
            topScorers,
            topAssists,
          });
          setLoadedScopeKey(scopeKey);
          setErrorScopeKey(null);
        }
      } catch (error) {
        console.error("Failed to load league data:", error);

        if (!cancelled) {
          setErrorScopeKey(scopeKey);
        }
      }
    }

    loadLeagueData();

    return () => {
      cancelled = true;
    };
 }, [scopeKey, league?.id, season]);

  const currentSeason =
    useMemo(
      () => season,
      [season],
    );

  return (
    <main className="league-page">
      {leagueLoading && (
        <p className="league-data-status">Loading league data...</p>
      )}

      {leagueError && (
        <p className="league-data-status" role="alert">
          Could not load league data.
        </p>
      )}
      <section className="league-hero card">
        <div className="league-identity">
          <div className="league-logo">
            <Trophy size={32} />
          </div>

          <div className="league-information">
            <div className="league-breadcrumb">
              Afghanistan
              <ChevronRight size={13} />
              {leagueSport}
            </div>

            <h1>{leagueName}</h1>

            <p className="league-location">
              {getLeagueProvince(leagueName)}
              <span className="league-meta-divider">·</span>
              {leagueSport}
            </p>
          </div>
        </div>

        <div className="league-season-control">
          <label htmlFor="league-season">Season</label>
          <div className="season-select-wrap">
            <select
              id="league-season"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              aria-label="Select season"
            >
              <option value="2026/2027">2026/2027</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2024/2025">2024/2025</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="league-actions">
          <button
            className={`follow-button ${followed ? "followed" : ""}`}
            onClick={() => setFollowed((value) => !value)}
          >
            <Heart
              size={16}
              fill={followed ? "currentColor" : "none"}
            />
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </section>

      <section className="league-toolbar card">
        <nav className="league-tabs">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={
                tab === item.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab(item.id)
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      </section>

      {tab === "overview" && (
        <OverviewContent
          season={currentSeason}
          onOpenTab={setTab}
          standings={displayedLeagueData.standings}
          fixtures={displayedLeagueData.fixtures}
          topRated={displayedLeagueData.topRated}
          topScorers={displayedLeagueData.topScorers}
          topAssists={displayedLeagueData.topAssists}
        />
      )}

      {tab === "table" && (
        <section className="league-content-grid">
          <StandingsCard
            full
            standings={displayedLeagueData.standings}
            season={currentSeason}
          />
        </section>
      )}

      {tab === "fixtures" && (
        <section className="league-content-grid">
          <FixturesCard full fixtures={displayedLeagueData.fixtures} />
        </section>
      )}

      {tab === "players" && (
        <section className="league-content-grid">
          <div className="league-main-column">
            <TopPlayersCard
              title="Top rated"
              icon={<Star size={17} />}
              players={displayedLeagueData.topRated}
              ratingMode
            />
          </div>

          <aside className="league-side-column">
            <TopPlayersCard
              title="Top scorers"
              icon={<Target size={17} />}
              players={displayedLeagueData.topScorers}
            />

            <TopPlayersCard
              title="Top assists"
              icon={<Users size={17} />}
              players={displayedLeagueData.topAssists}
            />
          </aside>
        </section>
      )}

      {tab === "teams" && (
        <section className="league-content-grid">
          <StandingsCard
            full
            standings={displayedLeagueData.standings}
            season={currentSeason}
          />
        </section>
      )}

      {tab === "transfers" && (
        <EmptyLeagueSection
          icon={<Users size={21} />}
          title="Transfer Center"
          description="Transfer information for this competition will appear here."
        />
      )}

      {tab === "seasons" && (
        <section className="league-content-grid">
          <div className="league-main-column">
            <section className="card league-section">
              <div className="league-section-header">
                <div>
                  <span className="section-kicker">Competition history</span>
                  <h2>League seasons</h2>
                </div>
              </div>
              <div className="season-history-list">
                <p className="season-history-note">Demo data — sample season results</p>
                {[
                  { season: "2025/2026", winner: "Demo Champion FC", runnerUp: "Demo United FC" },
                  { season: "2024/2025", winner: "Sample Stars FC", runnerUp: "Sample United FC" },
                  { season: "2023/2024", winner: "Demo United FC", runnerUp: "Demo Champion FC" },
                  { season: "2022/2023", winner: "Sample United FC", runnerUp: "Sample Stars FC" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.season}
                    className={`season-history-row ${item.season === season ? "active" : ""}`}
                    onClick={() => setSeason(item.season)}
                  >
                    <div className="season-history-year">
                      <strong>{item.season}</strong>
                      <span>Season</span>
                    </div>
                    <div className="season-history-result">
                      <span className="season-history-label">Winner</span>
                      <strong>{item.winner}</strong>
                    </div>
                    <div className="season-history-result">
                      <span className="season-history-label">Runner-up</span>
                      <strong>{item.runnerUp}</strong>
                    </div>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}
      {tab === "news" && (
        <section className="league-content-grid">
          <div className="league-main-column">
            <NewsCard full />
          </div>

          <aside className="league-side-column">
            <TeamOfWeekCard />
          </aside>
        </section>
      )}
    </main>
  );
}

function OverviewContent({
  season,
  onOpenTab,
  standings,
  fixtures,
  topRated,
  topScorers,
  topAssists,
}: {
  season: string;
  onOpenTab: (tab: LeagueTab) => void;
  standings: Standing[];
  fixtures: Awaited<ReturnType<typeof leagueService.getFixtures>>;
  topRated: PlayerStat[];
  topScorers: PlayerStat[];
  topAssists: PlayerStat[];
}) {
  return (
    <div className="league-content-grid">
      <div className="league-main-column">
        <StandingsCard
          standings={standings}
          season={season}
          onFullTable={() =>
            onOpenTab("table")
          }
        />

        <FixturesCard
          fixtures={fixtures}
          onAllFixtures={() =>
            onOpenTab("fixtures")
          }
        />

        <NewsCard
          onViewAll={() =>
            onOpenTab("news")
          }
        />
      </div>

      <aside className="league-side-column">
        <TopPlayersCard
          title="Top rated"
          icon={<Star size={17} />}
          players={topRated}
          ratingMode
        />

        <TopPlayersCard
          title="Top scorers"
          icon={<Target size={17} />}
          players={topScorers}
        />

        <TopPlayersCard
          title="Top assists"
          icon={<Users size={17} />}
          players={topAssists}
        />

        <TeamOfWeekCard />
      </aside>
    </div>
  );
}

function StandingsCard({
  full = false,
  season,
  standings,
  onFullTable,
}: {
  full?: boolean;
  season: string;
  standings: Standing[];
  onFullTable?: () => void;
}) {
  return (
    <section
      className={`card league-section ${
        full
          ? "full-width-section"
          : ""
      }`}
    >
      <div className="league-section-header">
        <div>
          <span className="section-kicker">
            {season}
          </span>

          <h2>Standings</h2>
        </div>

        {!full && (
          <button
            className="text-button"
            onClick={onFullTable}
          >
            Full table
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>PL</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>PTS</th>
              <th>Form</th>
              <th>Next</th>
            </tr>
          </thead>

          <tbody>
            {standings.map(
              (team) => (
                <tr
                  key={team.team}
                >
                  <td>
                    <span
                      className={`position position-${team.position}`}
                    >
                      {team.position}
                    </span>
                  </td>

                  <td>
                    <div className="standing-team">
                      <span className="team-logo">
                        {team.team.charAt(
                          0,
                        )}
                      </span>

                      <strong>
                        {team.team}
                      </strong>
                    </div>
                  </td>

                  <td>
                    {team.played}
                  </td>

                  <td>
                    {team.won}
                  </td>

                  <td>
                    {team.drawn}
                  </td>

                  <td>
                    {team.lost}
                  </td>

                  <td>
                    {team.goalsFor}
                  </td>

                  <td>
                    {team.goalsAgainst}
                  </td>

                  <td>
                    {team.gd > 0
                      ? `+${team.gd}`
                      : team.gd}
                  </td>

                  <td>
                    <strong>
                      {team.points}
                    </strong>
                  </td>

                  <td>
                    <div className="form-list">
                      {team.form.map(
                        (
                          result,
                          index,
                        ) => (
                          <span
                            key={`${team.team}-${index}`}
                            className={`form-${result.toLowerCase()}`}
                          >
                            {result}
                          </span>
                        ),
                      )}
                    </div>
                  </td>

                  <td>
                    <span className="next-team">
                      {team.next}
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div className="standings-legend">
        <span>
          <i className="legend-dot champions" />
          Championship qualification
        </span>

        <span>
          <i className="legend-dot continental" />
          Continental qualification
        </span>

        <span>
          <i className="legend-dot relegation" />
          Relegation zone
        </span>
      </div>
    </section>
  );
}

function FixturesCard({
  full = false,
  fixtures,
  onAllFixtures,
}: {
  full?: boolean;
  fixtures: Awaited<ReturnType<typeof leagueService.getFixtures>>;
  onAllFixtures?: () => void;
}) {
  return (
    <section
      className={`card league-section ${
        full
          ? "full-width-section"
          : ""
      }`}
    >
      <div className="league-section-header">
        <div>
          <span className="section-kicker">
            Round 9
          </span>

          <h2>Fixtures</h2>
        </div>

        {!full && (
          <button
            className="text-button"
            onClick={onAllFixtures}
          >
            All fixtures
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="fixture-round">
        <button>
          <ChevronRight size={15} />
        </button>

        <strong>
          Round 9
        </strong>

        <button>
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="fixtures-list">
        {fixtures.map(
          (fixture) => (
            <article
              className="fixture-row"
              key={`${fixture.home}-${fixture.away}`}
            >
              <div className="fixture-date">
                <strong>
                  {fixture.date}
                </strong>

                <span>
                  {fixture.day}
                </span>
              </div>

              <div className="fixture-teams">
                <span>
                  {fixture.home}
                </span>

                <span>
                  {fixture.away}
                </span>
              </div>

              <div className="fixture-time">
                {fixture.time}
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

function TopPlayersCard({
  title,
  icon,
  players,
  ratingMode = false,
}: {
  title: string;
  icon: React.ReactNode;
  players: PlayerStat[];
  ratingMode?: boolean;
}) {
  return (
    <section className="card league-section">
      <div className="league-section-header compact">
        <div className="section-title-with-icon">
          {icon}
          <h2>{title}</h2>
        </div>

        <button className="text-button">
          All
        </button>
      </div>

      <div className="player-list">
        {players.map(
          (
            player,
            index,
          ) => (
            <div
              className="player-row"
              key={player.name}
            >
              <span className="player-rank">
                {index + 1}
              </span>

              <span className="player-avatar">
                {player.name.charAt(
                  0,
                )}
              </span>

              <div className="player-info">
                <strong>
                  {player.name}
                </strong>

                <span>
                  {player.team}
                </span>
              </div>

              <strong className="player-value">
                {ratingMode
                  ? player.rating?.toFixed(
                      2,
                    )
                  : player.value}
              </strong>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

function NewsCard({
  full = false,
  onViewAll,
}: {
  full?: boolean;
  onViewAll?: () => void;
}) {
  return (
    <section
      className={`card league-section ${
        full
          ? "full-width-section"
          : ""
      }`}
    >
      <div className="league-section-header">
        <div className="section-title-with-icon">
          <Newspaper size={17} />
          <h2>News</h2>
        </div>

        {!full && (
          <button
            className="text-button"
            onClick={onViewAll}
          >
            View all
          </button>
        )}
      </div>

      <div className="league-news-list">
        {leagueNews.map(
          (
            item,
            index,
          ) => (
            <article
              className="league-news-item"
              key={item}
            >
              <div className="news-number">
                {index + 1}
              </div>

              <div>
                <h3>
                  {item}
                </h3>

                <span>
                  VarzeshOne ·{" "}
                  {index + 1} hr. ago
                </span>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

function TeamOfWeekCard() {
  return (
    <section className="card league-section team-of-week">
      <div className="league-section-header compact">
        <div className="section-title-with-icon">
          <Trophy size={17} />
          <h2>
            Team of the Week
          </h2>
        </div>
      </div>

      <div className="team-of-week-visual">
        <div className="formation">
          <div className="formation-player goalkeeper">
            <span>GK</span>
            <strong>
              Rahimi
            </strong>
          </div>

          <div className="formation-row">
            <div className="formation-player">
              <span>DF</span>
              <strong>
                Ahmadi
              </strong>
            </div>

            <div className="formation-player">
              <span>DF</span>
              <strong>
                Noori
              </strong>
            </div>

            <div className="formation-player">
              <span>DF</span>
              <strong>
                Karimi
              </strong>
            </div>
          </div>

          <div className="formation-row">
            <div className="formation-player">
              <span>MF</span>
              <strong>
                Waziri
              </strong>
            </div>

            <div className="formation-player">
              <span>MF</span>
              <strong>
                Akbari
              </strong>
            </div>

            <div className="formation-player">
              <span>MF</span>
              <strong>
                Noor
              </strong>
            </div>
          </div>

          <div className="formation-player striker">
            <span>FW</span>
            <strong>
              Rahimi
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyLeagueSection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section className="card league-empty">
      <div className="empty-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>
    </section>
  );
}






