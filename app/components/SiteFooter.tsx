import {
  ChevronRight,
  Clock3,
  CreditCard,
  ExternalLink,
  FileText,
  GraduationCap,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  footerUtilityNavigation,
  libraryNavigation,
  primaryNavigation,
} from "../data/navigation";
import { siteConfig } from "../data/site";

const mobilePolicyLinks = [
  { href: "/privacy", label: "隐私政策", icon: ShieldCheck },
  { href: "/terms", label: "使用条款", icon: FileText },
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
          <section className="footer-mobile-cta" aria-labelledby="footer-cta-title">
            <div className="footer-mobile-cta-heading">
              <span className="footer-cta-icon" aria-hidden="true">
                <Target size={23} strokeWidth={2.1} />
              </span>
              <div>
                <h2 id="footer-cta-title">还没找到合适的 Skill？</h2>
                <p>说出任务，快速找到能用的 Skill</p>
              </div>
            </div>
            <Link className="footer-search-action" href="/skills">
              <Search aria-hidden="true" size={21} strokeWidth={2.2} />
              立即搜索 Skill
            </Link>
            <Link className="footer-task-action" href="/workbench">
              <Sparkles aria-hidden="true" size={18} strokeWidth={2} />
              生成 Codex 任务单
              <ChevronRight aria-hidden="true" size={17} />
            </Link>
          </section>

          <Link
            className="footer-mobile-brand"
            href="/"
            aria-label="返回技能开工站首页"
          >
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span>
              <strong>技能开工站</strong>
              <small>第三方中文指南，不代表 OpenAI 官方产品</small>
            </span>
            <ChevronRight aria-hidden="true" size={19} />
          </Link>

          <nav className="footer-mobile-links" aria-label="移动端辅助导航">
            {footerUtilityNavigation.map((item) => {
              const Icon = item.href === "/guide" ? GraduationCap : Clock3;
              return (
                <Link key={item.href} href={item.href}>
                  <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
                  <span>{item.label}</span>
                  <ChevronRight aria-hidden="true" size={16} />
                </Link>
              );
            })}
          </nav>

          <div className="footer-mobile-services">
            <p>{siteConfig.services.enabled ? "服务与政策" : "站点政策"}</p>
            <nav aria-label="移动端服务与政策">
              {siteConfig.services.enabled ? (
                <>
                  <a
                    href={siteConfig.services.apiUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Share2 aria-hidden="true" size={19} strokeWidth={1.8} />
                    <span>AI 接口中转</span>
                  </a>
                  <a
                    href={siteConfig.services.subscriptionUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CreditCard
                      aria-hidden="true"
                      size={19}
                      strokeWidth={1.8}
                    />
                    <span>AI 订阅协助</span>
                  </a>
                </>
              ) : null}
              {mobilePolicyLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="footer-mobile-legal">
            <span>© 2026 技能开工站</span>
            <span>链接检查 {siteConfig.linkCheckedAt}</span>
            <a
              href="https://github.com/wangchaozhuanyong/skillshuoming"
              target="_blank"
              rel="noreferrer"
            >
              GitHub 源地址
              <ExternalLink aria-hidden="true" size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
