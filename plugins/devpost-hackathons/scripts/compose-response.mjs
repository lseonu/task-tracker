import { readFile } from "node:fs/promises";
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
const securityScanPath = path.join(projectRoot, ".openai-codex-hackathon/submission-security-scan.json");

const mainSteps = [
  { id: "start-hackathon", key: "start", label: "Start", title: "Start hackathon", headline: "Welcome to {{event.name}}", nextAction: "Register on Devpost, then run $review-rules." },
  { id: "review-rules", key: "rules", label: "Rules", title: "Review rules", headline: "Review the rules", nextAction: "Reply yes or no in chat to unlock the rest of the flow." },
  { id: "resources", key: "resources", label: "Resources", title: "Resources", headline: "Choose your build path", nextAction: "Continue to $prepare-submission or enter the guided build tool with $build-onboard." },
  { id: "prepare-submission", key: "prepare", label: "Prepare", title: "Prepare submission", headline: "Prepare your submission", nextAction: "Work through the preparation checklist, then run $submission-check." },
  { id: "submission-check", key: "check", label: "Check", title: "Submission check", headline: "Run your final check", nextAction: "If ready, complete the official submission in Devpost." }
];

const learningSteps = [
  { id: "onboard", page: "build-onboard", key: "onboard", label: "Ideate", headline: "Ideate your project", nextAction: "After brainstorming, run $build-scope." },
  { id: "scope", page: "build-scope", key: "scope", label: "Scope", headline: "Shape your project scope", nextAction: "After the scope is saved, run $build-prd." },
  { id: "prd", page: "build-prd", key: "prd", label: "PRD", headline: "Write the product requirements", nextAction: "After the PRD is saved, run $build-spec." },
  { id: "spec", page: "build-spec", key: "spec", label: "Spec", headline: "Plan the implementation", nextAction: "After the spec is saved, run $build-checklist." },
  { id: "checklist", page: "build-checklist", key: "checklist", label: "Checklist", headline: "Break the build into tasks", nextAction: "After the checklist is saved, run $build-project." },
  { id: "build", page: "build-project", key: "build", label: "Build", headline: "Build with Codex", nextAction: "Continue $build-project until the checklist is complete, then run $prepare-submission." }
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
      registration: { devpost_registered: false, registration_url: "TBD" },
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
  if (learning) {
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
  if (step.id === "submission-check" && submissionIsReady(state)) return "done";
  if (step.id === activeStep.id) return "current";
  if ((state.completed_stages || []).includes(step.id)) return "done";
  if ((step.id === "prepare-submission" || step.id === "submission-check") && state.rules_acknowledged !== true) return "blocked";
  return "todo";
}

function learningStepState(step, activeLearning, state) {
  const completed = new Set(state.learning?.completed_steps || []);
  if (state.learning?.status === "completed") return "done";
  if (step.id === activeLearning?.id || step.id === state.learning?.current_step) return "current";
  if (completed.has(step.id)) return "done";
  return "todo";
}

function effectiveMainStep(page, state) {
  if (page.kind === "learning" && state.learning?.status === "completed" && state.next_command === "prepare-submission") {
    return mainByKey.get("prepare-submission");
  }
  return page.step;
}

const DASH_DIVIDER = "────────────────────────────";

function stepperItems(page, state) {
  const activeMainStep = effectiveMainStep(page, state);
  const mainItems = mainSteps.map((step) => {
    const itemState = mainStepState(step, activeMainStep, state);
    return {
      id: step.id,
      label: step.label,
      title: step.title,
      state: itemState,
      reason: itemState === "blocked" ? "needs rules ack" : ""
    };
  });
  const activeLearning = page.learning || learningByPage.get(state.learning?.current_step || "");
  const learningItems = learningSteps.map((step) => ({
    id: step.id,
    label: step.label,
    title: step.label,
    state: learningStepState(step, activeLearning, state),
    reason: ""
  }));
  return { mainItems, learningItems };
}

function progressPercent(mainItems) {
  const done = mainItems.filter((item) => item.state === "done").length;
  return Math.round((done / mainItems.length) * 100);
}

function deadlineLine(state, config) {
  const display = state.deadlines?.next_display || config.dates?.submission_deadline?.display || "Official deadline pending";
  const iso = state.deadlines?.next_iso || config.dates?.submission_deadline?.iso || "";
  let suffix = "";
  if (iso) {
    const ms = Date.parse(iso);
    if (!Number.isNaN(ms)) {
      const days = Math.ceil((ms - Date.now()) / 86400000);
      if (days > 0) suffix = ` (${days} day${days === 1 ? "" : "s"} left)`;
      else if (days === 0) suffix = " (due today)";
      else suffix = " (deadline passed)";
    }
  }
  return `Deadline: ${display}${suffix}`;
}

function dashboardRows(items) {
  const width = Math.max(...items.map((item) => item.title.length)) + 3;
  return items.map((item) => {
    const glyph = item.state === "done" ? "[x]" : item.state === "current" ? "[>]" : "[ ]";
    const status = item.state === "blocked" ? `blocked (${item.reason || "locked"})` : item.state;
    return `${glyph} ${item.title.padEnd(width)}${status}`;
  });
}

// Fully-expressive text fallback. Rich inline visuals come from the bundled
// `devpost` MCP stepper widget on hosts that can render it (Codex Desktop);
// this text dashboard is what the CLI and any non-widget host always show.
function renderTextDashboard(page, state, config) {
  const { mainItems, learningItems } = stepperItems(page, state);
  const eventName = config.event?.name || "Hackathon";
  const lines = [
    `${eventName} — ${progressPercent(mainItems)}% complete`,
    DASH_DIVIDER,
    ...dashboardRows(mainItems),
    DASH_DIVIDER,
    deadlineLine(state, config)
  ];
  if (page.kind === "learning" || state.learning?.status === "active") {
    lines.push("", "Guided build tool", DASH_DIVIDER, ...dashboardRows(learningItems), DASH_DIVIDER);
  }
  return lines.join("\n");
}

function summaryLines(state, config) {
  const lines = [];
  const participant = state.participant?.display_name || state.participant?.name || "";
  const project = state.project?.name || state.project?.summary || "";
  if (participant) lines.push(`Participant: ${participant}`);
  if (project) lines.push(`Project: ${project}`);
  if (state.submission?.status && state.submission.status !== "not-started") lines.push(`Submission status: ${state.submission.status}`);
  return lines;
}

function fallbackNextCommand(page, state) {
  if (page.kind === "learning") {
    if (page.learning.id === "build") {
      return state.learning?.status === "completed" ? "prepare-submission" : "build-project";
    }
    const index = learningSteps.findIndex((step) => step.id === page.learning.id);
    return learningSteps[index + 1]?.page || "prepare-submission";
  }
  if (page.kind === "map") return "start-hackathon";
  const index = mainSteps.findIndex((step) => step.id === page.step.id);
  return mainSteps[index + 1]?.id || "hackathon-map";
}

function resolvedNextCommand(page, state) {
  if (!state.__preview_state && state.next_command) return state.next_command;
  return fallbackNextCommand(page, state);
}

function submissionIsReady(state) {
  return state.submission?.status === "ready" || state.submission?.browser_handoff_ready === true;
}

function officialSubmissionDestination(config) {
  const url = config.official_urls?.submission_page || "";
  if (url && url !== "TBD") return `[official Devpost submission page](${url})`;
  return "the official Devpost submission page (URL TBD in this prototype)";
}

function readySubmissionHandoff(config) {
  return [
    "You're done in Codex. You're ready to submit on Devpost.",
    "",
    "Do this now:",
    `1. Open ${officialSubmissionDestination(config)}.`,
    "2. Copy the final text from `devpost-submission.md` into the official form.",
    "3. Add your repository link, demo link, screenshots, and demo video.",
    "4. Submit on Devpost before the official deadline.",
    "",
    "Optional later: type `$hackathon-map` if you want to review the flow again."
  ].join("\n");
}

function nextInstructionFor(page, state, config) {
  if (page.step?.id === "submission-check" && submissionIsReady(state)) {
    return readySubmissionHandoff(config);
  }
  const command = resolvedNextCommand(page, state);
  if (page.step?.id === "review-rules" && state.rules_acknowledged !== true && command === "review-rules") {
    return [
      "Next: Reply `yes` when you acknowledge the rules, or `no` if you need help understanding them.",
      "After that, Codex will show the next skill invocation."
    ].join("\n");
  }
  if (page.step?.id === "submission-check" && command === "hackathon-map") {
    return [
      "Next skill invocation if you need the map again: `$hackathon-map`.",
      "Otherwise, complete the official submission in Devpost."
    ].join("\n");
  }
  const lines = [`Type this next: \`$${command}\`.`];
  if (page.kind === "main" && page.step?.id === "resources" && state.learning?.status !== "active" && command !== "build-onboard") {
    lines.push("Optional guided build tool: `$build-onboard`.");
  }
  return lines.join("\n");
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

async function compose(page, state, config, markdown) {
  const blocks = [renderTextDashboard(page, state, config)];
  blocks.push(`## ${interpolate(page.learning?.headline || page.step.headline, config)}`);
  const summary = summaryLines(state, config);
  if (summary.length) blocks.push(summary.join("\n"));
  if (markdown) blocks.push(markdown);
  const scanBlock = await securityScanBlock(page);
  if (scanBlock) blocks.push(scanBlock);
  blocks.push(nextInstructionFor(page, state, config));
  return `${blocks.filter(Boolean).join("\n\n")}\n`;
}

async function main() {
  const args = parseArgs();
  const config = await readJson(configPath);
  const state = await readState();
  const page = resolvePage(args.page, state);
  const markdown = await readPageMarkdown(config, page);
  const output = await compose(page, state, config, markdown);
  process.stdout.write(output);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
