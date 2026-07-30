"use client";

import {
  Bell,
  Bookmark,
  BookOpenText,
  Boxes,
  Compass,
  ExternalLink,
  Home,
  Menu,
  Sparkles,
  SunMoon,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../data/site";

const links = [
  { href: "/", label: "首页" },
  { href: "/skills", label: "全部 Skill" },
  { href: "/categories", label: "分类" },
  { href: "/rankings", label: "推荐榜" },
  { href: "/updates", label: "更新记录" },
  { href: "/workbench", label: "AI 工作台" },
  { href: "/guide", label: "小白教程" },
];

const mobileLinks = [
  { href: "/", label: "首页", icon: Home },
  { href: "/skills", label: "Skill", icon: Compass },
  { href: "/workbench", label: "工作台", icon: Sparkles },
  { href: "/library", label: "我的", icon: Bookmark },
];

const mobileMenuLinks = [
  { href: "/categories", label: "工作分类", icon: Boxes },
  { href: "/rankings", label: "推荐榜", icon: Trophy },
  { href: "/updates", label: "更新记录", icon: Bell },
  { href: "/guide", label: "小白教程", icon: BookOpenText },
];

function matchesPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [menuOpen]);

  function toggleTheme() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("skill-start-theme", next);
  }

  return (
    <>
      <div className="site-notice">
        <div className="container site-notice-inner">
          <span>非 OpenAI 官方产品</span>
          <p>中文说明 · 来源链接核验 · 权限提示 · 无需注册</p>
          <Link href="/updates">
            查看 {siteConfig.contentUpdatedAt} 更新记录 →
          </Link>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="技能开工站首页">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span className="brand-copy">
              <strong>技能开工站</strong>
              <small>CODEX SKILL 中文库</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="主导航">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={matchesPath(pathname, link.href) ? "active" : ""}
                aria-current={
                  matchesPath(pathname, link.href) ? "page" : undefined
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link
              className={`header-library-link ${
                matchesPath(pathname, "/library") ? "active" : ""
              }`}
              href="/library"
              aria-current={
                matchesPath(pathname, "/library") ? "page" : undefined
              }
            >
              <Bookmark aria-hidden="true" size={17} strokeWidth={2} />
              <span>我的清单</span>
            </Link>
            {siteConfig.services.enabled ? (
              <>
                <a
                  className="service-link"
                  href={siteConfig.services.apiUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  AI 接口中转
                </a>
                <a
                  className="service-link"
                  href={siteConfig.services.subscriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  AI 订阅协助
                </a>
              </>
            ) : null}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="切换浅色或深色模式"
            >
              <SunMoon aria-hidden="true" size={18} strokeWidth={2} />
            </button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? (
              <X aria-hidden="true" size={21} strokeWidth={2.2} />
            ) : (
              <Menu aria-hidden="true" size={21} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`mobile-drawer-backdrop ${menuOpen ? "open" : ""}`}
        aria-label="关闭导航菜单"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />

      <div
        ref={drawerRef}
        id="mobile-navigation-drawer"
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="网站菜单"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <div className="mobile-drawer-heading">
          <div>
            <span>网站菜单</span>
            <strong>继续探索技能开工站</strong>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="关闭导航菜单"
            onClick={() => setMenuOpen(false)}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <nav aria-label="移动端次级导航">
          {mobileMenuLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={matchesPath(pathname, link.href) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                <span>{link.label}</span>
                <ExternalLink
                  className="mobile-menu-arrow"
                  aria-hidden="true"
                  size={15}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mobile-service-links">
          <p>{siteConfig.services.enabled ? "第三方服务" : "显示设置"}</p>
          {siteConfig.services.enabled ? (
            <>
              <a
                href={siteConfig.services.apiUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                AI 接口中转
                <ExternalLink aria-hidden="true" size={15} />
              </a>
              <a
                href={siteConfig.services.subscriptionUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                AI 订阅协助
                <ExternalLink aria-hidden="true" size={15} />
              </a>
            </>
          ) : null}
          <button type="button" onClick={toggleTheme}>
            <SunMoon aria-hidden="true" size={17} />
            切换浅色 / 深色模式
          </button>
        </div>

        <p className="mobile-drawer-note">
          非 OpenAI 官方产品 · 收藏与任务草稿仅保存在本机
        </p>
      </div>

      <nav className="mobile-bottom-nav" aria-label="移动端快捷导航">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={matchesPath(pathname, link.href) ? "active" : ""}
              aria-current={matchesPath(pathname, link.href) ? "page" : undefined}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={2} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
