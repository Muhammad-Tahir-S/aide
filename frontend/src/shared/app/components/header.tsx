import Calendar from "@/shared/assets/icons/calendar.svg?react";
import HamburgerMenu from "@/shared/assets/icons/hamburger-menu.svg?react";
import Notification from "@/shared/assets/icons/notification.svg?react";
import SearchBox from "@/shared/components/search-box";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import ExpandLight from "../../assets/icons/expand-icon.svg?react";

export default function Header({
  isSideBarOpen,
  setIsSideBarOpen,
}: {
  isSideBarOpen: "expanded" | "collapsed";
  setIsSideBarOpen: React.Dispatch<
    React.SetStateAction<"expanded" | "collapsed">
  >;
}) {
  const actions = [
    {
      label: "Notifications",
      icon: Notification,
    },
    {
      label: "Calendar",
      icon: Calendar,
    },
  ];

  return (
    <div className="flex bg-primary-50 dark:bg-primary-900 w-full h-[72px] rounded-[var(--radius)] py-3 px-4 items-center gap-0.5 md:gap-6 [box-shadow:var(--custom-shadow)]">
      {isSideBarOpen === "collapsed" ? (
        <div className="w-10 h-10 flex md:hidden items-center justify-center shrink-0">
          <ExpandLight
            onClick={() => setIsSideBarOpen("expanded")}
            className="text-primary-200 dark:text-primary-pressed w-5 h-5 cursor-pointer"
          />
        </div>
      ) : (
        ""
      )}

      <div className="flex-1 min-w-0">
        <SearchBox />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-10 h-10 flex md:hidden items-center justify-center shrink-0">
            <HamburgerMenu className="stroke-gray-500 dark:stroke-gray-300" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] mx-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem key={action.label} className=" group">
                <Icon className="stroke-gray-500 dark:stroke-gray-300 group-hover:stroke-primary-hover dark:group-hover:stroke-primary-main" />
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className=" hidden md:flex items-center">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              className="flex items-center w-10 h-10  justify-center shrink-0"
              key={action.label}
            >
              <Icon className="stroke-gray-500 dark:stroke-gray-300 group-hover:stroke-primary-hover dark:group-hover:stroke-primary-main " />
            </div>
          );
        })}
      </div>
    </div>
  );
}
