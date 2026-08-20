import { createContext, type ReactNode, useContext, useState } from "react";
import useLocalStorage from "use-local-storage";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import {
  isSidebarMode,
  SIDEBAR_CHROME,
  type SidebarChromeStyle,
  type SidebarMode,
} from "./variants";

const MODE_KEY = "helper-apps-sidebar-mode";

type SidebarChromeValue = {
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
  variant: SidebarChromeStyle;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  menusOpen: boolean;
  setMenusOpen: (open: boolean) => void;
};

const SidebarChromeContext = createContext<SidebarChromeValue | null>(null);

export function SidebarChromeProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [storedMode, setStoredMode] = useLocalStorage<SidebarMode>(
    MODE_KEY,
    "hover",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menusOpen, setMenusOpen] = useState(false);

  const mode = isSidebarMode(storedMode) ? storedMode : "hover";

  return (
    <SidebarChromeContext.Provider
      value={{
        mode,
        setMode: setStoredMode,
        variant: SIDEBAR_CHROME,
        isMobile,
        mobileOpen,
        setMobileOpen,
        menusOpen,
        setMenusOpen,
      }}
    >
      {children}
    </SidebarChromeContext.Provider>
  );
}

export function useSidebarChrome() {
  const context = useContext(SidebarChromeContext);
  if (!context) {
    throw new Error(
      "useSidebarChrome must be used within SidebarChromeProvider",
    );
  }
  return context;
}
