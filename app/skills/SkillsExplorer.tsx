"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildSearchText,
  categories,
  skills,
  type SkillEntry,
  type SkillSourceType,
} from "../data/skills";

type SortMode = "推荐优先" | "小白优先" | "来源优先";

type SkillsExplorerProps = {
  initialQuery: string;
  initialCategory: string;
};

const searchStopWords = new Set([
  "帮我",
  "请帮",
  "一个",
  "一份",
  "我的",
  "一下",
]);

function matchesSearch(skill: SkillEntry, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const searchText = buildSearchText(skill);
  if (searchText.includes(normalized)) return true;

  const keywords = [
    skill.chineseName,
    skill.name,
    skill.category,
    ...skill.tags,
    ...skill.aliases,
  ]
    .map((item) => item.toLowerCase())
    .filter((item) => item.length >= 2);

  if (keywords.some((keyword) => normalized.includes(keyword))) return true;

  const tokens = normalized
    .split(/[\s，。！？、；：,.!?;:]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && !searchStopWords.has(item));

  return tokens.length > 0 && tokens.every((token) => searchText.includes(token));
}

function readFavorites() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const saved = window.localStorage.getItem("skill-start-favorites");
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

function sortSkills(items: SkillEntry[], mode: SortMode) {
  return [...items].sort((a, b) => {
    if (mode === "小白优先") {
      const order = {
        小白可用: 0,
        需要基础配置: 1,
        适合进阶用户: 2,
      };
      return order[a.difficulty] - order[b.difficulty];
    }
    if (mode === "来源优先") {
      return a.sourceType === b.sourceType
        ? a.chineseName.localeCompare(b.chineseName, "zh-CN")
        : a.sourceType === "OpenAI 官方"
          ? -1
          : 1;
    }
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

export function SkillsExplorer({
  initialQuery,
  initialCategory,
}: SkillsExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [source, setSource] = useState<SkillSourceType | "全部来源">("全部来源");
  const [easyOnly, setEasyOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("推荐优先");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFavorites(readFavorites());
      setFavoritesReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const results = useMemo(() => {
    const filtered = skills.filter((skill) => {
      const matchesQuery = matchesSearch(skill, query);
      const matchesCategory = !category || skill.category === category;
      const matchesSource = source === "全部来源" || skill.sourceType === source;
      const matchesEasy = !easyOnly || skill.difficulty === "小白可用";
      return matchesQuery && matchesCategory && matchesSource && matchesEasy;
    });
    return sortSkills(filtered, sortMode);
  }, [category, easyOnly, query, sortMode, source]);

  function toggleFavorite(slug: string) {
    setFavorites((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      window.localStorage.setItem(
        "skill-start-favorites",
        JSON.stringify(next),
      );
      return next;
    });
  }

  function resetFilters() {
    setQuery("");
    setCategory("");
    setSource("全部来源");
    setEasyOnly(false);
  }

  return (
    <main id="main-content" className="skills-page">
      <section className="directory-hero">
        <div className="container directory-hero-layout">
          <div>
            <p className="eyebrow">Skill 中文目录</p>
            <h1>用工作目标来搜，不用记英文名</h1>
            <p>
              当前首发条目来自 OpenAI 官方插件仓库和已核验的公开社区仓库。本站不展示虚构安装量。
            </p>
          </div>
          <div className="directory-facts">
            <span>
              <strong>{skills.length}</strong>
              首发条目
            </span>
            <span>
              <strong>{categories.length}</strong>
              工作分类
            </span>
            <span>
              <strong>0</strong>
              虚构热度
            </span>
          </div>
        </div>
      </section>

      <section className="container explorer-shell">
        <aside className="filters-panel" aria-label="Skill 筛选">
          <div className="filter-heading">
            <strong>筛选</strong>
            <button type="button" onClick={resetFilters}>
              清空
            </button>
          </div>

          <fieldset>
            <legend>工作分类</legend>
            <button
              type="button"
              className={!category ? "selected" : ""}
              onClick={() => setCategory("")}
            >
              全部分类 <span>{skills.length}</span>
            </button>
            {categories.map((item) => {
              const count = skills.filter(
                (skill) => skill.category === item.name,
              ).length;
              return (
                <button
                  key={item.name}
                  type="button"
                  className={category === item.name ? "selected" : ""}
                  onClick={() => setCategory(item.name)}
                >
                  {item.name} <span>{count}</span>
                </button>
              );
            })}
          </fieldset>

          <fieldset>
            <legend>来源</legend>
            {(["全部来源", "OpenAI 官方", "社区精选"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={source === item ? "selected" : ""}
                onClick={() => setSource(item)}
              >
                {item}
              </button>
            ))}
          </fieldset>

          <label className="check-row">
            <input
              type="checkbox"
              checked={easyOnly}
              onChange={(event) => setEasyOnly(event.target.checked)}
            />
            <span>
              <strong>只看小白可用</strong>
              <small>无需复杂环境配置</small>
            </span>
          </label>

          <div className="filter-note">
            <strong>这里的“来源已核验”是什么意思？</strong>
            <p>表示公开仓库和路径存在，不代表脚本通过完整安全审计。</p>
          </div>
        </aside>

        <div className="results-panel">
          <div className="results-toolbar">
            <label className="directory-search">
              <span>搜索</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例如：做 PPT、分析 Excel、检查网站"
              />
            </label>
            <label className="sort-select">
              <span>排序</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                <option>推荐优先</option>
                <option>小白优先</option>
                <option>来源优先</option>
              </select>
            </label>
          </div>

          <div className="results-summary">
            <p>
              找到 <strong>{results.length}</strong> 个结果
              {query ? (
                <>
                  ，搜索“<b>{query}</b>”
                </>
              ) : null}
            </p>
            {favoritesReady ? <span>本机收藏 {favorites.length} 个</span> : null}
          </div>

          {results.length ? (
            <div className="skill-card-list">
              {results.map((skill) => {
                const favorite = favorites.includes(skill.slug);
                return (
                  <article className="skill-card" key={skill.slug}>
                    <div className="skill-card-top">
                      <span className="skill-initial" aria-hidden="true">
                        {skill.chineseName.slice(0, 1)}
                      </span>
                      <div>
                        <p className="skill-kicker">
                          {skill.category} · {skill.kind}
                        </p>
                        <h2>
                          <Link href={`/skills/${skill.slug}`}>
                            {skill.chineseName}
                          </Link>
                        </h2>
                        <small>{skill.name}</small>
                      </div>
                      <button
                        type="button"
                        className={`favorite-button ${favorite ? "active" : ""}`}
                        aria-label={
                          favorite
                            ? `取消收藏 ${skill.chineseName}`
                            : `收藏 ${skill.chineseName}`
                        }
                        aria-pressed={favorite}
                        onClick={() => toggleFavorite(skill.slug)}
                      >
                        {favorite ? "已收藏" : "收藏"}
                      </button>
                    </div>

                    <p className="skill-summary">{skill.summary}</p>

                    <div className="skill-tags">
                      <span>{skill.difficulty}</span>
                      <span>{skill.risk}</span>
                      {skill.tags.slice(0, 2).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <div className="skill-card-bottom">
                      <p>
                        <span>来源</span>
                        <strong>{skill.sourceType}</strong>
                        <small>{skill.repository}</small>
                      </p>
                      <p>
                        <span>最终输出</span>
                        <strong>{skill.output}</strong>
                      </p>
                      <Link
                        className="button button-small button-outline"
                        href={`/skills/${skill.slug}`}
                      >
                        查看怎么用
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">?</span>
              <h2>暂时没找到完全匹配的 Skill</h2>
              <p>
                换成工作目标试试，例如“做销售 PPT”“整理会议纪要”或“给文章配图”。
              </p>
              <button type="button" className="button" onClick={resetFilters}>
                清空筛选
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
