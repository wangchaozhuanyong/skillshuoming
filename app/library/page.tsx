import type { Metadata } from "next";
import { MyLibrary } from "./MyLibrary";

export const metadata: Metadata = {
  title: "我的 Skill 清单",
  description: "查看保存在当前浏览器中的 Skill 收藏。",
};

export default function LibraryPage() {
  return (
    <main id="main-content" className="library-page">
      <section className="page-hero page-hero-compact">
        <div className="container">
          <p className="eyebrow">MY SKILL DESK</p>
          <h1>我的 Skill 清单</h1>
          <p>
            无需注册。收藏只保存在当前浏览器，清理浏览器数据后会一并删除。
          </p>
        </div>
      </section>
      <section className="section container">
        <MyLibrary />
      </section>
    </main>
  );
}
