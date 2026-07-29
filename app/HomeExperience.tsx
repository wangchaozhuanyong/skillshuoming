"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories, featuredSkills, skills } from "./data/skills";

const popularQueries = [
  "做 PPT",
  "写公众号",
  "分析 Excel",
  "做小红书图片",
  "检查网站",
  "制作短视频",
];

const workTools = [
  {
    index: "01",
    label: "每日高频",
    title: "Codex 任务单生成器",
    copy: "把一句模糊需求整理成带输入、输出、权限和验收标准的完整任务。",
    href: "/workbench",
    action: "生成任务单",
    tone: "primary",
  },
  {
    index: "02",
    label: "安装前判断",
    title: "GitHub Skill 体检清单",
    copy: "先检查脚本、联网、密钥、覆盖文件和维护状态。",
    href: "/guide#safety",
    action: "查看检查方法",
    tone: "violet",
  },
  {
    index: "03",
    label: "少装更好",
    title: "Skill 最小组合",
    copy: "按职业和工作目标，只选择真正需要的一组 Skill。",
    href: "/categories",
    action: "按工作组合",
    tone: "cyan",
  },
  {
    index: "04",
    label: "本机保存",
    title: "我的 Skill 清单",
    copy: "收藏、最近查看和准备安装都保存在当前浏览器。",
    href: "/library",
    action: "打开我的清单",
    tone: "slate",
  },
];

const rolePacks = [
  {
    title: "自媒体运营",
    copy: "研究资料 → 写作 → 配图 → 小红书图卡",
    query: "小红书 文章 配图",
    symbol: "创",
  },
  {
    title: "办公室职员",
    copy: "会议纪要 → Excel → 汇报 PPT",
    query: "会议 Excel PPT",
    symbol: "办",
  },
  {
    title: "网站开发者",
    copy: "需求拆解 → 开发 → 浏览器测试",
    query: "网站 开发 测试",
    symbol: "站",
  },
];

