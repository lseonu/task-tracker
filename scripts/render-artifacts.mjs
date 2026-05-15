import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(process.env.HACKATHON_PLUGIN_ROOT || path.join(scriptDir, ".."));
const projectRoot = path.resolve(process.env.HACKATHON_PROJECT_ROOT || process.cwd());
const generatedDir = path.join(projectRoot, "artifacts/generated");
const supportDir = path.join(projectRoot, ".openai-codex-hackathon");
const statePath = path.join(projectRoot, ".openai-codex-hackathon-state.json");
const projectConfigPath = path.join(projectRoot, "config/hackathon.json");
const pluginConfigPath = path.join(pluginRoot, "config/hackathon.json");
const configPath = existsSync(projectConfigPath) ? projectConfigPath : pluginConfigPath;
const configRoot = configPath === projectConfigPath ? projectRoot : pluginRoot;
const securityScanPath = path.join(generatedDir, "submission-security-scan.json");

const steps = [
  {
    id: "start-hackathon",
    key: "start",
    file: "start-hackathon.html",
    label: "Start",
    description: "Register and set up your Codex flow",
    headline: "Welcome to {{event.name}}",
    subcopy: "Register on Devpost, then continue here in Codex.",
    nextAction: "Register on Devpost, then run $review-rules.",
    fallback: ["State initialized or loaded.", "Register on Devpost.", "Next command: $review-rules."]
  },
  {
    id: "review-rules",
    key: "rules",
    file: "review-rules.html",
    label: "Rules",
    description: "Review requirements and confirm eligibility",
    headline: "Review the rules",
    subcopy: "Confirm the requirements before you start building.",
    nextAction: "Reply yes or no in chat to unlock the rest of the flow.",
    fallback: ["Rules review is required.", "Reply exactly yes or no.", "Next command after yes: $resources."]
  },
  {
    id: "resources",
    key: "resources",
    file: "resources.html",
    label: "Resources",
    description: "Explore guides, examples, and project planning",
    headline: "Choose your build path",
    subcopy: "Use the resources or start the optional guided learning path.",
    nextAction: "Continue to $prepare-submission or enter guided planning from Step 3.",
    fallback: ["Resources shown.", "Guided planning is optional and nested inside Step 3.", "Next likely command: $prepare-submission."]
  },
  {
    id: "prepare-submission",
    key: "prepare",
    file: "prepare-submission.html",
    label: "Prepare",
    description: "Draft your Devpost submission",
    headline: "Prepare your submission",
    subcopy: "Turn your project into a clear Devpost-ready draft.",
    nextAction: "Work through the revision checklist, then run $submission-check.",
    fallback: ["Submission draft status shown.", "Fix missing materials.", "Next command when ready: $submission-check."]
  },
  {
    id: "submission-check",
    key: "check",
    file: "submission-check.html",
    label: "Check",
    description: "Run final review before submitting",
    headline: "Run your final check",
    subcopy: "Review completeness, security, and handoff readiness.",
    nextAction: "If ready, complete the official submission in Devpost.",
    fallback: ["Readiness result shown.", "Fix-now items listed if needed.", "Browser handoff when ready."]
  }
];

const stepByKey = new Map(steps.map((step) => [step.key, step]));
const stepById = new Map(steps.map((step) => [step.id, step]));
const resourcesStep = stepById.get("resources");

