import { categories, skills } from "../app/data/skills.ts";

const errors = [];
const categoryNames = new Set(categories.map((category) => category.name));
const seenSlugs = new Set();

const requiredTextFields = [
  "slug",
  "name",
  "chineseName",
  "summary",
  "category",
  "kind",
  "sourceType",
  "repository",
  "githubUrl",
  "audience",
  "output",
  "prompt",
  "installNote",
  "lastVerifiedAt",
];

const requiredListFields = [
  "tags",
  "aliases",
  "canDo",
  "cannotDo",
  "requirements",
  "permissions",
];

for (const skill of skills) {
  for (const field of requiredTextFields) {
    if (typeof skill[field] !== "string" || !skill[field].trim()) {
      errors.push(`${skill.slug || "(missing slug)"}: 缺少 ${field}`);
    }
  }

  for (const field of requiredListFields) {
    if (!Array.isArray(skill[field]) || skill[field].length === 0) {
      errors.push(`${skill.slug || "(missing slug)"}: ${field} 不能为空`);
    }
  }

  if (seenSlugs.has(skill.slug)) {
    errors.push(`${skill.slug}: slug 重复`);
  }
  seenSlugs.add(skill.slug);

  if (!categoryNames.has(skill.category)) {
    errors.push(`${skill.slug}: 未知分类 ${skill.category}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(skill.lastVerifiedAt || "")) {
    errors.push(`${skill.slug}: lastVerifiedAt 格式必须是 YYYY-MM-DD`);
  }

  try {
    const url = new URL(skill.githubUrl);
    if (url.protocol !== "https:" || url.hostname !== "github.com") {
      errors.push(`${skill.slug}: GitHub 地址必须使用 https://github.com`);
    }
  } catch {
    errors.push(`${skill.slug}: GitHub 地址格式无效`);
  }
}

if (errors.length) {
  console.error(`Skill 内容校验失败，共 ${errors.length} 项：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Skill 内容校验通过：${skills.length} 个条目，${categoryNames.size} 个预设分类。`,
  );
}
