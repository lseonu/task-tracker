---
name: build-guide
description: Shared behavior for the optional guided build tool. Not user-invocable.
user-invocable: false
---

# Guided Build Tool Guide

Read `plugin-runtime.md` before running any composer, renderer, or scanner command from a participant project.

This guide adapts the Devpost learning curriculum for the Codex hackathon plugin.

The path is nested inside Step 3: Resources and uses six build commands:

`$build-onboard -> $build-scope -> $build-prd -> $build-spec -> $build-checklist -> $build-project`

After `$build-project`, return to the main flow with `$prepare-submission`.

## Core Rules

- Ask one question at a time.
- Use free-form questions for interviews and planning.
- Use flipped interaction: Codex interviews the participant, draws out context, then writes docs.
- Keep the tone brisk, encouraging, and substantive.
- Do not call the participant remedial or imply the guided build tool is mandatory.
- Read upstream docs before writing downstream docs.
- Use local documents as durable context instead of long JSON state.
- Keep `.devpost-hackathon-state.json` small: progress, file paths, and confirmed project metadata only.
- After each build command, run the response composer for the matching build page.
- Chat is the primary participant interface. Keep composer output text-only, including during the optional guided build tool; rich visuals come from the `devpost` MCP server on capable hosts.
- Do not hand-write separate dashboards, Mermaid diagrams, or long duplicate writeups in chat.

## Documents

Create `docs/hackathon-build/` if it does not exist.

Expected files:

- `learner-profile.md`
- `scope.md`
- `prd.md`
- `spec.md`
- `checklist.md`
- `build-notes.md`
- `process-notes.md`

Before each command after onboarding, read every existing file in `docs/hackathon-build/`.

## Deepening Rounds

For `$build-scope`, `$build-prd`, `$build-spec`, and `$build-checklist`, use two phases:

1. Mandatory questions: enough to produce a meaningful document.
2. Optional deepening rounds: offer another round of 4-5 focused questions before writing the doc.

Use this prompt when ready to offer depth:

> I have enough to write the document. It may be useful to do another round of questions to sharpen it, or I can write the doc now. Which would you prefer?

If they choose another round, ask one question at a time and then offer the choice again.

## Feedback And Handoff

After generating each document:

- Give 2-4 sentences of feedback using `✓` and `△`.
- Name the file created or updated.
- Include the composer output for the matching build page.
- Tell the participant the next command using the exact skill invocation. If anything follows the composer output, make the final line exactly: ``Type this next: `$command-name`.``.
- Update `docs/hackathon-build/process-notes.md`.

Because this is Codex, do not tell the participant to run `/clear` as a hard requirement. Instead, say that the next command can be run in a fresh chat if the conversation feels long.
