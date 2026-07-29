import type { Metadata } from "next";
import Link from "next/link";
import { skills } from "../data/skills";

export const metadata: Metadata = {
  title: "Skill 综合推荐榜",
  description:
    "按来源透明度、小白友好度和用途清晰度查看 Codex Skill 综合推荐。",
};

const rankedSkills = [...skills].sort((a, b) => {
  const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  if (featured) return featured;
  const source =
    Number(b.sourceType === "OpenAI 官方") -
    Number(a.sourceType === "OpenAI 官方");
  if (source) return source;
  return a.chineseName.localeCompare(b.chineseName, "zh-CN");
});

export default function RankingsPage() {
  const podium = rankedSkills.slice(0, 3);

  return (
    <main id="main-content" className="ranking-page">
      <section className="page-hero ranking-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">综合推荐 · 不是 Star 排名</p>
            <h1>热门不等于最好，先看适不适合你</h1>
            <p>
              首发阶段没有足够本站行为数据，因此不展示虚构热度。当前顺序依据来源透明度、用途清晰度与小白友好度。
            </p>
          </div>
          <div className="ranking-rules">
            <span>当前排序依据</span>
            <ul>
              <li>是否为官方或可核验来源</li>
              <li>用途、输入和输出是否清楚</li>
              <li>安装条件与权限是否透明</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="ranking-tabs" aria-label="榜单说明">
          <span className="active">综合推荐</span>
          <span>小白友好</span>
          <span>官方来源</span>
          <span>最新核验</span>
        </div>

        <div className="podium-grid">
          {podium.map((skill, index) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className={`podium-card podium-${index + 1}`}
            >
              <span className="podium-number">0{index + 1}</span>
              <span className="skill-logo" aria-hidden="true">
                {skill.chineseName.slice(0, 1)}
              </span>
              <small>
                {skill.category} · {skill.sourceType}
              </small>
              <h2>{skill.chineseName}</h2>
              <p>{skill.summary}</p>
              <b>查看怎么用 →</b>
            </Link>
          ))}
        </div>

        <div className="ranking-list">
          <div className="ranking-list-head">
            <span>序号</span>
            <span>Skill</span>
            <span>适合谁</span>
            <span>判断标签</span>
            <span />
          </div>
          {rankedSkills.slice(3).map((skill, index) => (
            <article key={skill.slug}>
              <span>{String(index + 4).padStart(2, "0")}</span>
              <div>
                <strong>{skill.chineseName}</strong>
                <small>{skill.name}</small>
              </div>
              <p>{skill.audience}</p>
              <div className="skill-tags">
                <span>{skill.difficulty}</span>
                <span>{skill.risk}</span>
              </div>
              <Link href={`/skills/${skill.slug}`}>查看 →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
