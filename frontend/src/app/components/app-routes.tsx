import { Navigate, Route, Routes } from "react-router";
import useLocalStorage from "use-local-storage";

import { AuthLayout, SigninPage, SignupPage } from "@/auth";

import {
  appModules,
  DEFAULT_LAST_VISITED,
  LAST_VISITED_KEY,
} from "../utils/modules";
import { ModuleFrame } from "./module-frame";
import RootLayout from "./root-layout";

export const AppRoutes = () => {
  const [lastVisitedApp] = useLocalStorage(
    LAST_VISITED_KEY,
    DEFAULT_LAST_VISITED,
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={lastVisitedApp} />} />
      <Route path="auth" element={<AuthLayout />}>
        <Route path="signin" element={<SigninPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
      <Route element={<RootLayout />}>
        {appModules.map((mod) => (
          <Route
            key={mod.id}
            path={mod.path}
            element={<ModuleFrame path={mod.url} remember={mod.remember} />}
          >
            {mod.Detail ? <Route path=":id" element={<mod.Detail />} /> : null}
            <Route index element={<mod.List />} />
            <Route path="*" element={<mod.List />} />
          </Route>
        ))}
        <Route path="*" element={<Navigate replace to={lastVisitedApp} />} />
      </Route>
    </Routes>
  );
};
