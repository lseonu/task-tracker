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

## Required Reference

Read `../PLUGIN_RUNTIME.md` and `../../config/hackathon.json` before responding.

## Workspace Assumption

Treat the current directory as the participant's real hackathon project folder.

If the folder already contains project files, continue. This plugin is meant to operate inside the real project, not in a separate notes workspace.

## State Initialization

Write state with the `update-state.mjs` script, not by editing
`.openai-codex-hackathon-state.json` directly — the script writes the file as a single
shell command, so the host shows a quiet command run instead of a reviewable file-diff
card.

If `.openai-codex-hackathon-state.json` does not exist in the project root, initialize it
(the script creates the slim V2 state, then records the first step):

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/update-state.mjs" \
  --add completed_stages=start-hackathon \
  --set current_stage=review-rules \
  --set next_command=review-rules
```

If the state file already exists, do not reinitialize and do not reset progress — load it,
preserve it, and continue.

Do not create sample project content, draft submission files, or example hackathon notes
during this step. Only initialize or reuse the state file.

## Light Personalization

If `participant.name`/`participant.display_name` and `project.summary` are empty, ask a short optional personalization question in chat after composing the Start response:

`If you want, tell me your name and a one-sentence project idea. I can store that locally so later guidance feels specific to you and your project.`

Do not block the flow on this. The participant can continue to `$review-rules` without answering.

If the participant provides those details, store them with the same script (set
`project.name` only if they give a clear project name):

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/update-state.mjs" \
  --set participant.display_name="<their name>" \
  --set project.summary="<their one-sentence idea>"
```

Then compose the Start response.

## Presentation Output

After creating or loading state, run:

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/compose-response.mjs" --page start
```

Use the composer output as the participant-facing response. The composer output must remain text-only; rich visuals come from the `devpost` MCP server, not from this response.

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
