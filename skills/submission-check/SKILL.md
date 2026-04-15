---
name: submission-check
description: Run the final pre-submission review against the hackathon requirements and the prepared draft materials. Use when the user wants a pass-fail style checklist before handing off to Devpost for the actual submission.
---

# Submission Check

## Overview

Perform the last internal review before the participant leaves Codex to submit on Devpost in the browser. Flag missing assets, weak claims, and unresolved placeholders.

This step should function as the clean final box-checking gate after the revision round, not as a second qualitative critique pass.

## Required Reference

Read `references/preflight-checklist.md` before responding.

Also read `../../config/hackathon.json` for the browser handoff URL.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

If `devpost-submission.md` does not exist, direct the user to `$prepare-submission`.

## Review Standard

Run a concrete pass-fail review across:
- rules acknowledgment recorded
- project brief present
- honest build description
- OpenAI usage explained clearly
- Codex usage explained clearly
- testing instructions included
- repo link present or clearly marked TODO
- public demo link present or clearly marked TODO
- demo video plan or URL present or clearly marked TODO
- screenshot plan present
- browser handoff checklist present
- unresolved legal or sponsor placeholders clearly labeled
- no obvious contradiction between the build and the submission copy

Keep the review practical. Focus on completeness, clarity of required assets, and browser handoff readiness.

Do not spend time on broad product critique here unless it directly affects submission readiness.

## Output Format

Return:
- a short top-line result: `ready`, `close`, or `not ready`
- a compact scorecard with a simple numeric rubric when practical
- a flat checklist or table with `pass`, `fix now`, or `placeholder`
- short reasoning for each weak area
- the single next best action to take

Prefer a visual review card over a plain paragraph block.

When practical:
- render the scorecard as Mermaid first when possible
- use a Markdown image that points at a saved SVG only if Mermaid cannot express the layout cleanly
- use status icons or emoji sparingly to make the review easier to scan
- present the criteria as a compact table
- make the result feel like a polished preflight check, not just a dumped checklist

Keep the text terse. The visual scorecard and checklist should do most of the work.

## Handoff Behavior

If the result is `ready`:
- explicitly tell the user they are ready to complete the Devpost submission in the browser
- reference the official submission URL from `../../config/hackathon.json` when it is available
- if the official URL is still missing, say that the browser handoff link is still `TODO official URL`

If the result is `close` or `not ready`:
- point back to the most useful fixing command
- keep the remediation list concrete and short
- do not turn this into a second revision essay

## Visual Guidance

When practical, render `../../assets/placeholders/submission-check-scorecard.svg` as a placeholder or fallback visual for the final review surface.

For local placeholder visuals in Codex desktop:
- use Markdown image syntax with an absolute filesystem path
- never use raw HTML `<img>` tags
- never emit raw `<svg>...</svg>` markup directly into the response

The review UI should feel:
- crisp
- trustworthy
- compact
- a little ceremonial, since this is the final internal checkpoint

Avoid anything playful enough to undercut the seriousness of the final review.

## State Update

If the project passes cleanly enough for handoff:
- Add `submission-check` to `completed_stages` if needed
- Set `submission.status` to `ready`
- Set `submission.browser_handoff_ready` to `true`
- Set `current_stage` to `submission-check`
- Clear `next_command` or set it to `hackathon-map`
- Update `dashboard` if it exists:
  - set `completion_percent` to `100`
  - set `registration_status` to `complete`
  - update `last_rendered_at`

If it does not pass:
- Set `submission.status` to `needs-work`
- Set `current_stage` to `submission-check`
- Set `next_command` to the specific command that should fix the issue
- Point the user back to that specific command
- Update `dashboard` if it exists:
  - set `completion_percent` to `80`
  - update `last_rendered_at`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.