const learningPages = [
  {
    id: "learning-onboard",
    key: "onboard",
    file: "learning-onboard.html",
    learningId: "onboard",
    label: "Ideate",
    headline: "Ideate your project",
    subcopy: "Bring the spark of an idea and shape it into a clearer direction.",
    nextAction: "After brainstorming, run $learning-scope."
  },
  {
    id: "learning-scope",
    key: "scope",
    file: "learning-scope.html",
    learningId: "scope",
    label: "Scope",
    headline: "Shape your project scope",
    subcopy: "Turn a spark of an idea into a focused build path.",
    nextAction: "After the scope is saved, run $learning-prd."
  },
  {
    id: "learning-prd",
    key: "prd",
    file: "learning-prd.html",
    learningId: "prd",
    label: "PRD",
    headline: "Write the product requirements",
    subcopy: "Describe the user experience before deciding how the code should work.",
    nextAction: "After the PRD is saved, run $learning-spec."
  },
  {
    id: "learning-spec",
    key: "spec",
    file: "learning-spec.html",
    learningId: "spec",
    label: "Spec",
    headline: "Plan the implementation",
    subcopy: "Translate the PRD into technical structure, risks, and verification notes.",
    nextAction: "After the spec is saved, run $learning-checklist."
  },
  {
    id: "learning-checklist",
    key: "checklist",
    file: "learning-checklist.html",
    learningId: "checklist",
    label: "Checklist",
    headline: "Break the build into tasks",
    subcopy: "Create a sequenced checklist Codex can execute and verify.",
    nextAction: "After the checklist is saved, run $learning-build."
  },
  {
    id: "learning-build",
    key: "build",
    file: "learning-build.html",
    learningId: "build",
    label: "Build",
    headline: "Build with Codex",
    subcopy: "Execute the checklist with verification pauses that match the participant's comfort level.",
    nextAction: "Continue $learning-build until the checklist is complete, then run $prepare-submission."
  }
];

const mapPage = {
  id: "hackathon-map",
  key: "map",
  file: "hackathon-map.html",
  map: true,
  label: "Map",
  headline: "Hackathon map",
  subcopy: "Use this page to recover your place in the workflow.",
  nextAction: "Continue with the next recommended command."
};

const learningByKey = new Map(learningPages.flatMap((page) => [[page.key, page], [page.id, page], [page.learningId, page]]));

