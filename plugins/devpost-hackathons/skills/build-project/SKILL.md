---
name: build-project
description: Execute the guided build checklist with Codex while preserving verification pauses.
---

# Guided Build: Build

Read `../build-guide/SKILL.md`, then follow this command.

This is the Codex version of the learning curriculum's build command.

## Goal

Build from `docs/hackathon-build/checklist.md` according to the selected build mode.

The intelligence is in the checklist and spec. Do not improvise new items or skip verification preferences.

## Preconditions

Read `.devpost-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

Read everything in `docs/hackathon-build/`. If `checklist.md` is missing, direct the user to `$build-checklist`.

If every checklist item is complete, set the guided build tool complete and direct the user to `$prepare-submission`.

## Step-By-Step Mode

Each `$build-project` run handles exactly one unchecked checklist item.

For the first unchecked item:

1. Announce what you are building and why it is next.
2. Build only that item.
3. Verify according to the item's `Verify` field if verification is enabled.
4. If comprehension checks are enabled, ask one precise question about what was built.
5. Mark the item complete in `docs/hackathon-build/checklist.md`.
6. Append build notes to `docs/hackathon-build/build-notes.md`.
7. End by telling the participant to run `$build-project` again for the next item, or `$prepare-submission` if complete.

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
- `next_command` to `build-project` until the checklist is complete
- when complete, add `build` to `learning.completed_steps`, set `learning.status` to `completed`, set `current_stage` to `prepare-submission`, and set `next_command` to `prepare-submission`

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/learning/build.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script. End with what changed, how it was verified, and the next command.

## Required References

- `../PLUGIN_RUNTIME.md`
- `../build-guide/SKILL.md`
- `../../content/learning/build.md`
