---
name: hackathon-map
description: Show the OpenAI Codex Hackathon command map, current project progress, deadline/readiness context, and the next recommended command. Use when the user asks what commands are available, wants to resume after context loss, or wants to know what to do next.
---

# Hackathon Map

## Overview

Show the participant-facing map for this plugin. Read the tiny local state file, explain where the user is in the flow, surface any deadline/readiness context, and make the next step obvious.

This should feel like a compact in-app dashboard, not a status dump. Default to visual communication first.

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

Always make it clear that `.openai-codex-hackathon-state.json` is what powers this map. The participant should understand that the file is the continuity layer for the whole in-Codex hackathon experience.

Use `../../config/hackathon.json` as the source of truth for any official deadline that has been filled in. The state file can cache the currently shown deadline/readiness summary for continuity, but the config is the event source of truth.

If an older state file still references `deadline-reminders` in `current_stage`, `completed_stages`, or `next_command`, treat that as legacy state from an earlier prototype version. Normalize it mentally into the current map flow and do not tell the participant to run a removed command.

## Dynamic Progress Card

Render a compact visual progress card before the text summary when practical.

Build the visual from the current state instead of reading from any external runtime tool. This feature must have zero runtime dependencies.

Prefer this order:
- Mermaid with explicit styling first
- a Markdown image that points at a saved SVG only if Mermaid cannot express the layout cleanly
- plain text only as a last resort

Use this styling approach:
- completed stages should read as done
- the current stage should stand out clearly
- the next command should read as the recommended next action
- blocked stages should be visibly blocked
- each stage should feel like a distinct progress marker, not just a label in a list
- the overall card should feel polished, calm, and visually attractive rather than like a developer debug panel

If the state file does not exist yet, render the whole chain as `not started` and highlight `start-hackathon`.

After the visual card:
- provide only a very small text summary below it
- keep the graphic small enough to scan quickly
- use the same visual language every time so the user learns to recognize it

Any skill that updates `.openai-codex-hackathon-state.json` should immediately render a refreshed compact version of this progress card after the state write.

## Visual Layout

The response should be led by a single rendered dashboard whenever practical.

That dashboard should combine:
- the workflow map
- the current stage
- the next recommended action
- the next known deadline or timing state
- a tiny readiness summary

Prefer one coherent card over multiple separate graphics.

The visual should feel like a friendly product surface:
- clear hierarchy
- strong contrast
- small number of colors with consistent meaning
- compact labels
- enough whitespace to scan in seconds

Avoid decorative filler, giant paragraphs inside the diagram, or anything that looks like placeholder admin tooling.

Important rendering rule for Codex desktop:
- prefer Mermaid for generated dashboards
- if a custom SVG is necessary, save it to a file and render it with Markdown image syntax
- never emit raw `<svg>...</svg>` markup directly into the response

## Deadline And Readiness Summary

This skill now absorbs the lightweight reminder behavior instead of relying on a separate reminder command.

Alongside the progress card, show a compact timing/readiness strip that includes:
- the next known official deadline from `../../config/hackathon.json`, or `TODO official date`
- a one-line explanation of why that timing matters now
- a short readiness checklist when helpful

If no official dates are filled in yet:
- say that the countdown is scaffolded but waiting on the hard-coded event dates
- still show practical readiness guidance based on the current workflow state

When practical, the timing/readiness strip should feel like a small dashboard component, not a separate essay.

Keep the readiness content short. Favor signals like:
- rules cleared or not
- resources reviewed or not
- submission draft started or not
- browser handoff ready or not

## Command Map

Always render these commands in order:
- `start-hackathon`
- `review-rules`
- `resources`
- `prepare-submission`
- `submission-check`

Derive status from state:
- `complete` if the command appears in `completed_stages`
- `current` if it matches `current_stage`
- `next` if it matches `next_command`
- `blocked` if an earlier gate is unmet
- `available` otherwise

Use these gates:
- `prepare-submission` and `submission-check` are blocked until `rules_acknowledged` is `true`
- `submission-check` is blocked until `devpost-submission.md` exists or `submission.status` is `drafting`

## Response Pattern

Keep the output compact and practical:
- lead with the rendered dashboard
- include only a few short lines of supporting text
- show the current stage
- show one-line project status if known
- show the next deadline or timing state
- end with one single recommendation for the next command

The text below the SVG should be minimal. Aim for something closer to a caption plus one recommendation than a full explanation.

## Tone

Make the output feel user-friendly, visually attractive, and calm.

It should read like a polished product dashboard inside the chat app:
- concise
- helpful
- lightly guided
- never verbose

Do not spend space re-explaining the full workflow unless the user is clearly lost.

## State Update

When this skill runs and the state file exists:
- preserve the current workflow stage fields unless the user explicitly asks to change them
- update or create `reminders` with:
  - `last_checked_at`
  - `next_deadline_label`
  - `next_deadline_display`
  - `official_dates_confirmed`
- update `dashboard.deadline_label` and `dashboard.deadline_display` when `dashboard` exists
- update `dashboard.last_rendered_at` when `dashboard` exists

Do not mark additional workflow stages complete just because the user opened the map.

When helpful, mention that this prototype mirrors the core Devpost participant path and intentionally defers direct Devpost API submission, auth, gallery, discussions, and live event updates.
