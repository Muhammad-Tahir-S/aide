import { cn } from "@/shared/utils/cn";

import type { SidebarMode } from "./variants";

export function SidebarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4 shrink-0", className)}
      aria-hidden
    >
      <path
        d="M3.5 13.5C3.5 13.5 4.2 8.8 7.2 6.2C9.6 4.1 11.4 3.4 12.6 2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M12.6 2.6C13.5 2.2 14.2 2.9 13.9 3.8C13.6 4.7 12.5 5.1 11.8 4.4C11.1 3.7 11.6 2.9 12.6 2.6Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function SidebarModeGlyph({
  mode,
  className,
}: {
  mode: SidebarMode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 16"
      className={cn("size-4 shrink-0", className)}
      aria-hidden
    >
      <rect
        x="0.6"
        y="0.6"
        width="18.8"
        height="14.8"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      {mode === "expanded" ? (
        <rect
          x="2"
          y="2"
          width="7.2"
          height="12"
          rx="1"
          fill="currentColor"
          opacity="0.38"
        />
      ) : null}
      {mode === "collapsed" ? (
        <rect
          x="2"
          y="2"
          width="3.4"
          height="12"
          rx="0.8"
          fill="currentColor"
          opacity="0.38"
        />
      ) : null}
      {mode === "hover" ? (
        <>
          <rect
            x="2"
            y="2"
            width="3.4"
            height="12"
            rx="0.8"
            fill="currentColor"
            opacity="0.38"
          />
          <rect
            x="6.2"
            y="2"
            width="5.6"
            height="12"
            rx="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1.6 1.4"
            opacity="0.7"
          />
        </>
      ) : null}
    </svg>
  );
}
