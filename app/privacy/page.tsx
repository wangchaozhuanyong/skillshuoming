import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私说明",
  description: "技能开工站当前版本的数据处理说明。",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="simple-page legal-page">
      <article className="container narrow-container">
        <p className="eyebrow">隐私说明</p>
        <h1>当前版本如何处理你的数据</h1>
        <p className="simple-lead">更新日期：2026-07-29</p>

        <h2>搜索与任务内容</h2>
        <p>
          当前前端版本不会主动把搜索词或任务单内容提交到本站业务数据库。任务单在浏览器中生成。
        </p>

        <h2>本机保存</h2>
        <p>
          为了保留收藏和最近生成的任务，网站会使用浏览器本地存储，键名为
          <code>skill-start-favorites</code> 和
          <code>skill-start-last-task</code>。清除浏览器站点数据即可删除。
        </p>

        <h2>外部链接</h2>
        <p>
          点击 GitHub 或其他第三方链接后，将适用第三方自己的隐私政策与服务条款。不要在本站或未知页面填写
          API Key、密码、Cookie 或验证码。
        </p>

        <h2>基础托管日志</h2>
        <p>
          托管和网络服务可能为了安全、稳定性和故障排查处理基础访问日志。正式运营前应补充运营主体、联系方式、保留周期和用户权利说明。
        </p>
      </article>
    </main>
  );
}
