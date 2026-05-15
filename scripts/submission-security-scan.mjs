import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const outputPath = path.join(root, "artifacts/generated/submission-security-scan.json");

const skipDirs = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".venv",
  "venv",
  "__pycache__"
]);

const textExtensions = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".json", ".md", ".txt", ".yml", ".yaml", ".toml",
  ".env", ".example", ".css", ".html", ".py", ".rb",
  ".go", ".rs", ".java", ".kt", ".swift", ".php",
  ".sh", ".bash", ".zsh", ".sql", ".graphql"
]);

const secretPatterns = [
  { id: "openai-key", label: "OpenAI API key", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { id: "github-token", label: "GitHub token", regex: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/g },
  { id: "slack-token", label: "Slack token", regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g },
  { id: "aws-access-key", label: "AWS access key id", regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: "private-key", label: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
  { id: "generic-assignment", label: "Credential-like assignment", regex: /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*["']?([A-Za-z0-9_./+=-]{24,})["']?/gi }
];

const riskyFilePatterns = [
  /^\.env(?:\..+)?$/,
  /(?:^|\/)(?:id_rsa|id_dsa|id_ecdsa|id_ed25519)$/,
  /\.(?:pem|key|p12|pfx)$/i,
  /credentials/i,
  /secrets?/i
];

function shouldSkipPath(relativePath) {
  const parts = relativePath.split(path.sep);
  return parts.some((part) => skipDirs.has(part));
}

function isLikelyTextFile(relativePath) {
  const base = path.basename(relativePath);
  const ext = path.extname(relativePath);
  if (base.startsWith(".env")) return true;
  return textExtensions.has(ext);
}

function gitFiles() {
  try {
    const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .filter(Boolean);
    const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .filter(Boolean);
    return [...new Set([...tracked, ...untracked])].filter((file) => !shouldSkipPath(file));
  } catch {
    return null;
  }
}

async function walkFiles(dir = root, output = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    const relativePath = path.relative(root, absolutePath);
    if (!relativePath || shouldSkipPath(relativePath)) continue;
    if (entry.isDirectory()) {
      await walkFiles(absolutePath, output);
    } else if (entry.isFile()) {
      const info = await stat(absolutePath);
      if (info.size <= 1024 * 1024) output.push(relativePath);
    }
  }
  return output;
}

function redact(value) {
  const text = String(value);
  if (text.length <= 12) return "[redacted]";
  return `${text.slice(0, 4)}...[redacted]...${text.slice(-4)}`;
}

function lineNumberFor(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function isRiskyFile(relativePath) {
  const normalized = relativePath.replaceAll(path.sep, "/");
  const base = path.basename(relativePath);
  return riskyFilePatterns.some((pattern) => pattern.test(base) || pattern.test(normalized));
}

function isSpecificSecretValue(value) {
  return /^sk-[A-Za-z0-9_-]{20,}$/.test(value)
    || /^gh[pousr]_[A-Za-z0-9_]{30,}$/.test(value)
    || /^xox[baprs]-[A-Za-z0-9-]{20,}$/.test(value)
    || /^AKIA[0-9A-Z]{16}$/.test(value);
}

async function scan() {
  const findings = [];
  const files = gitFiles() || await walkFiles();

  for (const relativePath of files) {
    if (!isLikelyTextFile(relativePath) && !isRiskyFile(relativePath)) continue;
    const absolutePath = path.join(root, relativePath);
    if (!existsSync(absolutePath)) continue;

    if (isRiskyFile(relativePath)) {
      findings.push({
        severity: relativePath.includes(".example") ? "warning" : "high",
        type: "risky-file",
        label: "Credential-looking file",
        file: relativePath,
        line: 1,
        evidence: path.basename(relativePath)
      });
    }

    let content = "";
    try {
      content = await readFile(absolutePath, "utf8");
    } catch {
      continue;
    }
    if (content.includes("\u0000")) continue;

    for (const pattern of secretPatterns) {
      pattern.regex.lastIndex = 0;
      for (const match of content.matchAll(pattern.regex)) {
        const raw = match[1] || match[0];
        if (pattern.id === "generic-assignment" && isSpecificSecretValue(raw)) continue;
        const line = lineNumberFor(content, match.index || 0);
        const severity = pattern.id === "generic-assignment" ? "warning" : "high";
        findings.push({
          severity,
          type: pattern.id,
          label: pattern.label,
          file: relativePath,
          line,
          evidence: redact(raw)
        });
      }
    }
  }

  const high = findings.filter((finding) => finding.severity === "high").length;
  const warnings = findings.filter((finding) => finding.severity === "warning").length;
  const result = {
    status: high > 0 ? "block" : warnings > 0 ? "review" : "pass",
    summary: {
      files_scanned: files.length,
      high_confidence_findings: high,
      warnings
    },
    findings
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

scan().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
