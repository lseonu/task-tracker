---
name: build-onboard
description: Start the optional guided build tool inside Step 3 Resources. Use when the participant wants help shaping a hackathon project before submission prep.
---

# Guided Build: Ideate

Read `../build-guide/SKILL.md`, then follow this command.

This is the Codex version of the learning curriculum's onboarding command. In the participant UI, this phase is labeled `Ideate`.

## Goal

Welcome the participant, introduce the optional guided path, begin brainstorming the project idea, and create `docs/hackathon-build/learner-profile.md` so every downstream build command can calibrate to who they are.

Do not over-explain the whole process. Keep onboarding warm and efficient.

## Preconditions

Read `.devpost-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review` first.

Create `docs/hackathon-build/` if needed. Read any existing files in it before asking questions.

## Flow

Open with a brief welcome and explain:

- this optional path helps them plan before Codex builds
- Codex will interview them using flipped interaction
- the docs are useful build context and submission evidence
- the command chain is `$build-onboard -> $build-scope -> $build-prd -> $build-spec -> $build-checklist -> $build-project`

Then ask one question at a time to learn:

- name, if they want to share it
- what they do and what brought them to the hackathon
- coding experience level
- languages/frameworks they know, if any
- whether they have used AI coding agents before
- what they want to learn beyond shipping the app
- creative sensibility signals, such as apps, games, books, music, or art they like
- whether they have planned projects with docs before

If they want to dictate answers with speech-to-text, support that naturally. Accept longer dictated responses, summarize them back, and confirm before writing durable files.

## Output

Use `../build-guide/templates/learner-profile-template.md`.

Create or update:

- `docs/hackathon-build/learner-profile.md`
- `docs/hackathon-build/process-notes.md`

## State Update

Set:

- `learning.status` to `active`
- `learning.current_step` to `onboard`
- add `resources` to `completed_stages` if missing
- `current_stage` to `resources`
- `next_command` to `build-scope`
- `participant.display_name` when the participant gives a preferred name
- `project.summary` when the participant describes the project idea
- `project.name` when the participant gives a clear project name

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/learning/onboard.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script. End with a compact note that the next command is `$build-scope`.

## Required References

- `../PLUGIN_RUNTIME.md`
- `../build-guide/SKILL.md`
- `../../content/learning/onboard.md`
