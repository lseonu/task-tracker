# State Model

## Purpose

`.openai-codex-hackathon-state.json` is the continuity layer for the participant's in-Codex hackathon flow.

It should stay small, human-readable, and easy to compose participant-facing responses from. It is not a database, chat transcript, design settings file, or record of rendered UI.

## Principles

- Store only participant/workflow state that helps the next skill compose the right response or make the right recommendation.
- Keep rendered output history out of state.
- Keep design-system values in config/assets, not participant state.
- Do not store Desktop/CLI capability guesses. The installed plugin package decides presentation.
- Store light personalization when it makes screens feel specific.
- Treat future Devpost MCP/auth details as out of scope until the MCP integration exists.

## V1 Shape

```json
{
  "plugin": "devpost-hackathon",
  "version": 1,
  "participant": {
    "name": "",
    "display_name": ""
  },
  "current_stage": "review-rules",
  "completed_stages": ["start-hackathon"],
  "rules_acknowledged": false,
  "registration": {
    "devpost_registered": false,
    "registration_url": "TBD",
    "last_prompted_at": ""
  },
  "project": {
    "name": "",
    "summary": "",
    "openai_usage": "",
    "codex_usage": ""
  },
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
    "public_demo_url": "",
    "repo_url": "",
    "video_url": "",
    "browser_handoff_ready": false
  },
  "deadlines": {
    "next_label": "",
    "next_display": "Official deadline to be confirmed",
    "official_dates_confirmed": false,
    "last_checked_at": ""
  },
  "next_command": "review-rules"
}
```

## Personalization

Use `participant` and `project` for small personalized touches:

- `Welcome, Joe`
- `Prepare your submission for ProjectName`
- `Need help shaping ProjectName?`

Do not store long generated messages, user biographies, or broad preference profiles.

## Learning State

The optional learning path stays nested inside Step 3.

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

This repo ships two installable plugin packages:

- `devpost-hackathon-desktop`
- `devpost-hackathon-cli`

Both packages read and write the same workflow state shape. The package controls presentation:

- Desktop may generate progress SVGs from state and reference them in chat.
- CLI emits text progress only.

If a participant switches between Desktop and CLI while working in the same project folder, the same `.openai-codex-hackathon-state.json` should continue to work.

## Legacy Fields

Earlier prototype notes used `dashboard` and `reminders`.

For V1, prefer:

- `deadlines` for deadline display/cache
- package-local config/assets for presentation decisions
- `.openai-codex-hackathon/submission-security-scan.json` for final-check scan output

Existing skills may still tolerate older `dashboard`, `reminders`, `presentation`, and `artifacts` fields in old participant projects, but new state writes should use the clarified V1 shape.
