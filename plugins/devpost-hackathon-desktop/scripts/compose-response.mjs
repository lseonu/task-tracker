import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(process.env.HACKATHON_PLUGIN_ROOT || path.join(scriptDir, ".."));
const projectRoot = path.resolve(process.env.HACKATHON_PROJECT_ROOT || process.cwd());
const statePath = path.join(projectRoot, ".openai-codex-hackathon-state.json");
const projectConfigPath = path.join(projectRoot, "config/hackathon.json");
const pluginConfigPath = path.join(pluginRoot, "config/hackathon.json");
const configPath = existsSync(projectConfigPath) ? projectConfigPath : pluginConfigPath;
const configRoot = configPath === projectConfigPath ? projectRoot : pluginRoot;
const progressAssetDir = path.join(projectRoot, ".openai-codex-hackathon/progress");
const securityScanPath = path.join(projectRoot, ".openai-codex-hackathon/submission-security-scan.json");

const mainSteps = [
  { id: "start-hackathon", key: "start", label: "Start", headline: "Welcome to {{event.name}}", nextAction: "Register on Devpost, then run $review-rules." },
  { id: "review-rules", key: "rules", label: "Rules", headline: "Review the rules", nextAction: "Reply yes or no in chat to unlock the rest of the flow." },
  { id: "resources", key: "resources", label: "Resources", headline: "Choose your build path", nextAction: "Continue to $prepare-submission or enter guided planning with $learning-onboard." },
  { id: "prepare-submission", key: "prepare", label: "Prepare", headline: "Prepare your submission", nextAction: "Work through the revision checklist, then run $submission-check." },
  { id: "submission-check", key: "check", label: "Check", headline: "Run your final check", nextAction: "If ready, complete the official submission in Devpost." }
];

const learningSteps = [
  { id: "onboard", page: "learning-onboard", key: "onboard", label: "Ideate", headline: "Ideate your project", nextAction: "After brainstorming, run $learning-scope." },
  { id: "scope", page: "learning-scope", key: "scope", label: "Scope", headline: "Shape your project scope", nextAction: "After the scope is saved, run $learning-prd." },
  { id: "prd", page: "learning-prd", key: "prd", label: "PRD", headline: "Write the product requirements", nextAction: "After the PRD is saved, run $learning-spec." },
  { id: "spec", page: "learning-spec", key: "spec", label: "Spec", headline: "Plan the implementation", nextAction: "After the spec is saved, run $learning-checklist." },
  { id: "checklist", page: "learning-checklist", key: "checklist", label: "Checklist", headline: "Break the build into tasks", nextAction: "After the checklist is saved, run $learning-build." },
  { id: "build", page: "learning-build", key: "build", label: "Build", headline: "Build with Codex", nextAction: "Continue $learning-build until the checklist is complete, then run $prepare-submission." },
  { id: "return", page: "prepare-submission", key: "return", label: "Submit", headline: "Return to submission prep", nextAction: "Run $prepare-submission." }
];

const mainByKey = new Map(mainSteps.flatMap((step) => [[step.key, step], [step.id, step]]));
const learningByPage = new Map(learningSteps.flatMap((step) => [[step.page, step], [step.key, step], [step.id, step]]));

function parseArgs() {
  const args = process.argv.slice(2);
  const valueAfter = (name, fallback = "") => {
    const index = args.indexOf(name);
    return index === -1 ? fallback : args[index + 1] || fallback;
  };
  return {
    page: valueAfter("--page", "map")
  };
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readOptionalJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return await readJson(filePath);
  } catch {
    return null;
  }
}

async function readState() {
  if (!existsSync(statePath)) {
    return {
      __preview_state: true,
      plugin: "devpost-hackathon",
      version: 1,
      participant: { name: "", display_name: "" },
      current_stage: "start-hackathon",
      completed_stages: [],
      rules_acknowledged: false,
      registration: { devpost_registered: false, registration_url: "https://openai.devpost.com/" },
      project: { name: "", summary: "", openai_usage: "", codex_usage: "" },
      learning: { status: "not-started", current_step: "", completed_steps: [] },
      submission: { draft_file: "devpost-submission.md", status: "not-started", browser_handoff_ready: false },
      deadlines: { next_display: "Official deadline to be confirmed", official_dates_confirmed: false },
      next_command: "start-hackathon"
    };
  }
  return readJson(statePath);
}

