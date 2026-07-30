import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  footerUtilityNavigation,
  libraryNavigation,
  primaryNavigation,
} from "../data/navigation";
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
        <div className="footer-mobile-panel">
          <section className="footer-mobile-summary">
            <Link href="/" aria-label="返回技能开工站首页">
              <span className="brand-mark" aria-hidden="true">
                S
              </span>
              <span>
                <strong>技能开工站</strong>
                <small>Codex Skill 中文说明与任务匹配</small>
              </span>
            </Link>
            <p>
              第三方中文指南，不代表 OpenAI 官方产品；公开来源存在不等于安全认证。
            </p>
          </section>

          <nav className="footer-mobile-index" aria-label="移动端页脚导航">
            {footerUtilityNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {mobilePolicyLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {siteConfig.services.enabled ? (
              <>
                <a
                  href={siteConfig.services.apiUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  AI 接口服务
                </a>
                <a
                  href={siteConfig.services.subscriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  AI 订阅服务
                </a>
              </>
            ) : null}
          </nav>

          <div className="footer-mobile-legal">
            <span>© 2026 技能开工站</span>
            <span>链接核验 {siteConfig.linkCheckedAt}</span>
            <a
              href="https://github.com/wangchaozhuanyong/skillshuoming"
              target="_blank"
              rel="noreferrer"
            >
              项目源码
              <ExternalLink aria-hidden="true" size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
