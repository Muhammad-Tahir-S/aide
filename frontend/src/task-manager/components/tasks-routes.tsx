import { useEffect } from "react";
import { Route, Routes } from "react-router";
import useLocalStorage from "use-local-storage";

import globalKeys from "@/shared/lib/globalKeys";

export const TasksRoutes = () => {
  const [_lastVisitedApp, setLastVisitedApp] = useLocalStorage(
    globalKeys.lastVisitedApp,
    globalKeys.defaultLastVisitedApp,
  );

  useEffect(() => {
    setLastVisitedApp("/tasks");
  }, [setLastVisitedApp]);

  return (
    <Routes>
      <Route path="/*" element={<div>Tasks</div>} />
      <Route path="/:id" element={<div>Tasks ID</div>} />
    </Routes>
  );
};
