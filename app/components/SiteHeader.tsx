"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "首页" },
  { href: "/skills", label: "全部 Skill" },
  { href: "/categories", label: "分类" },
  { href: "/rankings", label: "热门榜" },
  { href: "/updates", label: "今日更新" },
  { href: "/workbench", label: "AI 工作台" },
  { href: "/guide", label: "小白教程" },
];

const mobileLinks = [
  { href: "/", label: "首页", symbol: "⌂" },
  { href: "/skills", label: "Skill", symbol: "技" },
  { href: "/workbench", label: "工作台", symbol: "台" },
  { href: "/library", label: "我的", symbol: "藏" },
];

function matchesPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <p>中文说明 · 来源核验 · 权限提示 · 无需注册</p>
          <Link href="/updates">查看 2026-07-29 首发更新 →</Link>
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
            <Link className="service-link" href="/services#api">
              AI 接口中转
            </Link>
            <Link className="service-link" href="/services#subscription">
              AI 订阅协助
            </Link>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="切换浅色或深色模式"
            >
              <span aria-hidden="true">◐</span>
            </button>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>

        <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
          <div className="container">
            <p>发现 Skill</p>
            <nav aria-label="移动端主导航">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={matchesPath(pathname, link.href) ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  <span>→</span>
                </Link>
              ))}
            </nav>
            <div className="mobile-service-links">
              <Link href="/services#api" onClick={() => setMenuOpen(false)}>
                AI 接口中转
              </Link>
              <Link
                href="/services#subscription"
                onClick={() => setMenuOpen(false)}
              >
                AI 订阅协助
              </Link>
              <button type="button" onClick={toggleTheme}>
                切换浅色 / 深色模式
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="mobile-bottom-nav" aria-label="移动端快捷导航">
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={matchesPath(pathname, link.href) ? "active" : ""}
          >
            <span aria-hidden="true">{link.symbol}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
