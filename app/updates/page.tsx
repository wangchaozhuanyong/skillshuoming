import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "../components/PageHeader";
import { skills } from "../data/skills";
import { siteConfig } from "../data/site";

export const metadata: Metadata = {
  title: "Skill 更新记录",
  description:
    "查看技能开工站的 Skill 收录、来源链接、安装说明和权限提示更新。",
};

const changes = [
  {
    date: siteConfig.contentUpdatedAt,
    label: "来源修正",
    title: "移除已失效的 Google Slides 条目",
    copy: "原公开地址已返回 404。没有可核验的新来源前，不继续展示或推荐该条目。",
    level: "safety",
  },
  {
    date: siteConfig.contentUpdatedAt,
    label: "首发上线",
    title: `首批 ${skills.length} 个 Skill 完成公开来源链接核验`,
    copy: "覆盖办公、内容、图片、网站、数据、自动化、开发和 Skill 工具。每个条目均展示用途、来源、权限与使用边界。",
    level: "new",
  },
  {
    date: siteConfig.contentUpdatedAt,
    label: "安装说明",
    title: "安装路径更新为当前 Codex 官方规则",
    copy: "项目级使用 .agents/skills，个人级使用 $HOME/.agents/skills；旧的 .codex/skills 路径不再作为默认推荐。",
    level: "verified",
  },
  {
    date: siteConfig.contentUpdatedAt,
    label: "可信边界",
    title: "移除虚构 Star、安装量和质量分",
    copy: "来源存在不代表安全认证。所有涉及脚本、联网、密钥和文件覆盖的项目都会单独提示。",
    level: "safety",
  },
  {
    date: siteConfig.contentUpdatedAt,
    label: "交互优化",
    title: "移动端页脚去广告化、导航统一化",
    copy: "移动端页脚改为信息导航型，顶部/侧边导航与桌面主导航口径统一，减少无关视觉噪点。",
    level: "verified",
  },
];

export default function UpdatesPage() {
  const now = siteConfig.contentUpdatedAt;

  return (
    <main id="main-content" className="updates-page">
      <PageHeader
        eyebrow="更新记录"
        title="来源、安装和权限哪里变了"
        description="只记录会影响普通用户选择和使用的变化，不堆叠无关的 Git 提交。"
        meta={
          <>
            <span>内容更新 {siteConfig.contentUpdatedAt}</span>
            <span>{skills.length} 条已核验来源</span>
          </>
        }
      />

      <section className="section container updates-layout">
        <div className="update-timeline">
          {changes.map((change) => (
            <article key={change.title} className={`update-item ${change.level}`}>
              <div className="update-date">
                <span>{change.date ?? now}</span>
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
