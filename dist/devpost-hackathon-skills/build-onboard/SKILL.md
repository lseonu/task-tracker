---
name: build-onboard
description: Start the optional guided build tool inside Step 3 Resources. Use when the participant wants help shaping a hackathon project before submission prep.
---

# Guided Build: Ideate

Read `references/build-guide.md`, then follow this command.

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
- the docs are useful build context and submission evidence
- the command chain is `$build-onboard -> $build-scope -> $build-prd -> $build-spec -> $build-checklist -> $build-project`

Keep the onboarding short. Ask questions in batches, not one at a time — repeated single-question back-and-forth is cumbersome in the desktop app. Ask these two or three questions together in one message:

1. Do you have an idea of what you want to build today? (A rough sketch is fine — "no idea yet" is a valid answer.)
2. What's your coding experience — level, and any languages, frameworks, or AI coding agents you've used?
3. What brought you to the hackathon (and your name, if you'd like to share it)?

After they answer, ask whether they'd like a couple more questions to sharpen the profile or would rather move on. If they want more, ask one final batch (e.g. whether they have planned projects with docs before, and preferred pace or support needs). If not, move straight on to `$build-scope`.

If they want to dictate answers with speech-to-text, support that naturally. Accept longer dictated responses, summarize them back, and confirm before writing durable files.

## Output

Use `references/templates/learner-profile-template.md`.

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

Compose the response in-context per `references/plugin-runtime.md` ("Composing the Response"): read `references/content/learning/onboard.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script. End with a compact note that the next command is `$build-scope`.

## Required References

- `references/plugin-runtime.md`
- `references/build-guide.md`
- `references/content/learning/onboard.md`
