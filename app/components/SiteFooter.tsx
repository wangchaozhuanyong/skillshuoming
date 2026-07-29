import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              技
            </span>
            <span>
              <strong>技能开工站</strong>
              <small>把复杂 Skill 讲成人话</small>
            </span>
          </div>
          <p className="footer-note">
            非 OpenAI 官方产品。本站展示来源、权限提示和使用方法，不对第三方
            Skill 作绝对安全保证。
          </p>
        </div>

        <div className="footer-links" aria-label="页脚导航">
          <div>
            <strong>开始使用</strong>
            <Link href="/skills">查找 Skill</Link>
            <Link href="/workbench">生成任务单</Link>
            <Link href="/guide">安装指南</Link>
          </div>
          <div>
            <strong>站点信息</strong>
            <Link href="/services">第三方服务入口</Link>
            <Link href="/privacy">隐私说明</Link>
            <Link href="/terms">使用条款</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 技能开工站</span>
        <span>最近核验：2026-07-29</span>
      </div>
    </footer>
  );
}
