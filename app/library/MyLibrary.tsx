"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { skills } from "../data/skills";

export function MyLibrary() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(
          window.localStorage.getItem("skill-start-favorites") ?? "[]",
        ) as string[];
        setFavoriteSlugs(saved);
      } catch {
        setFavoriteSlugs([]);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const favorites = skills.filter((skill) =>
    favoriteSlugs.includes(skill.slug),
  );

  function removeFavorite(slug: string) {
    const next = favoriteSlugs.filter((item) => item !== slug);
    setFavoriteSlugs(next);
    window.localStorage.setItem(
      "skill-start-favorites",
      JSON.stringify(next),
    );
  }

  if (!ready) {
    return (
      <div className="library-loading" aria-live="polite">
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="library-empty">
        <span aria-hidden="true">藏</span>
        <h2>你的清单还是空的</h2>
        <p>打开 Skill 详情后点击“收藏到本机”，它就会出现在这里。</p>
        <Link href="/skills" className="button">
          去找第一个 Skill
        </Link>
      </div>
    );
  }

  return (
    <div className="library-grid">
      {favorites.map((skill) => (
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
            <Link href={`/skills/${skill.slug}`}>查看说明 →</Link>
            <button type="button" onClick={() => removeFavorite(skill.slug)}>
              移除
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
