---
name: prepare-submission
description: Draft the participant's Devpost submission materials from the current project and saved state. Use when the user has a build worth describing and needs help preparing the title, write-up, testing notes, screenshots, and demo materials.
---

# Prepare Submission

## Overview

Translate the current project into a submission-prep packet that helps the participant complete the real Devpost form in the browser.

This is not a direct submission tool. Treat it as the in-Codex draft room and revision pass that makes the browser handoff easier, faster, and more complete.

## Required Reference

Read `references/submission-template.md` before responding.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

If the workspace or conversation still does not reveal a real project, warn the user that the result will be a draft placeholder rather than a truthful submission.

## Experience Goal

This skill should feel like a founder-friendly submission prep session, not a raw form filler.

The participant should leave with:
- a working draft of the packet content
- a clear list of what is still missing or weak
- practical suggestions for improving the submission before final review

Use a product-facing tone by default. The copy can still be judge-aware, but it should help the builder tell a strong, honest product story.

## Output File

Create or update `devpost-submission.md` in the current project root.

Preserve any user edits already in that file.

Use the reference template as the outline.

Treat the file as a working prep document for the eventual Devpost submission, not as a claim that Codex is submitting anything automatically.

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
- submission readiness notes
- placeholders for repo URL, public demo URL, and video URL
- `[TODO: official form-specific fields]` where the real event later requires exact copy

## Writing Standard

Prefer concise, product-facing language with honest specifics. Avoid hype without evidence.

Inspect the workspace first and use real implementation details when available. Ask only for the smallest missing facts you need.

Make the draft honest about what exists today versus what is still placeholder material.

Treat this like the in-Codex draft room for the Devpost handoff rather than a raw file generation step. Keep the experience polished and grounded.

## Review And Feedback

Do not stop at drafting.

After reviewing the workspace and updating the packet, also give the participant a compact revision round that covers:
- missing submission components
- weak or vague claims
- unclear product positioning
- missing proof points, demo assets, or testing details
- anything about the plugin or project presentation that could make the submission less convincing

Frame this as helpful feedback, not as a pass-fail judgment.

This is the main place for qualitative editorial feedback. Do not defer that kind of feedback to `$submission-check`.

## Response Structure

Keep the in-chat response compact and useful.

Use this order when practical:
- a short top-line summary of the packet status
- confirmation that `devpost-submission.md` was updated
- a short revision checklist or improvement list
- the single next recommendation

The revision checklist should be the centerpiece of the response.

If the project is still missing major information, make that obvious and direct the user to improve the packet before attempting `$submission-check`.

## Revision Handoff

End this skill like a revision round, not a final approval.

Tell the participant to work through the suggested fixes and return for `$submission-check` when they are ready.

Only suggest `$submission-check` as the next command when the packet is materially complete and the remaining gaps are minor.

## State Update

After drafting:
- Add `prepare-submission` to `completed_stages` only when the packet is materially complete and the remaining gaps are minor
- Set `submission.status` to `drafting`
- Set `submission.draft_file` to `devpost-submission.md`
- Set `submission.browser_handoff_ready` to `false`
- Set `current_stage` to `prepare-submission`
- Set `next_command` to:
  - `submission-check` when the packet is materially complete and only minor follow-ups remain
  - otherwise `prepare-submission`
- Update `dashboard` if it exists:
  - set `completion_percent` to `80`
  - update `last_rendered_at`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.

End by directing the user to work through the revision checklist and come back for `$submission-check` when ready.
