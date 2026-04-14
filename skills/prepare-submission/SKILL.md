---
name: prepare-submission
description: Draft the participant's Devpost submission materials from the current project and saved state. Use when the user has a build worth describing and needs help preparing the title, write-up, testing notes, screenshots, and demo materials.
---

# Prepare Submission

## Overview

Translate the current project into submission-ready materials. Keep the artifact lightweight by writing a single submission draft file in the project root.

## Required Reference

Read `references/submission-template.md` before responding.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

If the workspace or conversation still does not reveal a real project, warn the user that the result will be a draft placeholder rather than a truthful submission.

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
- browser handoff checklist
- placeholders for repo URL, public demo URL, and video URL
- `[TODO: official form-specific fields]` where the real event later requires exact copy

## Writing Standard

Prefer concise, judge-facing language. Avoid hype without evidence.

Inspect the workspace first and use real implementation details when available. Ask only for the smallest missing facts you need.

Make the draft honest about what exists today versus what is still placeholder material.

Treat this like the in-Codex draft room for the Devpost handoff rather than a raw file generation step. Keep the experience polished and grounded.

## State Update

After drafting:
- Add `prepare-submission` to `completed_stages` if needed
- Set `submission.status` to `drafting`
- Set `submission.draft_file` to `devpost-submission.md`
- Set `submission.browser_handoff_ready` to `false`
- Set `current_stage` to `submission-check`
- Set `next_command` to `submission-check`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.

End by directing the user to `$submission-check`.
