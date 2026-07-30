"use client";

import { Bookmark, Copy, ExternalLink, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";

type CopyActionsProps = {
  githubUrl: string;
  installCommand?: string;
  prompt: string;
  slug: string;
};

type CopyState = "idle" | "install" | "prompt" | "error";

export function CopyActions({
  githubUrl,
  installCommand,
  prompt,
  slug,
}: CopyActionsProps) {
  const [state, setState] = useState<CopyState>("idle");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(
          window.localStorage.getItem("skill-start-favorites") ?? "[]",
        ) as string[];
        setFavorite(saved.includes(slug));
      } catch {
        setFavorite(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [slug]);

  async function copy(text: string, nextState: CopyState) {
    try {
      await navigator.clipboard.writeText(text);
      setState(nextState);
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
    }
  }

  function toggleFavorite() {
    let saved: string[] = [];
    try {
      saved = JSON.parse(
        window.localStorage.getItem("skill-start-favorites") ?? "[]",
      ) as string[];
    } catch {
      saved = [];
    }

    const next = saved.includes(slug)
      ? saved.filter((item) => item !== slug)
      : [...saved, slug];
    window.localStorage.setItem(
      "skill-start-favorites",
      JSON.stringify(next),
    );
    setFavorite(next.includes(slug));
  }

  return (
    <div className="copy-actions">
      <a
        className="button"
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink aria-hidden="true" size={17} />
        打开 GitHub 源地址
      </a>
      <button
        type="button"
        className="button button-outline"
        onClick={() => copy(prompt, "prompt")}
      >
        <Copy aria-hidden="true" size={17} />
        {state === "prompt" ? "使用话术已复制" : "复制使用话术"}
      </button>
      {installCommand ? (
        <button
          type="button"
          className="button button-quiet"
          onClick={() => copy(installCommand, "install")}
        >
          <SquareTerminal aria-hidden="true" size={17} />
          {state === "install" ? "参考命令已复制" : "复制参考命令"}
        </button>
      ) : null}
      <button
        type="button"
        className={`button button-quiet ${favorite ? "active" : ""}`}
        onClick={toggleFavorite}
        aria-pressed={favorite}
      >
        <Bookmark
          aria-hidden="true"
          size={17}
          fill={favorite ? "currentColor" : "none"}
        />
        {favorite ? "已收藏" : "收藏到本机"}
      </button>
      {state === "error" ? (
        <p className="inline-error" role="status">
          浏览器未允许复制，请手动选择文字。
        </p>
      ) : null}

      <div className="mobile-detail-actionbar" aria-label="Skill 快捷操作">
        <button
          type="button"
          onClick={() => copy(prompt, "prompt")}
        >
          <Copy aria-hidden="true" size={18} />
          {state === "prompt" ? "话术已复制" : "复制使用话术"}
        </button>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" size={18} />
          打开 GitHub
        </a>
      </div>
    </div>
  );
}
