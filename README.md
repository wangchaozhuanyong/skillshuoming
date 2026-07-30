# 技能开工站

面向中国 Codex 用户的 Skill 中文发现、判断、安装与使用网站。

## 当前实现

- 中文自然语言 Skill 搜索与分类筛选
- 12 个来源链接已核验的首发条目
- Skill 详情、权限提示、使用边界与 GitHub 源地址
- 本机收藏
- GitHub 下载入口、参考安装命令与使用话术复制
- Codex 任务单生成器
- 小白安装与安全指南
- 第三方服务透明预留页
- 响应式布局、键盘焦点、减少动画支持
- Open Graph 分享图与基础结构化数据

## 技术栈

- Next.js 16 / React 19
- TypeScript
- Tailwind CSS 4 入口 + 项目自定义 CSS
- vinext / Cloudflare Workers 兼容构建
- Sites 托管
- npm

## 本地开发

```bash
npm install
npm run dev
```

常用检查：

```bash
npm run lint
npm run check:skills
npm run check:links
npm run build
npm test
```

## 内容可信边界

- “来源链接已核验”表示公开仓库和路径在核验时存在，不代表完整安全审计。
- 不展示虚构安装量、虚构热度或把 GitHub Star 写成质量认证。
- 第三方 Skill 安装前仍需检查 `SKILL.md`、脚本、依赖、联网与密钥要求。
- 当前来源链接检查日期由 `app/data/site.ts` 统一维护。

## 静态内容更新

本站不使用 GitHub 自动采集、管理后台或自动发布。内容由 Codex
协助查找和编写，人工确认后再更新静态数据：

```text
查找候选 Skill
→ 核实 GitHub 地址与 SKILL.md
→ 编写中文说明和权限提示
→ 更新 app/data/skills.ts
→ 运行 check:skills、check:links、lint、test
→ 人工确认后再提交与部署
```

## 数据与隐私

当前版本没有业务数据库、用户账号、云端同步或一键安装。收藏、最近查看和最近任务只保存在浏览器本地：

- `skill-start-favorites`
- `skill-start-recent`
- `skill-start-last-task`

搜索与任务单生成在浏览器中完成。
