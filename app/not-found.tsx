import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <div className="container">
        <span>404</span>
        <h1>这个页面没有找到</h1>
        <p>链接可能已经变化。回到 Skill 目录，用工作目标重新搜索。</p>
        <div>
          <Link href="/skills" className="button">
            去找 Skill
          </Link>
          <Link href="/" className="button button-outline">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
