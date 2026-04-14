---
name: start-hackathon
description: Start the OpenAI Codex Hackathon workflow in the current project folder. Use when the user wants to begin the guided experience, initialize the local state file, or understand the end-to-end flow before working through the event in Codex.
---

# Start Hackathon

## Overview

Initialize the hackathon flow in the current workspace. Treat the first response like a compact landing page inside Codex: welcoming, visual, and immediately clear about what the user should do next.

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
  "current_stage": "review-rules",
  "completed_stages": ["start-hackathon"],
  "rules_acknowledged": false,
  "project": {
    "name": "",
    "summary": "",
    "openai_usage": "",
    "codex_usage": ""
  },
  "reminders": {
    "last_checked_at": "",
    "next_deadline_label": "",
    "next_deadline_display": "",
    "official_dates_confirmed": false
  },
  "submission": {
    "draft_file": "devpost-submission.md",
    "status": "not-started",
    "public_demo_url": "",
    "repo_url": "",
    "video_url": "",
    "browser_handoff_ready": false
  },
  "next_command": "review-rules"
}
```

If the state file already exists, do not overwrite user data. Summarize the current state and recommend `$hackathon-map` or the recorded `next_command`.

## Experience Goal

Make this feel like the participant has landed inside the hackathon itself rather than inside a plain command reference.

Keep it compact, but give it some lift:
- feel like a lightweight hackathon welcome page, not a wall of bullets
- use rich markdown and graphical output when practical
- keep every visual useful; avoid decorative filler
- position the plugin as the Codex-native participant flow, with the browser reserved for official verification and final Devpost submission

## Opening Message

Use a practical coach tone with a little more polish than a standard CLI handoff.

Cover these points clearly:
- This plugin is meant to replace as much of the Devpost participant journey as possible inside Codex
- The tiny `.openai-codex-hackathon-state.json` file is the continuity layer for the experience
- `$hackathon-map` reads that state file and can be run anytime to show live progress
- Rules review is a strict blocker before the rest of the workflow
- The final browser handoff is still the actual Devpost submission step
- This prototype does not submit to Devpost automatically

## Command Chain

Do not render the flow as plain inline text unless you have no other option.

Prefer this order of presentation:
- a compact hero section with a one-sentence TLDR and the immediate next action
- a graphical command map rendered as inline SVG first
- Mermaid with explicit styling as the fallback if inline SVG is awkward
- plain text arrows only as a last resort

Show this sequence in the visual map:
- `$start-hackathon`
- `$review-rules`
- `$resources`
- `$deadline-reminders`
- `$prepare-submission`
- `$submission-check`

Also note that `$hackathon-map` can be run at any time.

## Visual Guidance

When practical, render these local placeholder assets in the response:
- `../../assets/placeholders/onboarding-video.svg` as a stand-in for a future onboarding video

The opening view should ideally include:
- a compact welcome hero
- a short "how this works" summary
- the progress map with `review-rules` highlighted as next
- a short note that the state file powers the live map

## Handoff

End by directing the user to run `$review-rules`, and remind them that `$hackathon-map` is the live progress view they can revisit at any point.
