---
name: build-project
description: Build the planned hackathon project in the current workspace using the stored project brief as the source of truth. Use when the user is ready to start coding, resume implementation, or turn the plan into a working product.
---

# Build Project

## Overview

Implement the project in the real workspace. Use the saved plan to keep coding grounded in the agreed concept instead of drifting into a different app.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, stop and direct the user to `$review-rules`.

If the `project` object is still empty or vague, stop and direct the user to `$plan-project`.

## Execution Model

Treat the saved project brief as the source of truth for:
- scope
- intended user
- core workflow
- OpenAI usage
- wow factor

Before major edits:
- Restate the current build target in 2-4 lines
- Confirm whether to scaffold from scratch or adapt existing files if the workspace shape is ambiguous

Then implement directly in the current folder.

Prefer small, verifiable milestones over giant jumps.

## Build Discipline

Keep the participant in the loop:
- explain the current increment before editing
- run relevant checks when practical
- summarize what changed and what still needs work
- pause if the implementation needs to deviate materially from the planned concept

Use the plugin state file as the continuity layer, not a large notes system.

## State Update

After each meaningful milestone, update:
- `build.status`
- `build.latest_milestone`
- `build.repo_ready` when the repo is in a credible state for submission
- `build.demo_ready` when there is a working demo path the user can show

When the project reaches a reasonable submission candidate:
- Add `build-project` to `completed_stages` if needed
- Set `current_stage` to `prepare-submission`
- Set `next_command` to `prepare-submission`

Direct the user to `$prepare-submission` once there is enough product to describe honestly.
