---
name: start-hackathon
description: Start the OpenAI Codex Hackathon workflow in the current project folder. Use when the user wants to begin the guided experience, initialize the local state file, or understand the end-to-end flow before working through the event in Codex.
---

# Start Hackathon

## Purpose

Initialize or resume the local hackathon state, generate the Start HTML artifact, and point the participant to the next command.

The HTML artifact is the primary participant interface. Chat is only the control surface and fallback.

## Required Reference

Read `../../config/hackathon.json` before responding.

## Workspace Assumption

Treat the current directory as the participant's real hackathon project folder.

If the folder already contains project files, continue. This plugin is meant to operate inside the real project, not in a separate notes workspace.

## State Initialization

Create `.openai-codex-hackathon-state.json` in the project root if it does not exist.

Use this initial payload:

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

If the state file already exists, do not overwrite user data. Load it, preserve it, and continue.

Do not create sample project content, draft submission files, or example hackathon notes during this step. Only initialize or reuse the state file.

## Light Personalization

If `participant.name`/`participant.display_name` and `project.summary` are empty, ask a short optional personalization question in chat after generating the artifact:

`If you want, tell me your name and a one-sentence project idea. I can store that locally so later pages feel specific to you and your project.`

Do not block the flow on this. The participant can continue to `$review-rules` without answering.

If the participant provides those details, update `.openai-codex-hackathon-state.json`:

- `participant.display_name`
- `project.summary`
- `project.name` only if they give a clear project name

Then regenerate the Start artifact.

## Artifact Output

After creating or loading state, run:

```bash
node scripts/render-artifacts.mjs --page start
```

The generated page is `artifacts/generated/start-hackathon.html`.

Generated HTML must be opened through localhost, not `file://`.

Expected preview URL when the repo is served on port 8787:

```text
http://localhost:8787/artifacts/generated/start-hackathon.html
```

## Chat Output

Keep chat output minimal.

Do not render:

- placeholder SVGs
- Markdown images
- Mermaid diagrams
- inline dashboards
- landing-page-style copy blocks
- long explanations of the entire workflow

In normal operation, respond with:

- whether state was created or loaded
- that the Start artifact was regenerated
- the localhost preview URL
- the next command: `$review-rules`
- an invitation to ask questions about how the flow works before continuing
- the optional personalization prompt if name/project idea are missing

If artifact generation fails, use a compact text fallback:

- current stage: Start
- next command: `$review-rules`
- registration reminder: Devpost registration still happens in the browser
- one-sentence error summary

## Handoff

End by telling the participant:

1. Preview the Start artifact through localhost.
2. Register on Devpost if needed.
3. Come back and run `$review-rules`.

Also mention `$hackathon-map` only as the recovery command if they lose track later.
