import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file, mocks = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, require: (id) => mocks[id] ?? require(id), ...globals,
  });
  return exports;
}

function home(matches, sort = false) {
  let index = 0;
  const states = new Map([[0, matches], [1, [{ id: 'herat', name: 'Herat' }]], [3, false], [7, sort]]);
  return load('../src/pages/HomePage.tsx', {
    react: {
      useEffect() {},
      useMemo: (fn) => fn(),
      useState: (initial) => {
        const i = index++;
        return [states.has(i) ? states.get(i) : typeof initial === 'function' ? initial() : initial, () => {}];
      },
    },
    '../services/sportsService': {},
    '../data/leagueData': { getDemoLeagueSeasonData: () => ({ standings: [] }) },
    '../data/seasonData': { CURRENT_DEMO_SEASON_ID: 'season-2026-2027' },
    '../utils/storage': { readPreference: () => null },
  }).default;
}

function loadDemoCatalog() {
  const geographyData = load('../src/data/geographyData.ts');
  const teamsData = load('../src/data/teamData.ts', {
    './geographyData': geographyData,
  });
  const playersData = load('../src/data/playerData.ts');
  const performancesData = load('../src/data/playerMatchData.ts');
  const seasonsData = load('../src/data/seasonData.ts');
  const transfersData = load('../src/data/transferData.ts');
  const membershipsData = load('../src/data/membershipData.ts');
  const mockData = load('../src/data/mockData.ts', {
    './teamData': teamsData,
    './geographyData': geographyData,
    './seasonData': seasonsData,
  });
  const leagueData = load('../src/data/leagueData.ts', {
    './playerData': playersData,
    './playerMatchData': performancesData,
    './seasonData': seasonsData,
    './teamData': teamsData,
    './transferData': transfersData,
    './mockData': mockData,
  });
  const matchDetailData = load('../src/data/matchDetailData.ts', {
    './leagueData': leagueData,
    './playerData': playersData,
    './teamData': teamsData,
    './mockData': mockData,
  });
  return {
    ...geographyData,
    ...teamsData,
    ...playersData,
    ...performancesData,
    ...seasonsData,
    ...transfersData,
    ...membershipsData,
    ...mockData,
    ...leagueData,
    ...matchDetailData,
  };
}

function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (predicate(node)) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const result = find(child, predicate);
    if (result) return result;
  }
}

function findAll(node, predicate, results = []) {
  if (!node || typeof node !== 'object') return results;
  if (predicate(node)) results.push(node);
  for (const child of [node.props?.children].flat(Infinity)) {
    findAll(child, predicate, results);
  }
  return results;
}

function authPage(mode) {
  const states = [];
  let index = 0;
  const icons = Object.fromEntries(
    ['ArrowRight', 'Eye', 'EyeOff', 'LockKeyhole', 'ShieldCheck', 'UserRound']
      .map((name) => [name, name]),
  );
  const Page = load('../src/pages/AuthPage.tsx', {
    react: {
      useState: (initial) => {
        const i = index++;
        if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial;
        return [states[i], (value) => {
          states[i] = typeof value === 'function' ? value(states[i]) : value;
        }];
      },
    },
    'lucide-react': icons,
    '../i18n': { translate: (_language, key) => key },
  }).default;
  return () => {
    index = 0;
    return Page({ mode, language: 'en', onNavigate() {} });
  };
}

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const matches = ['16:00', '9:30', undefined].map((time, i) => ({
  id: String(i), home: 'Home', away: 'Away', leagueId: 'herat', leagueName: 'Herat',
  date: today, sport: 'football', status: 'UPCOMING', time,
}));
const props = { search: '', setSearch() {}, onOpenNews() {}, onOpenTeam() {}, onOpenMatch() {}, onOpenLeague() {} };

test('By time sorts numerically and places missing times last', () => {
  const Page = home(matches, true);
  const tree = Page(props);
  const competition = find(tree, (n) => n.type?.name === 'CompetitionCard');
  assert.deepEqual(Array.from(competition.props.matches, (m) => m.id), ['1', '0', '2']);
  assert.deepEqual(matches.map((m) => m.id), ['0', '1', '2']);
});

