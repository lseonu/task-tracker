---
name: next
description: Use this project-local skill when the user says "$next" or asks to continue the V1 sprint. It reads V1_CHECKLIST.md, finds the earliest unchecked numbered item, runs a flipped-interaction interview to decide exactly how to do that item, executes the agreed work, verifies it, and marks that item complete.
---

# Next

## Purpose

Drive this plugin's V1 sprint one checklist item at a time.

This skill is for development of the Devpost/Codex hackathon plugin itself, not for participant-facing hackathon users.

## Required File

Read `V1_CHECKLIST.md` from the repo root before doing anything else.

## Checklist Selection

Find the earliest numbered heading with an unchecked marker:

```md
## 1. [ ] Example Item
```

Ignore completed headings:

```md
## 1. [x] Example Item
```

Work on exactly one unchecked numbered item per `$next` run unless the user explicitly asks to continue further.

If there are no unchecked numbered items, report that the V1 checklist is complete and suggest a review pass.

## Flipped Interaction

Before implementation, interview the user about the selected item.

Use a flipped interaction style:
- briefly state the selected checklist item
- ask focused questions that help the user decide how the item should be done
- keep questions concrete and sequenced
- avoid presenting a large plan before hearing the user's preferences
- incorporate the user's answers into a short implementation plan

Ask only as many questions as needed for the current item. Prefer 1-3 questions at a time.

## Execution

After the user gives enough direction:
- implement the selected checklist item
- keep changes scoped to that item
- update supporting docs, artifacts, skills, config, or templates as needed
- verify the work with the lightest reliable check
- report what changed

Do not mark the item complete until the work is actually done and verified.

## Completion Marking

When the selected item is complete, update only that heading in `V1_CHECKLIST.md`:

```md
## 1. [x] Example Item
```

Do not mark later items complete preemptively.

If the item is partially done, leave it unchecked and add a concise note under that section explaining what remains.

## Response Pattern

When starting an item:
- identify the selected checklist item
- ask the flipped-interaction question(s)

When finishing an item:
- summarize the completed work
- mention verification
- say that the checklist item was marked complete, if it was
- name the next unchecked item without starting it unless the user asks

## Guardrails

- Preserve user changes.
- Do not rewrite the checklist structure unless needed for this workflow.
- Do not implement future Devpost MCP integration until Benoit's authenticated MCP exists.
- Do not add video structures to participant-facing templates until a media embed proof passes.
- Treat Codex desktop app as the required participant surface.
