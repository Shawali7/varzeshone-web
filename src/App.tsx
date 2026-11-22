
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Shield,
  Trophy,
  CirclePlay,
  UserRound,
  Smartphone,
  Play,
  ChartNoAxesCombined,
  Users,
  ArrowLeftRight,
  Newspaper,
  Euro,
  Ruler,
  Keyboard,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  Globe,
  Tv,
  Monitor,
} from "lucide-react";

import "./styles.css";
import NewsPage from "./NewsPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LeaguePage from "./pages/LeaguePage";
import MatchPage from "./pages/MatchPage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";

import { getLeagues, getMatches } from "./services/sportsService";
import { getPlayers } from "./services/playerService";
import { getTeams } from "./services/teamService";
import { getTransfers } from "./services/transferService";

import type {
  League,
  Match,
  Player,
  PlayerTransfer,
  Team,
} from "./types";

type ThemeMode = "light" | "dark" | "system";
type AppLanguage = "fa-AF" | "ps-AF" | "en";

type SearchTab =
  | "all"
  | "teams"
  | "leagues"
  | "players"
  | "matches";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: "team" | "league" | "match" | "player";
  leagueId?: string;
  match?: Match;
  player?: Player;
};



function App() {
  // ----------------------------------------
  // Application state
  // ----------------------------------------

  const [activePage, setActivePage] = useState<
    "home" | "news" | "about" | "league" | "match" | "team" | "player"
  >("home");

  const [selectedMatch, setSelectedMatch] =
    useState<Match | null>(null);

  const [selectedTeam, setSelectedTeam] =
    useState<string | null>(null);

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [playerData, setPlayerData] =
    useState<Player[]>([]);

  const [teamData, setTeamData] =
    useState<Team[]>([]);

  const [transferData, setTransferData] =
    useState<PlayerTransfer[]>([]);

  const [teamMatches, setTeamMatches] =
    useState<Match[]>([]);

  const [leagueData, setLeagueData] =
    useState<League[]>([]);

  const [selectedLeagueId, setSelectedLeagueId] =
    useState("afghanistan-premier-league");

  // ----------------------------------------
  // Language state
  // ----------------------------------------

  const [language, setLanguage] =
    useState<AppLanguage>(() => {
      const saved = localStorage.getItem("varzeshone-language");

      if (
        saved === "fa-AF" ||
        saved === "ps-AF" ||
        saved === "en"
      ) {
        return saved;
      }

      return "fa-AF";
    });

  // ----------------------------------------
  // Theme state
  // ----------------------------------------

  const [theme, setTheme] =
    useState<ThemeMode>(() => {
      const saved = localStorage.getItem("varzeshone-theme");

      if (
        saved === "light" ||
        saved === "dark" ||
        saved === "system"
      ) {
        return saved;
      }

      return "system";
    });

  // ----------------------------------------
  // Menu and search state
  // ----------------------------------------

  const [languageMenuOpen, setLanguageMenuOpen] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [searchTab, setSearchTab] =
    useState<SearchTab>("all");

  const searchRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------
  // Language effect: RTL / LTR
  // ----------------------------------------

  useEffect(() => {
    document.documentElement.lang = language;

    document.documentElement.dir =
      language === "en" ? "ltr" : "rtl";

    localStorage.setItem(
      "varzeshone-language",
      language
    );
  }, [language]);

  // ----------------------------------------
  // Save theme preference
  // ----------------------------------------

  useEffect(() => {
    localStorage.setItem(
      "varzeshone-theme",
      theme
    );
  }, [theme]);

  // ----------------------------------------
  // Theme effect: Light / Dark / System
  // ----------------------------------------

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const updateTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && mediaQuery.matches);

      document.documentElement.dataset.theme =
        isDark ? "dark" : "light";
    };

    updateTheme();

    if (theme === "system") {
      mediaQuery.addEventListener(
        "change",
        updateTheme
      );

      return () => {
        mediaQuery.removeEventListener(
          "change",
          updateTheme
        );
      };
    }
  }, [theme]);

  // ----------------------------------------
  // Load leagues
  // ----------------------------------------

  useEffect(() => {
    let cancelled = false;

    getLeagues()
      .then((data) => {
        if (!cancelled) {
          setLeagueData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load leagues:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------
  // Load matches
  // ----------------------------------------

  useEffect(() => {
    let cancelled = false;

    getMatches()
      .then((data) => {
        if (!cancelled) {
          setTeamMatches(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load team matches:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------
  // Load teams
  // ----------------------------------------

  useEffect(() => {
    let cancelled = false;

    getTeams()
      .then((data) => {
        if (!cancelled) {
          setTeamData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load teams:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------
  // Load players
  // ----------------------------------------

  useEffect(() => {
    let cancelled = false;

    getPlayers()
      .then((data) => {
        if (!cancelled) {
          setPlayerData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load players:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------
  // Load transfers
  // ----------------------------------------

  useEffect(() => {
    let cancelled = false;

    getTransfers()
      .then((data) => {
        if (!cancelled) {
          setTransferData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load transfers:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------
  // Search functionality
  // ----------------------------------------

  const normalizedSearch = search.trim().toLowerCase();

  const allSearchResults: SearchResult[] = (() => {
    const teams: SearchResult[] = teamData.map((team) => ({
      id: `team-${team.id}`,
      title: team.name,
      subtitle: `${team.country} · ${team.sport} · DEMO DATA`,
      type: "team",
    }));

    const leagues: SearchResult[] = leagueData.map((league) => ({
      id: `league-${league.id}`,
      title: league.name,
      subtitle: `${league.country} · ${league.sport}`,
      type: "league",
      leagueId: league.id,
    }));

    const matches: SearchResult[] = teamMatches.map((match) => ({
      id: `match-${match.id}`,
      title: `${match.home} vs ${match.away}`,
      subtitle: `${match.leagueName} · ${
        match.status === "LIVE"
          ? "Live"
          : match.status === "FT"
            ? "Finished"
            : match.time || match.date
      }`,
      type: "match",
      match,
    }));

    const playerResults: SearchResult[] = playerData.map((player) => ({
      id: `player-${player.id}`,
      title: player.name,
      subtitle: `${player.position || "Player"} · DEMO DATA`,
      type: "player",
      player,
    }));

    return [
      ...teams,
      ...leagues,
      ...matches,
      ...playerResults,
    ];
  })();

  const tabTypes: Record<SearchTab, SearchResult["type"][]> = {
    all: ["team", "league", "match", "player"],
    teams: ["team"],
    leagues: ["league"],
    players: ["player"],
    matches: ["match"],
  };

  const searchResults = allSearchResults.filter((item) => {
    const matchesTab = tabTypes[searchTab].includes(item.type);

    const matchesQuery =
      !normalizedSearch ||
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.subtitle.toLowerCase().includes(normalizedSearch);

    return matchesTab && matchesQuery;
  });

  // ----------------------------------------
  // Navigation functions
  // ----------------------------------------

  const openLeague = () => {
    setActivePage("league");
    setSelectedMatch(null);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openTeam = (teamName: string) => {
    setSelectedTeam(teamName);
    setSelectedMatch(null);
    setActivePage("team");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const closeTeam = () => {
    setSelectedTeam(null);
    setActivePage("home");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openMatch = (match: Match) => {
    setSelectedMatch(match);
    setActivePage("match");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const closeMatch = () => {
    setSelectedMatch(null);
    setActivePage("home");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setSelectedMatch(null);
    setSelectedTeam(null);
    setActivePage("player");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const closePlayer = () => {
    setSelectedPlayer(null);
    setActivePage("home");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openNews = () => {
    setActivePage("news");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openAbout = () => {
    setActivePage("about");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openHome = () => {
    setActivePage("home");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleLeagueSelect = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setSelectedMatch(null);
    setActivePage("league");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  // ----------------------------------------
  // Search keyboard and outside-click effects
  // ----------------------------------------

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);

        requestAnimationFrame(() => {
          document
            .querySelector<HTMLInputElement>(".search-input")
            ?.focus();
        });
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", keyboard);

    return () => {
      document.removeEventListener("keydown", keyboard);
    };
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">

          <button
            className="mobile-menu-button icon-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>

          <button
            className="brand"
            onClick={openHome}
            aria-label="Go to home"
          >
            <span className="brand-mark">V</span>

            <span className="brand-text">
              <strong>ورزش وان</strong>
              <small>VARZESHONE</small>
            </span>
          </button>

          {/* Search */}
          <div
            className="search-container"
            ref={searchRef}
          >
            <button
              className={`search-box ${searchOpen ? "open" : ""}`}
              onClick={() => {
                setSearchOpen(true);

                requestAnimationFrame(() => {
                  document
                    .querySelector<HTMLInputElement>(".search-input")
                    ?.focus();
                });
              }}
            >
              <Search size={17} />

              <input
                className="search-input"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSearchOpen(true);
                }}
                onClick={(event) => event.stopPropagation()}
                placeholder="Search"
              />

              {search ? (
                <span
                  className="search-clear"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSearch("");
                  }}
                >
                  <X size={14} />
                </span>
              ) : (
                <kbd>Ctrl K</kbd>
              )}
            </button>

            {searchOpen && (
              <div className="search-dropdown">
                <div className="search-tabs">
                  {[
                    ["all", "All"],
                    ["teams", "Teams"],
                    ["leagues", "Leagues"],
                    ["players", "Players"],
                    ["matches", "Matches"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      className={
                        searchTab === value ? "active" : ""
                      }
                      onClick={() =>
                        setSearchTab(value as SearchTab)
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="recent-header">
                  <strong>
                    {normalizedSearch
                      ? "Search results"
                      : "Explore"}
                  </strong>

                  <span>
                    {searchResults.length} results
                  </span>
                </div>

                <div className="recent-list">
                  {searchResults.length === 0 ? (
                    <div className="search-empty">
                      {searchTab === "players"
                        ? "Player data is not available yet"
                        : "No results found"}
                    </div>
                  ) : (
                    searchResults.map((item) => (
                      <button
                        className="recent-item"
                        key={item.id}
                        onClick={() => {
                          if (item.type === "team") {
                            openTeam(item.title);
                            return;
                          }

                          if (item.type === "league" && item.leagueId) {
                            handleLeagueSelect(item.leagueId);
                            return;
                          }

                          if (
                            item.type === "match" &&
                            item.match
                          ) {
                            openMatch(item.match);
                            return;
                          }

                          if (
                            item.type === "player" &&
                            item.player
                          ) {
                            openPlayer(item.player);
                          }
                        }}
                      >
                        <span
                          className={`recent-icon search-result-${item.type}`}
                        >
                          {item.type === "team" ? (
                            <Shield size={17} />
                          ) : item.type === "league" ? (
                            <Trophy size={17} />
                          ) : item.type === "match" ? (
                            <CirclePlay size={17} />
                          ) : (
                            <UserRound size={17} />
                          )}
                        </span>

                        <span className="recent-content">
                          <strong>{item.title}</strong>
                          <small>{item.subtitle}</small>
                        </span>

                        <span className="search-result-type">
                          {item.type === "team"
                            ? "TEAM"
                            : item.type === "league"
                              ? "LEAGUE"
                              : item.type === "match"
                                ? "MATCH"
                                : "PLAYER"}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="navigation">
            {/* Temporarily hidden Home navigation link */}

            <button
              className={`nav-link ${
                activePage === "news" ? "active" : ""
              }`}
              onClick={openNews}
            >
              News
            </button>

            <button
              className="nav-link"
              onClick={openAbout}
            >
              About
            </button>

            <button
              className="icon-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open settings"
            >
              <Menu size={19} />
            </button>

            <span className="header-divider" />

            <button
              className="store-button"
              aria-label="App store"
            >
              <Smartphone size={16} />
            </button>

            <button
              className="store-button"
              aria-label="Google Play"
            >
              <Play size={16} fill="currentColor" />
            </button>
          </nav>
        </div>
      </header>

      {/* Page content */}
      {activePage === "about" ? (
        <AboutPage language={language} />
      ) : activePage === "news" ? (
        <NewsPage />
      ) : activePage === "league" ? (
        <LeaguePage
  league={leagueData.find(
    (item) => item.id === selectedLeagueId
  )}
/>
      ) : activePage === "team" && selectedTeam ? (
        <TeamPage
          teamName={selectedTeam}
          team={teamData.find(
            (item) => item.name === selectedTeam
          )}
          matches={teamMatches}
          players={playerData.filter(
            (player) =>
              teamData.find(
                (item) => item.name === selectedTeam
              )?.id === player.teamId
          )}
          onOpenPlayer={openPlayer}
          onBack={closeTeam}
        />
      ) : activePage === "player" && selectedPlayer ? (
        <PlayerPage
          player={selectedPlayer}
          teamName={
            teamData.find(
              (team) => team.id === selectedPlayer.teamId
            )?.name
          }
          teams={teamData}
          transfers={transferData.filter(
            (transfer) =>
              transfer.playerId === selectedPlayer.id
          )}
          onBack={closePlayer}
        />
      ) : activePage === "match" && selectedMatch ? (
        <MatchPage
          match={selectedMatch}
          onBack={closeMatch}
        />
      ) : (
        <HomePage
          onOpenNews={openNews}
          onOpenLeague={openLeague}
          onOpenMatch={openMatch}
          onOpenTeam={openTeam}
          search={search}
          setSearch={setSearch}
        />
      )}

      {/* Settings menu */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="menu-header">
              <div>
                <strong>Settings</strong>
                <span>VarzeshOne</span>
              </div>

              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close settings"
              >
                <X size={19} />
              </button>
            </div>

            <div className="menu-tools-grid">
              <button>
                <span className="tool-icon">
                  <ChartNoAxesCombined size={18} />
                </span>
                <span>Predictor</span>
              </button>

              <button>
                <span className="tool-icon">
                  <Users size={18} />
                </span>
                <span>Lineup Builder</span>
              </button>

              <button>
                <Tv size={18} />
                <span>TV schedules</span>
              </button>

              <button>
                <span className="tool-icon">
                  <ArrowLeftRight size={18} />
                </span>
                <span>Transfer Center</span>
              </button>

              <button>
                <span className="tool-icon">
                  <Newspaper size={18} />
                </span>
                <span>Rumors</span>
              </button>
            </div>

            <div className="menu-divider" />

            <button className="menu-action">
              Sign in
            </button>

            <div className="menu-divider" />

            {/* Theme settings */}
            <div className="menu-setting">
              <div>
                <strong>Theme</strong>
              </div>

              <div className="theme-switch">
                <button
                  className={theme === "light" ? "active" : ""}
                  onClick={() => setTheme("light")}
                  aria-label="Light theme"
                  aria-pressed={theme === "light"}
                >
                  <Sun size={16} />
                </button>

                <button
                  className={theme === "dark" ? "active" : ""}
                  onClick={() => setTheme("dark")}
                  aria-label="Dark theme"
                  aria-pressed={theme === "dark"}
                >
                  <Moon size={16} />
                </button>

                <button
                  className={theme === "system" ? "active" : ""}
                  onClick={() => setTheme("system")}
                  aria-label="System theme"
                  aria-pressed={theme === "system"}
                >
                  <Monitor size={16} />
                </button>
              </div>
            </div>

            {/* Language settings */}
            <button
              className="menu-setting-row"
              onClick={() =>
                setLanguageMenuOpen((open) => !open)
              }
              aria-expanded={languageMenuOpen}
              aria-label="Select language"
            >
              <Globe size={17} />

              <span>
                {language === "fa-AF"
                  ? "\u062F\u0631\u06CC"
                  : language === "ps-AF"
                    ? "\u067E\u069A\u062A\u0648"
                    : "English (US)"}
              </span>

              <ChevronDown size={15} />
            </button>

            {languageMenuOpen && (
              <div className="language-options">
                <button
                  className={
                    language === "fa-AF" ? "active" : ""
                  }
                  onClick={() => {
                    setLanguage("fa-AF");
                    setLanguageMenuOpen(false);
                  }}
                >
                  {"\u062F\u0631\u06CC"}
                  <span>فارسی افغانستان</span>
                </button>

                <button
                  className={
                    language === "ps-AF" ? "active" : ""
                  }
                  onClick={() => {
                    setLanguage("ps-AF");
                    setLanguageMenuOpen(false);
                  }}
                >
                  {"\u067E\u069A\u062A\u0648"}
                  <span>Pashto</span>
                </button>

                <button
                  className={language === "en" ? "active" : ""}
                  onClick={() => {
                    setLanguage("en");
                    setLanguageMenuOpen(false);
                  }}
                >
                  English
                  <span>United States</span>
                </button>
              </div>
            )}

            {/* Currency */}
            <button className="menu-setting-row">
              <span className="currency-icon">
                <Euro size={18} />
              </span>

              <span>Euro (EUR)</span>

              <ChevronDown size={15} />
            </button>

            {/* Measurement */}
            <button className="menu-setting-row">
              <span className="metric-icon">
                <Ruler size={18} />
              </span>

              <span>Metric (cm)</span>

              <ChevronDown size={15} />
            </button>

            {/* Keyboard shortcuts */}
            <button className="menu-setting-row">
              <span>
                <Keyboard size={17} />
              </span>

              <span>Keyboard shortcuts</span>
            </button>

            <div className="menu-divider" />

            {/* Afghanistan leagues */}
            <div className="menu-section">
              <div className="menu-label">
                Afghanistan
              </div>

              {leagueData.map((league) => (
                <button
                  className="menu-item"
                  key={league.id}
                  onClick={() => handleLeagueSelect(league.id)}
                >
                  <span>
                    <Trophy size={16} />
                  </span>

                  <span>{league.name}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
