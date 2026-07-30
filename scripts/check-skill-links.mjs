import { skills } from "../app/data/skills.ts";

const failures = [];

for (const skill of skills) {
  try {
    const response = await fetch(skill.githubUrl, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "user-agent": "skill-start-station-link-check",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      failures.push(`${skill.slug}: HTTP ${response.status}`);
      console.error(`✗ ${skill.slug} → HTTP ${response.status}`);
      continue;
    }

    console.log(`✓ ${skill.slug} → HTTP ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${skill.slug}: ${message}`);
    console.error(`✗ ${skill.slug} → ${message}`);
  }
}

if (failures.length) {
  console.error(`\nGitHub 链接检查失败，共 ${failures.length} 项。`);
  process.exitCode = 1;
} else {
  console.log(`\nGitHub 链接检查通过：${skills.length} 个地址均可访问。`);
}
