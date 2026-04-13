---
name: review-rules
description: Present the hackathon requirements, judging criteria, eligibility placeholders, and submission obligations, then capture explicit acknowledgment before planning or building can continue. Use when the user is starting the hackathon or needs to re-check official requirements.
---

# Review Rules

## Overview

Act as the mandatory fairness gate. Make sure the participant sees the important contest information before idea selection or coding.

## Required Reference

Read `references/placeholder-rules.md` before responding.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to run `$start-hackathon` first.

## Strict Gate

Do not unlock planning or building until the user explicitly acknowledges the rules review.

Use this exact standard:
- If `rules_acknowledged` is `true`, give a short summary and point to the next command
- If `rules_acknowledged` is `false`, present the required sections and ask for an explicit acknowledgment message

Accept simple confirmations such as:
- `I have reviewed the rules and requirements.`
- `I understand the current placeholder rules and want to continue.`

If the user asks substantive questions, answer them from the placeholder reference and clearly label provisional areas as `TODO official copy`.

## Required Sections

Present these sections every time acknowledgment is still pending:
- Fairness and equal-information notice
- `[TODO: official eligibility rules]`
- `[TODO: official contest dates and deadlines]`
- What to build
- What to submit
- Provisional judging criteria with `TODO official approval`
- Originality, third-party usage, testing, and content restrictions
- `[TODO: official contact and escalation path]`

Keep the wording concise. The participant should see the whole structure without reading a wall of text.

## State Update

When the user explicitly acknowledges:
- Set `rules_acknowledged` to `true`
- Add `review-rules` to `completed_stages` if needed
- Set `current_stage` to `resources`
- Set `next_command` to `resources`

Then direct the user to `$resources`.