function parseArgs() {
  const args = process.argv.slice(2);
  const pageIndex = args.indexOf("--page");
  if (args.includes("--all")) return { all: true };
  if (pageIndex !== -1 && args[pageIndex + 1]) return { page: args[pageIndex + 1] };
  return { all: true };
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
      plugin: "openai-codex-hackathon",
      version: 1,
      participant: { name: "", display_name: "" },
      current_stage: "start-hackathon",
      completed_stages: [],
      rules_acknowledged: false,
      registration: { devpost_registered: false },
      project: { name: "", summary: "", openai_usage: "", codex_usage: "" },
      learning: { status: "not-started", current_step: "", completed_steps: [] },
      submission: { draft_file: "devpost-submission.md", status: "not-started", browser_handoff_ready: false },
      deadlines: { next_display: "Official deadline to be confirmed", official_dates_confirmed: false },
      artifacts: {},
      next_command: "start-hackathon"
    };
  }
  return readJson(statePath);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function generatedAssetPath(assetPath) {
  const value = String(assetPath || "").trim();
  if (!value) return "";
  if (/^(?:https?:)?\/\//.test(value) || value.startsWith("data:")) return value;
  return `../../.openai-codex-hackathon/${value.replace(/^\.?\//, "")}`;
}

function renderBrandHeader(config) {
  const lightLogo = generatedAssetPath(config.assets?.logo_light) || "../../assets/logos/devpost-logo-original.svg";
  const darkLogo = generatedAssetPath(config.assets?.logo_dark) || "../../assets/logos/devpost-logo-white.svg";
  return `      <a class="artifact-brand-mark" data-slot="devpost-logo" href="https://devpost.com/" aria-label="Devpost">
        <img class="artifact-logo artifact-logo-light" src="${escapeHtml(lightLogo)}" alt="Devpost">
        <img class="artifact-logo artifact-logo-dark" src="${escapeHtml(darkLogo)}" alt="" aria-hidden="true">
      </a>
      <h1 class="artifact-brand-title">${escapeHtml(config.event?.name || "Hackathon plugin")}</h1>`;
}

function inlineMarkdown(value = "") {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function interpolateCopy(value = "", config = {}) {
  return String(value)
    .replaceAll("[Hackathon name]", config.event?.name || "Hackathon")
    .replaceAll("{{event.name}}", config.event?.name || "Hackathon");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    output.push("<ul>");
    for (const item of list) output.push(`  <li>${inlineMarkdown(item)}</li>`);
    output.push("</ul>");
    list = [];
  };

  let inComment = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (inComment) {
      if (line.includes("-->")) inComment = false;
      continue;
    }
    if (line.startsWith("<!--")) {
      if (!line.includes("-->")) inComment = true;
      continue;
    }
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      output.push(`<h3>${inlineMarkdown(line.slice(2))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      output.push(`<h4>${inlineMarkdown(line.slice(3))}</h4>`);
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return output.join("\n");
}

function stepState(step, activeStep, state) {
  if (state.__preview_state) {
    if (step.id === activeStep.id) return "active";
    if (steps.indexOf(step) < steps.indexOf(activeStep)) return "complete";
    return "pending";
  }
  if ((state.completed_stages || []).includes(step.id)) return "complete";
  if (step.id === activeStep.id) return "active";
  if ((step.id === "prepare-submission" || step.id === "submission-check") && state.rules_acknowledged !== true) return "blocked";
  if (step.id === "submission-check" && !state.submission?.draft_file && state.submission?.status !== "drafting") return "blocked";
  return "pending";
}

function markerFor(step, stateName) {
  if (stateName === "complete") return "✓";
  return "";
}

function renderStepper(activeStep, state) {
  return steps.map((step) => {
    const stateName = stepState(step, activeStep, state);
    const stepNumber = steps.indexOf(step) + 1;
    return `        <li class="artifact-step" data-step="${step.id}" data-state="${stateName}">
          <span class="artifact-step-marker" aria-hidden="true">${markerFor(step, stateName)}</span>
          <span>
            <span class="artifact-step-label">Step ${stepNumber}</span>
            <span class="artifact-step-description">${step.label}</span>
          </span>
        </li>`;
  }).join("\n");
}

function renderLearningFlow(state, activeStep) {
  const learningActive = activeStep.id === "resources" && state.learning?.status === "active";
  if (!learningActive) return "";
  const learningSteps = ["onboard", "scope", "prd", "spec", "checklist", "build", "return"];
  const labels = {
    onboard: "Ideate",
    scope: "Scope",
    prd: "PRD",
    spec: "Spec",
    checklist: "Checklist",
    build: "Build",
    return: "Return"
  };
  const completed = new Set(state.learning?.completed_steps || []);
  const current = state.learning?.current_step || "onboard";
  const currentIndex = learningSteps.indexOf(current);
  const items = learningSteps.map((id, index) => {
    const stateName = completed.has(id) ? "complete" : id === current ? "active" : "pending";
    const marker = stateName === "complete" ? "✓" : String(index + 1);
    const connectorState = index < currentIndex ? "complete" : index === currentIndex ? "active" : "pending";
    return `        <li class="artifact-nested-step" data-learning-step="${id}" data-state="${stateName}" data-connector="${connectorState}">
          <span class="artifact-nested-marker" aria-hidden="true">${marker}</span>
          <span class="artifact-nested-label">${labels[id]}</span>
        </li>`;
  }).join("\n");

  return `    <section class="artifact-nested-flow" data-slot="optional-learning-flow">
      <h2>Optional guided planning - <span>Learning path</span></h2>
      <ol class="artifact-nested-list">
${items}
      </ol>
    </section>`;
}

function renderChoices(activeStep, options = {}) {
  if (options.hideChoices || activeStep.id !== "resources") return "";
  return `
        <div class="artifact-card-grid" aria-label="Step 3 choices">
          <div class="artifact-choice">
            <strong>I have my project idea</strong>
            <span>Run <code>$prepare-submission</code> when you are ready.</span>
          </div>
          <div class="artifact-choice">
            <strong>Use the learning path</strong>
            <span>Run <code>$learning-onboard</code> to brainstorm your project idea.</span>
          </div>
        </div>`;
}

function renderSecurityScan(scan) {
  if (!scan) return "";
  const statusLabel = {
    pass: "Pass",
    review: "Review",
    block: "Blocked"
  }[scan.status] || "Unknown";
  const findings = scan.findings || [];
  const rows = findings.length
    ? findings.slice(0, 8).map((finding) => `          <li><strong>${escapeHtml(finding.severity)}</strong>: ${escapeHtml(finding.label)} in <code>${escapeHtml(finding.file)}:${escapeHtml(finding.line)}</code> (${escapeHtml(finding.evidence)})</li>`).join("\n")
    : "          <li>No high-confidence secrets or credential-looking files found.</li>";

  return `
        <section class="artifact-security-scan" data-security-status="${escapeHtml(scan.status || "unknown")}">
          <h3>Security scan</h3>
          <p><strong>${statusLabel}</strong>: scanned ${escapeHtml(scan.summary?.files_scanned ?? 0)} files. High-confidence findings: ${escapeHtml(scan.summary?.high_confidence_findings ?? 0)}. Warnings: ${escapeHtml(scan.summary?.warnings ?? 0)}.</p>
          <ul>
${rows}
          </ul>
        </section>`;
}

function renderPersonalization(state) {
  const participantName = state.participant?.display_name || state.participant?.name || "";
  const projectName = state.project?.name || "";
  const projectSummary = state.project?.summary || "";
  const rows = [];
  if (participantName) rows.push(["Participant", participantName]);
  if (projectName) rows.push(["Project", projectName]);
  if (projectSummary) rows.push(["Idea", projectSummary]);
  if (!rows.length) return "";

  return `
        <section class="artifact-context" data-slot="personalization">
          <h3>Your working context</h3>
${rows.map(([label, value]) => `          <p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("\n")}
        </section>`;
}

function renderCopySource(contentPath) {
  if (!contentPath) return "";
  return `
        <section class="artifact-copy-source" data-slot="copy-source">
          <h3>Edit this page copy</h3>
          <p>Main body copy comes from <code>${escapeHtml(contentPath)}</code>.</p>
        </section>`;
}

async function renderPage(config, state, activeStep, options = {}) {
  const contentPath = options.contentPath || config.content?.[activeStep.key];
  const markdown = contentPath ? interpolateCopy(await readFile(path.join(configRoot, contentPath), "utf8"), config) : "";
  const body = markdownToHtml(markdown);
  const securityScan = activeStep.id === "submission-check" ? await readOptionalJson(securityScanPath) : null;
  const participantName = state.participant?.display_name || state.participant?.name || "";
  const projectName = state.project?.name || "";
  const personalized = projectName ? `Project: ${escapeHtml(projectName)}` : participantName ? `Participant: ${escapeHtml(participantName)}` : "";
  const deadline = state.deadlines?.next_display || config.dates?.submission_deadline?.display || "Official deadline to be confirmed";
  const completedStages = state.__preview_state
    ? steps.slice(0, steps.indexOf(activeStep)).map((step) => step.id)
    : state.completed_stages || [];
  const completed = completedStages.map((id) => stepById.get(id)?.label || id).join(", ") || "None yet";
  const next = options.nextAction || (state.__preview_state ? activeStep.nextAction : state.next_command || activeStep.nextAction);
  const learningFlow = renderLearningFlow(state, activeStep);
  const bannerPath = generatedAssetPath(config.assets?.event_banner);
  const showBanner = Boolean(bannerPath);
  const meta = [
    `Step ${steps.indexOf(activeStep) + 1} of 5: ${activeStep.label}`,
    `Completed: ${completed}`,
    `Next: ${next}`,
    `Deadline: ${deadline}`,
    personalized || ""
  ].filter(Boolean);

  return `<!doctype html>
<html lang="en" data-artifact="${options.artifactId || activeStep.id}" data-theme="system">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(options.documentTitle || activeStep.label)} | ${escapeHtml(config.event?.name || "Hackathon plugin")}</title>
  <script>
    (() => {
      const theme = new URLSearchParams(window.location.search).get("theme");
      if (theme === "light" || theme === "dark" || theme === "system") {
        document.documentElement.dataset.theme = theme;
      }
    })();
  </script>
  <link rel="stylesheet" href="../../.openai-codex-hackathon/templates/shared-artifact.css?v=template-workshop-1">
</head>
<body>
  <main class="artifact-shell" data-current-stage="${activeStep.id}" data-next-command="${escapeHtml(next)}">
    <header class="artifact-header" aria-label="Hackathon plugin header">
${renderBrandHeader(config)}
    </header>

${showBanner ? `    <div class="artifact-banner" data-slot="event-banner">
      <img src="${escapeHtml(bannerPath)}" alt="">
    </div>

` : ""}    <section class="artifact-progress-meta" aria-label="Current status">
${meta.map((item) => `      <span>${escapeHtml(item)}</span>`).join("\n")}
    </section>

    <div class="artifact-workspace">
      <aside class="artifact-sidebar">
        <nav class="artifact-stepper" aria-label="Hackathon progress">
          <ol class="artifact-stepper-list">
${renderStepper(activeStep, state)}
          </ol>
        </nav>
      </aside>

      <div class="artifact-main">
${learningFlow}

        <section class="artifact-hero" data-slot="page-intro">
          <h2>${escapeHtml(interpolateCopy(options.headline || activeStep.headline, config))}</h2>
          <p>${escapeHtml(interpolateCopy(options.subcopy || activeStep.subcopy, config))}</p>
        </section>

${renderPersonalization(state)}

        <section class="artifact-layout" data-slot="page-body">
          <div class="artifact-panel" data-slot="primary-content">
${body}
${renderChoices(activeStep, options)}
${renderSecurityScan(securityScan)}
          </div>
        </section>

        <section class="artifact-footer">
          <div class="artifact-next-action" data-slot="next-action">
            <h3>Next action</h3>
            <p>${inlineMarkdown(interpolateCopy(options.nextAction || activeStep.nextAction, config))}</p>
          </div>
${renderCopySource(contentPath)}
        </section>
      </div>
    </div>
  </main>
</body>
</html>
`;
}

async function renderLearningPage(config, state, page) {
  const order = learningPages.map((item) => item.learningId);
  const completed = state.__preview_state
    ? order.slice(0, order.indexOf(page.learningId))
    : state.learning?.completed_steps || [];
  const learningState = {
    ...state,
    current_stage: "resources",
    learning: {
      ...(state.learning || {}),
      status: "active",
      current_step: page.learningId,
      completed_steps: completed
    },
    next_command: page.id
  };
  return renderPage(config, learningState, resourcesStep, {
    contentPath: config.content?.learning?.[page.key],
    headline: page.headline,
    subcopy: page.subcopy,
    nextAction: page.nextAction,
    fallback: [
      `${page.label} guidance shown.`,
      "This optional path stays nested inside Step 3.",
      page.nextAction
    ],
    hideChoices: true
  });
}

async function renderMapPage(config, state) {
  const activeStep =
    stepById.get(state.current_stage) ||
    stepByKey.get(state.next_command) ||
    stepById.get(state.next_command) ||
    steps[0];
  const nextCommand = state.next_command ? `$${state.next_command}` : "$start-hackathon";
  return renderPage(config, state, activeStep, {
    artifactId: mapPage.id,
    documentTitle: mapPage.label,
    contentPath: config.content?.map,
    headline: mapPage.headline,
    subcopy: mapPage.subcopy,
    nextAction: `Continue with ${nextCommand}.`,
    hideChoices: true
  });
}

async function prepareRuntimeFiles() {
  await mkdir(generatedDir, { recursive: true });
  await mkdir(supportDir, { recursive: true });
  await cp(path.join(pluginRoot, "artifacts/templates"), path.join(supportDir, "templates"), { recursive: true });
  await cp(path.join(pluginRoot, "assets"), path.join(supportDir, "assets"), { recursive: true });
}

async function main() {
  const args = parseArgs();
  await prepareRuntimeFiles();
  const config = await readJson(configPath);
  const state = await readState();
  const pages = args.all
    ? [...steps, mapPage, ...learningPages]
    : [stepByKey.get(args.page) || stepById.get(args.page) || learningByKey.get(args.page) || (args.page === "map" || args.page === "hackathon-map" ? mapPage : null)].filter(Boolean);

  if (!pages.length) {
    throw new Error(`Unknown page: ${args.page}`);
  }

  for (const step of pages) {
    const html = step.map
      ? await renderMapPage(config, state)
      : step.learningId
        ? await renderLearningPage(config, state, step)
        : await renderPage(config, state, step);
    const outPath = path.join(generatedDir, step.file);
    await writeFile(outPath, html, "utf8");
    console.log(path.relative(projectRoot, outPath));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
