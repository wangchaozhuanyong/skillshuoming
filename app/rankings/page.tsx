import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";
import { RankingExperience } from "./RankingExperience";

export const metadata: Metadata = {
  title: "Skill 编辑推荐",
  description:
    "按来源透明度、小白友好度和用途清晰度查看 Codex Skill 综合推荐。",
};

export default function RankingsPage() {
  return (
    <main id="main-content" className="ranking-page">
      <PageHeader
        eyebrow="编辑推荐 · 不是热度排名"
        title="推荐不等于适合所有人"
        description="当前没有真实安装量或站内热度数据；顺序只参考来源透明度、用途清晰度和小白友好度。"
        meta={
          <>
            <span>来源可核验</span>
            <span>用途与输出清楚</span>
            <span>权限边界透明</span>
          </>
        }
      />

      <section className="section container">
        <RankingExperience />
      </section>
    </main>
  );
}
