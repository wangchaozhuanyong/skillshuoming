import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { libraryNavigation, primaryNavigation } from "../data/navigation";
import { siteConfig } from "../data/site";

const mobilePolicyLinks = [
  { href: "/privacy", label: "隐私政策" },
  { href: "/terms", label: "使用条款" },
];

function navigationItem(href: string) {
  const item = primaryNavigation.find((candidate) => candidate.href === href);
  if (!item) throw new Error(`Missing navigation item for ${href}`);
  return item;
}

export function SiteFooter() {
  const discoveryLinks = [
    navigationItem("/skills"),
    navigationItem("/categories"),
    navigationItem("/rankings"),
  ];
  const workLinks = [
    navigationItem("/workbench"),
    libraryNavigation,
    navigationItem("/guide"),
  ];
  const siteLinks = [navigationItem("/updates")];

  const mobileQuickLinks = [
    navigationItem("/"),
    navigationItem("/skills"),
    navigationItem("/categories"),
    navigationItem("/rankings"),
    libraryNavigation,
    navigationItem("/workbench"),
  ];

  const mobileServiceLinks = siteConfig.services.enabled
    ? [
        {
          href: siteConfig.services.apiUrl,
          label: "AI 接口中转",
          external: true,
        },
        {
          href: siteConfig.services.subscriptionUrl,
          label: "AI 订阅协助",
          external: true,
        },
      ]
    : [];

  return (
    <footer className="site-footer">
      <div className="footer-desktop">
        <div className="container footer-main">
          <div className="footer-brand-block">
            <div className="brand footer-brand">
              <span className="brand-mark" aria-hidden="true">
                S
              </span>
              <span className="brand-copy">
                <strong>技能开工站</strong>
                <small>CODEX SKILL 中文库</small>
              </span>
            </div>
            <p>
              帮中国 Codex 用户看懂 Skill、判断权限并开始工作。非 OpenAI
              官方产品，不对第三方 Skill 作绝对安全保证。
            </p>
          </div>

          <div className="footer-map" aria-label="页脚导航">
            <div>
              <strong>发现</strong>
              {discoveryLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <strong>工作</strong>
              {workLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <strong>站点</strong>
              {siteLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/privacy">隐私说明</Link>
              <Link href="/terms">使用条款</Link>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 技能开工站</span>
          <span>来源链接检查：{siteConfig.linkCheckedAt}</span>
          <a
            href="https://github.com/wangchaozhuanyong/skillshuoming"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 源码 ↗
          </a>
        </div>
      </div>

      <div className="container footer-mobile">
        <section className="footer-mobile-header">
          <Link href="/" aria-label="返回技能开工站首页">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span className="footer-brand-copy">
              <strong>技能开工站</strong>
              <small>Codex Skill 目录与任务匹配</small>
            </span>
          </Link>
          <p>只做内容说明与风险提示，不提供自动安装和账号代管。</p>
        </section>

        <section className="footer-mobile-section" aria-label="移动端页脚导航">
          <h2 className="footer-mobile-section-title">快捷导航</h2>
          <nav className="footer-mobile-grid">
            {mobileQuickLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        <section
          className="footer-mobile-section footer-mobile-policy-wrap"
          aria-label="移动端页脚服务与政策"
        >
          <h2 className="footer-mobile-section-title">服务与政策</h2>
          <nav className="footer-mobile-policy">
            {mobilePolicyLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {siteLinks.map((item) => (
              <Link key={`site-${item.href}`} href={item.href}>
                {item.label}
              </Link>
            ))}
            {mobileServiceLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label} <ExternalLink aria-hidden="true" size={12} />
              </a>
            ))}
            <a
              href="https://github.com/wangchaozhuanyong/skillshuoming"
              target="_blank"
              rel="noreferrer"
            >
              开源仓库 <ExternalLink aria-hidden="true" size={12} />
            </a>
            {siteConfig.services.enabled ? null : (
              <span className="footer-mobile-policy-note">服务暂未开放</span>
            )}
          </nav>
        </section>

        <div className="footer-mobile-legal">
          <span>© 2026 技能开工站</span>
          <span>来源链接检查：{siteConfig.linkCheckedAt}</span>
        </div>
      </div>
    </footer>
  );
}
