import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import useLocalStorage from "use-local-storage";

import NotesRoutes from "@/notes";
import AuthRoutes from "@/shared/auth";
import globalKeys from "@/shared/lib/globalKeys";
import TasksRoutes from "@/task-manager";

import RootLayout from "./root-layout";

const DevDesignSystem = import.meta.env.DEV
  ? lazy(() => import("@/dev/design-system/routes"))
  : null;

function MainRoutes() {
  return (
    <RootLayout>
      <Routes>
        <Route path="notes/*" element={<NotesRoutes />} />
        <Route path="tasks/*" element={<TasksRoutes />} />
      </Routes>
    </RootLayout>
  );
}

export const AppRoutes = () => {
  const [lastVisitedApp] = useLocalStorage(
    globalKeys.lastVisitedApp,
    globalKeys.defaultLastVisitedApp,
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={lastVisitedApp} />} />

      <Route path="auth/*" element={<AuthRoutes />} />

      {DevDesignSystem ? (
        <Route
          path="design-system/*"
          element={
            <RootLayout>
              <Suspense fallback={null}>
                <DevDesignSystem />
              </Suspense>
            </RootLayout>
          }
        />
      ) : null}

      <Route path="/*" element={<MainRoutes />} />
    </Routes>
  );
};
