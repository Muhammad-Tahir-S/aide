import { ChevronDown, X } from "lucide-react";
import type { ReactNode } from "react";

import AvatarIcon from "@/shared/assets/images/avatar.png";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/design-system";
import { cn } from "@/shared/lib/utils";

import { useSidebarChrome } from "./chrome";
import { SidebarMark, SidebarModeGlyph } from "./marks";
import { COLLAPSED_WIDTH, MODE_LABEL, SIDEBAR_MODES } from "./variants";

const user = {
  name: "MT Sanuth",
  email: "mtsanuth@xyz.com",
  avatar: "",
};

const profileMenu = [
  { title: "View profile" },
  { title: "Invite members" },
  { title: "Log out" },
];

export function RailSlot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: COLLAPSED_WIDTH }}
    >
      {children}
    </div>
  );
}

export function SidebarBrand() {
  const { variant, isMobile, setMobileOpen } = useSidebarChrome();

  return (
    <div
      className={cn("flex h-13 shrink-0 items-center border-b", variant.border)}
    >
      <RailSlot>
        <SidebarMark className={variant.mark} />
      </RailSlot>
      <span
        className={cn(
          "sidebar-rail-fade min-w-0 flex-1 truncate tracking-(--heading-tracking)",
          variant.logo,
        )}
      >
        App Logo
      </span>
      {isMobile ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-(--radius) text-gray-500 hover:bg-primary-25 hover:text-primary-main"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  );
}

export function SidebarProfile() {
  const { mode, variant, setMenusOpen, isMobile } = useSidebarChrome();
  const expanded = isMobile || mode === "expanded";

  return (
    <DropdownMenu modal={false} onOpenChange={setMenusOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-none text-left outline-none",
            variant.profile,
          )}
        >
          <RailSlot>
            <Avatar className="size-7 rounded-(--radius)">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-(--radius)">
                <img
                  src={AvatarIcon}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </AvatarFallback>
            </Avatar>
          </RailSlot>
          <span className="sidebar-rail-fade min-w-0 flex-1 overflow-hidden">
            <span className="block truncate text-[12px] font-medium text-gray-700">
              {user.name}
            </span>
            <span className="block truncate text-[11px] text-gray-500">
              {user.email}
            </span>
          </span>
          <ChevronDown
            className="sidebar-rail-fade mr-2 size-3.5 shrink-0 text-gray-400"
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={expanded ? "top" : "right"}
        align={expanded ? "start" : "end"}
        sideOffset={expanded ? 8 : 4}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className={cn("w-52 py-1.5", variant.menu)}
      >
        {profileMenu.map((item) => (
          <DropdownMenuItem
            key={item.title}
            className={cn("py-1.5 text-[13px]", variant.menuItem)}
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SidebarControl() {
  const { mode, setMode, variant, setMenusOpen } = useSidebarChrome();
  const expanded = mode === "expanded";

  return (
    <DropdownMenu modal={false} onOpenChange={setMenusOpen}>
      <RailSlot className="h-8">
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Sidebar control"
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-(--radius) outline-none",
              variant.control,
            )}
          >
            <SidebarModeGlyph mode={mode} className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
      </RailSlot>
      <DropdownMenuContent
        side={expanded ? "top" : "right"}
        align={expanded ? "start" : "end"}
        sideOffset={expanded ? 8 : 4}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className={cn("w-44 gap-0 px-1.5 py-2", variant.menu)}
      >
        <p className="font-serif flex min-h-10 items-center px-2 text-[16px] leading-none text-gray-800">
          Sidebar control
        </p>
        <div
          className={cn(
            "mt-0.5 flex flex-col gap-0.5 border-t pt-1.5",
            variant.border,
          )}
        >
          {SIDEBAR_MODES.map((option) => {
            const selected = mode === option;
            return (
              <DropdownMenuItem
                key={option}
                onSelect={() => setMode(option)}
                className={cn(
                  "rounded-(--radius) px-2 py-1.5 text-[12px] font-normal",
                  variant.menuItem,
                  selected ? variant.menuItemActive : "",
                )}
              >
                {MODE_LABEL[option]}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
