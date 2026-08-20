export const SIDEBAR_MODES = ["expanded", "collapsed", "hover"] as const;

export type SidebarMode = (typeof SIDEBAR_MODES)[number];

export const COLLAPSED_WIDTH = 48;
export const EXPANDED_WIDTH = 216;

export type SidebarChromeStyle = {
  rail: string;
  border: string;
  logo: string;
  mark: string;
  item: string;
  itemHover: string;
  itemActive: string;
  itemLabel: string;
  iconClass: string;
  tooltip: string;
  tooltipArrow: boolean;
  tooltipArrowClass: string;
  tooltipDelay: number;
  control: string;
  menu: string;
  menuItem: string;
  menuItemActive: string;
  profile: string;
  overlayShadow: boolean;
};

export const SIDEBAR_CHROME: SidebarChromeStyle = {
  rail: "bg-primary-50",
  border: "border-gray-200",
  logo: "font-serif text-[15px] text-primary-main",
  mark: "text-primary-main",
  item: "rounded-none text-gray-700",
  itemHover:
    "hover:bg-primary-25 hover:text-primary-main active:bg-primary-25 active:text-primary-main",
  itemActive: "hover:bg-transparent active:bg-transparent",
  itemLabel: "text-[13px] font-medium",
  iconClass: "size-4",
  tooltip: "bg-gray-800 text-base-light border-0",
  tooltipArrow: true,
  tooltipArrowClass: "bg-gray-800 fill-gray-800",
  tooltipDelay: 180,
  control:
    "text-gray-500 hover:bg-primary-25 hover:text-primary-main active:bg-primary-25 active:text-primary-main",
  menu: "bg-base-light border-gray-200",
  menuItem:
    "hover:bg-primary-25 hover:text-primary-main active:bg-primary-25 active:text-primary-main",
  menuItemActive: "bg-primary-25 text-primary-main",
  profile: "hover:bg-primary-25 active:bg-primary-25",
  overlayShadow: true,
};

export const MODE_LABEL: Record<SidebarMode, string> = {
  expanded: "Expanded",
  collapsed: "Collapsed",
  hover: "Expand on hover",
};

export function isSidebarMode(value: unknown): value is SidebarMode {
  return SIDEBAR_MODES.includes(value as SidebarMode);
}
