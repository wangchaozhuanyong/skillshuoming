import Link from "next/link";

const links = [
  { href: "/skills", label: "找 Skill" },
  { href: "/workbench", label: "AI 工作台" },
  { href: "/guide", label: "小白指南" },
  { href: "/#updates", label: "更新说明" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="技能开工站首页">
          <span className="brand-mark" aria-hidden="true">
            技
          </span>
          <span>
            <strong>技能开工站</strong>
            <small>Codex Skill 中文指南</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="service-link" href="/services">
            服务入口
          </Link>
          <Link className="button button-small" href="/skills">
            开始查找
          </Link>
        </div>

        <details className="mobile-menu">
          <summary aria-label="打开导航菜单">菜单</summary>
          <nav aria-label="移动端主导航">
            <Link href="/">首页</Link>
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/services">服务入口</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
