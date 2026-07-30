import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../components/PageHeader";
import { skills } from "../data/skills";
import { CategoryGrid } from "./CategoryGrid";

export const metadata: Metadata = {
  title: "Skill 工作分类",
  description:
    "按办公、内容、图片、视频、开发、数据、研究等工作目标查找 Codex Skill。",
};

export default function CategoriesPage() {
  const availableCategoryCount = new Set(
    skills.map((skill) => skill.category),
  ).size;

  return (
    <main id="main-content" className="catalog-page">
      <PageHeader
        eyebrow={`${availableCategoryCount} 个已有内容的工作方向`}
        title="按工作目标找 Skill，不按技术名词找"
        description="不知道属于哪个分类也没关系，可以进入全部 Skill，直接用中文描述需求。"
        meta={
          <>
            <span>分类按工作结果整理</span>
            <span>跨分类任务可直接搜索</span>
          </>
        }
      />

      <section className="section container">
        <CategoryGrid />

        <div className="natural-search-cta">
          <div>
            <p className="eyebrow">不知道属于哪个分类？</p>
            <h2>直接说：“把一篇文章做成 8 张小红书图片”</h2>
          </div>
          <Link href="/skills" className="button">
            用中文搜索
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
