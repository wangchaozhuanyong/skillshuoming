import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "第三方服务入口",
  description: "AI 接口中转与订阅协助服务的透明说明和预留入口。",
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="simple-page">
      <div className="container narrow-container">
        <p className="eyebrow">商业服务 · 明确分区</p>
        <h1>第三方服务入口</h1>
        <p className="simple-lead">
          这两个入口与自然 Skill 推荐分开。正式服务地址、运营主体、计费、退款和隐私说明尚未配置，因此当前不提供跳转、付款或账号提交。
        </p>

        <div className="service-grid">
          <article id="api">
            <span>服务 A</span>
            <h2>AI 接口中转</h2>
            <p>
              正式开放前需要说明支持模型、计费方式、日志保留、数据处理与退款规则。
            </p>
            <button type="button" disabled>
              待配置真实地址
            </button>
          </article>
          <article id="subscription">
            <span>服务 B</span>
            <h2>AI 订阅协助</h2>
            <p>
              正式开放前需要说明服务边界。不会提供共享账号，也不会索取你的登录密码。
            </p>
            <button type="button" disabled>
              待配置真实地址
            </button>
          </article>
        </div>

        <div className="warning-callout">
          <strong>请勿向未确认的页面提交密钥、密码或验证码</strong>
          <p>
            当真实服务准备好后，应由网站运营方提供可核验的公司信息、条款、隐私政策和售后方式。
          </p>
        </div>

        <Link href="/" className="text-link">
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
