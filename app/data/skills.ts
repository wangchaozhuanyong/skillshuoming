export type SkillSourceType = "OpenAI 官方" | "社区精选";
export type SkillRisk = "低关注" | "需留意" | "谨慎使用";
export type SkillKind = "Skill" | "插件内 Skill";

export type SkillEntry = {
  slug: string;
  name: string;
  chineseName: string;
  summary: string;
  category: string;
  kind: SkillKind;
  sourceType: SkillSourceType;
  repository: string;
  githubUrl: string;
  difficulty: "小白可用" | "需要基础配置" | "适合进阶用户";
  risk: SkillRisk;
  tags: string[];
  aliases: string[];
  audience: string;
  output: string;
  canDo: string[];
  cannotDo: string[];
  requirements: string[];
  permissions: string[];
  prompt: string;
  installCommand?: string;
  installNote: string;
  builtIn?: boolean;
  featured?: boolean;
};

export const categories = [
  {
    name: "办公文档",
    short: "PPT、表格、会议纪要",
    symbol: "文",
    aliases: ["ppt", "excel", "表格", "会议", "word", "slides"],
  },
  {
    name: "内容创作",
    short: "公众号、小红书、研究写作",
    symbol: "写",
    aliases: ["小红书", "公众号", "文章", "文案", "写作"],
  },
  {
    name: "图片设计",
    short: "封面、信息图、界面设计",
    symbol: "图",
    aliases: ["图片", "海报", "封面", "设计", "figma"],
  },
  {
    name: "网站与产品",
    short: "建站、测试、产品交付",
    symbol: "站",
    aliases: ["网站", "产品", "前端", "网页", "测试"],
  },
  {
    name: "数据分析",
    short: "公式、清洗、图表分析",
    symbol: "数",
    aliases: ["数据", "excel", "csv", "公式", "图表"],
  },
  {
    name: "自动化工具",
    short: "Notion、协作与批处理",
    symbol: "自",
    aliases: ["自动化", "notion", "批量", "工作流", "协作"],
  },
  {
    name: "编程开发",
    short: "代码、测试、修复问题",
    symbol: "码",
    aliases: ["代码", "bug", "开发", "测试", "部署"],
  },
  {
    name: "Skill 工具",
    short: "创建、检查与管理 Skill",
    symbol: "技",
    aliases: ["skill", "创建", "安装", "检查", "管理"],
  },
] as const;

const installerPath =
  "python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py";