test('Homepage league navigation passes the selected league ID', () => {
  let selected;
  const Page = home(matches);
  const tree = Page({ ...props, onOpenLeague: (id) => { selected = id; } });
  find(tree, (n) => n.type === 'button' && n.props.className?.includes('league-item') && n.key === 'herat').props.onClick();
  assert.equal(selected, 'herat');
});

test('Favorite keyboard events do not open match details', () => {
  let opened = 0;
  const Page = home(matches);
  const competition = find(Page(props), (n) => n.type?.name === 'CompetitionCard');
  const card = competition.type(competition.props);
  const rowElement = find(card, (n) => n.type?.name === 'MatchRow');
  const row = rowElement.type({ ...rowElement.props, onOpenMatch: () => { opened++; } });
  const target = {};
  row.props.onKeyDown({ key: 'Enter', target: {}, currentTarget: target });
  assert.equal(opened, 0);
  row.props.onKeyDown({ key: 'Enter', target, currentTarget: target, preventDefault() {} });
  assert.equal(opened, 1);
});

test('Blocked storage is safe for both preference reads and writes', () => {
  const storage = load('../src/utils/storage.ts', {}, {
    localStorage: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } },
  });
  assert.equal(storage.readPreference('theme'), null);
  assert.doesNotThrow(() => storage.writePreference('theme', 'dark'));
});


test('Match date remains the selected calendar day west of UTC', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';
  try {
    const Page = load('../src/pages/MatchPage.tsx', {
      react: { useEffect() {}, useMemo: (fn) => fn(), useState: (initial) => [initial, () => {}] },
      '../services/matchDetailService': {},
    }).default;
    const tree = Page({ match: { ...matches[0], date: '2026-11-22' }, onBack() {} });
    assert.ok(find(tree, (n) => [n.props?.children].flat().includes('22 Nov 2026')));
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});


test('Rejected homepage and match detail requests become visible errors', async () => {
  for (const [file, service, exports] of [
    ['../src/pages/HomePage.tsx', '../services/sportsService', {
      getLeagues: async () => [], getMatches: async () => { throw Error('unavailable'); },
    }],
    ['../src/pages/MatchPage.tsx', '../services/matchDetailService', {
      getMatchDetails: async () => { throw Error('unavailable'); },
    }],
  ]) {
    const effects = [];
    const updates = [];
    const Page = load(file, {
      react: {
        useEffect: (fn) => effects.push(fn),
        useMemo: (fn) => fn(),
        useState: (initial) => [typeof initial === 'function' ? initial() : initial, (value) => updates.push(value)],
      },
      [service]: exports,
      '../data/leagueData': file.includes('HomePage')
        ? { getDemoLeagueSeasonData: () => ({ standings: [] }) }
        : undefined,
      '../data/seasonData': file.includes('HomePage')
        ? { CURRENT_DEMO_SEASON_ID: 'season-2026-2027' }
        : undefined,
      '../utils/storage': { readPreference: () => null, writePreference() {} },
    }).default;
    Page({ ...props, match: matches[0], onBack() {} });
    const cleanups = effects.map((effect) => effect());
    await new Promise((resolve) => setImmediate(resolve));
    assert.ok(updates.includes(file.includes('MatchPage') ? matches[0].id : true), file + ' should set its error state');
    cleanups.forEach((cleanup) => cleanup?.());
  }
});


test('Match details distinguish pending, rejected and empty successful requests', async () => {
  for (const rejected of [false, true]) {
    let resolve, reject;
    const request = new Promise((yes, no) => { resolve = yes; reject = no; });
    const states = [];
    const effects = [];
    let index = 0;
    const Page = load('../src/pages/MatchPage.tsx', {
      react: {
        useEffect: (fn) => effects.push(fn), useMemo: (fn) => fn(),
        useState: (initial) => {
          const i = index++;
          if (!(i in states)) states[i] = initial;
          return [states[i], (value) => { states[i] = value; }];
        },
      },
      '../services/matchDetailService': { getMatchDetails: () => request },
    }).default;
    const render = () => { index = 0; return Page({ match: matches[0], onBack() {} }); };
    const pending = render();
    assert.ok(find(pending, (n) => n.props?.role === 'status'));
    assert.equal(find(pending, (n) => n.type?.name === 'Overview'), undefined);
    const cleanup = effects[0]();
    if (rejected) reject(Error('unavailable')); else resolve(undefined);
    await new Promise((done) => setImmediate(done));
    const settled = render();
    assert.equal(Boolean(find(settled, (n) => n.props?.role === 'alert')), rejected);
    assert.equal(Boolean(find(settled, (n) => n.type?.name === 'Overview')), !rejected);
    assert.equal(find(settled, (n) => n.props?.role === 'status'), undefined);
    cleanup();
  }
});


