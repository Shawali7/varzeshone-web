# VarzeshOne Frontend audit — 2026-11-22

## Scope and baseline

Reviewed the React/Vite entry point, application state navigation, search,
preferences, all page components, static service/data layer, shared components,
global/page styles, TypeScript and ESLint configuration, public assets and build.
No backend, dependency additions, routing migration or architecture changes.

The working tree already contained edits to App/HomePage, a storage helper and
an audit test script. Those were retained; they are not new findings introduced
by this audit. Existing unrelated deleted files were left untouched.

## Corrections in this pass

- MatchPage: parse date-only strings as local calendar dates in both date
  displays. UTC parsing previously displayed the preceding day west of UTC.
- MatchPage: do not label live or unscheduled upcoming matches “Full time”.
- HomePage and MatchPage: handle rejected data requests and show an error,
  rather than an unhandled rejection and misleading empty results.
- App settings: focus the dialog when opened, contain Tab/Shift+Tab navigation,
  restore focus on close, prevent background scrolling and add dialog semantics.
- App: highlight the active About navigation item; remount player-specific state
  when selecting another player, consistent with other detail pages.
- LeaguePage: include the two older seasons selectable from season history in
  the controlled season dropdown.
- MatchesPage: clear error/loading state on retry, return effect cleanup and
  ignore outdated requests. This component currently has no App navigation entry;
  the correction does not introduce one.
- Updated existing regression tests for the additional homepage error state;
  added date/timezone and rejected-request coverage.

## Verified existing corrections

The pre-existing working-tree changes cover numeric kickoff sorting, selected
league navigation, safe storage access, search input/button nesting, resetting
league/team/match detail state and favorite-button keyboard event propagation.
The regression suite exercises sorting, league selection, favorites, storage,
timezone handling and request failures using transpiled components and mocked
hooks/services. It is not a browser integration suite.

## Current product limitations

- Data is local/static demonstration data, including live statuses and relative
  dates. There is no live results feed or authentication backend.
- Store buttons and several settings/tools (sign-in, predictor, lineup builder,
  TV schedules, currency, measurements and shortcuts) have no action handlers.
  Real destinations/business behavior are not specified. No backend or invented
  destinations were added.
- Language preference changes document direction/language and About content;
  the rest of the interface is still a mixture of English and Dari. Full
  translation is not implemented.
- Navigation is in-memory state: reload returns home and browser history does
  not represent page navigation. Follow states outside homepage favorites are
  temporary. These are existing design limitations, not routing changes here.
- Several shared-component files are empty and unused; the older MatchDetails
  component and MatchesPage are not rendered by App. They were not reorganized.
- The large global stylesheet has repeated rules and overrides. Without visual
  regression evidence, broad CSS cleanup would risk changing the appearance.
- README remains the Vite template; deployment and product documentation are
  incomplete. TypeScript strict mode is not enabled; existing build/lint pass.

## Validation and limits

- `npm.cmd run build`: passed (TypeScript and production Vite build).
- `npm.cmd run lint`: passed.
- `node --test scripts/frontend-audit.test.mjs`: 11 tests passed.
- `git diff --check`: passed.
- Browser automation inventory reported `The browser access host is unavailable`.
  Actual browser interaction, mobile/desktop screenshots, visual RTL/LTR,
  contrast and screen-reader behavior remain unverified. Source review and
  component tests cannot substitute for those checks.
- No dependency vulnerability scan or internet-based package/version audit was
  performed. No security audit of a backend is applicable to this static app.

## Loading/error/empty follow-up

- Match details now show a pending status while the request is unresolved;
  detail tabs render only after successful completion. A rejected request shows
  an alert instead of simultaneous empty-data messages. Errors are scoped to
  the requested match ID.
- Player history now distinguishes a failed request from successful empty
  history, and announces its loading status.
- League data sections no longer render empty tables while loading or after
  failure. Successful empty standings, fixtures and player statistics have
  explicit status messages.
- Homepage loading and filtered-empty messages have status semantics.
- Added a regression exercising pending, rejected and successful-empty match
  detail requests. Existing NewsPage search-empty and MatchesPage
  loading/error/filtered-empty branches were also reviewed.

## Navigation follow-up

- Back from a player opened in a team squad restores the originating team.
  Direct player navigation retains the existing home fallback. Added a
  component regression for the team → player → team path.
- Added Home, News and About to the settings/menu navigation so that destinations
  hidden by mobile header rules remain accessible.
- Disabled the unimplemented App store/tool/sign-in/currency/measurement/shortcut
  controls and marked them “Not available yet” rather than retaining clickable
  no-op controls. No external URL or missing feature was invented.
- URL routing/browser history limitations remain as documented above; no routing
  library or backend was added. Browser-level interaction is still unverified.

## Static data/runtime follow-up

- Verified unique IDs, match league/team references, player current-team sport,
  finished-match performance references, dates, kickoff times and nonnegative
  scores/performance counters against current static collections.
- Transfer and membership collections are currently empty; reference checks
  cover records when present but do not validate a populated dataset today.
- Match detail lookup now checks own properties: IDs such as `constructor` or
  `__proto__` previously returned inherited objects instead of undefined.
- Invalid match dates now display “Date unavailable” rather than throwing an
  Intl RangeError. Both date displays use the same guarded formatter.
- Added three regressions for lookup IDs, invalid-date rendering and current
  static-data integrity. Static demonstration content was not replaced with
  invented real-world data.
