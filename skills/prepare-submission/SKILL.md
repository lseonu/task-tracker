---
name: prepare-submission
description: Draft the participant's Devpost submission materials from the current project and saved state. Use when the user has a build worth describing and needs help preparing the title, write-up, testing notes, screenshots, and demo materials.
---

# Prepare Submission

## Overview

Translate the project into submission-ready materials. Keep the artifact lightweight by writing a single submission draft file in the project root.

## Required Reference

Read `references/submission-template.md` before responding.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If the project brief is missing, stop and direct the user to `$plan-project`.

If the build is still obviously empty, warn the user that the result will be a draft placeholder rather than a truthful submission.

## Output File

Create or update `devpost-submission.md` in the current project root.

Preserve any user edits already in that file.

Use the reference template as the outline.

The draft should include:
- title
- one-line summary
- problem
- solution
- why this matters
- how OpenAI capabilities are used
- how Codex was used in the build process
- key features
- architecture summary
- testing instructions
- screenshot shot list
- demo video outline
- placeholders for repo URL, public demo URL, and video URL
- `[TODO: official form-specific fields]` where the real event later requires exact copy

## Writing Standard

Prefer concise, judge-facing language. Avoid hype without evidence.

Make the draft honest about what exists today versus what is still placeholder material.

## State Update

After drafting:
- Add `prepare-submission` to `completed_stages` if needed
- Set `submission.status` to `drafting`
- Set `submission.draft_file` to `devpost-submission.md`
- Set `current_stage` to `submission-check`
- Set `next_command` to `submission-check`

End by directing the user to `$submission-check`.
