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
  assert.match(html, /不用学术语/);
  assert.match(html, /帮我找 Skill/);
  assert.match(html, /\d+(?:<!-- -->)? 个精选条目/);
  assert.match(html, /https:\/\/skill-start\.example\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Building your site/);
});

test("renders the directory, detail, workbench, and guide routes", async () => {
  const worker = await createWorker();
  const routes = [
    ["/skills", /Skill 中文目录/],
    ["/skills/baoyu-xhs-images", /小红书图卡生成/],
    ["/workbench", /Codex 能执行的任务单/],
    ["/guide", /先弄懂三件事/],
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
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /#020617|purple|blue-purple/i);
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