export function HomeExperience() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/skills?q=${encodeURIComponent(value)}` : "/skills");
  }

  function searchFor(value: string) {
    setQuery(value);
    router.push(`/skills?q=${encodeURIComponent(value)}`);
  }

  return (
    <main id="main-content">
      <section className="hero-section">
        <div className="hero-aurora hero-aurora-one" aria-hidden="true" />
        <div className="hero-aurora hero-aurora-two" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              为中国 Codex 用户设计
            </p>
            <h1>
              <span className="hero-title-main">告诉我你想做什么，</span>
              <span className="hero-title-accent">
                30 秒找到能用的 Skill。
              </span>
            </h1>
            <p className="hero-lead">
              不用看懂 GitHub，也不用研究复杂命令。用中文描述任务，我们帮你找到合适的
              Skill、说明权限，并生成可以直接交给 Codex 的任务单。
            </p>

            <form className="hero-search" onSubmit={submit}>
              <label htmlFor="home-search">今天想让 Codex 帮你做什么？</label>
              <div className="hero-search-row">
                <span className="search-symbol" aria-hidden="true">
                  ⌕
                </span>
                <input
                  id="home-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="例如：做一份公司介绍 PPT、分析 Excel、检查网站代码……"
                />
                <button type="submit" className="button">
                  帮我找 Skill
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="quick-queries" aria-label="常用需求">
                {popularQueries.map((item) => (
                  <button key={item} type="button" onClick={() => searchFor(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </form>

            <div className="trust-line">
              <span>
                <b>✓</b> 来源链接已核验
              </span>
              <span>
                <b>✓</b> 权限先讲明白
              </span>
              <span>
                <b>✓</b> 不把 Star 当安全认证
              </span>
            </div>
          </div>

          <aside className="hero-workcard" aria-label="今天的 AI 开工台">
            <div className="workcard-window">
              <div className="window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <span>今天的 AI 开工台</span>
              <small>本地保存</small>
            </div>

            <div className="workcard-body">
              <p className="workflow-label">推荐工作流 · 自媒体内容发布</p>
              <h2>把一篇长文章变成可直接发布的小红书图文</h2>
              <div className="workflow-steps">
                <div className="workflow-step active">
                  <span>01</span>
                  <p>
                    <strong>文章结构整理</strong>
                    <small>提炼标题、观点与内容层级</small>
                  </p>
                  <b>已匹配</b>
                </div>
                <div className="workflow-connector" />
                <div className="workflow-step">
                  <span>02</span>
                  <p>
                    <strong>图文卡片生成</strong>
                    <small>拆成统一视觉的 3:4 图片</small>
                  </p>
                  <b>已匹配</b>
                </div>
                <div className="workflow-connector" />
                <div className="workflow-step">
                  <span>03</span>
                  <p>
                    <strong>发布文案优化</strong>
                    <small>生成标题、正文与话题方向</small>
                  </p>
                  <b>已匹配</b>
                </div>
              </div>

              <div className="workcard-actions">
                <Link href="/workbench?skill=baoyu-xhs-images">
                  生成这份任务单
                </Link>
                <Link href="/skills?q=小红书">查看匹配 Skill</Link>
              </div>

              <div className="workcard-stats">
                <span>
                  <strong>{skills.length}</strong>已核验条目
                </span>
                <span>
                  <strong>{categories.length}</strong>工作分类
                </span>
                <span>
                  <strong>0</strong>虚构安装量
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="proof-strip" aria-label="站点数据说明">
        <div className="container proof-grid">
          <p>
            <strong>{skills.length}</strong>
            <span>已核验 Skill</span>
          </p>
          <p>
            <strong>{categories.length}</strong>
            <span>工作分类</span>
          </p>
          <p>
            <strong>2026-07-29</strong>
            <span>最近来源核验</span>
          </p>
          <p>
            <strong>无需注册</strong>
            <span>收藏保存在本机</span>
          </p>
        </div>
      </section>

      <section className="section daily-tools-section">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">AI WORKSPACE</p>
              <h2>每天都会用到的 AI 工作入口</h2>
            </div>
            <p>
              不只是找 Skill，也把安装判断、工作边界和个人清单一起整理好。
            </p>
          </div>

          <div className="tool-mosaic">
            {workTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className={`tool-card tool-card-${tool.tone}`}
              >
                <span className="tool-index">{tool.index}</span>
                <div>
                  <small>{tool.label}</small>
                  <h3>{tool.title}</h3>
                  <p>{tool.copy}</p>
                </div>
                <b>{tool.action} →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">按工作分类</p>
              <h2>不知道 Skill 名字，也能找到入口</h2>
            </div>
            <Link href="/categories" className="section-link">
              查看全部 {categories.length} 个分类 →
            </Link>
          </div>

          <div className="category-board">
            {categories.slice(0, 8).map((category, index) => {
              const count = skills.filter(
                (skill) => skill.category === category.name,
              ).length;
              return (
                <Link
                  key={category.name}
                  href={`/skills?category=${encodeURIComponent(category.name)}`}
                  className={`category-tile category-tile-${(index % 4) + 1}`}
                >
                  <span className="category-symbol" aria-hidden="true">
                    {category.symbol}
                  </span>
                  <span>
                    <strong>{category.name}</strong>
                    <small>{category.short}</small>
                  </span>
                  <b>{count ? `${count} 个` : "待收录"}</b>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">小白本周先看</p>
              <h2>具体、清楚、能判断的 Skill</h2>
            </div>
            <Link href="/rankings" className="section-link">
              查看综合推荐榜 →
            </Link>
          </div>

          <div className="featured-grid">
            {featuredSkills.slice(0, 6).map((skill, index) => (
              <article className="featured-card" key={skill.slug}>
                <div className="featured-card-top">
                  <span className="skill-logo" aria-hidden="true">
                    {skill.chineseName.slice(0, 1)}
                  </span>
                  <div>
                    <small>
                      {skill.category} · {skill.kind}
                    </small>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                  </div>
                </div>
                <h3>{skill.chineseName}</h3>
                <code>{skill.name}</code>
                <p>{skill.summary}</p>
                <div className="skill-tags">
                  <span>{skill.difficulty}</span>
                  <span>{skill.risk}</span>
                  <span>{skill.sourceType}</span>
                </div>
                <Link href={`/skills/${skill.slug}`}>
                  查看怎么用 <span>→</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="section-action">
            <Link href="/skills" className="button">
              查看全部 Skill
              <span aria-hidden="true">→</span>
            </Link>
            <span>支持中文任务搜索、来源与难度筛选</span>
          </div>
        </div>
      </section>

      <section className="section role-pack-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">按职业开工</p>
            <h2>不用装一堆，只选最小工作组合</h2>
            <p>先明确你每天真正做什么，再组合最少数量的 Skill。</p>
          </div>

          <div className="role-pack-grid">
            {rolePacks.map((pack) => (
              <button
                type="button"
                key={pack.title}
                onClick={() => searchFor(pack.query)}
              >
                <span aria-hidden="true">{pack.symbol}</span>
                <div>
                  <h3>{pack.title}</h3>
                  <p>{pack.copy}</p>
                </div>
                <b>查看组合 →</b>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section update-section">
        <div className="container update-card">
          <div>
            <p className="eyebrow">TODAY · 2026-07-29</p>
            <h2>首发版本：数据真实比数字好看更重要</h2>
          </div>
          <div className="update-copy">
            <p>
              当前只展示已核验公开来源的代表性条目。没有虚构安装量，也没有把
              GitHub Star 包装成安全认证。
            </p>
            <p>
              “来源已核验”表示仓库与路径存在，不代表脚本经过完整安全审计。
            </p>
          </div>
          <Link href="/updates" className="button button-light">
            查看更新中心
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
