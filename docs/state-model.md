# State Model

## Purpose

`.openai-codex-hackathon-state.json` is the continuity layer for the participant's in-Codex hackathon flow.

It should stay small, human-readable, and easy to regenerate artifacts from. It is not a database, artifact archive, chat transcript, or design settings file.

## Principles

- Store only participant/workflow state that helps the next skill render the right artifact or make the right recommendation.
- Keep generated HTML out of state.
- Keep artifact history out of state.
- Keep design-system values in config/assets, not participant state.
- Store light personalization when it makes screens feel specific.
- Treat future Devpost MCP/auth details as out of scope until the MCP integration exists.

## V1 Shape

```json
{
  "plugin": "openai-codex-hackathon",
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
    "registration_url": "https://openai.devpost.com/",
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
  "artifacts": {
    "last_rendered": "",
    "last_rendered_at": "",
    "preview_base_url": ""
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

## Artifact State

Use `artifacts` only for lightweight render metadata:

- last rendered artifact path
- last render time
- optional localhost preview base URL

Do not store full HTML or a list of old artifacts.

## Legacy Fields

Earlier prototype notes used `dashboard` and `reminders`.

For V1 HTML artifacts, prefer:

- `deadlines` for deadline display/cache
- `artifacts` for render metadata
- generated HTML files for the visual dashboard itself

Existing skills may still tolerate older `dashboard` and `reminders` fields, but new state writes should use the clarified V1 shape.
