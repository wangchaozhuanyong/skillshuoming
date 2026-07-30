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
  assert.match(html, /还没找到合适的 Skill/);
  assert.match(html, /立即搜索 Skill/);
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
    ["/workbench", /Codex 能执行的任务单/],
    ["/guide", /先弄懂三件事/],
    ["/categories", /已有内容的工作方向/],
    ["/rankings", /推荐不等于适合所有人/],
    ["/updates", /更新记录讲人话/],
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
  assert.match(css, /\.footer-mobile-cta/);
  assert.match(css, /\.footer-mobile-links/);
  assert.match(css, /\.footer-mobile-services/);
});

test("keeps desktop and mobile navigation mapped to the same pages", async () => {
  const header = await readFile(
    new URL("../app/components/SiteHeader.tsx", import.meta.url),
    "utf8",
  );

  assert.match(header, /href: "\/skills", label: "Skill"/);
  assert.match(header, /href: "\/rankings", label: "推荐榜"/);
  assert.match(header, /href: "\/updates", label: "更新记录"/);
  assert.match(header, /className={`header-library-link/);
  assert.match(header, /href="\/library"/);
  assert.match(header, />我的清单</);
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
