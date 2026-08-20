import { useEffect } from "react";
import { Route, Routes } from "react-router";
import useLocalStorage from "use-local-storage";

import globalKeys from "@/shared/lib/globalKeys";

export const NotesRoutes = () => {
  const [_lastVisitedApp, setLastVisitedApp] = useLocalStorage(
    globalKeys.lastVisitedApp,
    globalKeys.defaultLastVisitedApp,
  );

  useEffect(() => {
    setLastVisitedApp("/notes");
  }, [setLastVisitedApp]);

  return (
    <Routes>
      <Route path="/*" element={<div>Notes</div>} />
      <Route path="/:id" element={<div>Notes ID</div>} />
    </Routes>
  );
};
