---
name: start-hackathon
description: Start the OpenAI Codex Hackathon workflow in the current project folder. Use when the user wants to begin the guided experience, initialize the local state file, or understand the end-to-end flow before working through the event in Codex.
---

# Start Hackathon

## Purpose

Initialize or resume the local hackathon state, compose the Start chat response, and point the participant to the next command.

Chat is the primary participant interface. Keep responses text-first so they render in any Codex host; the bundled `devpost` MCP server supplies rich inline visuals on hosts that support them.

## Required Data Source

Use the `devpost` MCP server (bundled with this plugin) as the source of truth for official hackathon information. Verify its tools are callable in this Codex session, for example `mcp__devpost__get_hackathon_overview`. If they are missing (an older Codex that does not auto-register bundled servers, or the server was disabled), add it manually with `codex mcp add devpost --url https://devpost.com/mcp` and restart Codex.

Once the hackathon identifier is known, call:
- `devpost.get_hackathon_overview`
- `devpost.get_key_dates`
- `devpost.get_announcements`

Do not fabricate official hackathon data when the server is unavailable; fall back to the local `config/hackathon.json` and content files and say the data is provisional.

## Required References

Read before responding:

- `../PLUGIN_RUNTIME.md`
- `../../config/hackathon.json`
- `../../content/steps/start.md` (the page content you will present)

## Workspace Assumption

Treat the current directory as the participant's real hackathon project folder.

If the folder already contains project files, continue. This plugin is meant to operate inside the real project, not in a separate notes workspace.

## State Initialization

If `.openai-codex-hackathon-state.json` does not exist in the project root, create it by
writing this initial (slim V2) payload:

```json
{
  "plugin": "devpost-hackathon",
  "version": 2,
  "participant": { "name": "", "display_name": "" },
  "project": { "name": "", "summary": "", "openai_usage": "", "codex_usage": "" },
  "current_stage": "review-rules",
  "completed_stages": ["start-hackathon"],
  "rules_acknowledged": false,
  "learning": { "status": "not-started", "current_step": "", "completed_steps": [], "plan_file": "", "checklist_file": "" },
  "submission": { "draft_file": "devpost-submission.md", "status": "not-started", "browser_handoff_ready": false },
  "next_command": "review-rules"
}
```

If the state file already exists, do not reinitialize and do not reset progress — load it,
preserve it, and continue.

Do not create sample project content, draft submission files, or example hackathon notes
during this step. Only initialize or reuse the state file.

## Light Personalization

If `participant.name`/`participant.display_name` and `project.summary` are empty, ask a short optional personalization question in chat after composing the Start response:

`If you want, tell me your name and a one-sentence project idea. I can store that locally so later guidance feels specific to you and your project.`

Do not block the flow on this. The participant can continue to `$review-rules` without answering.

If the participant provides those details, edit `.openai-codex-hackathon-state.json` to set
`participant.display_name` and `project.summary` (and `project.name` only if they give a
clear project name), preserving the rest of the file. Then compose the Start response.

## Presentation Output

After creating or loading state, compose the response in-context per `../PLUGIN_RUNTIME.md`
("Composing the Response"): read `../../content/steps/start.md`, strip maintainer `<!-- -->`
comments, interpolate the event name, and present it as the participant-facing response.
Render the journey stepper widget first (see PLUGIN_RUNTIME). Keep the response text-only;
the stepper widget is the progress visual.

## Chat Output

Keep chat output minimal. Do not hand-write a separate progress dashboard or landing
experience — the stepper widget shows progress.

In normal operation, respond with:

- a warm welcome that names the event and explains that Codex will guide the participant through the hackathon from this project folder
- one sentence explaining that Codex will keep the process in chat with text progress
- whether state was created or loaded
- the next command: `$review-rules`
- an invitation to ask questions about how the flow works before continuing
- the optional personalization prompt if name/project idea are missing

## Handoff

End by telling the participant:

1. Register on Devpost if needed.
2. Come back and run `$review-rules`.

Also mention `$hackathon-map` only as the recovery command if they lose track later.