test('Direct detail and nested league paths resolve and invalid paths 404', () => {
  const { resolveRoute, entityPath, leaguePath } = load('../src/routing/routes.ts');

  const league = resolveRoute('/league/afghanistan-premier-league/table/');
  assert.equal(league.type, 'league');
  assert.equal(league.leagueId, 'afghanistan-premier-league');
  assert.equal(league.section, 'table');

  const match = resolveRoute('/match/match-001');
  assert.equal(match.type, 'match');
  assert.equal(match.matchId, 'match-001');

  assert.equal(resolveRoute('/league/unknown/not-a-section').type, 'not-found');
  assert.equal(resolveRoute('/player/%E0%A4%A').type, 'not-found');
  assert.equal(resolveRoute('/sign-in').type, 'sign-in');
  assert.equal(resolveRoute('/register').type, 'register');
  assert.equal(resolveRoute('/forgot-password').type, 'forgot-password');
  assert.equal(resolveRoute('/terms').type, 'terms');
  assert.equal(resolveRoute('/privacy').type, 'privacy');
  assert.equal(leaguePath('afghanistan-premier-league', 'fixtures'), '/league/afghanistan-premier-league/fixtures');
  assert.equal(entityPath('team', 'Herat FC'), '/team/Herat%20FC');
});

