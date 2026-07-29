import type { Metadata } from "next";
import Link from "next/link";
import { skills } from "../data/skills";

export const metadata: Metadata = {
  title: "Skill 更新中心",
  description:
    "查看技能开工站的 Skill 收录、来源核验、安装说明和权限提示更新。",
};

const changes = [
  {
    date: "2026-07-29",
    label: "首发上线",
    title: `首批 ${skills.length} 个 Skill 完成公开来源核验`,
    copy: "覆盖办公、内容、图片、网站、数据、自动化、开发和 Skill 工具。每个条目均展示用途、来源、权限与使用边界。",
    level: "new",
  },
  {
    date: "2026-07-29",
    label: "安装说明",
    title: "安装路径更新为当前 Codex 官方规则",
    copy: "项目级使用 .agents/skills，个人级使用 $HOME/.agents/skills；旧的 .codex/skills 路径不再作为默认推荐。",
    level: "verified",
  },
  {
    date: "2026-07-29",
    label: "可信边界",
    title: "移除虚构 Star、安装量和质量分",
    copy: "来源存在不代表安全认证。所有涉及脚本、联网、密钥和文件覆盖的项目都会单独提示。",
    level: "safety",
  },
];

export default function UpdatesPage() {
  return (
    <main id="main-content" className="updates-page">
      <section className="page-hero page-hero-compact">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">UPDATE CENTER</p>
            <h1>更新讲人话：是否重装，权限是否变化</h1>
            <p>
              这里不堆 Git 提交记录，只展示会影响普通用户选择和使用的变化。
            </p>
          </div>
          <aside className="page-hero-note">
            <span>当前版本</span>
            <strong>首发 · 2026-07-29</strong>
            <p>{skills.length} 个来源已核验条目，无虚构安装数据。</p>
          </aside>
        </div>
      </section>

      <section className="section container updates-layout">
        <div className="update-timeline">
          {changes.map((change) => (
            <article key={change.title} className={`update-item ${change.level}`}>
              <div className="update-date">
                <span>{change.date}</span>
                <b>{change.label}</b>
              </div>
              <div>
                <h2>{change.title}</h2>
                <p>{change.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="updates-sidebar">
          <div>
            <span>更新判断</span>
            <h2>看到这些变化，需要特别留意</h2>
            <ul>
              <li>新增脚本或系统权限</li>
              <li>开始访问互联网或第三方 API</li>
              <li>新增密钥、Cookie 或账号要求</li>
              <li>安装路径和运行环境变化</li>
            </ul>
          </div>
          <Link href="/guide#safety" className="button button-outline">
            学会判断风险
          </Link>
        </aside>
      </section>
    </main>
  );
}
