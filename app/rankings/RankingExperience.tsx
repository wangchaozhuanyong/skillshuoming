"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { skills, type SkillEntry } from "../data/skills";
import { siteConfig } from "../data/site";

type RankingMode = "综合推荐" | "小白友好" | "官方来源" | "社区精选";

const modes: RankingMode[] = [
  "综合推荐",
  "小白友好",
  "官方来源",
  "社区精选",
];

const difficultyOrder = {
  小白可用: 0,
  需要基础配置: 1,
  适合进阶用户: 2,
};

function rank(items: SkillEntry[], mode: RankingMode) {
  const candidates = items.filter((skill) => {
    if (mode === "官方来源") return skill.sourceType === "OpenAI 官方";
    if (mode === "社区精选") return skill.sourceType === "社区精选";
    return true;
  });

  return candidates.sort((a, b) => {
    if (mode === "小白友好") {
      return (
        difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] ||
        a.chineseName.localeCompare(b.chineseName, "zh-CN")
      );
    }
    return (
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      Number(b.sourceType === "OpenAI 官方") -
        Number(a.sourceType === "OpenAI 官方") ||
      a.chineseName.localeCompare(b.chineseName, "zh-CN")
    );
  });
}

export function RankingExperience() {
  const [mode, setMode] = useState<RankingMode>("综合推荐");
  const rankedSkills = useMemo(() => rank(skills, mode), [mode]);
  const podium = rankedSkills.slice(0, 3);

  return (
    <>
      <div className="ranking-tabs" aria-label="选择榜单">
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            className={mode === item ? "active" : ""}
            aria-pressed={mode === item}
            onClick={() => setMode(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="ranking-mobile-note" role="status">
        当前显示 {rankedSkills.length} 个条目 · 链接检查{" "}
        {siteConfig.linkCheckedAt}
      </p>

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
            <b>
              查看怎么用
              <ChevronRight aria-hidden="true" size={17} />
            </b>
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
            <Link href={`/skills/${skill.slug}`}>
              查看
              <ChevronRight aria-hidden="true" size={17} />
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
