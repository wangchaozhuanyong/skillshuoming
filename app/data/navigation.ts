export type NavigationIcon =
  | "home"
  | "skills"
  | "categories"
  | "rankings"
  | "updates"
  | "workbench"
  | "guide"
  | "library";

export type NavigationArea = "home" | "discover" | "workbench" | "library";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/skills", label: "全部 Skill", icon: "skills" },
  { href: "/categories", label: "分类", icon: "categories" },
  { href: "/rankings", label: "推荐榜", icon: "rankings" },
  { href: "/updates", label: "更新记录", icon: "updates" },
  { href: "/workbench", label: "AI 工作台", icon: "workbench" },
  { href: "/guide", label: "小白教程", icon: "guide" },
];

export const libraryNavigation: NavigationItem = {
  href: "/library",
  label: "我的清单",
  icon: "library",
};

export const mobileBottomNavigation: Array<
  NavigationItem & { area: NavigationArea }
> = [
  { href: "/", label: "首页", icon: "home", area: "home" },
  { href: "/skills", label: "发现", icon: "skills", area: "discover" },
  {
    href: "/workbench",
    label: "工作台",
    icon: "workbench",
    area: "workbench",
  },
  { href: "/library", label: "我的", icon: "library", area: "library" },
];

export const mobileDrawerNavigation = [
  ...primaryNavigation,
  libraryNavigation,
];

export const footerUtilityNavigation = primaryNavigation.filter((item) =>
  ["/guide", "/updates"].includes(item.href),
);

const discoverPrefixes = [
  "/skills",
  "/categories",
  "/rankings",
  "/updates",
  "/guide",
];

export function matchesPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function matchesNavigationArea(
  pathname: string,
  area: NavigationArea,
) {
  if (area === "home") return pathname === "/";
  if (area === "workbench") return matchesPath(pathname, "/workbench");
  if (area === "library") return matchesPath(pathname, "/library");

  return discoverPrefixes.some((prefix) => matchesPath(pathname, prefix));
}

