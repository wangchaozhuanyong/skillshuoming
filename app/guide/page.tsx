import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../data/site";

export const metadata: Metadata = {
  title: "Codex Skill 小白指南",
  description:
    "用简单中文了解 Skill 是什么、怎么安装、Skill 与插件的区别，以及安装前的安全检查方法。",
};

export default function GuidePage() {
  return (
    <main id="main-content" className="guide-page">
      <section className="guide-hero">
        <div className="container">
          <p className="eyebrow">5 分钟小白指南</p>
          <h1>先弄懂三件事，再安装第一个 Skill</h1>
          <p>
            Skill 不是“更长的 Prompt”，也不是装得越多越好。它是一套可重复使用的工作说明，还可能附带脚本、模板和工具依赖。
          </p>
          <div className="guide-source">
            <span>
              内容更新：{siteConfig.contentUpdatedAt} · 来源链接检查：
              {siteConfig.linkCheckedAt}
            </span>
            <a
              href="https://developers.openai.com/codex/skills"
              target="_blank"
              rel="noreferrer"
            >
              OpenAI 官方 Skill 文档 ↗
            </a>
          </div>
        </div>
      </section>

      <div className="container guide-layout">
        <aside className="guide-nav">
          <strong>本页内容</strong>
          <a href="#what">01 · Skill 是什么</a>
          <a href="#difference">02 · Skill 和插件</a>
          <a href="#install">03 · 放在哪里</a>
          <a href="#safety">04 · 安装前检查</a>
          <a href="#first">05 · 第一次使用</a>
        </aside>

        <article className="guide-content">
          <section id="what">
            <span className="chapter-number">01</span>
            <h2>Skill 是一份“可重复执行的工作说明”</h2>
            <p>
              一个 Skill 至少有一个 <code>SKILL.md</code>
              文件，里面写着名称、什么时候应该使用，以及完成这类工作时要遵守的步骤。它还可以带参考资料、模板和脚本。
            </p>
            <div className="guide-example">
              <span>举个例子</span>
              <p>
                普通 Prompt 可能只说“帮我整理会议纪要”。会议纪要 Skill
                会进一步规定：先找出决定，再列负责人和截止时间；缺失信息要标记待确认，不能猜。
              </p>
            </div>
            <p>
              Codex 先看到 Skill 的名称和简介。你的任务匹配时，它再读取完整说明。你也可以在
              Codex 里用 <code>$skill-name</code> 明确指定。
            </p>
          </section>

          <section id="difference">
            <span className="chapter-number">02</span>
            <h2>Skill 教“怎么做”，插件还可以带“能动手的工具”</h2>
            <div className="compare-table">
              <div>
                <span>Skill</span>
                <strong>适合固定工作方法</strong>
                <p>说明步骤、格式、边界，也可以附脚本与模板。</p>
                <small>例：会议纪要、网站测试、文章配图</small>
              </div>
              <div>
                <span>插件</span>
                <strong>适合安装和连接服务</strong>
                <p>可以把多个 Skill、连接器和 MCP 工具打包在一起。</p>
                <small>例：Figma、Notion、Google Drive</small>
              </div>
            </div>
            <p className="guide-caution">
              插件目前只在支持的 ChatGPT Work、ChatGPT 桌面端和 Codex CLI
              表面中使用；Codex IDE 扩展并不提供插件目录。具体可用性以你当前产品界面为准。
            </p>
          </section>

          <section id="install">
            <span className="chapter-number">03</span>
            <h2>Skill 放在哪里，取决于你想让谁使用</h2>
            <div className="location-list">
              <div>
                <span>只给当前项目</span>
                <code>&lt;项目&gt;/.agents/skills/&lt;skill-name&gt;</code>
                <p>适合团队项目，可以和项目代码一起管理。</p>
              </div>
              <div>
                <span>给自己所有项目</span>
                <code>$HOME/.agents/skills/&lt;skill-name&gt;</code>
                <p>适合你的个人通用工作流。</p>
              </div>
              <div>
                <span>从公开仓库安装</span>
                <code>$skill-installer &lt;skill-name 或 GitHub 地址&gt;</code>
                <p>先看来源和脚本，再让安装器下载。</p>
              </div>
            </div>
            <p>
              Codex 通常会自动发现 Skill
              变化。如果新安装的内容没有出现，再重新打开 Codex。不要把几十个 Skill
              一次性全装上：初始 Skill 列表有上下文预算，过多会让说明被缩短或省略。
            </p>
            <p className="guide-caution">
              本站不会替你自动安装 Skill。请先打开 GitHub
              查看源码和作者说明，再决定是否下载或复制参考命令。
            </p>
          </section>

          <section id="safety">
            <span className="chapter-number">04</span>
            <h2>安装前，至少检查这六项</h2>
            <ol className="safety-list">
              <li>
                <span>1</span>
                <div>
                  <strong>来源是谁</strong>
                  <p>是官方仓库、可信作者，还是刚创建的匿名项目？</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>会不会运行脚本</strong>
                  <p>查看 scripts 目录以及 Shell、Python、Node.js 命令。</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>会读取和上传什么</strong>
                  <p>本地文件、浏览器状态、客户资料会不会发送到第三方？</p>
                </div>
              </li>
              <li>
                <span>4</span>
                <div>
                  <strong>要不要 API Key</strong>
                  <p>密钥只能放环境变量或安全配置，不能写进 Skill 或提交到 Git。</p>
                </div>
              </li>
              <li>
                <span>5</span>
                <div>
                  <strong>会不会覆盖或删除文件</strong>
                  <p>第一次运行用副本，并明确要求不覆盖原件。</p>
                </div>
              </li>
              <li>
                <span>6</span>
                <div>
                  <strong>最近是否还在维护</strong>
                  <p>安装说明、路径和依赖会变化，旧教程不一定还能用。</p>
                </div>
              </li>
            </ol>
            <div className="warning-callout">
              <strong>“来源链接已核验”不等于“绝对安全”</strong>
              <p>
                GitHub Star 只能反映关注度信号。任何包含脚本、联网或账号权限的
                Skill，都需要按你的数据和使用场景重新判断。
              </p>
            </div>
          </section>

          <section id="first">
            <span className="chapter-number">05</span>
            <h2>第一次使用，照着这个顺序</h2>
            <ol className="first-run-list">
              <li>选一个具体的小任务，不要一次安装一整套。</li>
              <li>先阅读 Skill 详情页和 GitHub 原始说明。</li>
              <li>用不含敏感信息的测试文件试运行。</li>
              <li>明确“不覆盖原文件、缺失信息不猜、完成后自检”。</li>
              <li>确认输出真的能打开，再放进正式工作。</li>
            </ol>
            <div className="guide-cta">
              <div>
                <strong>准备开工了吗？</strong>
                <p>先找一个 Skill，或者把你的目标整理成任务单。</p>
              </div>
              <div>
                <Link href="/skills" className="button">
                  找 Skill
                </Link>
                <Link href="/workbench" className="button button-outline">
                  生成任务单
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
