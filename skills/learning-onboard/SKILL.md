---
name: learning-onboard
description: Start the optional guided learning path inside Step 3 Resources. Use when the participant wants help shaping a hackathon project before submission prep.
---

# Learning Ideate

Read `../learning-guide/SKILL.md`, then follow this command.

This is the Codex port of the Claude curriculum `/onboard` command. In the participant UI, this phase is labeled `Ideate`.

## Goal

Welcome the participant, introduce the optional guided path, begin brainstorming the project idea, and create `docs/hackathon-learning/learner-profile.md` so every downstream learning command can calibrate to who they are.

Do not over-explain the whole process. Keep onboarding warm and efficient.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

Create `docs/hackathon-learning/` if needed. Read any existing files in it before asking questions.

## Flow

Open with a brief welcome and explain:

- this optional path helps them plan before Codex builds
- Codex will interview them using flipped interaction
- the docs are useful build context and submission evidence
- the command chain is `$learning-onboard -> $learning-scope -> $learning-prd -> $learning-spec -> $learning-checklist -> $learning-build`

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

Use `../learning-guide/templates/learner-profile-template.md`.

Create or update:

- `docs/hackathon-learning/learner-profile.md`
- `docs/hackathon-learning/process-notes.md`

## State Update

Set:

- `learning.status` to `active`
- `learning.current_step` to `onboard`
- add `resources` to `completed_stages` if missing
- `current_stage` to `resources`
- `next_command` to `learning-scope`

## Artifact

Run:

```bash
node scripts/render-artifacts.mjs --page learning-onboard
```

The generated page is `artifacts/generated/learning-onboard.html`.

End with a compact note that the artifact was regenerated and the next command is `$learning-scope`.
