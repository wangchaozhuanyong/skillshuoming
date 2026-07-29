import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-block">
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span className="brand-copy">
              <strong>技能开工站</strong>
              <small>CODEX SKILL 中文库</small>
            </span>
          </div>
          <p>
            帮中国 Codex 用户看懂 Skill、判断权限并开始工作。非 OpenAI
            官方产品，不对第三方 Skill 作绝对安全保证。
          </p>
        </div>

        <div className="footer-map" aria-label="页脚导航">
          <div>
            <strong>发现</strong>
            <Link href="/skills">全部 Skill</Link>
            <Link href="/categories">工作分类</Link>
            <Link href="/rankings">综合推荐</Link>
          </div>
          <div>
            <strong>工作</strong>
            <Link href="/workbench">任务单生成器</Link>
            <Link href="/library">我的清单</Link>
            <Link href="/guide">小白教程</Link>
          </div>
          <div>
            <strong>站点</strong>
            <Link href="/updates">更新记录</Link>
            <Link href="/services">第三方服务</Link>
            <Link href="/privacy">隐私说明</Link>
            <Link href="/terms">使用条款</Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 技能开工站</span>
        <span>公开来源核验日期：2026-07-29</span>
        <a
          href="https://github.com/wangchaozhuanyong/skillshuoming"
          target="_blank"
          rel="noreferrer"
        >
          GitHub 源码 ↗
        </a>
      </div>
    </footer>
  );
}
