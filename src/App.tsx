import type { AppLanguage } from "./i18n/types"
import { translate } from "./i18n";

import { useEffect, useRef, useState } from "react";
import { readPreference, writePreference } from "./utils/storage";
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
import MatchesPage from "./pages/MatchesPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthPage from "./pages/AuthPage";
import LegalNoticePage from "./pages/LegalNoticePage";

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
import { entityPath, leaguePath, resolveRoute } from "./routing/routes";
import type { LeagueSection } from "./routing/routes";
import { useBrowserRouter } from "./routing/useBrowserRouter";

type ThemeMode = "light" | "dark" | "system";


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

type RouteDataStatus = {
  leagues: "loading" | "ready" | "error";
  matches: "loading" | "ready" | "error";
  teams: "loading" | "ready" | "error";
  players: "loading" | "ready" | "error";
};


function App() {
  // ----------------------------------------
  // Application state
  // ----------------------------------------

  const { location, navigate, go } = useBrowserRouter();
  const route = resolveRoute(location.pathname);
  const activePage = route.type;
  const isStandaloneExperience =
    route.type === "sign-in" ||
    route.type === "register" ||
    route.type === "forgot-password" ||
    route.type === "terms" ||
    route.type === "privacy";

  const currentUrl = `${location.pathname}${location.search}${location.hash}`;
  const navigateTo = (path: string) => navigate(path, {
    preserveSearch: true,
    preserveHash: true,
  });
  const navigateBack = () => {
    const historyState = location.state as { __varzeshoneIndex?: number } | null;
    if (historyState?.__varzeshoneIndex && historyState.__varzeshoneIndex > 0) {
      go(-1);
      return;
    }

    navigate("/", {
      replace: true,
      preserveSearch: true,
      preserveHash: true,
      state: null,
    });
  };

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

  const [routeDataStatus, setRouteDataStatus] = useState<RouteDataStatus>({
    leagues: "loading",
    matches: "loading",
    teams: "loading",
    players: "loading",
  });

  // ----------------------------------------
  // Language state
  // ----------------------------------------

  const [language, setLanguage] =
    useState<AppLanguage>(() => {
      const saved = readPreference("varzeshone-language");

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
      const saved = readPreference("varzeshone-theme");

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
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = menuRef.current;
    panel?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panel) return;
      const controls = Array.from(panel.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input, select, a[href], [tabindex="0"]',
      )).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [menuOpen]);

  // ----------------------------------------
  // Language effect: RTL / LTR
  // ----------------------------------------

  useEffect(() => {
    document.documentElement.lang = language;

    document.documentElement.dir =
      language === "en" ? "ltr" : "rtl";

    writePreference(
      "varzeshone-language",
      language
    );
  }, [language]);

  // ----------------------------------------
  // Save theme preference
  // ----------------------------------------

  useEffect(() => {
    writePreference(
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
          setRouteDataStatus((status) => ({ ...status, leagues: "ready" }));
        }
      })
      .catch((error) => {
        console.error("Failed to load leagues:", error);
        if (!cancelled) {
          setRouteDataStatus((status) => ({ ...status, leagues: "error" }));
        }
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
          setRouteDataStatus((status) => ({ ...status, matches: "ready" }));
        }
      })
      .catch((error) => {
        console.error("Failed to load team matches:", error);
        if (!cancelled) {
          setRouteDataStatus((status) => ({ ...status, matches: "error" }));
        }
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
          setRouteDataStatus((status) => ({ ...status, teams: "ready" }));
        }
      })
      .catch((error) => {
        console.error("Failed to load teams:", error);
        if (!cancelled) {
          setRouteDataStatus((status) => ({ ...status, teams: "error" }));
        }
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
          setRouteDataStatus((status) => ({ ...status, players: "ready" }));
        }
      })
      .catch((error) => {
        console.error("Failed to load players:", error);
        if (!cancelled) {
          setRouteDataStatus((status) => ({ ...status, players: "error" }));
        }
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
      subtitle: `${team.country} · ${translate(language, team.sport === "football" ? "football" : "futsal")} · ${translate(language, "demoData")}`,
      type: "team",
    }));

    const leagues: SearchResult[] = leagueData.map((league) => ({
      id: `league-${league.id}`,
      title: league.name,
      subtitle: `${league.country} · ${translate(language, league.sport === "football" ? "football" : "futsal")}`,
      type: "league",
      leagueId: league.id,
    }));

    const matches: SearchResult[] = teamMatches.map((match) => ({
      id: `match-${match.id}`,
      title: `${match.home} vs ${match.away}`,
      subtitle: `${match.leagueName} · ${
        match.status === "LIVE"
          ? translate(language, "live")
          : match.status === "FT"
            ? translate(language, "finished")
            : match.time || match.date
      }`,
      type: "match",
      match,
    }));

    const playerResults: SearchResult[] = playerData.map((player) => ({
      id: `player-${player.id}`,
      title: player.name,
      subtitle: `${player.position || translate(language, "player")} · ${translate(language, "demoData")}`,
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

  const openLeague = (leagueId: string) => {
    navigateTo(leaguePath(leagueId));
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openTeam = (teamName: string) => {
    const team = teamData.find((item) => item.name === teamName);
    navigateTo(entityPath("team", team?.id ?? teamName));
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const closeTeam = () => {
    navigateBack();
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openMatch = (match: Match) => {
    navigateTo(entityPath("match", match.id));
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const closeMatch = () => {
    navigateBack();
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openPlayer = (player: Player) => {
    navigateTo(entityPath("player", player.id));
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const closePlayer = () => {
    navigateBack();
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openNews = () => {
    navigateTo("/news");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openAbout = () => {
    navigateTo("/about");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const openHome = () => {
    navigateTo("/");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleLeagueSelect = (leagueId: string) => {
    navigateTo(leaguePath(leagueId));
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

  const renderRoute = () => {
    switch (route.type) {
      case "home":
        return (
          <HomePage
            language={language}
            onOpenNews={openNews}
            onOpenLeague={openLeague}
            onOpenMatch={openMatch}
            onOpenTeam={openTeam}
            search={search}
            setSearch={setSearch}
          />
        );
      case "matches":
        return <MatchesPage language={language} onOpenMatch={openMatch} />;
      case "news":
        return <NewsPage language={language} />;
      case "about":
        return <AboutPage language={language} />;
      case "sign-in":
      case "register":
      case "forgot-password":
        return (
          <AuthPage
            key={route.type}
            mode={route.type}
            language={language}
            onNavigate={navigateTo}
          />
        );
      case "terms":
      case "privacy":
        return (
          <LegalNoticePage
            kind={route.type}
            language={language}
            onNavigate={navigateTo}
          />
        );
      case "league": {
        if (routeDataStatus.leagues === "loading") return <RouteLoading language={language} />;
        if (routeDataStatus.leagues === "error") return <RouteLoadError language={language} />;

        const league = leagueData.find((item) => item.id === route.leagueId);
        if (!league) {
          return <NotFoundPage language={language} path={currentUrl} onHome={openHome} />;
        }

        const changeTab = (section: LeagueSection) => {
          const path = leaguePath(route.leagueId, section);
          navigate(`${path}${location.search}${location.hash}`, {
            state: location.state,
          });
        };
        const changeSeason = (season: string) => {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set("season", season);
          navigate(`${location.pathname}?${searchParams.toString()}${location.hash}`, {
            state: location.state,
          });
        };

        return (
          <LeaguePage
            key={route.leagueId}
            league={league}
            language={language}
            tab={route.section}
            season={new URLSearchParams(location.search).get("season") ?? undefined}
            onTabChange={changeTab}
            onSeasonChange={changeSeason}
          />
        );
      }
      case "match": {
        if (routeDataStatus.matches === "loading") return <RouteLoading language={language} />;
        if (routeDataStatus.matches === "error") return <RouteLoadError language={language} />;
        const match = teamMatches.find((item) => item.id === route.matchId);
        return match
          ? <MatchPage key={match.id} match={match} language={language} onBack={closeMatch} />
          : <NotFoundPage language={language} path={currentUrl} onHome={openHome} />;
      }
      case "team": {
        if (routeDataStatus.teams === "loading") return <RouteLoading language={language} />;
        if (routeDataStatus.teams === "error") return <RouteLoadError language={language} />;
        const team = teamData.find((item) => item.id === route.teamId) ??
          teamData.find((item) => item.name.toLowerCase() === route.teamId.toLowerCase());
        if (!team) return <NotFoundPage language={language} path={currentUrl} onHome={openHome} />;

        return (
          <TeamPage
            key={team.id}
            team={team}
            matches={teamMatches}
            players={playerData.filter((player) => player.teamId === team.id)}
            language={language}
            onOpenPlayer={openPlayer}
            onBack={closeTeam}
          />
        );
      }
      case "player": {
        if (routeDataStatus.players === "loading") return <RouteLoading language={language} />;
        if (routeDataStatus.players === "error") return <RouteLoadError language={language} />;
        const player = playerData.find((item) => item.id === route.playerId);
        if (!player) return <NotFoundPage language={language} path={currentUrl} onHome={openHome} />;

        return (
          <PlayerPage
            key={player.id}
            player={player}
            teamName={teamData.find((team) => team.id === player.teamId)?.name}
            teams={teamData}
            transfers={transferData.filter((transfer) => transfer.playerId === player.id)}
            language={language}
            onBack={closePlayer}
          />
        );
      }
      case "not-found":
        return <NotFoundPage language={language} path={currentUrl} onHome={openHome} />;
      default:
        return <NotFoundPage language={language} path={currentUrl} onHome={openHome} />;
    }
  };

  const routeContent = renderRoute();

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <div className="app">
      {!isStandaloneExperience && (
      <header className="header">
        <div className="header-inner">

          <button
            className="mobile-menu-button icon-button"
            onClick={() => setMenuOpen(true)}
            aria-label={translate(language, "mainNavigation")}
          >
            <Menu size={19} />
          </button>

          <button
            className="brand"
            onClick={openHome}
            aria-label={translate(language, "legalNoticeHome")}
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
            <div
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
                placeholder={translate(language, "search")}
                aria-label={translate(language, "searchTeamsCompetitions")}
                aria-expanded={searchOpen}
                onFocus={() => setSearchOpen(true)}
              />

              {search ? (
                <button
                  type="button"
                  aria-label={translate(language, "clearSearch")}
                  className="search-clear"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSearch("");
                  }}
                >
                  <X size={14} />
                </button>
              ) : (
                <kbd>Ctrl K</kbd>
              )}
            </div>

            {searchOpen && (
              <div className="search-dropdown">
                <div className="search-tabs">
                  {[
                    ["all", translate(language, "all")],
                    ["teams", translate(language, "teamsBreadcrumb")],
                    ["leagues", translate(language, "leagueDetails")],
                    ["players", translate(language, "player")],
                    ["matches", translate(language, "matches")],
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
                      ? translate(language, "searchResults")
                      : translate(language, "explore")}
                  </strong>

                  <span>
                    {searchResults.length} {translate(language, "resultsCount")}
                  </span>
                </div>

                <div className="recent-list">
                  {searchResults.length === 0 ? (
                    <div className="search-empty">
                      {searchTab === "players"
                        ? translate(language, "playerDataUnavailable")
                        : translate(language, "noResultsFound")}
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
              {translate(language, "news")}
            </button>

            <button
              className={`nav-link ${activePage === "about" ? "active" : ""}`}
              onClick={openAbout}
            >
              {translate(language, "about")}
            </button>

            <button
              className="icon-button"
              onClick={() => setMenuOpen(true)}
              aria-label={translate(language, "settings")}
            >
              <Menu size={19} />
            </button>

            <span className="header-divider" />

            <button
              className="store-button"
              disabled
              title={translate(language, "notAvailableYet")}
              aria-label={translate(language, "appStore")}
            >
              <Smartphone size={16} />
            </button>

            <button
              className="store-button"
              disabled
              title={translate(language, "notAvailableYet")}
              aria-label={translate(language, "googlePlay")}
            >
              <Play size={16} fill="currentColor" />
            </button>
          </nav>
        </div>
      </header>
      )}

      {!isStandaloneExperience && (
        <div className="demo-data-banner" role="note">
          {translate(language, "demoDataNotice")}
        </div>
      )}

      {/* Page content */}
      {routeContent}

      {/* Settings menu */}
      {menuOpen && !isStandaloneExperience && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="menu-panel"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={translate(language, "settings")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="menu-header">
              <div>
                <strong>{translate(language, "settings")}</strong>
                <span>VarzeshOne</span>
              </div>

              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
                aria-label={translate(language, "closeSettings")}
              >
                <X size={19} />
              </button>
            </div>

            <div className="menu-tools-grid">
              <button disabled title={translate(language, "notAvailableYet")}>
                <span className="tool-icon">
                  <ChartNoAxesCombined size={18} />
                </span>
                <span>{translate(language, "predictor")}</span>
              </button>

              <button disabled title={translate(language, "notAvailableYet")}>
                <span className="tool-icon">
                  <Users size={18} />
                </span>
                <span>{translate(language, "lineupBuilder")}</span>
              </button>

              <button disabled title={translate(language, "notAvailableYet")}>
                <Tv size={18} />
                <span>{translate(language, "tvSchedules")}</span>
              </button>

              <button disabled title={translate(language, "notAvailableYet")}>
                <span className="tool-icon">
                  <ArrowLeftRight size={18} />
                </span>
                <span>{translate(language, "transferCenter")}</span>
              </button>

              <button disabled title={translate(language, "notAvailableYet")}>
                <span className="tool-icon">
                  <Newspaper size={18} />
                </span>
                <span>{translate(language, "rumors")}</span>
              </button>
            </div>

            <div className="menu-divider" />

            <nav aria-label={translate(language, "mainNavigation")}>
              <button className="menu-item" onClick={openHome} aria-current={activePage === "home" ? "page" : undefined}>{translate(language, "home")}</button>
              <button className="menu-item" onClick={openNews} aria-current={activePage === "news" ? "page" : undefined}>{translate(language, "news")}</button>
              <button className="menu-item" onClick={openAbout} aria-current={activePage === "about" ? "page" : undefined}>{translate(language, "about")}</button>
            </nav>

            <button
              className="menu-action"
              onClick={() => {
                navigateTo("/sign-in");
                setMenuOpen(false);
              }}
            >
              {translate(language, "authSignIn")}
            </button>

            <div className="menu-divider" />

            {/* Theme settings */}
            <div className="menu-setting">
              <div>
                <strong>{translate(language, "theme")}</strong>
              </div>

              <div className="theme-switch">
                <button
                  className={theme === "light" ? "active" : ""}
                  onClick={() => setTheme("light")}
                  aria-label={translate(language, "lightTheme")}
                  aria-pressed={theme === "light"}
                >
                  <Sun size={16} />
                </button>

                <button
                  className={theme === "dark" ? "active" : ""}
                  onClick={() => setTheme("dark")}
                  aria-label={translate(language, "darkTheme")}
                  aria-pressed={theme === "dark"}
                >
                  <Moon size={16} />
                </button>

                <button
                  className={theme === "system" ? "active" : ""}
                  onClick={() => setTheme("system")}
                  aria-label={translate(language, "systemTheme")}
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
              aria-label={translate(language, "selectLanguage")}
            >
              <Globe size={17} />

              <span>
                {language === "fa-AF"
                  ? "\u062F\u0631\u06CC"
                  : language === "ps-AF"
                    ? "\u067E\u069A\u062A\u0648"
                    : translate(language, "englishUs")}
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
            <button className="menu-setting-row" disabled title={translate(language, "notAvailableYet")}>
              <span className="currency-icon">
                <Euro size={18} />
              </span>

              <span>{translate(language, "euro")}</span>

              <ChevronDown size={15} />
            </button>

            {/* Measurement */}
            <button className="menu-setting-row" disabled title={translate(language, "notAvailableYet")}>
              <span className="metric-icon">
                <Ruler size={18} />
              </span>

              <span>{translate(language, "metric")}</span>

              <ChevronDown size={15} />
            </button>

            {/* Keyboard shortcuts */}
            <button className="menu-setting-row" disabled title={translate(language, "notAvailableYet")}>
              <span>
                <Keyboard size={17} />
              </span>

              <span>{translate(language, "keyboardShortcuts")}</span>
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

function RouteLoading({ language }: { language: AppLanguage }) {
  return (
    <main className="route-state-page">
      <p role="status">{translate(language, "loadingPage")}</p>
    </main>
  );
}

function RouteLoadError({ language }: { language: AppLanguage }) {
  return (
    <main className="route-state-page">
      <p role="alert">{translate(language, "pageDataError")}</p>
    </main>
  );
}
