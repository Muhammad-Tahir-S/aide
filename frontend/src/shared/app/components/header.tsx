import { PanelLeft } from "lucide-react";

import Calendar from "@/shared/assets/icons/calendar.svg?react";
import HamburgerMenu from "@/shared/assets/icons/hamburger-menu.svg?react";
import Notification from "@/shared/assets/icons/notification.svg?react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SearchBox,
} from "@/shared/design-system";
import { cn } from "@/shared/lib/utils";

import { useSidebarChrome } from "../sidebar/chrome";

const actions = [
  { label: "Notifications", icon: Notification },
  { label: "Calendar", icon: Calendar },
];

export default function Header() {
  const { setMobileOpen, variant } = useSidebarChrome();

  return (
    <header
      className={cn(
        "flex h-13 w-full shrink-0 items-center gap-1 border-b px-2 md:gap-3 md:px-3",
        variant.rail,
        variant.border,
      )}
    >
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="flex size-8 items-center justify-center rounded-(--radius) text-gray-500 hover:bg-primary-25 hover:text-primary-main md:hidden"
      >
        <PanelLeft className="size-4" strokeWidth={1.5} />
      </button>

      <div className="min-w-0 flex-1">
        <SearchBox />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="More"
            className="flex size-8 items-center justify-center rounded-(--radius) text-gray-500 md:hidden"
          >
            <HamburgerMenu className="size-4 stroke-current" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] py-1.5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem key={action.label} className="group py-1.5">
                <Icon className="stroke-gray-500 group-hover:stroke-primary-hover" />
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden items-center md:flex">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-(--radius) text-gray-500 hover:bg-primary-25 hover:text-primary-main"
              key={action.label}
              aria-label={action.label}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
    </header>
  );
}
