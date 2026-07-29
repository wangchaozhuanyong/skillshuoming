"use client";

import { useEffect, useState } from "react";

type CopyActionsProps = {
  installCommand?: string;
  prompt: string;
  slug: string;
};

type CopyState = "idle" | "install" | "prompt" | "error";

export function CopyActions({
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
      {installCommand ? (
        <button
          type="button"
          className="button"
          onClick={() => copy(installCommand, "install")}
        >
          {state === "install" ? "安装命令已复制" : "复制安装命令"}
        </button>
      ) : null}
      <button
        type="button"
        className="button button-outline"
        onClick={() => copy(prompt, "prompt")}
      >
        {state === "prompt" ? "使用话术已复制" : "复制使用话术"}
      </button>
      <button
        type="button"
        className={`button button-quiet ${favorite ? "active" : ""}`}
        onClick={toggleFavorite}
        aria-pressed={favorite}
      >
        {favorite ? "已收藏" : "收藏到本机"}
      </button>
      {state === "error" ? (
        <p className="inline-error" role="status">
          浏览器未允许复制，请手动选择文字。
        </p>
      ) : null}
    </div>
  );
}
