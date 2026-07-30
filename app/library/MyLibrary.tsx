"use client";

import {
  Bookmark,
  ChevronRight,
  Clock3,
  Compass,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { skills } from "../data/skills";

type LibraryTab = "favorites" | "recent";

const tabs = [
  { id: "favorites" as const, label: "已收藏", icon: Bookmark },
  { id: "recent" as const, label: "最近查看", icon: Clock3 },
];

const storageKeys: Record<LibraryTab, string> = {
  favorites: "skill-start-favorites",
  recent: "skill-start-recent",
};

const emptyCopy: Record<
  LibraryTab,
  { title: string; copy: string; action: string }
> = {
  favorites: {
    title: "还没有收藏 Skill",
    copy: "在目录或详情页点击收藏，稍后就能从这里快速找到。",
    action: "去发现 Skill",
  },
  recent: {
    title: "还没有浏览记录",
    copy: "你打开过的 Skill 会保存在当前浏览器，最多显示最近 12 个。",
    action: "浏览推荐 Skill",
  },
};

function readSlugs(key: string) {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function MyLibrary() {
  const [activeTab, setActiveTab] = useState<LibraryTab>("favorites");
  const [collections, setCollections] = useState<Record<LibraryTab, string[]>>({
    favorites: [],
    recent: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollections({
        favorites: readSlugs(storageKeys.favorites),
        recent: readSlugs(storageKeys.recent),
      });
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleSkills = useMemo(() => {
    const slugs = collections[activeTab];
    return slugs
      .map((slug) => skills.find((skill) => skill.slug === slug))
      .filter(Boolean);
  }, [activeTab, collections]);

  function removeItem(slug: string) {
    setCollections((current) => {
      const next = {
        ...current,
        [activeTab]: current[activeTab].filter((item) => item !== slug),
      };
      window.localStorage.setItem(
        storageKeys[activeTab],
        JSON.stringify(next[activeTab]),
      );
      return next;
    });
  }

  return (
    <div className="library-experience">
      <nav className="library-tabs" aria-label="我的 Skill 分类">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "active" : ""}
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{tab.label}</span>
              <b>{collections[tab.id].length}</b>
            </button>
          );
        })}
      </nav>

      {!ready ? (
        <div className="library-loading" aria-live="polite">
          <span />
          <span />
          <span />
        </div>
      ) : visibleSkills.length ? (
        <div className="library-grid">
          {visibleSkills.map((skill) =>
            skill ? (
              <article className="library-card" key={skill.slug}>
                <span className="skill-logo" aria-hidden="true">
                  {skill.chineseName.slice(0, 1)}
                </span>
                <div>
                  <small>{skill.category}</small>
                  <h2>{skill.chineseName}</h2>
                  <p>{skill.summary}</p>
                </div>
                <div className="library-actions">
                  <Link href={`/skills/${skill.slug}`}>
                    查看说明
                    <ChevronRight aria-hidden="true" size={17} />
                  </Link>
                  <button
                    type="button"
                    aria-label={`从${tabs.find((tab) => tab.id === activeTab)?.label}中移除 ${skill.chineseName}`}
                    onClick={() => removeItem(skill.slug)}
                  >
                    <Trash2 aria-hidden="true" size={16} />
                    移除
                  </button>
                </div>
              </article>
            ) : null,
          )}
        </div>
      ) : (
        <div className="library-empty">
          <Compass aria-hidden="true" size={28} />
          <h2>{emptyCopy[activeTab].title}</h2>
          <p>{emptyCopy[activeTab].copy}</p>
          <Link
            href="/skills"
            className="button"
          >
            {emptyCopy[activeTab].action}
            <ChevronRight aria-hidden="true" size={17} />
          </Link>
        </div>
      )}
    </div>
  );
}
