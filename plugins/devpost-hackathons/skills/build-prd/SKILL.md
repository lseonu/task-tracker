---
name: build-prd
description: Convert the scoped hackathon idea into user-facing product requirements.
---

# Guided Build: PRD

Read `../build-guide/SKILL.md`, then follow this command.

This is the Codex version of the learning curriculum's PRD command.

## Goal

Turn `scope.md` into a product requirements document. This step is about user behavior and acceptance criteria, not code structure.

## Preconditions

Read `.devpost-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

Read everything in `docs/hackathon-build/`. If `scope.md` does not exist, direct the user to `$build-scope`.

## Flow

Ask one question at a time.

Mandatory beats:

1. Walk through the scope section by section and turn casual language into precise behavior.
2. Organize behaviors into user stories and epics with stable headings.
3. Write testable acceptance criteria for each story.
4. Surface edge cases, empty states, first-run experience, and obvious error cases.
5. Guard scope by separating what will be built from what would be added with more time.

After mandatory beats, offer a deepening round. Good PRD deepening topics include feature interactions, persistence, boundary cases, the Devpost "wow moment," assumptions about user order, and polish.

If the participant asks technical implementation questions, defer them warmly to `$build-spec`.

## Output

Use `../build-guide/templates/prd-template.md`.

Create or update:

- `docs/hackathon-build/prd.md`
- `docs/hackathon-build/process-notes.md`

The PRD should be more detailed than the scope doc.

## State Update

Set:

- `learning.current_step` to `prd`
- add `scope` to `learning.completed_steps` if missing
- `next_command` to `build-spec`

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/learning/prd.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script. End by recommending `$build-spec`.

## Required References

- `../PLUGIN_RUNTIME.md`
- `../build-guide/SKILL.md`
- `../../content/learning/prd.md`