test('Sign-in validates locally, toggles password visibility and never reports authentication success', () => {
  const render = authPage('sign-in');
  let tree = render();
  find(tree, (node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  tree = render();
  const errors = findAll(tree, (node) => node.props?.className === 'auth-field-error');
  assert.equal(errors.length, 2);
  assert.ok(errors.some((node) => node.props.children === 'authIdentifierRequired'));
  assert.ok(errors.some((node) => node.props.children === 'authPasswordRequired'));

  find(tree, (node) => node.type === 'input' && node.props.name === 'identifier')
    .props.onChange({ target: { value: 'fan@example.com' } });
  find(tree, (node) => node.type === 'input' && node.props.name === 'password')
    .props.onChange({ target: { value: 'x' } });
  tree = render();
  assert.equal(find(tree, (node) => node.type === 'h1').props.children, 'authSignInTitle');
  assert.equal(find(tree, (node) => node.props?.className === 'auth-sign-in-notice').props.children, 'authSignInUnavailable');
  assert.equal(findAll(tree, (node) => node.type === 'button' && ['Google', 'Apple', 'Facebook'].includes(node.props.children)).length, 0);
  find(tree, (node) => node.props?.className === 'auth-password-toggle')
    .props.onClick();
  tree = render();
  assert.equal(find(tree, (node) => node.type === 'input' && node.props.name === 'password').props.type, 'text');
  find(tree, (node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  tree = render();
  assert.equal(find(tree, (node) => node.props?.role === 'status').props.children, 'authSignInSubmitNotice');
});


test('Static match details return undefined for unknown and inherited IDs', () => {
  const data = loadDemoCatalog();
  for (const id of ['missing', '__proto__', 'constructor', 'toString']) {
    assert.equal(data.getDemoMatchDetails(id), undefined);
  }
  assert.ok(data.getDemoMatchDetails('match-001').events.length);
});

test('Invalid static match dates cannot crash the match page', () => {
  const Page = load('../src/pages/MatchPage.tsx', {
    react: { useEffect() {}, useMemo: (fn) => fn(), useState: (initial) => [initial, () => {}] },
    '../services/matchDetailService': {},
  }).default;
  const tree = Page({ match: { ...matches[0], date: 'invalid' }, onBack() {} });
  assert.ok(find(tree, (n) => [n.props?.children].flat().includes('Date unavailable')));
});

test('Demo catalog has stable IDs and linked leagues, teams, seasons, players and matches', () => {
  const {
    matches, demoMatchRecords, leagues, demoTeams: teams, demoPlayers: players,
    demoPlayerMatchPerformances: performances, demoTransfers: transfers,
    demoMemberships: memberships, demoSeasons: seasons, demoLeagueTeamMemberships: leagueTeams,
    getDemoLeagueSeasonData, getDemoMatchDetails,
  } = loadDemoCatalog();
  const uniqueIds = (records) => {
    assert.equal(new Set(records.map((item) => item.id)).size, records.length);
    assert.ok(records.every((item) => typeof item.id === 'string' && item.id.length > 0));
  };
  for (const records of [matches, demoMatchRecords, leagues, teams, players, performances, transfers, memberships, seasons, leagueTeams]) {
    uniqueIds(records);
  }
  assert.equal(teams.length, 48);
  assert.equal(leagues.length, 8);
  assert.equal(new Set(teams.map((team) => team.name)).size, teams.length);
  assert.equal(leagues.filter((league) => league.competitionLevel === 'national').length, 2);
  assert.equal(leagues.filter((league) => league.competitionLevel === 'regional').length, 1);
  assert.ok(leagues.filter((league) => league.competitionLevel === 'provincial').every((league) => league.province));
  assert.ok(leagues.filter((league) => league.competitionLevel === 'club').every((league) => league.city));
  assert.equal(leagues.filter((league) => league.sport === 'futsal').length, 3);
  assert.ok(seasons.every((season) => season.isDemo && /^season-\d{4}-\d{4}$/.test(season.id)));

  for (const league of leagues) {
    assert.equal(league.isDemo, true);
    const members = leagueTeams.filter((item) => item.leagueId === league.id);
    assert.ok(members.length > 0);
    for (const member of members) {
      const team = teams.find((item) => item.id === member.teamId);
      assert.ok(team);
      assert.equal(team.sport, league.sport);
      assert.equal(member.isDemo, true);
    }
  }

  for (const [index, record] of demoMatchRecords.entries()) {
    const view = matches.find((item) => item.id === record.id);
    const league = leagues.find((item) => item.id === record.leagueId);
    const home = teams.find((item) => item.id === record.homeTeamId);
    const away = teams.find((item) => item.id === record.awayTeamId);
    assert.ok(view && league && home && away, `match ${record.id} references known entities`);
    assert.equal(record.isDemo, true);
    assert.equal(record.seasonId, 'season-2026-2027');
    assert.notEqual(record.status, 'LIVE', 'demo matches must not be presented as live');
    assert.equal(view.home, home.name);
    assert.equal(view.away, away.name);
    assert.equal(view.leagueName, league.name);
    assert.equal(view.sport, league.sport);
    assert.notEqual(record.homeTeamId, record.awayTeamId);
    assert.ok(leagueTeams.some((item) => item.leagueId === league.id && item.teamId === home.id));
    assert.ok(leagueTeams.some((item) => item.leagueId === league.id && item.teamId === away.id));
    assert.ok(!Number.isNaN(new Date(record.date + 'T00:00:00').getTime()));
    assert.equal(view.id, demoMatchRecords[index].id);
    if (record.status === 'FT') {
      assert.ok(Number.isInteger(record.homeScore) && record.homeScore >= 0);
      assert.ok(Number.isInteger(record.awayScore) && record.awayScore >= 0);
    }
    if (record.time) assert.match(record.time, /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
  }

  for (const player of players) {
    const team = teams.find((item) => item.id === player.teamId);
    assert.ok(team);
    assert.equal(player.sport, team.sport);
    assert.equal(player.isDemo, true);
  }
  for (const performance of performances) {
    const match = matches.find((item) => item.id === performance.matchId);
    const player = players.find((item) => item.id === performance.playerId);
    assert.equal(match?.status, 'FT');
    assert.ok(player);
    assert.equal(player.teamId, performance.teamId);
    assert.ok([match.homeTeamId, match.awayTeamId].includes(performance.teamId));
    for (const key of ['minutesPlayed', 'goals', 'assists', 'yellowCards', 'redCards']) {
      assert.ok(Number.isInteger(performance[key]) && performance[key] >= 0);
    }
  }
  assert.equal(
    new Set(performances.map((item) => `${item.matchId}:${item.playerId}`)).size,
    performances.length,
    'a player has at most one performance record per match',
  );
  for (const match of matches.filter((item) => item.status === 'FT')) {
    const records = performances.filter((item) => item.matchId === match.id);
    if (records.length === 0) continue;
    assert.equal(
      records.filter((item) => item.teamId === match.homeTeamId).reduce((sum, item) => sum + item.goals, 0),
      match.homeScore,
      `${match.id} home player goals agree with the score`,
    );
    assert.equal(
      records.filter((item) => item.teamId === match.awayTeamId).reduce((sum, item) => sum + item.goals, 0),
      match.awayScore,
      `${match.id} away player goals agree with the score`,
    );
  }

  for (const league of leagues) {
    for (const season of seasons) {
      const data = getDemoLeagueSeasonData(league.id, season.id);
      const relatedMatches = matches.filter((item) => item.leagueId === league.id && item.seasonId === season.id);
      assert.equal(data.isDemo, true);
      assert.equal(data.leagueId, league.id);
      assert.equal(data.seasonId, season.id);
      assert.equal(data.fixtures.length, relatedMatches.length);
      for (const fixture of data.fixtures) {
        const match = relatedMatches.find((item) => item.id === fixture.matchId);
        assert.ok(match);
        assert.equal(fixture.isDemo, true);
        assert.equal(fixture.homeTeamId, match.homeTeamId);
        assert.equal(fixture.awayTeamId, match.awayTeamId);
        assert.equal(fixture.home, match.home);
        assert.equal(fixture.away, match.away);
      }

      for (const row of data.standings) {
        const results = relatedMatches.filter((item) =>
          item.status === 'FT' && [item.homeTeamId, item.awayTeamId].includes(row.teamId),
        );
        let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
        for (const match of results) {
          const home = match.homeTeamId === row.teamId;
          const scored = home ? match.homeScore : match.awayScore;
          const conceded = home ? match.awayScore : match.homeScore;
          goalsFor += scored;
          goalsAgainst += conceded;
          if (scored > conceded) wins++;
          else if (scored < conceded) losses++;
          else draws++;
        }
        assert.equal(row.played, results.length);
        assert.equal(row.won, wins);
        assert.equal(row.drawn, draws);
        assert.equal(row.lost, losses);
        assert.equal(row.goalsFor, goalsFor);
        assert.equal(row.goalsAgainst, goalsAgainst);
        assert.equal(row.gd, goalsFor - goalsAgainst);
        assert.equal(row.points, wins * 3 + draws);
        assert.equal(row.isDemo, true);
      }
      for (const stat of [...data.topRated, ...data.topScorers, ...data.topAssists]) {
        assert.ok(players.some((item) => item.id === stat.playerId));
        assert.ok(teams.some((item) => item.id === stat.teamId));
        assert.equal(stat.leagueId, league.id);
        assert.equal(stat.seasonId, season.id);
        assert.equal(stat.isDemo, true);
      }
      assert.ok(data.news.every((item) =>
        item.isDemo && item.leagueId === league.id && item.seasonId === season.id,
      ));
      for (const player of data.teamOfWeek) {
        assert.ok(players.some((item) => item.id === player.playerId));
        assert.ok(teams.some((item) => item.id === player.teamId));
      }
    }
  }

  for (const id of ['match-001', 'match-002', 'match-005']) {
    const detail = getDemoMatchDetails(id);
    const match = matches.find((item) => item.id === id);
    assert.ok(detail && match);
    assert.equal(detail.isDemo, true);
    const goalEvents = detail.events.filter((event) => event.type === 'goal');
    assert.equal(goalEvents.filter((event) => event.teamId === match.homeTeamId).length, match.homeScore);
    assert.equal(goalEvents.filter((event) => event.teamId === match.awayTeamId).length, match.awayScore);
    for (const event of detail.events) {
      const player = players.find((item) => item.id === event.playerId);
      assert.ok(player);
      assert.equal(event.player, player.name);
      assert.equal(player.teamId, event.teamId);
    }
    for (const lineupPlayer of [...detail.homePlayers, ...detail.awayPlayers]) {
      const player = players.find((item) => item.id === lineupPlayer.playerId);
      assert.ok(player);
      assert.equal(player.name, lineupPlayer.player);
      assert.equal(player.teamId, lineupPlayer.teamId);
    }
    for (const row of detail.table) {
      const standingsRow = getDemoLeagueSeasonData(match.leagueId, match.seasonId)
        .standings.find((item) => item.teamId === row.teamId);
      assert.ok(standingsRow);
      assert.equal(row.points, standingsRow.points);
      assert.equal(row.played, standingsRow.played);
    }
  }
});
