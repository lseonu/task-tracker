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
  { id: "build", page: "learning-build", key: "build", label: "Build", headline: "Build with Codex", nextAction: "Continue $learning-build until the checklist is complete, then run $prepare-submission." }
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

function asciiStepper(items) {
  return items.map((item) => {
    if (item.state === "done") return `${item.label} [done]`;
    if (item.state === "current") return `${item.label} [current]`;
    if (item.state === "blocked") return `${item.label} [blocked]`;
    return item.label;
  }).join(" -> ");
}

function stepperItems(page, state) {
  const activeMainStep = effectiveMainStep(page, state);
  const mainItems = mainSteps.map((step) => ({
    label: step.label,
    state: mainStepState(step, activeMainStep, state)
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

function nextCommandFor(page, state) {
  if (page.kind === "learning" && state.learning?.status === "completed" && state.next_command) return `Continue with $${state.next_command}.`;
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

async function composeCli(page, state, config, markdown) {
  const { mainItems, learningItems } = stepperItems(page, state);
  const blocks = [
    `Progress: ${asciiStepper(mainItems)}`
  ];
  if (page.kind === "learning" || state.learning?.status === "active") {
    blocks.push(`Learning: ${asciiStepper(learningItems)}`);
  }
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
  const output = await composeCli(page, state, config, markdown);
  process.stdout.write(output);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
