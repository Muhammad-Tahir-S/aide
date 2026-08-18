import { type ReactNode } from "react";
import { useLocation } from "react-router";

import { Atmosphere } from "@/shared/theme";

import { SidebarChromeProvider } from "../sidebar/chrome";
import Header from "./header";
import Sidebar from "./sidebar";

function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="sidebar-shell relative flex h-dvh w-dvw overflow-hidden">
      <Atmosphere withSidebar />
      <Sidebar />
      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default function RootLayout(props: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes("/auth");

  if (isAuthPage || pathname === "/") {
    return <>{props.children}</>;
  }

  return (
    <SidebarChromeProvider>
      <Chrome>{props.children}</Chrome>
    </SidebarChromeProvider>
  );
}
