"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories, featuredSkills, skills } from "./data/skills";

const popularQueries = [
  "做一份公司介绍 PPT",
  "分析 Excel 公式",
  "把文章做成小红书图片",
  "检查我的网站",
  "整理会议纪要",
];

const pathSteps = [
  {
    number: "01",
    title: "先说你想完成什么",
    copy: "不用记英文名称，直接用中文描述工作。",
  },
  {
    number: "02",
    title: "看清要求与权限",
    copy: "安装前先知道需要什么、会读取什么、是否联网。",
  },
  {
    number: "03",
    title: "复制任务单开工",
    copy: "把目标、边界和验收标准一次讲清楚。",
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
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span />
              给中国 Codex 用户的中文 Skill 指南
            </p>
            <h1>
              不用学术语，
              <br />
              <em>先把工作做成。</em>
            </h1>
            <p className="hero-lead">
              告诉我们你想让 Codex 做什么。这里会帮你找到合适的 Skill，解释安装要求、权限和用法，再给一段可以直接复制的任务说明。
            </p>

            <form className="hero-search" onSubmit={submit}>
              <label htmlFor="home-search">今天想让 Codex 帮你做什么？</label>
              <div className="hero-search-row">
                <input
                  id="home-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="例如：把一篇文章做成 8 张小红书图卡"
                />
                <button type="submit" className="button">
                  帮我找 Skill
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
              <span>✓ 来源链接已核验</span>
              <span>✓ 权限先讲明白</span>
              <span>✓ 不把 Star 当安全认证</span>
            </div>
          </div>

          <aside className="hero-workcard" aria-label="开工流程预览">
            <div className="workcard-top">
              <span>今天的开工单</span>
              <small>本地生成，不上传</small>
            </div>
            <div className="workcard-task">
              <span className="task-label">你的目标</span>
              <strong>把月度销售表做成一份 10 页汇报</strong>
              <p>输入：sales.xlsx · 输出：PPTX · 不修改原表</p>
            </div>
            <div className="workcard-flow">
              <div>
                <span className="flow-index">1</span>
                <p>
                  <strong>先检查数据</strong>
                  <small>表格公式助手</small>
                </p>
              </div>
              <div>
                <span className="flow-index">2</span>
                <p>
                  <strong>再生成演示</strong>
                  <small>办公文件生成</small>
                </p>
              </div>
              <div>
                <span className="flow-index">3</span>
                <p>
                  <strong>最后做自检</strong>
                  <small>数字、页数、文字溢出</small>
                </p>
              </div>
            </div>
            <Link href="/workbench" className="workcard-link">
              生成我的 Codex 任务单 <span>→</span>
            </Link>
          </aside>
        </div>
      </section>

      <section className="signal-strip" aria-label="站点原则">
        <div className="container signal-grid">
          <p>
            <span>当前首发</span>
            <strong>{skills.length} 个精选条目</strong>
          </p>
          <p>
            <span>展示标准</span>
            <strong>来源、用途、权限、边界</strong>
          </p>
          <p>
            <span>数据说明</span>
            <strong>公开仓库核验，不虚构安装量</strong>
          </p>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">按工作找</p>
              <h2>你不需要知道它叫什么</h2>
            </div>
            <p>
              分类按“要完成什么工作”组织，不按编程语言和仓库结构组织。
            </p>
          </div>

          <div className="category-board">
            {categories.map((category, index) => (
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
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">本周精选</p>
            <h2>先从这几个具体任务开始</h2>
            <p>
              这里展示的是已核验公开来源，不是“绝对安全榜”。安装前仍要查看仓库和权限说明。
            </p>
          </div>

          <div className="featured-list">
            {featuredSkills.slice(0, 6).map((skill, index) => (
              <article className="featured-row" key={skill.slug}>
                <span className="featured-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="featured-main">
                  <p className="skill-kicker">
                    {skill.category} · {skill.kind}
                  </p>
                  <h3>{skill.chineseName}</h3>
                  <p>{skill.summary}</p>
                </div>
                <div className="featured-meta">
                  <span>{skill.difficulty}</span>
                  <span>{skill.sourceType}</span>
                </div>
                <Link href={`/skills/${skill.slug}`} aria-label={`查看 ${skill.chineseName}`}>
                  查看怎么用 <span>→</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="section-action">
            <Link href="/skills" className="button">
              查看全部 Skill
            </Link>
            <span>支持中文任务搜索和权限筛选</span>
          </div>
        </div>
      </section>

      <section className="section method-section">
        <div className="container method-layout">
          <div className="method-intro">
            <p className="eyebrow">网站解决什么</p>
            <h2>不是收集链接，是帮你判断能不能用</h2>
            <p>
              旧式导航站只告诉你“这里有个仓库”。开工站把一次选择拆成三个动作，让小白也知道下一步该做什么。
            </p>
            <Link href="/guide" className="text-link">
              先读 5 分钟小白指南 <span>→</span>
            </Link>
          </div>
          <ol className="method-steps">
            {pathSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section update-section" id="updates">
        <div className="container update-card">
          <div>
            <p className="eyebrow">2026-07-29 · 首发说明</p>
            <h2>所有数据都要有可信边界</h2>
          </div>
          <div className="update-copy">
            <p>
              当前版本只收录已核验公开仓库的代表性条目。本站没有把 GitHub Star
              写成质量分，也没有把“复制安装命令”写成真实安装量。
            </p>
            <p>
              “来源已核验”只表示仓库与路径存在，不代表脚本通过了完整安全审计。第三方
              Skill 仍需你在安装前查看源码。
            </p>
          </div>
          <Link href="/guide#safety" className="button button-light">
            查看安全判断方法
          </Link>
        </div>
      </section>
    </main>
  );
}
