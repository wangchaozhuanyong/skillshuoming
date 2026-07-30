import type { Metadata } from "next";
import { RankingExperience } from "./RankingExperience";

export const metadata: Metadata = {
  title: "Skill 编辑推荐",
  description:
    "按来源透明度、小白友好度和用途清晰度查看 Codex Skill 综合推荐。",
};

export default function RankingsPage() {
  return (
    <main id="main-content" className="ranking-page">
      <section className="page-hero ranking-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">编辑推荐 · 不是热度排名</p>
            <h1>推荐不等于适合所有人，先看是否符合你的任务</h1>
            <p>
              当前没有真实安装量或站内热度数据。推荐顺序只依据来源透明度、用途清晰度与小白友好度。
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
        <RankingExperience />
      </section>
    </main>
  );
}
