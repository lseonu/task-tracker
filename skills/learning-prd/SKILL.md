---
name: learning-prd
description: Convert the scoped hackathon idea into user-facing product requirements.
---

# Learning PRD

Read `../learning-guide/SKILL.md`, then follow this command.

This is the Codex port of the Claude curriculum `/prd` command.

## Goal

Turn `scope.md` into a product requirements document. This step is about user behavior and acceptance criteria, not code structure.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

Read everything in `docs/hackathon-learning/`. If `scope.md` does not exist, direct the user to `$learning-scope`.

## Flow

Ask one question at a time.

Mandatory beats:

1. Walk through the scope section by section and turn casual language into precise behavior.
2. Organize behaviors into user stories and epics with stable headings.
3. Write testable acceptance criteria for each story.
4. Surface edge cases, empty states, first-run experience, and obvious error cases.
5. Guard scope by separating what will be built from what would be added with more time.

After mandatory beats, offer a deepening round. Good PRD deepening topics include feature interactions, persistence, boundary cases, the Devpost "wow moment," assumptions about user order, and polish.

If the participant asks technical implementation questions, defer them warmly to `$learning-spec`.

## Output

Use `../learning-guide/templates/prd-template.md`.

Create or update:

- `docs/hackathon-learning/prd.md`
- `docs/hackathon-learning/process-notes.md`

The PRD should be more detailed than the scope doc.

## State Update

Set:

- `learning.current_step` to `prd`
- add `scope` to `learning.completed_steps` if missing
- `next_command` to `learning-spec`

## Artifact

Run:

```bash
node scripts/render-artifacts.mjs --page learning-prd
```

The generated page is `artifacts/generated/learning-prd.html`.

End by saying the artifact was regenerated and recommending `$learning-spec`.
