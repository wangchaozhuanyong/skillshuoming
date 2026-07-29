import type { Metadata } from "next";
import Link from "next/link";
import { categories, skills } from "../data/skills";

export const metadata: Metadata = {
  title: "Skill 工作分类",
  description:
    "按办公、内容、图片、视频、开发、数据、研究等工作目标查找 Codex Skill。",
};

export default function CategoriesPage() {
  return (
    <main id="main-content" className="catalog-page">
      <section className="page-hero page-hero-compact">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">12 个工作方向</p>
            <h1>按工作目标找 Skill，不按技术名词找</h1>
            <p>
              不知道任务属于哪个分类也没关系。进入全部 Skill 后，直接用中文描述需求。
            </p>
          </div>
          <aside className="page-hero-note">
            <span>分类原则</span>
            <strong>结果优先，而不是工具优先</strong>
            <p>例如“做销售汇报”会同时涉及表格、PPT 和任务单。</p>
          </aside>
        </div>
      </section>

      <section className="section container">
        <div className="catalog-grid">
          {categories.map((category, index) => {
            const matches = skills.filter(
              (skill) => skill.category === category.name,
            );
            return (
              <article className="catalog-card" key={category.name}>
                <div className="catalog-card-top">
                  <span className="category-symbol" aria-hidden="true">
                    {category.symbol}
                  </span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>
                <h2>{category.name}</h2>
                <p>{category.short}</p>
                <div className="catalog-keywords">
                  {category.aliases.slice(0, 4).map((alias) => (
                    <span key={alias}>{alias}</span>
                  ))}
                </div>
                <div className="catalog-card-bottom">
                  <strong>
                    {matches.length ? `${matches.length} 个已核验` : "等待首批收录"}
                  </strong>
                  <Link
                    href={`/skills?category=${encodeURIComponent(category.name)}`}
                  >
                    查看分类 →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="natural-search-cta">
          <div>
            <p className="eyebrow">不知道属于哪个分类？</p>
            <h2>直接说：“把一篇文章做成 8 张小红书图片”</h2>
          </div>
          <Link href="/skills" className="button">
            用中文搜索
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
