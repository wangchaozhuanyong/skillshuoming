import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  const metadataBase = host ? new URL(`${protocol}://${host}`) : undefined;
  const ogImage = metadataBase
    ? new URL("/og.png", metadataBase).toString()
    : undefined;

  return {
    metadataBase,
    title: {
      default: "技能开工站｜Codex Skill 中文指南",
      template: "%s｜技能开工站",
    },
    description:
      "面向中国 Codex 用户的 Skill 中文发现、判断、安装与使用指南。",
    keywords: [
      "Codex Skill",
      "Codex 技能",
      "Skill 中文教程",
      "AI 工具",
      "Codex 安装",
    ],
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: "技能开工站",
      title: "技能开工站｜不用学术语，先把工作做成",
      description:
        "用中文找到合适的 Codex Skill，查看来源、权限和可直接复制的任务单。",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1731,
              height: 909,
              alt: "技能开工站｜Codex Skill 中文指南",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: "技能开工站｜不用学术语，先把工作做成",
      description:
        "用中文找到合适的 Codex Skill，查看来源、权限和可直接复制的任务单。",
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    try {
      var savedTheme = localStorage.getItem("skill-start-theme");
      document.documentElement.dataset.theme = savedTheme || "light";
    } catch (_) {
      document.documentElement.dataset.theme = "light";
    }
  `;

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
