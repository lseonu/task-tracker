# State Model

## Purpose

`.devpost-hackathon-state.json` is the continuity layer for the participant's in-Codex hackathon flow.

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
    "ai_usage": "",
    "codex_usage": ""
  },
  "current_stage": "review",
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
  "next_command": "review"
}
```

`submission.status` (`not-started` / `needs-work` / `close` / `ready` / `submitted`) and
`browser_handoff_ready` describe local draft readiness in Codex. `submitted` is set only
after a successful `submit_project` call from `$submission` (a returned confirmation
id/url may be recorded alongside it); Devpost remains the source of truth for submission
state and is read live via the MCP.

### Removed in V2 (read live from the MCP instead)

- `registration.*` — registration status/URL is owned by Devpost.
- `deadlines.*` — official dates come from `get_key_dates`.
- `submission.public_demo_url` / `repo_url` / `video_url` — these live in the
  local `devpost-submission.md` draft, not in state.

Older V1 files that still carry these fields are tolerated (skills only read the
fields they need), but new writes should not add them back.

## Writing State

The plugin has no state-writing script. Edit `.devpost-hackathon-state.json`
directly — a small JSON file edit is the expected mechanism. Keep these rules:

- Write only when state actually changes on this turn. Turns that just read, recap,
  or answer a question should not write state.
- Preserve fields you are not changing; never reset progress the participant has
  already made.
- Keep the file small and V2-shaped — do not add back the removed Devpost-owned
  fields; read those live from the `devpost` MCP server.

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

If a participant switches between Codex Desktop and Codex CLI while working in the same project folder, the same `.devpost-hackathon-state.json` should continue to work.

## Legacy Fields

Earlier prototype notes used `dashboard` and `reminders`.

Prefer:

- official dates read live from the `devpost` MCP server (not persisted in state)
- package-local config/assets for presentation decisions
- the final-check secret scan is an inline `grep` run by `$submission`; it does not
  persist a result file

Existing skills may still tolerate older `dashboard`, `reminders`, `presentation`, and `artifacts` fields in old participant projects, but new state writes should use the clarified V2 shape.
