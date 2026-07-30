import { buildSearchText, getSkillBySlug, skills, type SkillEntry } from "../data/skills";

export type WorkbenchFormValues = {
  goal: string;
  input: string;
  output: string;
  style: string;
  allowNetwork: boolean;
  allowModify: boolean;
  requireCheck: boolean;
};

export type MatchResult = {
  skill: SkillEntry;
  score: number;
  reasons: string[];
  gaps: string[];
};

export type MatchRequestPayload = WorkbenchFormValues & {
  selectedSlug?: string;
};

export type MatchRouteInput = {
  goal: string;
  input: string;
  output: string;
  style: string;
  allowNetwork: boolean;
  allowModify: boolean;
  requireCheck: boolean;
  selectedSlug: string;
};

const recommendationRules = [
  {
    terms: ["excel", "表格", "公式", "销售", "数据"],
    slugs: ["spreadsheet-formula-helper", "paperjsx"],
  },
  {
    terms: ["ppt", "汇报", "演示", "幻灯片"],
    slugs: ["paperjsx"],
  },
  {
    terms: ["小红书", "图卡"],
    slugs: ["baoyu-xhs-images"],
  },
  {
    terms: ["信息图", "流程图", "图解"],
    slugs: ["baoyu-infographic"],
  },
  {
    terms: ["文章配图", "公众号配图", "插图"],
    slugs: ["baoyu-article-illustrator"],
  },
  {
    terms: ["会议", "纪要", "行动项"],
    slugs: ["meeting-notes-and-actions"],
  },
  {
    terms: ["网站", "网页", "测试"],
    slugs: ["webapp-testing", "openai-build-web-apps"],
  },
  {
    terms: ["研究", "引用", "资料"],
    slugs: ["content-research-writer"],
  },
] as const;

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  return false;
}

export function normalizeMatchRequest(raw: {
  goal?: unknown;
  input?: unknown;
  output?: unknown;
  style?: unknown;
  allowNetwork?: unknown;
  allowModify?: unknown;
  requireCheck?: unknown;
  selectedSlug?: unknown;
}): MatchRouteInput {
  return {
    goal: normalizeText(raw.goal),
    input: normalizeText(raw.input),
    output: normalizeText(raw.output),
    style: normalizeText(raw.style),
    allowNetwork: normalizeBoolean(raw.allowNetwork),
    allowModify: normalizeBoolean(raw.allowModify),
    requireCheck: normalizeBoolean(raw.requireCheck),
    selectedSlug: normalizeText(raw.selectedSlug),
  };
}

export function sanitizeTextForResponse(text: string): string {
  return text.replace(/\u0000/g, "").slice(0, 4000);
}

export function runRuleMatch(form: WorkbenchFormValues, selectedSlug: string): MatchResult[] {
  const selected = selectedSlug ? getSkillBySlug(selectedSlug) : undefined;
  const query = `${form.goal} ${form.input} ${form.output}`.toLowerCase();
  const ruleMatches = new Map<string, string[]>();

  for (const rule of recommendationRules) {
    const matchedTerms = rule.terms.filter((term) => query.includes(term));
    if (!matchedTerms.length) continue;
    for (const slug of rule.slugs) {
      ruleMatches.set(slug, [...(ruleMatches.get(slug) ?? []), ...matchedTerms]);
    }
  }

  const results = skills.map<MatchResult>((skill) => {
    const reasons: string[] = [];
    const gaps: string[] = [];
    let score = 0;

    if (selected?.slug === skill.slug) {
      score += 30;
      reasons.push("你从这个 Skill 的详情页进入工作台");
    }

    const matchedRuleTerms = [...new Set(ruleMatches.get(skill.slug) ?? [])];
    if (matchedRuleTerms.length) {
      score += 10 + matchedRuleTerms.length * 3;
      reasons.push(`任务中提到：${matchedRuleTerms.slice(0, 3).join("、")}`);
    }

    const matchedLabels = [...skill.tags, ...skill.aliases].filter((label) =>
      query.includes(label.toLowerCase()),
    );
    if (matchedLabels.length) {
      score += Math.min(12, matchedLabels.length * 3);
      reasons.push(`与“${matchedLabels.slice(0, 2).join("、")}”直接相关`);
    } else if (buildSearchText(skill).includes(form.goal.toLowerCase())) {
      score += 5;
      reasons.push("用途说明与任务目标接近");
    }

    if (skill.sourceType === "OpenAI 官方") score += 2;
    if (skill.difficulty === "小白可用") score += 2;
    if (skill.featured) score += 1;

    const permissionText = skill.permissions.join(" ");
    if (!form.allowNetwork && /(联网|互联网|第三方|云端|访问目标网站)/.test(permissionText)) {
      score -= 5;
      gaps.push("当前任务不允许联网，但这个 Skill 可能需要外部访问");
    }
    if (!form.allowModify && /(覆盖|删除|修改原文件)/.test(permissionText)) {
      score -= 5;
      gaps.push("当前任务不允许修改原文件，需要先确认只写入新文件");
    }
    if (skill.risk === "谨慎使用") {
      score -= 3;
      gaps.push("权限较多，使用前需要逐项确认");
    }

    if (!reasons.length) reasons.push("作为同类任务的备用候选");

    return { skill, score, reasons, gaps };
  });

  const matched = results
    .filter((result) => result.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (matched.length >= 2) return matched;

  const fallback = results
    .filter(
      (result) =>
        result.skill.featured &&
        !matched.some((item) => item.skill.slug === result.skill.slug),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 3 - matched.length);

  return [...matched, ...fallback];
}

export function buildTaskBrief(form: WorkbenchFormValues, matches: MatchResult[]) {
  const recommendedNames = matches.length
    ? matches.map(({ skill }) => `$${skill.name}`).join("、")
    : "请根据任务选择最少且合适的 Skill";

  return `# Codex 工作任务单

## 任务目标
${form.goal.trim()}

## 输入资料
${form.input.trim()}

## 最终交付
${form.output.trim()}

## 风格与要求
${form.style.trim()}

## 执行边界
- 联网：${
    form.allowNetwork
      ? "允许，但只访问完成任务所需的公开来源，并记录来源"
      : "不允许；如果必须联网，先说明原因并等待确认"
  }
- 修改原文件：${
    form.allowModify
      ? "允许，但修改前先创建可恢复的副本"
      : "不允许；只读取原文件，结果写入新文件"
  }
- 自检：${
    form.requireCheck
      ? "必须执行；逐项报告验收结果与未验证风险"
      : "完成后提供简短结果说明"
  }
- 不要编造不存在的接口、字段、账号、数据或配置。
- 如果关键信息缺失且错误理解会造成返工，只问一个最关键的问题。

## 推荐 Skill
${recommendedNames}

## 建议执行顺序
1. 读取输入资料并复述范围，不先修改文件。
2. 检查输入是否完整，列出缺失项与风险。
3. 使用最少必要的 Skill 完成任务。
4. 把结果写入新的输出文件，不覆盖原件。
5. ${
  form.requireCheck
    ? "打开或解析最终文件，检查格式、数字、缺页、溢出和可用性。"
    : "总结已完成内容。"
}

## 验收标准
- 输出格式与文件数量符合要求。
- 所有结论能追溯到输入资料或明确来源。
- 数字、日期、单位和文件名一致。
- 明确区分“已验证”“未验证”和“需要人工确认”。`;
}
