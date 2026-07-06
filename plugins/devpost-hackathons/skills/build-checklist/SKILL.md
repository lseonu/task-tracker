---
name: build-checklist
description: Break the technical spec into sequenced build tasks with verification checkpoints.
---

# Guided Build: Checklist

Read `../build-guide/SKILL.md`, then follow this command.

This is the Codex version of the learning curriculum's checklist command.

## Goal

Turn the spec into a sequenced, verifiable build checklist. The checklist is the contract `$build-project` will execute.

## Preconditions

Read `.devpost-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

Read everything in `docs/hackathon-build/`. If `spec.md` or `prd.md` is missing, direct the user to the missing prior command.

## Flow

Ask one question at a time.

Mandatory beats:

1. Sequencing logic: ask what should be built first, then discuss blockers, risk, and simplest viable path.
2. Build mode: choose between autonomous and step-by-step.
3. Build preferences: verification, comprehension checks for step-by-step mode, git cadence, and check-in cadence.
4. Submission planning: identify story, screenshots, repo link, and handoff materials.
5. Break the spec into 8-12 atomic checklist items when practical.

Each checklist item must use the five-field format:

```md
- [ ] **N. Title**
  Spec ref: `spec.md > Section > Subsection`
  What to build: Concrete description.
  Acceptance: Testable criteria from `prd.md`.
  Verify: Specific command or manual check.
```

After the initial checklist draft, offer a deepening round. Good checklist deepening topics include item size, hidden dependencies, verification quality, risk points, autonomous ordering, and whether the submission item is concrete enough.

## Output

Use `../build-guide/templates/checklist-template.md`.

Create or update:

- `docs/hackathon-build/checklist.md`
- `docs/hackathon-build/process-notes.md`

## State Update

Set:

- `learning.current_step` to `checklist`
- add `spec` to `learning.completed_steps` if missing
- `learning.checklist_file` to `docs/hackathon-build/checklist.md`
- `next_command` to `build-project`

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/learning/checklist.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script. End by recommending `$build-project`.

## Required References

- `../PLUGIN_RUNTIME.md`
- `../build-guide/SKILL.md`
- `../../content/learning/checklist.md`