export const skills: SkillEntry[] = [
  {
    slug: "baoyu-xhs-images",
    name: "baoyu-xhs-images",
    chineseName: "小红书图卡生成",
    summary: "把文章或主题拆成 1–10 张小红书图卡，可选择版式、风格和配色。",
    category: "内容创作",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "JimLiu/baoyu-skills",
    githubUrl:
      "https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-xhs-images",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["小红书", "图卡", "中文场景"],
    aliases: ["小红书图片", "图文卡片", "内容转图片", "xhs"],
    audience: "自媒体运营、内容编辑、知识博主",
    output: "一组可发布的图片卡片",
    canDo: [
      "分析内容并拆分卡片结构",
      "选择适合的图卡版式与风格",
      "按同一视觉系统生成整组图片",
    ],
    cannotDo: [
      "不会替你确认平台内容合规",
      "不会自动保证所有生成文字零错字",
    ],
    requirements: ["电脑已安装 Node.js", "根据仓库说明准备可用的图片生成能力"],
    permissions: ["读取你指定的文章文件", "会运行仓库脚本", "生成图片时可能访问外部模型"],
    prompt:
      "请使用 $baoyu-xhs-images，把 article.md 做成 8 张小红书图卡。封面突出标题，正文每张只讲一个重点，使用 3:4 比例，完成后检查图片里的中文文字。",
    installCommand: `${installerPath} --repo JimLiu/baoyu-skills --path skills/baoyu-xhs-images`,
    installNote: "第三方 Skill。安装前先查看仓库脚本与依赖，安装后建议重新打开 Codex 会话。",
    featured: true,
  },
  {
    slug: "baoyu-infographic",
    name: "baoyu-infographic",
    chineseName: "专业信息图生成",
    summary: "把复杂内容整理成流程、对比、时间线、金字塔等结构化信息图。",
    category: "图片设计",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "JimLiu/baoyu-skills",
    githubUrl:
      "https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-infographic",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["信息图", "流程图", "知识整理"],
    aliases: ["信息图", "流程图", "对比图", "时间线", "图解"],
    audience: "运营、培训、咨询、产品与研究人员",
    output: "适合发布或汇报的信息图图片",
    canDo: ["分析内容结构", "推荐信息布局", "输出多种比例的信息图"],
    cannotDo: ["不能代替人工核对专业数据", "不会自动取得受版权保护的素材授权"],
    requirements: ["电脑已安装 Node.js", "根据仓库说明配置图片生成能力"],
    permissions: ["读取指定内容", "运行脚本", "生成图片时可能联网"],
    prompt:
      "请使用 $baoyu-infographic，把 report.md 做成一张 16:9 的流程信息图。先给我布局建议，确认后再生成，并逐项核对原文中的数字。",
    installCommand: `${installerPath} --repo JimLiu/baoyu-skills --path skills/baoyu-infographic`,
    installNote: "本站只核验了公开来源，未替作者做安全背书。",
    featured: true,
  },
  {
    slug: "baoyu-article-illustrator",
    name: "baoyu-article-illustrator",
    chineseName: "文章自动配图",
    summary: "分析文章段落，为需要解释或停顿的位置规划并生成配图。",
    category: "内容创作",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "JimLiu/baoyu-skills",
    githubUrl:
      "https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-article-illustrator",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["文章配图", "公众号", "插图"],
    aliases: ["给文章配图", "公众号配图", "插画", "article image"],
    audience: "公众号作者、编辑、课程内容团队",
    output: "文章配图与插入建议",
    canDo: ["判断配图位置", "规划整篇视觉风格", "生成并整理图片文件"],
    cannotDo: ["不能自动确认图片版权", "不能保证所有模型都支持中文文字"],
    requirements: ["准备 Markdown 或文本文章", "按仓库说明配置图像模型"],
    permissions: ["读取文章", "创建图片文件", "可能访问外部图像服务"],
    prompt:
      "请使用 $baoyu-article-illustrator，为 article.md 规划 5 张配图。先列出每张图的位置和作用，再统一风格生成，原文件先备份。",
    installCommand: `${installerPath} --repo JimLiu/baoyu-skills --path skills/baoyu-article-illustrator`,
    installNote: "使用外部图片模型时，请勿上传含敏感信息的原文。",
  },
  {
    slug: "spreadsheet-formula-helper",
    name: "spreadsheet-formula-helper",
    chineseName: "Excel 公式助手",
    summary: "根据你的表格目标编写、解释和排查 Excel 或表格公式。",
    category: "数据分析",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "composio-community/awesome-codex-skills",
    githubUrl:
      "https://github.com/composio-community/awesome-codex-skills/tree/master/spreadsheet-formula-helper",
    difficulty: "小白可用",
    risk: "低关注",
    tags: ["Excel", "公式", "表格"],
    aliases: ["excel公式", "表格公式", "vlookup", "透视表", "spreadsheet"],
    audience: "行政、财务、运营、数据初学者",
    output: "可复制的公式、解释和排错步骤",
    canDo: ["编写公式", "解释公式逻辑", "排查常见错误"],
    cannotDo: ["不能替代会计或审计判断", "没有源文件时无法核对真实列结构"],
    requirements: ["提供列名、示例数据或表格文件", "说明使用 Excel、WPS 还是 Google Sheets"],
    permissions: ["只读取你提供的表格或描述", "是否修改文件由你的任务要求决定"],
    prompt:
      "请使用 $spreadsheet-formula-helper，检查 sales.xlsx 的“本月”工作表。我要按客户编号汇总含税金额，请先确认列名，再给出公式和一个不修改原文件的验证结果。",
    installCommand: `${installerPath} --repo composio-community/awesome-codex-skills --path spreadsheet-formula-helper`,
    installNote: "如果涉及真实业务表格，先使用脱敏副本测试公式。",
    featured: true,
  },
  {
    slug: "meeting-notes-and-actions",
    name: "meeting-notes-and-actions",
    chineseName: "会议纪要与行动项",
    summary: "把会议记录整理成结论、决定、负责人和下一步行动。",
    category: "办公文档",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "composio-community/awesome-codex-skills",
    githubUrl:
      "https://github.com/composio-community/awesome-codex-skills/tree/master/meeting-notes-and-actions",
    difficulty: "小白可用",
    risk: "低关注",
    tags: ["会议纪要", "行动项", "办公"],
    aliases: ["会议总结", "会议记录", "待办", "meeting notes"],
    audience: "项目经理、销售、行政和团队负责人",
    output: "结构化会议纪要与行动项清单",
    canDo: ["提炼决定", "识别负责人", "整理截止时间与风险"],
    cannotDo: ["不能从含糊记录中猜负责人", "不能替你发送会议通知"],
    requirements: ["提供文字记录或转写文本", "敏感会议先做脱敏"],
    permissions: ["读取会议文本", "默认不联网", "默认不修改原始记录"],
    prompt:
      "请使用 $meeting-notes-and-actions，把 meeting.txt 整理成会议纪要。负责人和日期缺失时标记“待确认”，不要猜测；最后输出一个按负责人分组的行动项表格。",
    installCommand: `${installerPath} --repo composio-community/awesome-codex-skills --path meeting-notes-and-actions`,
    installNote: "涉及客户、财务或人事信息时，先确认数据可否交给所使用的模型处理。",
    featured: true,
  },
  {
    slug: "content-research-writer",
    name: "content-research-writer",
    chineseName: "带来源的内容研究",
    summary: "先检索和整理可靠来源，再写成带出处的文章或研究稿。",
    category: "内容创作",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "composio-community/awesome-codex-skills",
    githubUrl:
      "https://github.com/composio-community/awesome-codex-skills/tree/master/content-research-writer",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["研究", "写作", "引用"],
    aliases: ["研究文章", "带引用", "资料整理", "内容调研"],
    audience: "内容团队、市场研究、学生与顾问",
    output: "带来源说明的文章草稿",
    canDo: ["列研究问题", "整理来源", "区分事实与推断"],
    cannotDo: ["不能保证网页内容永久有效", "不能替代专业法律或医学审核"],
    requirements: ["允许联网检索", "明确文章对象、用途和发布日期"],
    permissions: ["访问互联网", "读取你提供的资料", "可能把查询发送给搜索服务"],
    prompt:
      "请使用 $content-research-writer，研究“中小企业如何开始使用 Codex”。只使用一手资料，区分事实和建议，给出直接链接，并标注资料日期。",
    installCommand: `${installerPath} --repo composio-community/awesome-codex-skills --path content-research-writer`,
    installNote: "高风险主题需要专业人员复核；不要把来源数量当作准确性证明。",
  },
  {
    slug: "webapp-testing",
    name: "webapp-testing",
    chineseName: "网站交互测试",
    summary: "按真实用户操作路径检查网页功能，并整理可复现的问题。",
    category: "编程开发",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "composio-community/awesome-codex-skills",
    githubUrl:
      "https://github.com/composio-community/awesome-codex-skills/tree/master/webapp-testing",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["网站测试", "浏览器", "Bug"],
    aliases: ["测试网站", "网页测试", "浏览器测试", "web test"],
    audience: "产品经理、网站运营、前端开发者",
    output: "测试记录、问题证据与复现步骤",
    canDo: ["执行关键路径", "记录错误状态", "整理复现步骤"],
    cannotDo: ["不能证明网站在所有设备上都正常", "不能在未授权网站执行破坏性测试"],
    requirements: ["提供可访问的网址", "明确允许测试的账号与范围"],
    permissions: ["控制浏览器", "访问目标网站", "可能读取测试账号可见内容"],
    prompt:
      "请使用 $webapp-testing，检查本地网站的注册、登录和下单路径。不要提交真实付款；记录视口、控制台错误、失败请求和复现步骤。",
    installCommand: `${installerPath} --repo composio-community/awesome-codex-skills --path webapp-testing`,
    installNote: "只测试你拥有或明确获准测试的网站。",
  },
  {
    slug: "skill-installer",
    name: "skill-installer",
    chineseName: "Skill 安装器",
    summary: "按 Skill 名称或 GitHub 仓库路径，把指定 Skill 安装到本机 Codex。",
    category: "Skill 工具",
    kind: "Skill",
    sourceType: "OpenAI 官方",
    repository: "Codex 系统内置",
    githubUrl:
      "https://github.com/openai/skills/tree/main/skills/.system/skill-installer",
    difficulty: "小白可用",
    risk: "需留意",
    tags: ["安装", "GitHub", "Skill 管理"],
    aliases: ["安装skill", "skill安装", "github安装", "技能安装"],
    audience: "需要从官方清单或公开仓库添加 Skill 的 Codex 用户",
    output: "安装到本机的一个或多个 Skill 目录",
    canDo: ["列出可安装 Skill", "安装官方精选 Skill", "按 GitHub 路径安装第三方 Skill"],
    cannotDo: ["不会替你证明第三方 Skill 安全", "目标目录已存在时不会直接覆盖"],
    requirements: ["确认要安装的 Skill 名称或 GitHub 路径", "私有仓库需要已有 GitHub 访问权限"],
    permissions: ["需要联网下载仓库内容", "会在本机 Skill 目录创建文件", "可能使用现有 Git 凭据访问私有仓库"],
    prompt:
      "请使用 $skill-installer，先核验这个 GitHub 地址中的 SKILL.md 和目标路径，再只安装我指定的一个 Skill；不要批量安装整个仓库。",
    installNote: "这是 Codex 系统内置 Skill，无需重复安装。第三方来源仍需在下载前查看源码。",
    builtIn: true,
  },
  {
    slug: "paperjsx",
    name: "paperjsx",
    chineseName: "办公文件批量生成",
    summary: "根据结构化数据生成 PPTX、DOCX、XLSX、PDF 等办公文件。",
    category: "办公文档",
    kind: "Skill",
    sourceType: "社区精选",
    repository: "composio-community/awesome-codex-skills",
    githubUrl:
      "https://github.com/composio-community/awesome-codex-skills/tree/master/paperjsx",
    difficulty: "适合进阶用户",
    risk: "需留意",
    tags: ["PPT", "Word", "PDF"],
    aliases: ["做ppt", "生成word", "生成pdf", "办公文件"],
    audience: "需要批量生成规范文档的运营与开发团队",
    output: "PPTX、DOCX、XLSX 或 PDF 文件",
    canDo: ["从结构化数据生成文档", "复用模板", "本地批量处理"],
    cannotDo: ["不能自动保证复杂版式零溢出", "不能替代最终视觉质检"],
    requirements: ["安装对应本地工具", "准备结构化内容或模板"],
    permissions: ["运行本地程序", "读取输入数据", "在指定目录创建文件"],
    prompt:
      "请使用 $paperjsx，根据 report.json 生成一份 12 页中文汇报 PPTX。保持标题层级统一，图表必须有单位，完成后检查文字溢出与缺页。",
    installCommand: `${installerPath} --repo composio-community/awesome-codex-skills --path paperjsx`,
    installNote: "生成后仍需打开最终文件做视觉检查。",
  },
  {
    slug: "openai-figma",
    name: "figma",
    chineseName: "Figma 设计协作",
    summary: "把设计稿、组件和代码连接起来，用于设计理解、生成与交付。",
    category: "图片设计",
    kind: "插件内 Skill",
    sourceType: "OpenAI 官方",
    repository: "openai/plugins",
    githubUrl: "https://github.com/openai/plugins/tree/main/plugins/figma",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["Figma", "UI", "设计系统"],
    aliases: ["figma", "ui设计", "设计稿", "组件库"],
    audience: "产品设计师、前端开发者、设计系统团队",
    output: "设计分析、Figma 文件变更或代码映射",
    canDo: ["读取授权设计内容", "辅助生成设计", "维护组件与代码映射"],
    cannotDo: ["没有连接 Figma 时不能读取私有文件", "不会自动拥有团队空间权限"],
    requirements: ["在支持插件的 Codex/ChatGPT 表面安装插件", "按提示连接 Figma"],
    permissions: ["访问你授权的 Figma 内容", "部分操作会写入 Figma", "受 Figma 自身权限限制"],
    prompt:
      "请使用 Figma 插件，检查这个产品页的移动端设计。先列出信息层级、间距和可访问性问题，不要直接修改；我确认后再生成新方案。",
    installNote: "在 ChatGPT 桌面端或 Codex CLI 的插件目录中查看。安装后新开一个会话使用。",
    featured: true,
  },
  {
    slug: "openai-notion",
    name: "notion",
    chineseName: "Notion 工作流",
    summary: "把会议、研究和项目资料整理进 Notion，并按既定结构持续维护。",
    category: "自动化工具",
    kind: "插件内 Skill",
    sourceType: "OpenAI 官方",
    repository: "openai/plugins",
    githubUrl: "https://github.com/openai/plugins/tree/main/plugins/notion",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["Notion", "知识库", "会议"],
    aliases: ["notion", "知识库", "项目资料", "会议同步"],
    audience: "团队负责人、知识管理与项目运营人员",
    output: "Notion 页面、会议资料或结构化知识",
    canDo: ["读取授权页面", "整理会议和研究信息", "按模板写入工作区"],
    cannotDo: ["不能访问未授权页面", "不会绕过 Notion 权限"],
    requirements: ["安装官方插件", "连接自己的 Notion 账号"],
    permissions: ["读取授权页面", "写入前需要相应权限", "数据处理受第三方条款约束"],
    prompt:
      "请使用 Notion 插件，把今天的会议记录整理到“项目周会”数据库。写入前先给我字段映射预览，负责人不明确时不要猜测。",
    installNote: "连接前先确认允许访问的工作区范围，尽量使用最小权限。",
  },
  {
    slug: "openai-build-web-apps",
    name: "build-web-apps",
    chineseName: "网站开发工作流",
    summary: "把产品需求拆成可实现的网站任务，覆盖界面、数据、支付与部署检查。",
    category: "网站与产品",
    kind: "插件内 Skill",
    sourceType: "OpenAI 官方",
    repository: "openai/plugins",
    githubUrl:
      "https://github.com/openai/plugins/tree/main/plugins/build-web-apps",
    difficulty: "适合进阶用户",
    risk: "谨慎使用",
    tags: ["网站开发", "数据库", "部署"],
    aliases: ["开发网站", "全栈", "部署", "支付", "数据库"],
    audience: "独立开发者、产品团队、网站技术负责人",
    output: "可运行的网站代码与验证结果",
    canDo: ["规划和实现网站", "检查关键流程", "连接适用的开发工具"],
    cannotDo: ["不会替你获得生产发布权限", "不能保证第三方服务永久可用"],
    requirements: ["明确项目与授权范围", "生产配置变更前需要人工确认"],
    permissions: ["可能修改代码和配置", "可能连接部署或数据库服务", "生产操作需要额外确认"],
    prompt:
      "请使用 build-web-apps 插件，先审计当前项目并给出最小修改计划。不要改支付、登录、数据库结构或生产配置；实现后运行现有检查。",
    installNote: "涉及支付、登录、数据库与部署时，必须逐项确认范围和权限。",
  },
  {
    slug: "openai-google-slides",
    name: "google-slides",
    chineseName: "Google 幻灯片工作流",
    summary: "根据资料创建、整理和检查 Google Slides 演示文稿。",
    category: "办公文档",
    kind: "插件内 Skill",
    sourceType: "OpenAI 官方",
    repository: "openai/plugins",
    githubUrl:
      "https://github.com/openai/plugins/tree/main/plugins/google-slides",
    difficulty: "需要基础配置",
    risk: "需留意",
    tags: ["PPT", "Google Slides", "汇报"],
    aliases: ["做ppt", "幻灯片", "slides", "演示文稿"],
    audience: "销售、培训、管理者与内容团队",
    output: "Google Slides 演示文稿",
    canDo: ["根据资料规划页结构", "创建或编辑幻灯片", "检查内容完整性"],
    cannotDo: ["不能访问未授权文件", "不能替你确认所有品牌或版权要求"],
    requirements: ["在支持插件的表面安装", "连接 Google 账号并授权对应文件"],
    permissions: ["读取授权文件", "按任务写入幻灯片", "受 Google 账号权限限制"],
    prompt:
      "请使用 Google Slides 插件，把 brief.md 做成 10 页中文销售演示。先给页纲，不要编造客户数据；完成后检查每页文字密度和引用来源。",
    installNote: "使用最小文件权限；涉及客户资料时先确认可否上传到第三方服务。",
    featured: true,
  },
];

export const featuredSkills = skills.filter((skill) => skill.featured);

export function getSkillBySlug(slug: string) {
  return skills.find((skill) => skill.slug === slug);
}

export function buildSearchText(skill: SkillEntry) {
  return [
    skill.chineseName,
    skill.name,
    skill.summary,
    skill.category,
    skill.audience,
    ...skill.tags,
    ...skill.aliases,
  ]
    .join(" ")
    .toLowerCase();
}
