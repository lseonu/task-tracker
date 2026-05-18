---
name: learning-guide
description: Shared behavior for the optional guided learning path. Not user-invocable.
user-invocable: false
---

# Learning Guide

Read `../PLUGIN_RUNTIME.md` before running any composer, renderer, or scanner command from a participant project.

This guide adapts the Devpost learning curriculum for the Codex hackathon plugin.

The path is nested inside Step 3: Resources and uses six learning commands:

`$learning-onboard -> $learning-scope -> $learning-prd -> $learning-spec -> $learning-checklist -> $learning-build`

After `$learning-build`, return to the main flow with `$prepare-submission`.

## Core Rules

- Ask one question at a time.
- Use free-form questions for interviews and planning.
- Use flipped interaction: Codex interviews the participant, draws out context, then writes docs.
- Keep the tone brisk, encouraging, and substantive.
- Do not call the participant remedial or imply the learning path is mandatory.
- Read upstream docs before writing downstream docs.
- Use local documents as durable context instead of long JSON state.
- Keep `.openai-codex-hackathon-state.json` small: progress, file paths, and confirmed project metadata only.
- After each learning command, run the response composer for the matching learning page.
- Chat is the primary participant interface. This CLI plugin stays text-only, including during the optional learning path.
- Do not hand-write separate dashboards, Mermaid diagrams, or long duplicate writeups in chat.

## Documents

Create `docs/hackathon-learning/` if it does not exist.

Expected files:

- `learner-profile.md`
- `scope.md`
- `prd.md`
- `spec.md`
- `checklist.md`
- `build-notes.md`
- `process-notes.md`

Before each command after onboarding, read every existing file in `docs/hackathon-learning/`.

## Deepening Rounds

For `$learning-scope`, `$learning-prd`, `$learning-spec`, and `$learning-checklist`, use two phases:

1. Mandatory questions: enough to produce a meaningful document.
2. Optional deepening rounds: offer another round of 4-5 focused questions before writing the doc.

Use this prompt when ready to offer depth:

> I have enough to write the document. It may be useful to do another round of questions to sharpen it, or I can write the doc now. Which would you prefer?

If they choose another round, ask one question at a time and then offer the choice again.

## Feedback And Handoff

After generating each document:

- Give 2-4 sentences of feedback using `✓` and `△`.
- Name the file created or updated.
- Include the composer output for the matching learning page.
- Tell the participant the next command using the exact skill invocation. If anything follows the composer output, make the final line exactly: ``Type this next: `$command-name`.``.
- Update `docs/hackathon-learning/process-notes.md`.

Because this is Codex, do not tell the participant to run `/clear` as a hard requirement. Instead, say that the next command can be run in a fresh chat if the conversation feels long.
