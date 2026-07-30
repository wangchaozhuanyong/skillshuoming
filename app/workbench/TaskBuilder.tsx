"use client";

import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Copy,
  Files,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

type MobileStep = 1 | 2 | 3;

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
  const [mobileStep, setMobileStep] = useState<MobileStep>(1);
  const [mobileView, setMobileView] = useState<"form" | "result">("form");
  const outputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialSkill) return;
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(
          window.localStorage.getItem("skill-start-last-task") ?? "null",
        ) as Partial<FormState> | null;
        if (!saved?.goal) return;
        setForm((current) => ({ ...current, ...saved }));
      } catch {
        // A malformed local draft should not block the task builder.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialSkill]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          "skill-start-last-task",
          JSON.stringify({ ...form, savedAt: new Date().toISOString() }),
        );
      } catch {
        // Draft persistence is optional.
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [form]);

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
    setMobileView("result");
    window.setTimeout(() => {
      outputRef.current?.focus();
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);

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
          <nav className="workbench-switcher" aria-label="AI 工作台工具">
            <span className="active">任务单生成器</span>
            <Link href="/guide#safety">Skill 安全检查教程</Link>
            <Link href="/categories">Skill 最小组合</Link>
            <Link href="/library">我的 Skill 清单</Link>
          </nav>
        </div>
      </section>

      <section className="container task-builder">
        <form
          className={`task-form ${
            mobileView === "result" ? "mobile-view-hidden" : ""
          }`}
          onSubmit={buildTask}
        >
          <div className="form-heading">
            <span>01</span>
            <div>
              <h2>说清楚你要什么</h2>
              <p>不用写成专业 Prompt，先把目标和交付讲明白。</p>
            </div>
          </div>

          <nav className="task-stepper" aria-label="任务单填写步骤">
            {[
              { step: 1 as const, label: "任务目标", icon: Target },
              { step: 2 as const, label: "输入输出", icon: Files },
              { step: 3 as const, label: "权限验收", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.step}
                  type="button"
                  className={mobileStep === item.step ? "active" : ""}
                  aria-current={mobileStep === item.step ? "step" : undefined}
                  onClick={() => setMobileStep(item.step)}
                >
                  <Icon aria-hidden="true" size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="task-step" data-step="1" data-active={mobileStep === 1}>
            <label>
              <span>任务目标</span>
              <textarea
                required
                value={form.goal}
                onChange={(event) => update("goal", event.target.value)}
                rows={3}
              />
            </label>
            <div className="step-summary-card">
              <Target aria-hidden="true" size={18} />
              <p>
                <strong>先写结果，不用写专业 Prompt</strong>
                <span>例如：整理销售数据并生成管理层汇报。</span>
              </p>
            </div>
          </div>

          <div className="task-step" data-step="2" data-active={mobileStep === 2}>
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
          </div>

          <div className="task-step" data-step="3" data-active={mobileStep === 3}>
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
          </div>

          <button type="submit" className="button button-wide desktop-task-submit">
            生成完整任务单
          </button>

          <div className="mobile-task-actions">
            {mobileStep > 1 ? (
              <button
                type="button"
                className="task-back-button"
                onClick={() =>
                  setMobileStep((mobileStep - 1) as MobileStep)
                }
                aria-label="返回上一步"
              >
                <ArrowLeft aria-hidden="true" size={19} />
              </button>
            ) : null}
            {mobileStep < 3 ? (
              <button
                type="button"
                className="button"
                onClick={() =>
                  setMobileStep((mobileStep + 1) as MobileStep)
                }
              >
                下一步
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            ) : (
              <button type="submit" className="button">
                <Sparkles aria-hidden="true" size={18} />
                生成任务单
              </button>
            )}
          </div>
        </form>

        <aside
          ref={outputRef}
          className={`task-output ${
            mobileView === "result" ? "mobile-view-active" : ""
          }`}
          tabIndex={-1}
        >
          <div className="task-output-heading">
            <div>
              <ClipboardCheck aria-hidden="true" size={20} />
              <h2>复制给 Codex</h2>
            </div>
            {generated ? (
              <button type="button" onClick={copyTask}>
                <Copy aria-hidden="true" size={16} />
                {copyState === "copied" ? "已复制" : "复制全文"}
              </button>
            ) : null}
          </div>

          {generated ? (
            <>
              <button
                type="button"
                className="mobile-edit-task"
                onClick={() => setMobileView("form")}
              >
                <ArrowLeft aria-hidden="true" size={17} />
                返回修改
              </button>
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
