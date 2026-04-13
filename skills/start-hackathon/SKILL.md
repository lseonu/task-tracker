---
name: start-hackathon
description: Start the OpenAI Codex Hackathon workflow in the current project folder. Use when the user wants to begin the guided experience, initialize the local state file, or understand the end-to-end flow before planning and coding.
---

# Start Hackathon

## Overview

Initialize the hackathon flow in the current workspace. Welcome the user, explain the plugin map, and create the tiny state file that survives cleared context.

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
    "problem": "",
    "users": "",
    "core_workflow": "",
    "openai_usage": "",
    "codex_usage": "",
    "wow_factor": "",
    "anti_patterns_checked": false
  },
  "build": {
    "status": "not-started",
    "latest_milestone": "",
    "repo_ready": false,
    "demo_ready": false
  },
  "submission": {
    "draft_file": "devpost-submission.md",
    "status": "not-started",
    "public_demo_url": "",
    "repo_url": "",
    "video_url": ""
  },
  "next_command": "review-rules"
}
```

If the state file already exists, do not overwrite user data. Summarize the current state and recommend `$hackathon-map` or the recorded `next_command`.

## Opening Message

Use a practical coach tone.

Cover these points briefly:
- This plugin mirrors the core Devpost hackathon path inside Codex
- The user can check available commands anytime with `$hackathon-map`
- The final browser handoff is only for the actual Devpost submission step
- Rules review is a strict blocker before planning and building

## Command Chain

Show this sequence:
`$start-hackathon` → `$review-rules` → `$resources` → `$plan-project` → `$build-project` → `$prepare-submission` → `$submission-check`

Also note that `$hackathon-map` can be run at any time.

## Handoff

End by directing the user to run `$review-rules`.
