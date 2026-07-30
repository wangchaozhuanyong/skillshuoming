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
import { PageHeader } from "../components/PageHeader";
import { getSkillBySlug } from "../data/skills";
import {
  buildTaskBrief,
  runRuleMatch,
  type WorkbenchFormValues,
} from "./match-engine";

type TaskBuilderProps = {
  initialSkill: string;
};

type FormState = WorkbenchFormValues;

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
  const [useModel, setUseModel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchProvider, setMatchProvider] = useState("本机规则");
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

  const matches = useMemo(
    () => runRuleMatch(form, initialSkill),
    [form, initialSkill],
  );

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function buildTask(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const localTaskBrief = buildTaskBrief(form, matches);
    setGenerated("");
    setIsGenerating(true);
    setMatchProvider("本机规则");

    try {
      if (!useModel) {
        setGenerated(localTaskBrief);
      } else {
        const response = await fetch("/api/workbench/task-brief", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ...form,
            selectedSlug: initialSkill,
            useModel: true,
          }),
        });

        if (!response.ok) {
          setGenerated(localTaskBrief);
          setMatchProvider("模型接口失败，回退本机规则");
        } else {
          try {
            const payload = (await response.json()) as {
              brief?: string;
              provider?: string;
            };
            setGenerated(payload.brief || localTaskBrief);
            setMatchProvider(payload.provider || "本机规则");
          } catch {
            setGenerated(localTaskBrief);
            setMatchProvider("模型响应解析失败，回退本机规则");
          }
        }
      }
    } catch {
      setGenerated(localTaskBrief);
      setMatchProvider("本机规则（降级）");
    } finally {
      setIsGenerating(false);
    }

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
      <PageHeader
        eyebrow="AI 工作台 · 本机规则匹配"
        title="先匹配 Skill，再生成任务单"
        description="按任务、权限和风险先筛选 2–3 个候选；可选调用模型做重排与措辞增强，本地仅用于展示和生成任务单。"
        meta={
          <>
            <span>本机处理</span>
            <span>模型不可用自动降级</span>
          </>
        }
      />
      <div className="container">
        <nav
          className="workbench-switcher workbench-switcher-compact"
          aria-label="AI 工作台工具"
        >
          <span className="active">任务匹配与任务单</span>
          <Link href="/guide#safety">安全检查教程</Link>
          <Link href="/categories">工作分类</Link>
          <Link href="/library">我的清单</Link>
        </nav>
      </div>

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
                <span>规则匹配结果</span>
                <strong>{matches.length} 个候选，按符合程度排序</strong>
                <small>匹配来源：{matchProvider}</small>
              </div>
              <div className="workbench-match-list">
                {matches.length > 0 ? (
                  matches.map(({ skill, reasons, gaps }, index) => (
                    <article key={skill.slug} className="workbench-match-card">
                      <div>
                        <span>
                          候选 {index + 1} · {skill.category}
                        </span>
                        <strong>{skill.chineseName}</strong>
                      </div>
                      <p>{reasons[0]}</p>
                      {gaps.length ? (
                        <small>{gaps[0]}</small>
                      ) : (
                        <small>当前未发现明显条件冲突</small>
                      )}
                      <Link href={`/skills/${skill.slug}`}>查看用途与权限</Link>
                    </article>
                  ))
                ) : (
                  <p className="inline-error">
                    当前任务尚未匹配到足够候选，将使用可用性更高的默认推荐。
                  </p>
                )}
              </div>
            </div>

            <div className="workbench-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useModel}
                  onChange={(event) => setUseModel(event.target.checked)}
                />
                <span>
                  <strong>允许模型增强（可选）</strong>
                  <small>
                    不上传文件内容；只根据你已提交的任务文本进行重排和措辞。
                  </small>
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="button button-wide desktop-task-submit"
            disabled={isGenerating}
          >
            {isGenerating ? "生成中..." : "生成完整任务单"}
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
              <button type="submit" className="button" disabled={isGenerating}>
                <Sparkles aria-hidden="true" size={18} />
                {isGenerating ? "生成中..." : "生成任务单"}
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
