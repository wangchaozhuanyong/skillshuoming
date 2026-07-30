import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function createWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

function environment() {
  return {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
}

function context() {
  return {
    waitUntil() {},
    passThroughOnException() {},
  };
}

async function fetchPage(worker, path) {
  return worker.fetch(
    new Request(`https://skill-start.example${path}`, {
      headers: {
        accept: "text/html",
        host: "skill-start.example",
        "x-forwarded-host": "skill-start.example",
        "x-forwarded-proto": "https",
      },
    }),
    environment(),
    context(),
  );
}

async function fetchApi(worker, path, init = {}) {
  return worker.fetch(
    new Request(`https://skill-start.example${path}`, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(init.body ?? {}),
    }),
    environment(),
    context(),
  );
}

test("server-renders the finished homepage with production metadata", async () => {
  const worker = await createWorker();
  const response = await fetchPage(worker, "/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /技能开工站/);
  assert.match(html, /30 秒找到能用的 Skill/);
  assert.match(html, /帮我找 Skill/);
  assert.match(html, /来源链接已核验/);
  assert.match(html, /第三方中文指南，不代表 OpenAI 官方产品/);
  assert.match(html, /https:\/\/skill-start\.example\/og\.png/);
  assert.doesNotMatch(html, /AI 接口中转/);
  assert.doesNotMatch(html, /AI 订阅协助/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Building your site/);
});

test("renders the directory, detail, workbench, and guide routes", async () => {
  const worker = await createWorker();
  const routes = [
    ["/skills", /Skill 中文目录/],
    ["/skills/baoyu-xhs-images", /小红书图卡生成/],
    ["/workbench", /先匹配 Skill，再生成任务单/],
    ["/guide", /先弄懂三件事/],
    ["/categories", /已有内容的工作方向/],
    ["/rankings", /推荐不等于适合所有人/],
    ["/updates", /来源、安装和权限哪里变了/],
    ["/library", /我的 Skill 清单/],
  ];

  for (const [path, expected] of routes) {
    const response = await fetchPage(worker, path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});

test("keeps responsive and accessibility rules in the finished stylesheet", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.skip-link/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\.mobile-bottom-nav/);
  assert.match(css, /\.mobile-detail-actionbar/);
  assert.match(css, /\.filter-sheet-backdrop/);
  assert.match(css, /\.task-stepper/);
  assert.match(css, /\.tool-mosaic/);
  assert.match(css, /\.footer-mobile-summary/);
  assert.match(css, /\.footer-mobile-index/);
  assert.match(css, /\.footer-mobile-legal/);
  assert.match(css, /\.compact-page-header/);
});

test("keeps desktop and mobile navigation mapped to the same pages", async () => {
  const [header, navigation] = await Promise.all([
    readFile(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/navigation.ts", import.meta.url), "utf8"),
  ]);

  assert.match(navigation, /href: "\/skills", label: "全部 Skill"/);
  assert.match(navigation, /href: "\/rankings", label: "推荐榜"/);
  assert.match(navigation, /href: "\/updates", label: "更新记录"/);
  assert.match(navigation, /href: "\/skills", label: "发现"/);
  assert.match(navigation, /area: "discover"/);
  assert.match(navigation, /"\/categories"/);
  assert.match(navigation, /"\/guide"/);
  assert.match(header, /matchesNavigationArea/);
  assert.match(header, /mobileDrawerNavigation/);
  assert.match(header, /className={`header-library-link/);
  assert.match(header, /libraryNavigation\.href/);
  assert.match(header, /libraryNavigation\.label/);
});

test("ships the branded social image and removes starter files", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /HomeExperience/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(packageJson, /"name": "skill-start-station"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("keeps the static catalog honest and GitHub-first", async () => {
  const [skillsSource, detailActions, packageJson] = await Promise.all([
    readFile(new URL("../app/data/skills.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/skills/[slug]/CopyActions.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(skillsSource, /openai-google-slides/);
  assert.match(detailActions, /打开 GitHub 源地址/);
  assert.match(detailActions, /复制参考命令/);
  assert.doesNotMatch(detailActions, /标记已安装/);
  assert.match(packageJson, /"check:skills"/);
  assert.match(packageJson, /"check:links"/);
});

test("workbench rule match api works without database", async () => {
  const worker = await createWorker();
  const response = await fetchApi(worker, "/api/workbench/match", {
    body: {
      goal: "我需要做一份小红书图文",
      input: "一篇 1000 字的推广文章",
      output: "8 张封面图和发布文案",
      style: "简洁清晰",
      allowNetwork: false,
      allowModify: false,
      requireCheck: true,
      selectedSlug: "baoyu-xhs-images",
    },
  });

  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.equal(payload.source, "本机规则");
  assert.ok(Array.isArray(payload.matches) && payload.matches.length > 0);
  assert.ok(payload.matches.every((item) => item.slug && item.score >= 0));
});

test("workbench task-brief api supports local-first matching and model fallback", async () => {
  const worker = await createWorker();
  const response = await fetchApi(worker, "/api/workbench/task-brief", {
    body: {
      goal: "我要分析销售数据生成管理汇报",
      input: "销售统计表",
      output: "一份 PPT 与执行清单",
      style: "简洁",
      allowNetwork: false,
      allowModify: false,
      requireCheck: false,
      selectedSlug: "paperjsx",
      useModel: true,
    },
  });

  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.equal(typeof payload.brief, "string");
  assert.match(payload.brief, /# Codex 工作任务单/);
  assert.equal(Array.isArray(payload.matches), true);
  assert.ok(payload.matches.length > 0);
  assert.ok(
    /本机规则/.test(payload.provider) || /模型增强/.test(payload.provider),
  );
});
