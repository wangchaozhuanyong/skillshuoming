"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { categories, skills } from "../data/skills";

const categoriesWithSkills = categories
  .map((category) => ({
    category,
    matches: skills.filter((skill) => skill.category === category.name),
  }))
  .filter((item) => item.matches.length > 0);

const plannedCategories = categories.filter(
  (category) =>
    !categoriesWithSkills.some((item) => item.category.name === category.name),
);

export function CategoryGrid() {
  const [openCategory, setOpenCategory] = useState<string | null>(
    categoriesWithSkills[0]?.category.name ?? null,
  );

  return (
    <>
      <div className="catalog-grid">
        {categoriesWithSkills.map(({ category, matches }, index) => {
          const isOpen = openCategory === category.name;

          return (
            <article
              className={`catalog-card ${isOpen ? "open" : ""}`}
              key={category.name}
            >
              <button
                type="button"
                className="catalog-card-summary"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenCategory(isOpen ? null : category.name)
                }
              >
                <span className="category-symbol" aria-hidden="true">
                  {category.symbol}
                </span>
                <span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{category.name}</strong>
                  <b>{matches.length} 个条目</b>
                </span>
                <ChevronDown
                  className="catalog-expand-icon"
                  aria-hidden="true"
                  size={19}
                />
              </button>

              <div className="catalog-card-content">
                <p>{category.short}</p>
                <div className="catalog-keywords" aria-label="代表任务">
                  {category.aliases.slice(0, 4).map((alias) => (
                    <span key={alias}>{alias}</span>
                  ))}
                </div>
                <p className="catalog-examples">
                  代表 Skill：
                  {matches
                    .slice(0, 2)
                    .map((skill) => skill.chineseName)
                    .join("、")}
                </p>
                <Link
                  href={`/skills?category=${encodeURIComponent(category.name)}`}
                >
                  查看这个分类
                  <ChevronRight aria-hidden="true" size={17} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {plannedCategories.length ? (
        <section className="planned-categories" aria-labelledby="planned-title">
          <div>
            <span>准备收录</span>
            <h2 id="planned-title">这些方向将在内容核验后开放</h2>
          </div>
          <ul>
            {plannedCategories.map((category) => (
              <li key={category.name}>{category.name}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
