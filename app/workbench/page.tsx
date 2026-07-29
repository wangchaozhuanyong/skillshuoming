import type { Metadata } from "next";
import { TaskBuilder } from "./TaskBuilder";

export const metadata: Metadata = {
  title: "Codex 任务单生成器",
  description:
    "把工作目标、输入、输出、权限和验收标准整理成可以直接复制给 Codex 的任务单。",
};

type SearchParams = Promise<{ skill?: string | string[] }>;

export default async function WorkbenchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const skill = Array.isArray(params.skill) ? params.skill[0] : params.skill;
  return <TaskBuilder initialSkill={skill ?? ""} />;
}
