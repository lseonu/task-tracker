---
name: build-spec
description: Translate the PRD into a practical technical implementation plan.
---

# Guided Build: Spec

Read `../build-guide/SKILL.md`, then follow this command.

This is the Codex version of the learning curriculum's spec command.

## Goal

Turn the PRD into a technical spec detailed enough that Codex can build from it without guessing.

Interview first, propose second. Adapt depth to the participant's experience level.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

Read everything in `docs/hackathon-build/`. If `scope.md` or `prd.md` is missing, direct the user to the missing prior command.

## Flow

Ask one question at a time.

Mandatory beats:

1. Tech preferences: learn what stack they know or want to use before proposing.
2. Deployment: ask whether this should run locally only or have a deployed URL.
3. Research the stack: use current official docs for frameworks, libraries, and APIs under consideration.
4. Propose architecture section by section, explicitly mapping PRD epics to components.
5. Build a file structure and data flow together.

After mandatory beats, offer a deepening round. Good spec deepening topics include state management, API contracts, error strategy, demo flow, architecture self-review, and assumptions that should be checked against docs.

## Output

Use `../build-guide/templates/spec-template.md`.

Create or update:

- `docs/hackathon-build/spec.md`
- `docs/hackathon-build/process-notes.md`

Critical requirements:

- every architectural component has headings
- PRD epics are cross-referenced
- major dependencies and APIs have documentation links
- file structure and data flow are explicit

## State Update

Set:

- `learning.current_step` to `spec`
- add `prd` to `learning.completed_steps` if missing
- `next_command` to `build-checklist`

## Presentation Output

Run:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/devpost-hackathons/0.1.0/scripts/compose-response.mjs" --page build-spec
```

Use the composer output as the participant-facing response. End by recommending `$build-checklist`.
