import type { Metadata } from "next";
import { siteConfig } from "../data/site";

export const metadata: Metadata = {
  title: "使用条款",
  description: "技能开工站当前版本的使用边界与第三方来源说明。",
};

export default function TermsPage() {
  return (
    <main id="main-content" className="simple-page legal-page">
      <article className="container narrow-container">
        <p className="eyebrow">使用条款</p>
        <h1>使用本站前请了解这些边界</h1>
        <p className="simple-lead">
          更新日期：{siteConfig.legalUpdatedAt}
        </p>

        <h2>非官方产品</h2>
        <p>
          技能开工站不是 OpenAI 官方网站，也不代表 GitHub
          仓库作者。页面会尽量清楚标注官方来源与社区来源。
        </p>

        <h2>不是安全认证</h2>
        <p>
          “来源链接已核验”仅表示公开仓库和页面路径在核验时存在，不代表第三方
          Skill 通过完整代码审计、隔离运行或安全认证。
        </p>

        <h2>安装与运行责任</h2>
        <p>
          运行第三方脚本、连接账号、提供 API Key
          或修改文件前，请检查源码和权限，并在你有权操作的设备、账号与项目中使用。
        </p>

        <h2>数据可能变化</h2>
        <p>
          仓库内容、安装路径、产品功能和第三方条款都会变化。本站会标注核验日期，但无法保证外部内容永久不变。
        </p>
      </article>
    </main>
  );
}
