import { Suspense } from "react";
import { Outlet } from "react-router";
import useLocalStorage from "use-local-storage";

import { DEFAULT_LAST_VISITED, LAST_VISITED_KEY } from "../utils/modules";

export function useLastVisitedApp(path: string | null) {
  const [lastVisitedApp, setLastVisitedApp] = useLocalStorage(
    LAST_VISITED_KEY,
    DEFAULT_LAST_VISITED,
  );

  if (path !== null && lastVisitedApp !== path) {
    setLastVisitedApp(path);
  }
}

export function ModuleFrame({
  path,
  remember,
}: {
  path: string;
  remember: boolean;
}) {
  useLastVisitedApp(remember ? path : null);
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
