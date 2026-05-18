---
name: start-hackathon
description: Start the OpenAI Codex Hackathon workflow in the current project folder. Use when the user wants to begin the guided experience, initialize the local state file, or understand the end-to-end flow before working through the event in Codex.
---

# Start Hackathon

## Purpose

Initialize or resume the local hackathon state, compose the Start chat response, and point the participant to the next command.

Chat is the primary participant interface. This CLI plugin keeps responses text-only with compact progress lines.

## Required Reference

Read `../PLUGIN_RUNTIME.md` and `../../config/hackathon.json` before responding.

## Workspace Assumption

Treat the current directory as the participant's real hackathon project folder.

If the folder already contains project files, continue. This plugin is meant to operate inside the real project, not in a separate notes workspace.

## State Initialization

Create `.openai-codex-hackathon-state.json` in the project root if it does not exist.

Use this initial payload:

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

If the state file already exists, do not overwrite user data. Load it, preserve it, and continue.

Do not create sample project content, draft submission files, or example hackathon notes during this step. Only initialize or reuse the state file.

## Light Personalization

If `participant.name`/`participant.display_name` and `project.summary` are empty, ask a short optional personalization question in chat after composing the Start response:

`If you want, tell me your name and a one-sentence project idea. I can store that locally so later guidance feels specific to you and your project.`

Do not block the flow on this. The participant can continue to `$review-rules` without answering.

If the participant provides those details, update `.openai-codex-hackathon-state.json`:

- `participant.display_name`
- `project.summary`
- `project.name` only if they give a clear project name

Then compose the Start response.

## Presentation Output

After creating or loading state, run:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/devpost-hackathon-cli/0.1.0/scripts/compose-response.mjs" --page start
```

Use the composer output as the participant-facing response. In this CLI plugin, the response must remain text-only.

## Chat Output

Keep chat output minimal.

Do not hand-write a separate dashboard or landing experience. Let the CLI composer render the response.

In normal operation, respond with:

- a warm welcome that names the event and explains that Codex will guide the participant through the hackathon from this project folder
- one sentence explaining that Codex will keep the process in chat with text progress
- whether state was created or loaded
- the next command: `$review-rules`
- an invitation to ask questions about how the flow works before continuing
- the optional personalization prompt if name/project idea are missing

If composer generation fails, use a compact text fallback:

- current stage: Start
- next command: `$review-rules`
- registration reminder: Devpost registration still happens in the browser
- one-sentence error summary

## Handoff

End by telling the participant:

1. Register on Devpost if needed.
2. Come back and run `$review-rules`.

Also mention `$hackathon-map` only as the recovery command if they lose track later.
