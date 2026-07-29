"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { buildSearchText, getSkillBySlug, skills } from "../data/skills";

type TaskBuilderProps = {
  initialSkill: string;
};

type FormState = {
  goal: string;
  input: string;
  output: string;
  style: string;
  allowNetwork: boolean;
  allowModify: boolean;
  requireCheck: boolean;
};

const defaultForm: FormState = {
  goal: "把月度销售数据整理成一份适合管理层阅读的汇报",
  input: "sales.xlsx，包含订单日期、客户、产品、含税金额和区域",
  output: "一份 10 页以内的 PPTX，并附数据摘要",
  style: "简洁、结论先行；所有数字标注单位和时间范围",
  allowNetwork: false,
  allowModify: false,
  requireCheck: true,
};

const recommendationRules = [
  {
    terms: ["excel", "表格", "公式", "销售", "数据"],
    slugs: ["spreadsheet-formula-helper", "openai-google-slides"],
  },
  {
    terms: ["ppt", "汇报", "演示", "幻灯片"],
    slugs: ["openai-google-slides", "paperjsx"],
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

function recommendSkills(goal: string, selectedSlug: string) {
  const selected = selectedSlug ? getSkillBySlug(selectedSlug) : undefined;
  const query = goal.toLowerCase();
  const ruleSlugs = recommendationRules
    .filter((rule) => rule.terms.some((term) => query.includes(term)))
    .flatMap((rule) => rule.slugs);
  const ruleMatches = ruleSlugs
    .map((slug) => getSkillBySlug(slug))
    .filter(Boolean);
  const textMatches = skills.filter((skill) => {
    const searchable = buildSearchText(skill);
    return skill.tags.some(
      (tag) =>
        query.includes(tag.toLowerCase()) &&
        searchable.includes(tag.toLowerCase()),
    );
  });

  const matched = [selected, ...ruleMatches, ...textMatches]
    .filter(Boolean)
    .filter(
      (item, index, all) =>
        all.findIndex((candidate) => candidate?.slug === item?.slug) === index,
    );

  return matched.length
    ? matched.slice(0, 2)
    : skills.filter((item) => item.featured).slice(0, 2);
}

function createInitialForm(initialSkill: string): FormState {
  const selected = initialSkill ? getSkillBySlug(initialSkill) : undefined;
  if (!selected) return defaultForm;

  return {
    ...defaultForm,
    goal: selected.summary,
    input: "请填写要处理的文件、链接或文字内容",
    output: selected.output,
    style: "先说明执行计划，不覆盖原文件；缺失信息不要猜测，完成后报告自检结果",
  };
}

export function TaskBuilder({ initialSkill }: TaskBuilderProps) {
  const [form, setForm] = useState<FormState>(() =>
    createInitialForm(initialSkill),
  );
  const [generated, setGenerated] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const recommendations = useMemo(
    () => recommendSkills(form.goal, initialSkill),
    [form.goal, initialSkill],
  );

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildTask(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const recommendedNames = recommendations.length
      ? recommendations.map((skill) => `$${skill?.name}`).join("、")
      : "请根据任务选择最少且合适的 Skill";

    const task = `# Codex 工作任务单

## 任务目标
${form.goal.trim()}

## 输入资料
${form.input.trim()}

## 最终交付
${form.output.trim()}

## 风格与要求
${form.style.trim()}

## 执行边界
- 联网：${form.allowNetwork ? "允许，但只访问完成任务所需的公开来源，并记录来源" : "不允许；如果必须联网，先说明原因并等待确认"}
- 修改原文件：${form.allowModify ? "允许，但修改前先创建可恢复的副本" : "不允许；只读取原文件，结果写入新文件"}
- 自检：${form.requireCheck ? "必须执行；逐项报告验收结果与未验证风险" : "完成后提供简短结果说明"}
- 不要编造不存在的接口、字段、账号、数据或配置。
- 如果关键信息缺失且错误理解会造成返工，只问一个最关键的问题。

## 推荐 Skill
${recommendedNames}

## 建议执行顺序
1. 读取输入资料并复述范围，不先修改文件。
2. 检查输入是否完整，列出缺失项与风险。
3. 使用最少必要的 Skill 完成任务。
4. 把结果写入新的输出文件，不覆盖原件。
5. ${form.requireCheck ? "打开或解析最终文件，检查格式、数字、缺页、溢出和可用性。" : "总结已完成内容。"}

## 验收标准
- 输出格式与文件数量符合要求。
- 所有结论能追溯到输入资料或明确来源。
- 数字、日期、单位和文件名一致。
- 明确区分“已验证”“未验证”和“需要人工确认”。
`;

    setGenerated(task);
    setCopyState("idle");

    try {
      window.localStorage.setItem(
        "skill-start-last-task",
        JSON.stringify({ ...form, generatedAt: new Date().toISOString() }),
      );
    } catch {
      // Local storage is optional. Generation still works without it.
    }
  }

  async function copyTask() {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <main id="main-content" className="workbench-page">
      <section className="workbench-hero">
        <div className="container">
          <p className="eyebrow">AI 工作台 · 本机工具</p>
          <h1>把一句想法，整理成 Codex 能执行的任务单</h1>
          <p>
            这个工具不会调用模型，也不会把内容上传到本站服务器。生成结果只在当前浏览器中处理。
          </p>
        </div>
      </section>

      <section className="container task-builder">
        <form className="task-form" onSubmit={buildTask}>
          <div className="form-heading">
            <span>01</span>
            <div>
              <h2>说清楚你要什么</h2>
              <p>不用写成专业 Prompt，先把目标和交付讲明白。</p>
            </div>
          </div>

          <label>
            <span>任务目标</span>
            <textarea
              required
              value={form.goal}
              onChange={(event) => update("goal", event.target.value)}
              rows={3}
            />
          </label>

          <div className="field-grid">
            <label>
              <span>输入资料</span>
              <textarea
                required
                value={form.input}
                onChange={(event) => update("input", event.target.value)}
                rows={4}
              />
            </label>
            <label>
              <span>最终交付</span>
              <textarea
                required
                value={form.output}
                onChange={(event) => update("output", event.target.value)}
                rows={4}
              />
            </label>
          </div>

          <label>
            <span>风格与特殊要求</span>
            <textarea
              value={form.style}
              onChange={(event) => update("style", event.target.value)}
              rows={3}
            />
          </label>

          <fieldset className="permission-options">
            <legend>执行权限</legend>
            <label>
              <input
                type="checkbox"
                checked={form.allowNetwork}
                onChange={(event) =>
                  update("allowNetwork", event.target.checked)
                }
              />
              <span>
                <strong>允许联网</strong>
                <small>搜索资料或访问公开网页</small>
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.allowModify}
                onChange={(event) =>
                  update("allowModify", event.target.checked)
                }
              />
              <span>
                <strong>允许修改原文件</strong>
                <small>仍要求先创建可恢复副本</small>
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.requireCheck}
                onChange={(event) =>
                  update("requireCheck", event.target.checked)
                }
              />
              <span>
                <strong>完成后自检</strong>
                <small>输出验证结果和未验证风险</small>
              </span>
            </label>
          </fieldset>

          <div className="recommendation-box">
            <div>
              <span>自动建议</span>
              <strong>最少使用 {recommendations.length || 1} 个 Skill</strong>
            </div>
            <div className="recommended-skills">
              {recommendations.map((skill) =>
                skill ? (
                  <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                    <span>{skill.category}</span>
                    <strong>{skill.chineseName}</strong>
                  </Link>
                ) : null,
              )}
            </div>
          </div>

          <button type="submit" className="button button-wide">
            生成完整任务单
          </button>
        </form>

        <aside className="task-output">
          <div className="task-output-heading">
            <div>
              <span>02</span>
              <h2>复制给 Codex</h2>
            </div>
            {generated ? (
              <button type="button" onClick={copyTask}>
                {copyState === "copied" ? "已复制" : "复制全文"}
              </button>
            ) : null}
          </div>

          {generated ? (
            <>
              <pre>{generated}</pre>
              {copyState === "error" ? (
                <p className="inline-error" role="status">
                  浏览器未允许复制，请手动选择右侧文字。
                </p>
              ) : null}
            </>
          ) : (
            <div className="task-placeholder">
              <span aria-hidden="true">单</span>
              <h3>你的任务单会显示在这里</h3>
              <p>
                里面会自动补上执行边界、推荐 Skill、执行顺序和验收标准。
              </p>
              <ul>
                <li>不会擅自允许联网</li>
                <li>默认不覆盖原文件</li>
                <li>明确要求区分已验证与未验证</li>
              </ul>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
