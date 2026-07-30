"use client";

import { useEffect } from "react";

export function RecentSkillTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("skill-start-recent") ?? "[]",
      ) as string[];
      const next = [slug, ...saved.filter((item) => item !== slug)].slice(0, 12);
      window.localStorage.setItem("skill-start-recent", JSON.stringify(next));
    } catch {
      // Recently viewed history is optional and must not block the detail page.
    }
  }, [slug]);

  return null;
}
