# State Model

## Purpose

`.openai-codex-hackathon-state.json` is the continuity layer for the participant's in-Codex hackathon flow.

It should stay small, human-readable, and easy to compose participant-facing responses from. It is not a database, chat transcript, design settings file, or record of rendered UI.

## Principles

- Store only participant/workflow state that helps the next skill compose the right response or make the right recommendation.
- Keep rendered output history out of state.
- Keep design-system values in config/assets, not participant state.
- Do not store host capability guesses. The plugin is text-first; presentation richness is supplied by the bundled MCP widget on capable hosts.
- Store light personalization when it makes screens feel specific.
- Cache only small derived values from the bundled Devpost MCP; keep tokens and full payloads out of state.

## V2 Shape

V2 stores only data that is locally owned: the participant's in-Codex progress,
light personalization, and pointers to local documents. Devpost-owned data
(registration, official dates, submitted status) is read live from the bundled
`devpost` MCP server on each turn and is intentionally not persisted here, so the
local file never becomes a stale shadow of the production database.

```json
{
  "plugin": "devpost-hackathon",
  "version": 2,
  "participant": {
    "name": "",
    "display_name": ""
  },
  "project": {
    "name": "",
    "summary": "",
    "openai_usage": "",
    "codex_usage": ""
  },
  "current_stage": "review-rules",
  "completed_stages": ["start-hackathon"],
  "rules_acknowledged": false,
  "learning": {
    "status": "not-started",
    "current_step": "",
    "completed_steps": [],
    "plan_file": "",
    "checklist_file": ""
  },
  "submission": {
    "draft_file": "devpost-submission.md",
    "status": "not-started",
    "browser_handoff_ready": false
  },
  "next_command": "review-rules"
}
```

`submission.status` (`not-started` / `needs-work` / `close` / `ready`) and
`browser_handoff_ready` describe local draft readiness in Codex, not whether the
project was submitted on Devpost — that fact is owned by Devpost and read via the
MCP.

### Removed in V2 (read live from the MCP instead)

- `registration.*` — registration status/URL is owned by Devpost.
- `deadlines.*` — official dates come from `get_key_dates`.
- `submission.public_demo_url` / `repo_url` / `video_url` — these live in the
  local `devpost-submission.md` draft, not in state.

Older V1 files that still carry these fields are tolerated (the composer only
reads the fields it needs), but new writes should not add them back.

## Writing State

Do not edit `.openai-codex-hackathon-state.json` with the model's file-editing
tool. On Codex Desktop, an edit-tool write renders a reviewable file-diff card
("Edited …state.json +N -M" with Undo/Review) on every turn, which clutters the
conversation with bookkeeping the participant never needs to review.

Instead, persist changes with the write script, which the host renders as a quiet
command run:

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/update-state.mjs" \
  --set current_stage=resources \
  --set next_command=prepare-submission \
  --add completed_stages=resources
```

`--set key=value` sets a (dot-path) field with inferred typing, `--add` appends to
an array field (deduped), and `--json key=value` sets a parsed-JSON value. Run the
update before the response composer, and only when state actually changes on this
turn — turns that just read, recap, or answer a question should write nothing.

## Personalization

Use `participant` and `project` for small personalized touches:

- `Welcome, Joe`
- `Prepare your submission for ProjectName`
- `Need help shaping ProjectName?`

Do not store long generated messages, user biographies, or broad preference profiles.

## Learning State

The optional guided build tool stays nested inside Step 3.

Use `learning.status` values:

- `not-started`
- `active`
- `completed`
- `skipped`

Use `learning.current_step` and `learning.completed_steps` for the internal learning progression:

- `onboard`
- `scope`
- `prd`
- `spec`
- `checklist`
- `build`

Only store file paths for durable local outputs such as a plan or checklist. Do not store the full generated document body in state.

## Presentation Boundary

Do not store presentation mode in state.

This repo ships one installable plugin package:

- `devpost-hackathons`

It is text-first: the composer always renders the text dashboard from this state shape on every host. Presentation richness is not controlled by the package — rich inline visuals come from the bundled Devpost MCP stepper widget on capable hosts (Codex Desktop / ChatGPT), while the CLI and other non-widget hosts show the text dashboard.

If a participant switches between Codex Desktop and Codex CLI while working in the same project folder, the same `.openai-codex-hackathon-state.json` should continue to work.

## Legacy Fields

Earlier prototype notes used `dashboard` and `reminders`.

For V1, prefer:

- `deadlines` for deadline display/cache
- package-local config/assets for presentation decisions
- `.openai-codex-hackathon/submission-security-scan.json` for final-check scan output

Existing skills may still tolerate older `dashboard`, `reminders`, `presentation`, and `artifacts` fields in old participant projects, but new state writes should use the clarified V1 shape.
