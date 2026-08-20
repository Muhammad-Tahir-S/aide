import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Layers } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";

import {
  Dialog,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/design-system";
import { cn } from "@/shared/lib/utils";
import { SidebarAtmosphere } from "@/shared/theme/atmosphere";

import { useSidebarChrome } from "../sidebar/chrome";
import {
  RailSlot,
  SidebarBrand,
  SidebarControl,
  SidebarProfile,
} from "../sidebar/chrome-controls";
import type { SidebarChromeStyle } from "../sidebar/variants";

const INDICATOR_TRANSITION =
  "transition-transform duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const productNavItems = [
  { title: "Task Manager", url: "/tasks", kind: "tasks" as const },
  { title: "Notes Manager", url: "/notes", kind: "notes" as const },
];

const navItems = import.meta.env.DEV
  ? [
      ...productNavItems,
      {
        title: "Design system",
        url: "/design-system",
        kind: "design-system" as const,
      },
    ]
  : productNavItems;

function NavIcon({
  kind,
  variant,
  className,
}: {
  kind: (typeof navItems)[number]["kind"];
  variant: SidebarChromeStyle;
  className?: string;
}) {
  const Icon =
    kind === "tasks"
      ? variant.icon
      : kind === "notes"
        ? variant.notesIcon
        : Layers;
  return (
    <Icon strokeWidth={1.5} className={cn(variant.iconClass, className)} />
  );
}

function SidebarNavLink({
  item,
  allowTooltip,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  allowTooltip: boolean;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  const { variant } = useSidebarChrome();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const pointerInside = useRef(false);
  const isActive = pathname.startsWith(item.url);

  return (
    <Tooltip
      delayDuration={variant.tooltipDelay}
      disableHoverableContent
      open={allowTooltip ? tooltipOpen : false}
      onOpenChange={(open) => {
        if (!allowTooltip || (open && !pointerInside.current)) {
          setTooltipOpen(false);
          return;
        }
        setTooltipOpen(open);
      }}
    >
      <TooltipTrigger asChild>
        <NavLink
          to={item.url}
          onClick={onNavigate}
          onPointerEnter={() => {
            pointerInside.current = true;
          }}
          onPointerLeave={() => {
            pointerInside.current = false;
          }}
          aria-label={item.title}
          className={cn(
            "sidebar-nav-item relative z-1 flex h-8 w-full shrink-0 items-center overflow-hidden rounded-none",
            variant.item,
            isActive ? variant.itemActive : variant.itemHover,
          )}
        >
          <RailSlot>
            <NavIcon kind={item.kind} variant={variant} />
          </RailSlot>
          <span
            className={cn(
              "sidebar-rail-fade min-w-0 flex-1 truncate pr-3",
              variant.itemLabel,
            )}
          >
            {item.title}
          </span>
        </NavLink>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={4}
        align="center"
        hidden={!allowTooltip}
        hideArrow={!variant.tooltipArrow}
        arrowClassName={variant.tooltipArrowClass}
        className={variant.tooltip}
      >
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarNav({
  allowTooltip,
  onNavigate,
}: {
  allowTooltip: boolean;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({
    y: 0,
    height: 32,
    visible: false,
    ready: false,
  });

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) {
      setIndicator((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
      return;
    }

    const y = active.offsetTop;
    const height = active.offsetHeight;

    setIndicator((current) => {
      if (current.visible && current.y === y && current.height === height) {
        return current;
      }
      return { ...current, y, height, visible: true };
    });
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, pathname]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIndicator((current) =>
        current.ready ? current : { ...current, ready: true },
      );
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <nav className="flex flex-1 flex-col pt-3">
      <div ref={navRef} className="relative flex flex-col gap-2">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-0 bg-primary-main",
            indicator.ready && indicator.visible ? INDICATOR_TRANSITION : "",
            indicator.visible ? "opacity-100" : "opacity-0",
          )}
          style={{
            height: indicator.height,
            transform: `translateY(${indicator.y}px)`,
          }}
        />
        {navItems.map((item) => (
          <SidebarNavLink
            key={item.url}
            item={item}
            allowTooltip={allowTooltip}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

function SidebarBody({
  allowTooltip = false,
  onNavigate,
}: {
  allowTooltip?: boolean;
  onNavigate?: () => void;
}) {
  const { variant, isMobile } = useSidebarChrome();

  return (
    <div className="sidebar-rail-body relative z-10 flex h-full min-h-0 flex-col">
      <SidebarBrand />
      <SidebarNav allowTooltip={allowTooltip} onNavigate={onNavigate} />
      <div className="mt-auto flex flex-col">
        {!isMobile ? (
          <div className="pb-1.5">
            <SidebarControl />
          </div>
        ) : null}
        <div className={cn("border-t pt-1.5 pb-1.5", variant.border)}>
          <SidebarProfile />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { variant, isMobile, mobileOpen, setMobileOpen, mode, menusOpen } =
    useSidebarChrome();

  return (
    <>
      <div
        data-mode={mode}
        className={cn(
          "sidebar-spacer relative z-20 hidden h-full shrink-0 md:block",
        )}
      >
        <aside
          data-mode={mode}
          data-menus={menusOpen ? "open" : undefined}
          data-sidebar-mode={mode}
          className={cn(
            "sidebar-rail absolute inset-y-0 left-0 isolate flex flex-col overflow-hidden",
            variant.rail,
            "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-30 after:w-px after:bg-gray-200",
          )}
        >
          <SidebarAtmosphere />
          <SidebarBody allowTooltip={mode === "collapsed"} />
        </aside>
      </div>

      <Dialog open={isMobile && mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPortal>
          <DialogPrimitive.Content
            className={cn(
              "sidebar-screen relative isolate flex flex-col overflow-hidden outline-none",
              variant.rail,
            )}
          >
            <DialogTitle className="sr-only">Sidebar</DialogTitle>
            <DialogDescription className="sr-only">
              App navigation
            </DialogDescription>
            <SidebarAtmosphere />
            <SidebarBody onNavigate={() => setMobileOpen(false)} />
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
