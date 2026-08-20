import { Outlet } from "react-router";

import { MotifStage, PageMotifs } from "@/app/components/theme/atmosphere";

import Header from "./header";
import { SidebarChromeProvider, useSidebarChrome } from "./sidebar/chrome";
import Sidebar from "./sidebar/sidebar";

function useSidebarOccupiesPage() {
  const { mode, isMobile, menusOpen, railHovered } = useSidebarChrome();
  if (isMobile) return false;
  if (mode === "expanded") return true;
  if (mode === "hover") return railHovered || menusOpen;
  return false;
}

function Chrome() {
  const occupyLeft = useSidebarOccupiesPage();

  return (
    <MotifStage>
      <div className="sidebar-shell relative flex h-dvh w-dvw overflow-hidden">
        <PageMotifs occupyLeft={occupyLeft} withSidebar />
        <Sidebar />
        <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
          <Header />
          <div className="flex min-h-0 flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </MotifStage>
  );
}

export default function RootLayout() {
  return (
    <SidebarChromeProvider>
      <Chrome />
    </SidebarChromeProvider>
  );
}
