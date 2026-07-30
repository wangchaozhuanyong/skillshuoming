import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";
import { MyLibrary } from "./MyLibrary";

export const metadata: Metadata = {
  title: "我的 Skill 清单",
  description: "查看保存在当前浏览器中的 Skill 收藏。",
};

export default function LibraryPage() {
  return (
    <main id="main-content" className="library-page">
      <PageHeader
        eyebrow="我的清单"
        title="保存在当前浏览器里的 Skill"
        description="无需注册，也不会上传云端；清理浏览器数据后，本地收藏和最近查看会一并删除。"
        meta={
          <>
            <span>本机保存</span>
            <span>无需账号</span>
          </>
        }
      />
      <section className="section container">
        <MyLibrary />
      </section>
    </main>
  );
}
