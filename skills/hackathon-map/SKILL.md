---
name: hackathon-map
description: Show the OpenAI Codex Hackathon command map, current project progress, blocked and unblocked stages, and the next recommended command. Use when the user asks what commands are available, wants to resume after context loss, or wants to know what to do next.
---

# Hackathon Map

## Overview

Show the participant-facing map for this plugin. Read the tiny local state file, explain where the user is in the flow, and make the next step obvious.

## State File

Read `.openai-codex-hackathon-state.json` from the current project root when it exists.

If the file does not exist:
- Show the full command list as `not started`
- Explain that `$start-hackathon` is the entry point
- Do not create files from this skill alone unless the user asks you to initialize the flow

The state file should remain intentionally small. Expect keys in this shape:

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

Always make it clear that `.openai-codex-hackathon-state.json` is what powers this map. The participant should understand that the file is the continuity layer for the whole in-Codex hackathon experience.

## Dynamic Progress Card

Render a compact visual progress card before the text summary when practical.

Build the visual from the current state instead of reading from any external runtime tool. This feature must have zero runtime dependencies.

Prefer this order:
- inline SVG progress graphic first
- Mermaid with explicit styling as fallback
- plain text only as a last resort

Use this styling approach:
- completed stages should read as done
- the current stage should stand out clearly
- the next command should read as the recommended next action
- blocked stages should be visibly blocked
- each stage should feel like a distinct progress marker, not just a label in a list

If the state file does not exist yet, render the whole chain as `not started` and highlight `start-hackathon`.

After the visual card:
- provide the compact text summary below it
- keep the graphic small enough to scan quickly
- use the same visual language every time so the user learns to recognize it

Any skill that updates `.openai-codex-hackathon-state.json` should immediately render a refreshed compact version of this progress card after the state write.

## Command Map

Always render these commands in order:
- `start-hackathon`
- `review-rules`
- `resources`
- `deadline-reminders`
- `prepare-submission`
- `submission-check`

Derive status from state:
- `complete` if the command appears in `completed_stages`
- `current` if it matches `current_stage`
- `next` if it matches `next_command`
- `blocked` if an earlier gate is unmet
- `available` otherwise

Use these gates:
- `deadline-reminders`, `prepare-submission`, and `submission-check` are blocked until `rules_acknowledged` is `true`
- `submission-check` is blocked until `devpost-submission.md` exists or `submission.status` is `drafting`

## Response Pattern

Keep the output compact and practical:
- Show the current stage
- Show one-line project status if known
- Show the command list with statuses
- End with a single recommendation for the next command

When helpful, mention that this prototype mirrors the core Devpost participant path and intentionally defers direct Devpost API submission, auth, gallery, discussions, and live event updates.
