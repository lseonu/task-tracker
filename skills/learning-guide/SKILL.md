---
name: learning-guide
description: Shared behavior for the optional guided learning path. Not user-invocable.
user-invocable: false
---

# Learning Guide

Read `../PLUGIN_RUNTIME.md` before running any renderer or scanner command from a participant project.

This guide adapts the Devpost learning curriculum for the Codex hackathon plugin.

The path is nested inside Step 3: Resources and uses Codex commands:

`$learning-onboard -> $learning-scope -> $learning-prd -> $learning-spec -> $learning-checklist -> $learning-build -> $prepare-submission`

## Core Rules

- Ask one question at a time.
- Use free-form questions for interviews and planning.
- Use flipped interaction: Codex interviews the participant, draws out context, then writes docs.
- Keep the tone brisk, encouraging, and substantive.
- Do not call the participant remedial or imply the learning path is mandatory.
- Read upstream docs before writing downstream docs.
- Use local documents as durable context instead of long JSON state.
- Keep `.openai-codex-hackathon-state.json` small: progress, file paths, and confirmed project metadata only.
- After each learning command, regenerate the matching HTML artifact.
- Generated HTML is the primary participant interface. Chat is only for the live interview, brief progress updates, and fallback if artifact generation fails.
- Do not render placeholder SVGs, Markdown images, Mermaid diagrams, inline dashboards, or long artifact-style pages in chat.

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
- Say the matching HTML artifact was regenerated and provide the localhost URL when useful.
- Tell the participant the next command.
- Update `docs/hackathon-learning/process-notes.md`.

Because this is Codex, do not tell the participant to run `/clear` as a hard requirement. Instead, say that the next command can be run in a fresh chat if the conversation feels long.
