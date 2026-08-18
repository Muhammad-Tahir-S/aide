import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import AvatarIcon from "@/shared/assets/images/avatar.png";
import Typography from "@/shared/components/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { SidebarAtmosphere } from "@/shared/theme/atmosphere";

import CollapseLight from "../../assets/icons/collapse-icon.svg?react";
import ExpandLight from "../../assets/icons/expand-icon.svg?react";
import Logout from "../../assets/icons/logout.svg?react";
// import Settings from "../../assets/icons/setting.svg?react";
import SideMenuIcon from "../../assets/icons/side-menu-icon.svg?react";
import User from "../../assets/icons/user.svg?react";
import Users from "../../assets/icons/users.svg?react";

const user = {
  name: "MT Sanuth",
  email: "mtsanuth@xyz.com",
  avatar: "",
};

const sideBarMenu = [
  {
    title: "Task Manager",
    url: "/tasks",
  },
  {
    title: "Notes Manager",
    url: "/notes",
  },
];
const sideBarFooterMenu = [
  {
    title: "View profile",
    icon: User,
  },
  {
    title: "Invite members",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   icon: Settings,
  // },
  {
    title: "Log out",
    icon: Logout,
  },
];

export default function Sidebar({
  isSideBarOpen,
  setIsSideBarOpen,
}: {
  isSideBarOpen: "expanded" | "collapsed";
  setIsSideBarOpen: React.Dispatch<
    React.SetStateAction<"expanded" | "collapsed">
  >;
}) {
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative z-10 flex flex-col overflow-hidden transition-all ease-in-out duration-300 rounded-r-[var(--radius)] md:rounded-[var(--radius)] bg-primary-50 dark:bg-primary-900",
        isSideBarOpen === "expanded" ? "md:w-[280px] w-full" : "md:w-24 w-0",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-5 transition-all ease-in-out duration-300 min-h-[72px] relative z-10",
          isSideBarOpen === "expanded" ? "" : "justify-center",
        )}
      >
        <span
          className={cn(
            "font-serif font-bold text-[18px] text-primary-main dark:text-primary-50 overflow-hidden whitespace-nowrap shrink-0 transition-all duration-300 tracking-[var(--heading-tracking)]",
            isSideBarOpen === "expanded"
              ? "opacity-100 w-auto"
              : "opacity-0 w-0",
          )}
        >
          App Logo
        </span>
        {isSideBarOpen === "expanded" && (
          <CollapseLight
            onClick={() => setIsSideBarOpen("collapsed")}
            className="w-5 h-5 cursor-pointer text-primary-200 dark:text-primary-pressed "
          />
        )}
        {isSideBarOpen === "collapsed" && (
          <ExpandLight
            onClick={() => setIsSideBarOpen("expanded")}
            className="w-5 h-5 cursor-pointer text-primary-200 dark:text-primary-pressed opacity-0 md:opacity-100"
          />
        )}
      </div>

      <div
        className={cn(
          "relative z-10 flex-1 flex-col border-y border-primary-200 dark:border-primary-800 gap-6 py-4 px-5",
          isSideBarOpen === "collapsed" ? "hidden md:flex" : "flex",
        )}
      >
        {sideBarMenu.map((item) => {
          const pathToMatch = item?.url
            ? item?.url.split("/")?.at(-1)
            : undefined;
          const urlIsActive =
            !!pathToMatch && location.pathname.includes(pathToMatch);
          return (
            <Link to={item.url} key={item.title}>
              <Button
                size="sidebarItem"
                variant="sidebarItem"
                className={cn(
                  "flex items-center transition-all duration-300 ease-in-out overflow-hidden",
                  urlIsActive
                    ? "bg-primary-hover text-primary-25 dark:bg-primary-950 dark:text-primary-50 hover:bg-primary-hover hover:text-primary-25  dark:hover:bg-primary-950 dark:hover:text-primary-50"
                    : "",
                  isSideBarOpen === "collapsed"
                    ? "justify-center gap-0"
                    : "justify-start gap-3",
                )}
              >
                <SideMenuIcon
                  className={cn(
                    "transition-all duration-300 shrink-0",
                    isSideBarOpen === "collapsed" ? "mx-auto" : "",
                  )}
                />
                <span
                  className={cn(
                    "transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isSideBarOpen === "collapsed"
                      ? "opacity-0 w-0"
                      : "opacity-100 w-auto",
                  )}
                >
                  {item.title}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
      <div className="relative z-10 flex py-6 px-5">
        <DropdownMenu open={isProfileOpen} onOpenChange={setProfileOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                " items-center cursor-pointer gap-1 w-full",
                isSideBarOpen === "collapsed" ? "hidden md:flex" : "flex",
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    <img
                      src={AvatarIcon}
                      alt="Fallback avatar"
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    " flex-col flex-1 text-left",
                    isSideBarOpen === "expanded" ? "flex" : "hidden",
                  )}
                >
                  <Typography variant="text-md/semibold">
                    {user.name}
                  </Typography>
                  <Typography
                    variant="text-xs/medium"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    {user.email}
                  </Typography>
                </div>
              </div>

              <ChevronDown
                className={cn(
                  "size-4.5 text-gray-500 shrink-0 transition-transform duration-200",
                  isProfileOpen ? "rotate-180" : "rotate-0",
                )}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(
              "w-56 md:w-[256px]",
              isSideBarOpen === "collapsed" ? "mx-5" : "",
            )}
            side="bottom"
            align="center"
            sideOffset={9}
          >
            {sideBarFooterMenu.map((footerMenu) => {
              const Icon = footerMenu.icon;
              return (
                <DropdownMenuItem key={footerMenu.title} className="group">
                  <Icon className="stroke-gray-700 dark:stroke-gray-300 group-hover:stroke-primary-hover dark:group-hover:stroke-primary-main" />
                  <Typography
                    variant="text-sm/medium"
                    className="group-hover:text-primary-hover dark:group-hover:text-primary-main"
                  >
                    {footerMenu.title}
                  </Typography>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SidebarAtmosphere visible={isSideBarOpen === "expanded"} />
    </div>
  );
}
