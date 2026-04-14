---
name: review-rules
description: Present the hackathon requirements, judging criteria, eligibility placeholders, and submission obligations, then capture explicit acknowledgment before the user relies on the plugin for the rest of the flow. Use when the user is starting the hackathon or needs to re-check official requirements.
---

# Review Rules

## Overview

Act as the mandatory fairness gate. Make sure the participant sees the important contest information before idea selection or coding.

## Required Reference

Read these before responding:
- `../../config/hackathon.json`
- `references/placeholder-rules.md`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to run `$start-hackathon` first.

## Presentation Style

Present this like a compact review screen, not a legal memo.

When practical:
- use short sections, callouts, or tables instead of a long paragraph stack
- render `../../assets/placeholders/submission-requirements-review-video.svg` as a stand-in for a future rules or submission-requirements video
- keep the copy concise enough to scan in one pass

## Strict Gate

Do not unlock the rest of the plugin flow until the user explicitly acknowledges the rules review.

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
- Official-pages disclaimer: the participant must still verify the official Devpost materials

Keep the wording concise. The participant should see the whole structure without reading a wall of text.

## State Update

When the user explicitly acknowledges:
- Set `rules_acknowledged` to `true`
- Add `review-rules` to `completed_stages` if needed
- Set `current_stage` to `resources`
- Set `next_command` to `resources`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json` so the participant sees the stage unlock immediately.

Then direct the user to `$resources`.
