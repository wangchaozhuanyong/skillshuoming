import type { Metadata } from "next";
import { HomeExperience } from "./HomeExperience";

export const metadata: Metadata = {
  title: {
    absolute: "技能开工站｜Codex Skill 中文指南",
  },
  description:
    "用中文说出你的工作，找到适合的 Codex Skill，查看安装要求、权限提示和可直接复制的任务单。",
};

export default function Home() {
  return <HomeExperience />;
}
