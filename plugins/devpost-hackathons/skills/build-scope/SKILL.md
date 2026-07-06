---
name: build-scope
description: Help the participant turn a rough hackathon idea into a focused scope document.
---

# Guided Build: Scope

Read `../build-guide/SKILL.md`, then follow this command.

This is the Codex version of the learning curriculum's scope command.

## Goal

Use flipped interaction to draw out the participant's idea, sharpen it, cut scope, and write `docs/hackathon-build/scope.md`.

This is the most important context-gathering conversation in the guided build tool. Do not rush to the document.

## Preconditions

Read `.devpost-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `learning.status` is not `active`, direct the user to `$build-onboard` first.

Read everything in `docs/hackathon-build/`, especially `learner-profile.md`.

## Flow

Ask one question at a time.

Mandatory beats:

1. Brain dump: ask them to tell you everything about the idea, what excites them, who would use it, what inspired it, and what it looks like in their head.
2. Research and reaction: use web search for 2-3 inspiring examples in the same space, explain why they might be relevant, and ask what resonates.
3. Sharpen gaps: identify the biggest ambiguities and ask focused follow-ups.
4. Cut scope: help them decide what is not in scope for a credible hackathon build.

After mandatory beats, offer a deepening round before writing the document. Good scope deepening topics include aesthetic feel, emotional hook, inspirational references, what "done" means, and assumptions worth challenging.

## Output

Use `../build-guide/templates/scope-template.md`.

Create or update:

- `docs/hackathon-build/scope.md`
- `docs/hackathon-build/process-notes.md`

## State Update

Set:

- `learning.current_step` to `scope`
- add `onboard` to `learning.completed_steps` if missing
- `learning.plan_file` to `docs/hackathon-build/scope.md`
- confirmed `project.name` and `project.summary` if chosen
- `next_command` to `build-prd`

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/learning/scope.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script. End by recommending `$build-prd`.

## Required References

- `../PLUGIN_RUNTIME.md`
- `../build-guide/SKILL.md`
- `../../content/learning/scope.md`
