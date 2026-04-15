---
name: start-hackathon
description: Start the OpenAI Codex Hackathon workflow in the current project folder. Use when the user wants to begin the guided experience, initialize the local state file, or understand the end-to-end flow before working through the event in Codex.
---

# Start Hackathon

## Overview

Initialize the hackathon flow in the current workspace. Treat the first response like a compact Devpost-style landing page remixed for Codex: welcoming, visual, and immediately clear about what the user should do next.

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
  "dashboard": {
    "completion_percent": 0,
    "registration_status": "not-started",
    "deadline_label": "Official deadline pending",
    "deadline_display": "TODO official date",
    "last_rendered_at": ""
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

Do not create sample project content, draft submission files, or example hackathon notes during this step. Only initialize or reuse the state file.

## Experience Goal

Make this feel like the participant has landed inside the hackathon itself rather than inside a plain command reference.

Keep it compact, but give it some lift:
- feel like a lightweight hackathon landing page plus dashboard, not a wall of bullets
- use rich markdown and graphical output when practical
- keep every visual useful; avoid decorative filler
- position the plugin as the Codex-native participant flow, with the browser reserved for official verification and final Devpost submission
- make it obvious that browser registration happens first, then the rest of the workflow continues in Codex

## Opening Message

Use a practical coach tone with a little more polish than a standard CLI handoff.

Cover these points clearly:
- This plugin is meant to replace as much of the Devpost participant journey as possible inside Codex
- Devpost registration still happens in the browser before the participant continues here
- The tiny `.openai-codex-hackathon-state.json` file is the continuity layer for the experience
- `$hackathon-map` reads that state file and can be run anytime to show live progress
- Rules review is a strict blocker before the rest of the workflow
- The final browser handoff is still the actual Devpost submission step
- This prototype does not submit to Devpost automatically

## Response Structure

Use this order when practical:
- a compact hero with a one-sentence TLDR
- a primary CTA to register on Devpost
- one clickable temporary hackathon link from `../../config/hackathon.json`
- a short explanation of how the Codex flow takes over after registration
- the zero-state dashboard rendered from `.openai-codex-hackathon-state.json`
- a compact note that the state file powers the live map

Keep the whole response to about one compact screenful.

## Command Chain

Do not render the flow as plain inline text unless you have no other option.

Prefer this order of presentation:
- a compact hero section with a one-sentence TLDR and the immediate next action
- a graphical command map rendered as Mermaid first
- a Markdown image that points at a saved SVG only if Mermaid cannot express the layout cleanly
- plain text arrows only as a last resort

Show this sequence in the visual map:
- `$start-hackathon`
- `$review-rules`
- `$resources`
- `$prepare-submission`
- `$submission-check`

Also note that `$hackathon-map` can be run at any time to show both workflow progress and deadline/readiness context.

## Visual Guidance

When practical, render these local placeholder assets in the response:
- `../../assets/placeholders/onboarding-video.svg` as a stand-in for a future onboarding video
- `../../assets/placeholders/start-hackathon-landing.svg` as the compact start screen visual
- `../../assets/placeholders/devpost-registration-handoff.svg` as the browser registration handoff visual

Also render one remote Devpost brand image as a lightweight cue when practical:
- `https://logo.clearbit.com/devpost.com`

Important rendering rule for Codex desktop:
- use Markdown image syntax for every local or remote image
- use absolute filesystem paths for local assets
- never use raw HTML `<img>` tags in the response

Example pattern:
- `![Hackathon landing](/absolute/path/to/start-hackathon-landing.svg)`
- `![Devpost](https://logo.clearbit.com/devpost.com)`

The opening view should ideally include:
- a compact welcome hero
- a short "how this works" summary
- a visible browser handoff for Devpost registration
- the progress map with `review-rules` highlighted as next
- the dashboard in a fully zeroed initial state except for `start-hackathon` being complete
- a short note that the state file powers the live map

## Zero-State Dashboard

Render a compact zero-state dashboard from `.openai-codex-hackathon-state.json` immediately after the state file is created or loaded.

Prefer Mermaid with explicit styling for this dashboard in Codex desktop.

Do not emit raw `<svg>...</svg>` markup directly into the response. If Mermaid cannot express the desired layout cleanly, write a temporary SVG file and render it as a Markdown image instead.

The dashboard should:
- show the workflow in order
- show `start-hackathon` as complete
- show `review-rules` as next
- show every later stage as not started or blocked
- show registration as an external prerequisite banner, not as its own command stage
- show the next known deadline from config when available, otherwise `TODO official date`
- include a tiny legend or labels so the visual is self-explanatory without extra prose

After the dashboard, explain in one or two lines that the graphic is driven by the state file and will update as the participant confirms each step.

## Handoff

End with a clear two-part handoff:
- first, open the Devpost registration page in the browser
- then come back and run `$review-rules`

Also remind the user that `$hackathon-map` is the live progress view they can revisit at any point.
