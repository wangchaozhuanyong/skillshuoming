import {
  buildTaskBrief,
  runRuleMatch,
  sanitizeTextForResponse,
  type MatchRouteInput,
  type MatchResult,
  normalizeMatchRequest,
  type WorkbenchFormValues,
} from "../../../workbench/match-engine";

type ErrorResponse = {
  error: string;
  detail?: string;
};

type BriefResponse = {
  brief: string;
  provider: string;
  matches: Array<{
    slug: string;
    score: number;
  }>;
};

const FALLBACK_PROVIDER = "本机规则";
const MODEL_DISABLED_PROVIDER = "模型增强未启用（未配置模型）";
const MODEL_ERROR_PROVIDER = "模型重排失败，已回退本机规则";

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function toWorkbenchValues(raw: unknown): MatchRouteInput {
  if (!raw || typeof raw !== "object") {
    return {
      goal: "",
      input: "",
      output: "",
      style: "",
      allowNetwork: false,
      allowModify: false,
      requireCheck: false,
      selectedSlug: "",
    };
  }

  const source = raw as Record<string, unknown>;
  return normalizeMatchRequest({
    goal: source.goal,
    input: source.input,
    output: source.output,
    style: source.style,
    allowNetwork: source.allowNetwork,
    allowModify: source.allowModify,
    requireCheck: source.requireCheck,
    selectedSlug: source.selectedSlug,
  });
}

function pickTopMatchNames(matches: MatchResult[]) {
  return matches.slice(0, 3).map((item) => item.skill.chineseName);
}

function fallbackBrief(form: WorkbenchFormValues, matches: MatchResult[]) {
  return sanitizeTextForResponse(
    buildTaskBrief(form, matches.length ? matches : []),
  );
}

function matchForm(form: WorkbenchFormValues, selectedSlug: string) {
  const matches = runRuleMatch(form, selectedSlug);
  const brief = fallbackBrief(form, matches);
  return { matches, brief };
}

function methodNotAllowedResponse() {
  return Response.json(
    {
      error: "请使用 POST 调用任务单生成接口，提交 JSON：{ goal, selectedSlug }",
      detail:
        "支持字段：input/output/style/allowNetwork/allowModify/requireCheck/selectedSlug/useModel",
      sample: {
        goal: "我有一篇文章，帮我做 8 张小红书图片",
        selectedSlug: "meeting-notes-and-actions",
        allowNetwork: false,
        allowModify: false,
        requireCheck: true,
      },
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}

function buildModelPrompt(form: WorkbenchFormValues, matches: MatchResult[]) {
  return [
    "你是一名中文 AI 工作台助手。",
    "你只允许使用给定任务表述和候选 Skill 结果重写任务清单，不得新增、修改或推断任何未给出的技能信息。",
    "请基于任务边界、权限要求和推荐候选，用中文输出 1 段 Markdown 任务单文本。",
    "输出必须是 JSON，不要 Markdown 包裹，不要添加说明文字。",
    "输出示例格式: {\"brief\":\"...\"}",
    "",
    "【任务输入】",
    `目标：${form.goal}`,
    `输入资料：${form.input}`,
    `输出要求：${form.output}`,
    `风格：${form.style || "无特别要求"}`,
    `允许联网：${form.allowNetwork ? "是" : "否"}`,
    `允许修改原文件：${form.allowModify ? "是" : "否"}`,
    `完成后自检：${form.requireCheck ? "是" : "否"}`,
    "",
    "【候选 Skill（按推荐顺序）】",
    ...pickTopMatchNames(matches).map((name) => `- ${name}`),
  ].join("\n");
}

async function callModelEnhancer(form: WorkbenchFormValues, matches: MatchResult[]) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const model =
    process.env.WORKBENCH_LITE_MODEL?.trim() || "gpt-4o-mini";
  const baseUrl = process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.15,
      messages: [
        {
          role: "system",
          content:
            "请严格只做文本润色与重排，不补充任何未验证技能字段。输出为严格 JSON，包含 brief 字段。",
        },
        { role: "user", content: buildModelPrompt(form, matches) },
      ],
      response_format: {
        type: "json_object",
      },
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    throw new Error(`模型接口返回 ${response.status}`);
  }

  const payload = (await response.json()) as OpenAiChatResponse;
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("模型返回内容为空");
  }

  let parsed: { brief?: string } | null = null;
  try {
    parsed = JSON.parse(content) as { brief?: string };
  } catch {
    return null;
  }
  if (!parsed?.brief || typeof parsed.brief !== "string") {
    return null;
  }

  return sanitizeTextForResponse(parsed.brief);
}

export async function POST(request: Request) {
  let payload: MatchRouteInput & { useModel?: boolean };
  try {
    payload = (await request.json()) as MatchRouteInput & { useModel?: boolean };
  } catch {
    return Response.json(
      { error: "请求参数解析失败，请提交合法 JSON" } satisfies ErrorResponse,
      { status: 400 },
    );
  }

  const form = toWorkbenchValues(payload);
  const shouldUseModel = payload?.useModel === true;

  const { matches, brief } = matchForm(form, form.selectedSlug);
  if (!shouldUseModel) {
    return Response.json(
      {
        brief,
        provider: FALLBACK_PROVIDER,
        matches: matches.map((item) => ({
          slug: item.skill.slug,
          score: item.score,
        })),
      } satisfies BriefResponse,
    );
  }

  try {
    const modelBrief = await callModelEnhancer(form, matches);
    if (!modelBrief) {
      return Response.json(
        {
          brief,
          provider: MODEL_DISABLED_PROVIDER,
          matches: matches.map((item) => ({
            slug: item.skill.slug,
            score: item.score,
          })),
        } satisfies BriefResponse,
      );
    }

    return Response.json(
      {
        brief: modelBrief,
        provider: `模型增强（${process.env.WORKBENCH_LITE_MODEL || "gpt-4o-mini"}）`,
        matches: matches.map((item) => ({
          slug: item.skill.slug,
          score: item.score,
        })),
      } satisfies BriefResponse,
    );
  } catch {
    return Response.json(
      {
        brief,
        provider: MODEL_ERROR_PROVIDER,
        matches: matches.map((item) => ({
          slug: item.skill.slug,
          score: item.score,
        })),
      } satisfies BriefResponse,
    );
  }
}

export async function GET() {
  return methodNotAllowedResponse();
}
