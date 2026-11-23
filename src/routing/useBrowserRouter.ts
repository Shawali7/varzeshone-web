import { useCallback, useEffect, useState } from "react";

export type BrowserLocation = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
};

export type NavigateOptions = {
  replace?: boolean;
  preserveSearch?: boolean;
  preserveHash?: boolean;
  state?: unknown;
};

type HistoryState = {
  __varzeshoneIndex?: number;
  [key: string]: unknown;
};

function readLocation(): BrowserLocation {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: window.history.state,
  };
}

function getHistoryState(state: unknown): HistoryState {
  return state && typeof state === "object"
    ? state as HistoryState
    : {};
}

export function useBrowserRouter() {
  const [location, setLocation] = useState<BrowserLocation>(readLocation);

  useEffect(() => {
    const updateLocation = () => setLocation(readLocation());
    window.addEventListener("popstate", updateLocation);
    return () => window.removeEventListener("popstate", updateLocation);
  }, []);

  const navigate = useCallback((to: string, options: NavigateOptions = {}) => {
    const target = new URL(to, window.location.href);
    if (options.preserveSearch && !target.search) target.search = location.search;
    if (options.preserveHash && !target.hash) target.hash = location.hash;

    const currentState = getHistoryState(window.history.state);
    const nextIndex = options.replace
      ? currentState.__varzeshoneIndex ?? 0
      : (currentState.__varzeshoneIndex ?? 0) + 1;
    const destinationState = getHistoryState(
      options.state === undefined ? currentState : options.state,
    );
    const nextState: HistoryState = {
      ...destinationState,
      __varzeshoneIndex: nextIndex,
    };
    const url = `${target.pathname}${target.search}${target.hash}`;

    if (options.replace) window.history.replaceState(nextState, "", url);
    else window.history.pushState(nextState, "", url);

    setLocation(readLocation());
  }, [location.hash, location.search]);

  const go = useCallback((delta: number) => {
    window.history.go(delta);
  }, []);

  return { location, navigate, go };
}
