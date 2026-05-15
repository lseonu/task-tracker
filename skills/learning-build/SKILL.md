---
name: learning-build
description: Execute the guided learning checklist with Codex while preserving verification pauses.
---

# Learning Build

Read `../learning-guide/SKILL.md`, then follow this command.

This is the Codex port of the Claude curriculum `/build` command.

## Goal

Build from `docs/hackathon-learning/checklist.md` according to the selected build mode.

The intelligence is in the checklist and spec. Do not improvise new items or skip verification preferences.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

Read everything in `docs/hackathon-learning/`. If `checklist.md` is missing, direct the user to `$learning-checklist`.

If every checklist item is complete, set the learning path complete and direct the user to `$prepare-submission`.

## Step-By-Step Mode

Each `$learning-build` run handles exactly one unchecked checklist item.

For the first unchecked item:

1. Announce what you are building and why it is next.
2. Build only that item.
3. Verify according to the item's `Verify` field if verification is enabled.
4. If comprehension checks are enabled, ask one precise question about what was built.
5. Mark the item complete in `docs/hackathon-learning/checklist.md`.
6. Append build notes to `docs/hackathon-learning/build-notes.md`.
7. End by telling the participant to run `$learning-build` again for the next item, or `$prepare-submission` if complete.

## Autonomous Mode

If the checklist selects autonomous mode, work through the checklist in order.

Pause for verification every 3-4 items if verification is enabled, or sooner if risk rises.

If you use subagents, give each one the relevant checklist item, the full spec, the relevant PRD section, and the instruction that others may be working in the codebase.

## When Something Breaks

Stop. Explain what happened, what you tried, and why it is not a quick fix.

Do not power through a broken checklist item. Propose checklist/spec edits and get participant agreement before changing the plan.

## State Update

Set:

- `learning.current_step` to `build`
- add `checklist` to `learning.completed_steps` if missing
- `next_command` to `learning-build` until the checklist is complete
- when complete, add `build` to `learning.completed_steps`, set `learning.status` to `completed`, set `current_stage` to `prepare-submission`, and set `next_command` to `prepare-submission`

## Artifact

Run:

```bash
node scripts/render-artifacts.mjs --page learning-build
```

The generated page is `artifacts/generated/learning-build.html`.

End with what changed, how it was verified, the artifact URL when useful, and the next command.
