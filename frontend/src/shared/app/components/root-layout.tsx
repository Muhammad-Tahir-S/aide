import { type ReactNode, useState } from "react";
import { useLocation } from "react-router";

import { cn } from "@/shared/lib/utils";
import { Atmosphere } from "@/shared/theme";

import Header from "./header";
import Sidebar from "./sidebar";

export default function RootLayout(props: { children: ReactNode }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState<"collapsed" | "expanded">(
    "expanded",
  );
  const { pathname } = useLocation();

  const isAuthPage = pathname.includes("/auth");

  if (isAuthPage || pathname === "/") {
    return <>{props.children}</>;
  }
  return (
    <div className="relative flex h-dvh w-dvw md:p-5 md:gap-8">
      <Atmosphere withSidebar sidebarOpen={isSideBarOpen === "expanded"} />
      <Sidebar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />

      <div
        className={cn(
          "relative z-10 flex flex-col flex-1 gap-5 p-5 md:p-0 min-h-0",
          isSideBarOpen === "expanded" ? "w-0 hidden md:flex" : "w-full",
        )}
      >
        <Header
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <div className="flex flex-1 min-h-0">{props.children}</div>
      </div>
    </div>
  );
}
