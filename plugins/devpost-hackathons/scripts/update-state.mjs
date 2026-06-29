import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Writes the participant's local progress state without going through the
// model's file-editing tool. Skills invoke this as a single shell command so
// Codex renders it as a command execution instead of a reviewable file-diff
// card. Reads stay in compose-response.mjs; this is the write counterpart.
//
// Usage:
//   node update-state.mjs --set current_stage=resources --set next_command=prepare-submission
//   node update-state.mjs --add completed_stages=submission-check --set submission.status=ready
//   node update-state.mjs --json learning.completed_steps='["onboard","scope"]'
//
// --set key=value   set a (possibly nested, dot-path) field; value type is inferred
// --add key=value   append value to an array field (created if missing), deduped
// --json key=value  set a field to a parsed-JSON value (for arrays/objects/explicit types)

const projectRoot = path.resolve(process.env.HACKATHON_PROJECT_ROOT || process.cwd());
const statePath = path.join(projectRoot, ".openai-codex-hackathon-state.json");

// V2 slim shape: only locally-owned progress + personalization + doc pointers.
// Devpost-owned data (registration, official dates, submitted status) is read
// live from the bundled `devpost` MCP server and is intentionally NOT persisted.
function slimDefaultState() {
  return {
    plugin: "devpost-hackathon",
    version: 2,
    participant: { name: "", display_name: "" },
    project: { name: "", summary: "", openai_usage: "", codex_usage: "" },
    current_stage: "review-rules",
    completed_stages: ["start-hackathon"],
    rules_acknowledged: false,
    learning: { status: "not-started", current_step: "", completed_steps: [], plan_file: "", checklist_file: "" },
    submission: { draft_file: "devpost-submission.md", status: "not-started", browser_handoff_ready: false },
    next_command: "review-rules"
  };
}

function parseArgs(argv) {
  const ops = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    let kind = "";
    let pair = "";
    if (arg === "--set" || arg === "--add" || arg === "--json") {
      kind = arg.slice(2);
      pair = argv[++i];
    } else if (arg.startsWith("--set=") || arg.startsWith("--add=") || arg.startsWith("--json=")) {
      const eq = arg.indexOf("=");
      kind = arg.slice(2, eq);
      pair = arg.slice(eq + 1);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
    if (!pair) throw new Error(`Missing value for --${kind}`);
    const sep = pair.indexOf("=");
    if (sep === -1) throw new Error(`Expected key=value for --${kind}, got: ${pair}`);
    ops.push({ kind, key: pair.slice(0, sep), raw: pair.slice(sep + 1) });
  }
  return ops;
}

function coerce(raw) {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null") return null;
  if (/^-?\d+$/.test(raw)) return Number(raw);
  if (/^-?\d*\.\d+$/.test(raw)) return Number(raw);
  return raw;
}

function containerFor(state, key) {
  const parts = key.split(".");
  const last = parts.pop();
  let node = state;
  for (const part of parts) {
    if (typeof node[part] !== "object" || node[part] === null || Array.isArray(node[part])) {
      node[part] = {};
    }
    node = node[part];
  }
  return { node, last };
}

function setPath(state, key, value) {
  const { node, last } = containerFor(state, key);
  node[last] = value;
}

function addPath(state, key, value) {
  const { node, last } = containerFor(state, key);
  if (!Array.isArray(node[last])) node[last] = [];
  if (!node[last].includes(value)) node[last].push(value);
}

async function main() {
  const ops = parseArgs(process.argv.slice(2));
  if (ops.length === 0) {
    process.stdout.write("update-state: no changes requested\n");
    return;
  }

  const state = existsSync(statePath)
    ? JSON.parse(await readFile(statePath, "utf8"))
    : slimDefaultState();

  const applied = [];
  for (const op of ops) {
    if (op.kind === "set") {
      setPath(state, op.key, coerce(op.raw));
      applied.push(`${op.key}=${op.raw}`);
    } else if (op.kind === "json") {
      setPath(state, op.key, JSON.parse(op.raw));
      applied.push(`${op.key}=${op.raw}`);
    } else if (op.kind === "add") {
      addPath(state, op.key, coerce(op.raw));
      applied.push(`${op.key}+=${op.raw}`);
    }
  }

  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  process.stdout.write(`state updated: ${applied.join(", ")}\n`);
}

main().catch((error) => {
  process.stderr.write(`update-state error: ${error.message}\n`);
  process.exit(1);
});
