import {
  normalizeMatchRequest,
  runRuleMatch,
  type MatchRouteInput,
  type MatchResult,
} from "../../../workbench/match-engine";

type MatchPayload = {
  matches: Array<{
    slug: string;
    chineseName: string;
    category: string;
    score: number;
    reasons: string[];
    gaps: string[];
  }>;
  source: "本机规则";
};

function methodNotAllowedResponse() {
  return Response.json(
    {
      error: "请使用 POST 调用工作台匹配接口，提交 JSON：{ goal, input, output, style }",
      sample: {
        goal: "我需要给文章自动生成小红书图文",
        input: "原文内容",
        output: "9张图片 + 文案",
      },
    },
    {
      status: 405,
      headers: { Allow: "POST" },
    },
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "请求参数解析失败" }, { status: 400 });
  }

  const form = normalizeMatchRequest(payload as MatchRouteInput);
  const matches = runRuleMatch(form, form.selectedSlug) as MatchResult[];

  return Response.json({
    matches: matches.map((item) => ({
      slug: item.skill.slug,
      chineseName: item.skill.chineseName,
      category: item.skill.category,
      score: item.score,
      reasons: item.reasons,
      gaps: item.gaps,
    })),
    source: "本机规则",
  } satisfies MatchPayload);
}

export async function GET() {
  return methodNotAllowedResponse();
}
