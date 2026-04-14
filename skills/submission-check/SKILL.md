---
name: submission-check
description: Run the final pre-submission review against the hackathon requirements and the prepared draft materials. Use when the user wants a pass-fail style checklist before handing off to Devpost for the actual submission.
---

# Submission Check

## Overview

Perform the last internal review before the participant leaves Codex to submit on Devpost in the browser. Flag missing assets, weak claims, and unresolved placeholders.

## Required Reference

Read `references/preflight-checklist.md` before responding.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

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

## Output Format

Return:
- a short top-line result: `ready`, `close`, or `not ready`
- a compact scorecard with a simple numeric rubric when practical
- a flat checklist or table with `pass`, `fix now`, or `placeholder`
- short reasoning for each weak area
- the single next best action to take

Prefer a visual review card over a plain paragraph block.

When practical:
- use status icons or emoji sparingly to make the review easier to scan
- present the criteria as a compact table
- make the result feel like a grading moment, not just a dumped checklist

## State Update

If the project passes cleanly enough for handoff:
- Add `submission-check` to `completed_stages` if needed
- Set `submission.status` to `ready`
- Set `submission.browser_handoff_ready` to `true`
- Set `current_stage` to `submission-check`
- Clear `next_command` or set it to `hackathon-map`

If it does not pass:
- Set `submission.status` to `needs-work`
- Point the user back to the specific command that should fix the issue

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.