function interpolate(value = "", config = {}) {
  return String(value)
    .replaceAll("[Hackathon name]", config.event?.name || "Hackathon")
    .replaceAll("{{event.name}}", config.event?.name || "Hackathon");
}

function stripMaintainerComments(markdown = "") {
  return markdown.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function normalizeMarkdown(markdown = "", config = {}) {
  const text = stripMaintainerComments(interpolate(markdown, config));
  return text
    .replace(/^# .*(?:\r?\n)+/, "")
    .replace("This page should summarize", "This check summarizes")
    .replace("This page should help", "This step helps")
    .replace("Read this page before you answer in chat.", "Read this before you answer in chat.");
}

async function readPageMarkdown(config, page) {
  let contentPath = "";
  if (page.learning) {
    contentPath = config.content?.learning?.[page.learning.key] || "";
  } else {
    contentPath = config.content?.[page.step.key] || "";
  }
  if (!contentPath) return "";
  return normalizeMarkdown(await readFile(path.join(configRoot, contentPath), "utf8"), config);
}

function resolvePage(pageName, state) {
  const normalized = pageName === "map" ? "hackathon-map" : pageName;
  const learning = learningByPage.get(normalized);
  if (learning && learning.id !== "return") {
    return { kind: "learning", learning, step: mainByKey.get("resources") };
  }
  if (normalized === "hackathon-map") {
    const step = mainByKey.get(state.current_stage) || mainByKey.get(state.next_command) || mainSteps[0];
    return { kind: "map", step };
  }
  const step = mainByKey.get(normalized) || mainByKey.get(pageName);
  if (!step) throw new Error(`Unknown page: ${pageName}`);
  return { kind: "main", step };
}

function mainStepState(step, activeStep, state) {
  if (state.__preview_state) {
    if (step.id === activeStep.id) return "current";
    if (mainSteps.indexOf(step) < mainSteps.indexOf(activeStep)) return "done";
    return "todo";
  }
  if ((state.completed_stages || []).includes(step.id)) return "done";
  if (step.id === activeStep.id) return "current";
  if ((step.id === "prepare-submission" || step.id === "submission-check") && state.rules_acknowledged !== true) return "blocked";
  return "todo";
}

function learningStepState(step, activeLearning, state) {
  const completed = new Set(state.learning?.completed_steps || []);
  if (completed.has(step.id)) return "done";
  if (step.id === activeLearning?.id || step.id === state.learning?.current_step) return "current";
  if (step.id === "return" && state.learning?.status === "completed") return "current";
  return "todo";
}

function asciiStepper(items) {
  return items.map((item) => {
    if (item.state === "done") return `${item.label} [done]`;
    if (item.state === "current") return `${item.label} [current]`;
    if (item.state === "blocked") return `${item.label} [blocked]`;
    return item.label;
  }).join(" -> ");
}

function stepperItems(page, state) {
  const mainItems = mainSteps.map((step) => ({
    label: step.label,
    state: mainStepState(step, page.step, state)
  }));
  const activeLearning = page.learning || learningByPage.get(state.learning?.current_step || "");
  const learningItems = learningSteps.map((step) => ({
    label: step.label,
    state: learningStepState(step, activeLearning, state)
  }));
  return { mainItems, learningItems };
}

function summaryLines(state, config) {
  const lines = [];
  const participant = state.participant?.display_name || state.participant?.name || "";
  const project = state.project?.name || state.project?.summary || "";
  const deadline = state.deadlines?.next_display || config.dates?.submission_deadline?.display || "Official deadline to be confirmed";
  if (participant) lines.push(`Participant: ${participant}`);
  if (project) lines.push(`Project: ${project}`);
  if (deadline) lines.push(`Deadline: ${deadline}`);
  if (state.submission?.status && state.submission.status !== "not-started") lines.push(`Submission status: ${state.submission.status}`);
  return lines;
}

function progressImagesEnabled(config) {
  if (process.env.CODEX_HACKATHON_PROGRESS_IMAGES === "0") return false;
  return config.assets?.progress_images_enabled !== false;
}

function xmlEscape(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function visualState(item) {
  if (item.state === "done") return "complete";
  if (item.state === "current") return "current";
  if (item.state === "blocked") return "blocked";
  return "todo";
}

function stateSlug(items) {
  return items.map((item) => `${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${visualState(item)}`).join("_");
}

function mainStepperSvg(items, config) {
  const width = 1200;
  const height = 208;
  const x = 28;
  const y = 60;
  const stepWidth = 228;
  const stepHeight = 90;
  const arrow = 30;
  const title = xmlEscape(config.event?.name || "Hackathon");
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const segmentShapes = [];
  const segmentContent = [];
  items.forEach((item, index) => {
    const left = x + index * stepWidth;
    const right = left + stepWidth;
    const isLast = index === items.length - 1;
    const chevronTip = isLast ? right : right + arrow;
    const leftInset = index === 0 ? left : left + arrow;
    const points = isLast
      ? `${left},${y} ${right},${y} ${right},${y + stepHeight} ${left},${y + stepHeight}`
      : index === 0
        ? `${left},${y} ${right},${y} ${chevronTip},${y + stepHeight / 2} ${right},${y + stepHeight} ${left},${y + stepHeight}`
        : `${left},${y} ${right},${y} ${chevronTip},${y + stepHeight / 2} ${right},${y + stepHeight} ${left},${y + stepHeight} ${left + arrow},${y + stepHeight / 2}`;
    const state = visualState(item);
    const fill = state === "current" ? "#D9E7FF" : state === "blocked" ? "#F1F1F1" : "#FFFFFF";
    const iconFill = state === "complete" ? "#D9E7FF" : "#FFFFFF";
    const iconStroke = state === "complete" ? "#7EB0FF" : state === "blocked" ? "#B8B8B8" : "#8C8C8C";
    const primary = state === "blocked" ? "#5F5F5F" : "#2C2C2C";
    const secondary = state === "blocked" ? "#757575" : "#7A7A7A";
    const icon = state === "complete"
      ? `<path d="M${leftInset + 29} ${y + 43} l8 8 l17 -20" fill="none" stroke="#1D64D6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
      : "";
    const shape = `<polygon points="${points}" fill="${fill}" stroke="#8C8C8C" stroke-width="1.5"/>`;
    if (isLast) {
      segmentShapes.unshift(shape);
    } else {
      segmentShapes.push(shape);
    }
    segmentContent.push(`
      <circle cx="${leftInset + 38}" cy="${y + 39}" r="17" fill="${iconFill}" stroke="${iconStroke}" stroke-width="2"/>
      ${icon}
      <text x="${leftInset + 76}" y="${y + 38}" font-family="${font}" font-size="24" font-weight="700" fill="${primary}">Step ${index + 1}</text>
      <text x="${leftInset + 76}" y="${y + 68}" font-family="${font}" font-size="23" fill="${secondary}">${xmlEscape(item.label)}</text>`);
  });
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title} progress">
  <rect width="${width}" height="${height}" rx="14" fill="#FFFFFF"/>
  <text x="${x}" y="28" font-family="${font}" font-size="18" font-weight="700" fill="#005271">${title}</text>
  ${segmentShapes.join("\n")}
  ${segmentContent.join("\n")}
</svg>
`;
}

function learningStepperSvg(items, config) {
  const width = 1200;
  const height = 212;
  const centerY = 96;
  const startX = 160;
  const gap = 146;
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const title = xmlEscape(config.event?.name || "Hackathon");
  const activeIndex = Math.max(0, items.findIndex((item) => item.state === "current"));
  const lineSegments = items.slice(0, -1).map((item, index) => {
    const x1 = startX + index * gap + 24;
    const x2 = startX + (index + 1) * gap - 24;
    const fill = index < activeIndex ? "#D9E7FF" : "#DDE3E6";
    return `<rect x="${x1}" y="${centerY - 4}" width="${x2 - x1}" height="8" rx="4" fill="${fill}"/>`;
  }).join("");
  const nodes = items.map((item, index) => {
    const x = startX + index * gap;
    const state = visualState(item);
    const fill = state === "current" || state === "complete" ? "#D9E7FF" : "#FFFFFF";
    const stroke = state === "todo" ? "#8C8C8C" : "#D9E7FF";
    const numberFill = state === "current" ? "#1D64D6" : state === "complete" ? "#1D64D6" : "#8C8C8C";
    const labelFill = state === "blocked" ? "#757575" : "#2C2C2C";
    const marker = state === "complete"
      ? `<path d="M${x - 9} ${centerY + 1} l7 7 l16 -18" fill="none" stroke="#1D64D6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<text x="${x}" y="${centerY + 11}" text-anchor="middle" font-family="${font}" font-size="30" font-weight="800" fill="${numberFill}">${index + 1}</text>`;
    return `
      <circle cx="${x}" cy="${centerY}" r="29" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      ${marker}
      <text x="${x}" y="${centerY + 76}" text-anchor="middle" font-family="${font}" font-size="19" font-weight="700" fill="${labelFill}">${xmlEscape(item.label)}</text>`;
  }).join("");
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title} learning progress">
  <rect width="${width}" height="${height}" rx="14" fill="#FFFFFF"/>
  <text x="28" y="40" font-family="${font}" font-size="22" font-weight="800" fill="#2C2C2C">Optional guided planning</text>
  <text x="314" y="40" font-family="${font}" font-size="22" font-weight="800" fill="#1D64D6">Learning path</text>
  ${lineSegments}
  ${nodes}
</svg>
`;
}

async function stepperImage(page, state, config) {
  if (!progressImagesEnabled(config)) return "";
  const { mainItems, learningItems } = stepperItems(page, state);
  const kind = page.kind === "learning" ? "learning" : "main";
  const items = kind === "learning" ? learningItems : mainItems;
  const svg = kind === "learning" ? learningStepperSvg(items, config) : mainStepperSvg(items, config);
  const filename = `${kind}-${stateSlug(items)}.svg`;
  const outputPath = path.join(progressAssetDir, filename);
  try {
    await mkdir(progressAssetDir, { recursive: true });
    await writeFile(outputPath, svg, "utf8");
    return outputPath;
  } catch {
    return "";
  }
}

function progressFallback(page, state) {
  const { mainItems, learningItems } = stepperItems(page, state);
  const blocks = [`Progress: ${asciiStepper(mainItems)}`];
  if (page.kind === "learning" || state.learning?.status === "active") {
    blocks.push(`Learning: ${asciiStepper(learningItems)}`);
  }
  return blocks.join("\n\n");
}

function nextCommandFor(page, state) {
  if (page.kind === "learning") return page.learning.nextAction;
  if (page.kind === "map") return state.next_command ? `Continue with $${state.next_command}.` : "Run $start-hackathon.";
  return page.step.nextAction;
}

async function securityScanBlock(page) {
  if (page.step.id !== "submission-check") return "";
  const scan = await readOptionalJson(securityScanPath);
  if (!scan) return "";
  const summary = scan.summary || {};
  const findings = (scan.findings || []).slice(0, 5).map((finding) => `- ${finding.severity}: ${finding.label} in \`${finding.file}:${finding.line}\` (${finding.evidence})`);
  return [
    "",
    "## Security Scan",
    `Status: ${scan.status || "unknown"}. Files scanned: ${summary.files_scanned ?? 0}. High-confidence findings: ${summary.high_confidence_findings ?? 0}. Warnings: ${summary.warnings ?? 0}.`,
    findings.length ? findings.join("\n") : "No high-confidence secrets or credential-looking files found."
  ].join("\n");
}

async function composeDesktop(page, state, config, markdown) {
  const imagePath = await stepperImage(page, state, config);
  const blocks = imagePath
    ? [`![${config.event?.name || "Hackathon"} progress](${imagePath})`]
    : [progressFallback(page, state)];
  blocks.push(`## ${interpolate(page.learning?.headline || page.step.headline, config)}`);
  const summary = summaryLines(state, config);
  if (summary.length) blocks.push(summary.join("\n"));
  if (markdown) blocks.push(markdown);
  const scanBlock = await securityScanBlock(page);
  if (scanBlock) blocks.push(scanBlock);
  blocks.push(`Next: ${nextCommandFor(page, state)}`);
  return `${blocks.filter(Boolean).join("\n\n")}\n`;
}

async function main() {
  const args = parseArgs();
  const config = await readJson(configPath);
  const state = await readState();
  const page = resolvePage(args.page, state);
  const markdown = await readPageMarkdown(config, page);
  const output = await composeDesktop(page, state, config, markdown);
  process.stdout.write(output);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
