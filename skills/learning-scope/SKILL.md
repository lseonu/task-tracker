---
name: learning-scope
description: Help the participant turn a rough hackathon idea into a focused scope document.
---

# Learning Scope

Read `../learning-guide/SKILL.md`, then follow this command.

This is the Codex port of the Claude curriculum `/scope` command.

## Goal

Use flipped interaction to draw out the participant's idea, sharpen it, cut scope, and write `docs/hackathon-learning/scope.md`.

This is the most important context-gathering conversation in the learning path. Do not rush to the document.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `learning.status` is not `active`, direct the user to `$learning-onboard` first.

Read everything in `docs/hackathon-learning/`, especially `learner-profile.md`.

## Flow

Ask one question at a time.

Mandatory beats:

1. Brain dump: ask them to tell you everything about the idea, what excites them, who would use it, what inspired it, and what it looks like in their head.
2. Research and reaction: use web search for 2-3 inspiring examples in the same space, explain why they might be relevant, and ask what resonates.
3. Sharpen gaps: identify the biggest ambiguities and ask focused follow-ups.
4. Cut scope: help them decide what is not in scope for a credible hackathon build.

After mandatory beats, offer a deepening round before writing the document. Good scope deepening topics include aesthetic feel, emotional hook, inspirational references, what "done" means, and assumptions worth challenging.

## Output

Use `../learning-guide/templates/scope-template.md`.

Create or update:

- `docs/hackathon-learning/scope.md`
- `docs/hackathon-learning/process-notes.md`

## State Update

Set:

- `learning.current_step` to `scope`
- add `onboard` to `learning.completed_steps` if missing
- `learning.plan_file` to `docs/hackathon-learning/scope.md`
- confirmed `project.name` and `project.summary` if chosen
- `next_command` to `learning-prd`

## Artifact

Run:

```bash
node scripts/render-artifacts.mjs --page learning-scope
```

The generated page is `artifacts/generated/learning-scope.html`.

End by saying the artifact was regenerated and recommending `$learning-prd`.
