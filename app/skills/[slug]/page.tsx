import type { Metadata } from "next";
import { ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillBySlug, skills } from "../../data/skills";
import { CopyActions } from "./CopyActions";
import { RecentSkillTracker } from "./RecentSkillTracker";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};

  return {
    title: `${skill.chineseName}怎么用`,
    description: `${skill.summary} 查看 GitHub 来源、安装要求、权限提示和可复制的使用话术。`,
  };
}

export default async function SkillDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const related = skills
    .filter(
      (item) => item.slug !== skill.slug && item.category === skill.category,
    )
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: skill.chineseName,
    alternateName: skill.name,
    description: skill.summary,
    codeRepository: skill.githubUrl,
    programmingLanguage: "Markdown",
  };

  return (
    <main id="main-content" className="detail-page">
      <RecentSkillTracker slug={skill.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <nav className="breadcrumbs" aria-label="面包屑">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href="/skills">全部 Skill</Link>
          <span>/</span>
          <span>{skill.chineseName}</span>
        </nav>

        <section className="detail-hero">
          <div className="detail-title">
            <p className="skill-kicker">
              {skill.category} · {skill.kind} · {skill.sourceType}
            </p>
            <h1>{skill.chineseName}</h1>
            <code>{skill.name}</code>
            <p>{skill.summary}</p>
            <div className="skill-tags">
              <span>{skill.difficulty}</span>
              <span>{skill.risk}</span>
              {skill.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <aside className="decision-card">
            <span className="decision-label">30 秒判断</span>
            <dl>
              <div>
                <dt>适合谁</dt>
                <dd>{skill.audience}</dd>
              </div>
              <div>
                <dt>会得到什么</dt>
                <dd>{skill.output}</dd>
              </div>
            </dl>
            <details className="source-details">
              <summary>
                来源状态
                <ChevronDown aria-hidden="true" size={16} />
              </summary>
              <p>
                公开来源链接已核验（{skill.lastVerifiedAt}），未作完整安全审计。未核验部分仍以安装前检查代替。
              </p>
            </details>
            <a
              href={skill.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="source-link"
            >
              打开 GitHub 源地址
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          </aside>
        </section>

        <div className="detail-layout">
          <article className="detail-content">
            <section>
              <p className="section-index">01</p>
              <h2>它能帮你完成什么</h2>
              <ul className="check-list">
                {skill.canDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <p className="section-index">02</p>
              <h2>它不能替你做什么</h2>
              <ul className="plain-list">
                {skill.cannotDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <p className="section-index">03</p>
              <h2>使用前要准备什么</h2>
              <ol className="number-list">
                {skill.requirements.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>

            <section className="permission-section">
              <details className="detail-disclosure" open>
                <summary>
                  <span className="section-index">04</span>
                  <h2>权限与风险提示</h2>
                  <ChevronDown aria-hidden="true" size={20} />
                </summary>
                <div className="detail-disclosure-body">
                  <p>
                    这些提示来自仓库公开说明与用途判断，不等于安全认证。安装前仍要查看
                    `SKILL.md`、脚本和依赖。
                  </p>
                  <ul>
                    {skill.permissions.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true">!</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </section>

            <section>
              <details className="detail-disclosure" open>
                <summary>
                  <span className="section-index">05</span>
                  <h2>安装方式</h2>
                  <ChevronDown aria-hidden="true" size={20} />
                </summary>
                <div className="detail-disclosure-body">
                  {skill.installCommand ? (
                    <div className="code-block">
                      <div>
                        <span>高级用户参考命令</span>
                        <small>执行前先查看 GitHub 仓库说明</small>
                      </div>
                      <code>{skill.installCommand}</code>
                    </div>
                  ) : skill.builtIn ? (
                    <div className="install-callout">
                      <strong>这是 Codex 系统内置 Skill</strong>
                      <p>
                        无需再次安装。直接在 Codex 中输入
                        <code>$skill-installer</code>
                        ，再说明你要列出或安装哪个 Skill。
                      </p>
                    </div>
                  ) : (
                    <div className="install-callout">
                      <strong>这是插件内 Skill</strong>
                      <p>
                        请在支持插件的 ChatGPT 桌面端或 Codex CLI
                        中打开插件目录，根据产品提示安装并连接所需服务。
                      </p>
                    </div>
                  )}
                  <p className="detail-note">{skill.installNote}</p>
                </div>
              </details>
            </section>

            <section>
              <p className="section-index">06</p>
              <h2>复制后直接用的话术</h2>
              <blockquote className="prompt-block">{skill.prompt}</blockquote>
              <CopyActions
                githubUrl={skill.githubUrl}
                installCommand={skill.installCommand}
                prompt={skill.prompt}
                slug={skill.slug}
              />
            </section>
          </article>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <span className="decision-label">安装位置说明</span>
              <p>
                项目级 Skill 放在
                <code>.agents/skills</code>
              </p>
              <p>
                个人级 Skill 放在
                <code>$HOME/.agents/skills</code>
              </p>
              <small>
                Codex 通常会自动检测更新；如果没有出现，再重新打开 Codex。
              </small>
            </div>

            <div className="sidebar-card">
              <span className="decision-label">需要更完整的任务？</span>
              <h3>把这个 Skill 放进任务单</h3>
              <p>补上输入、输出、权限边界和验收标准，再交给 Codex 执行。</p>
              <Link href={`/workbench?skill=${skill.slug}`} className="button">
                生成任务单
              </Link>
            </div>

          </aside>
        </div>

        {related.length ? (
          <section className="related-section">
            <div className="section-heading">
              <p className="eyebrow">继续看看</p>
              <h2>同类 Skill</h2>
            </div>
            <div className="related-grid">
              {related.map((item) => (
                <Link key={item.slug} href={`/skills/${item.slug}`}>
                  <span>{item.category}</span>
                  <h3>{item.chineseName}</h3>
                  <p>{item.summary}</p>
                  <b>查看说明 →</b>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
