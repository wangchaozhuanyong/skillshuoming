import type { Metadata } from "next";
import { SkillsExplorer } from "./SkillsExplorer";

export const metadata: Metadata = {
  title: "全部 Skill",
  description:
    "按中文工作目标查找 Codex Skill，查看来源、用途、权限提示和使用方法。",
};

type SearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
}>;

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  return (
    <SkillsExplorer
      initialQuery={query ?? ""}
      initialCategory={category ?? ""}
    />
  );
}
