---
name: review-rules
description: Present the hackathon requirements, judging criteria, eligibility placeholders, and submission obligations, then capture explicit acknowledgment before the user relies on the plugin for the rest of the flow. Use when the user is starting the hackathon or needs to re-check official requirements.
---

# Review Rules

## Overview

Act as the mandatory fairness gate. Make sure the participant sees the important contest information before idea selection or coding.

The tone should feel more like a brisk preflight briefing than a legal memo: the participant needs to hear it before takeoff, but the experience should still feel guided, calm, and upbeat.

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
- render `../../assets/placeholders/rules-preflight-briefing.svg` as a static fallback or companion visual when useful
- keep the copy concise enough to scan in one pass
- keep the structure exhaustive even when some items are still `TODO official copy`
- make the participant feel supported, not scolded
- render images with Markdown image syntax, not raw HTML

## Strict Gate

Do not unlock the rest of the plugin flow until the user explicitly agrees to the rules review.

Use this exact standard:
- If `rules_acknowledged` is `true`, give a short summary and point to the next command
- If `rules_acknowledged` is `false`, present the required sections and ask: `Do you agree to these terms? Reply yes or no.`

Require a simple yes/no response for the legal confirmation.

Accept `yes` as the affirmative confirmation. Treat `no` as a stop: keep the flow locked, do not update the state file, and explain that the participant can ask questions or return later if they are not ready to agree.

Do not accept longer or ambiguous acknowledgments such as `confirm`, `acknowledge`, `continue`, or `reviewed` for the legal confirmation. If the participant gives one of those, ask them to reply with `yes` or `no`.

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
- Common reasons a submission can get blocked later
- `[TODO: official contact and escalation path]`
- Official-pages disclaimer: the participant must still verify the official Devpost materials

Keep the wording concise. The participant should see the whole structure without reading a wall of text.

## Response Structure

Use this order when practical:
- a compact preflight-style hero with a one-line TLDR
- one small visual or media placeholder
- the required rule sections in a compact scannable layout
- a short blocker box covering what could stop the user later
- a short legal confirmation prompt: `Do you agree to these terms? Reply yes or no.`

Aim for one compact screenful, or close to it.

Do not repeat the `start-hackathon` onboarding copy. Assume the participant has already seen that step.

## HTML Artifact Output

When presenting the rules gate or after recording a `yes` response, regenerate the Rules artifact:

```bash
node scripts/render-artifacts.mjs --page rules
```

The generated page is `artifacts/generated/review-rules.html`.

In chat, keep the response compact: point to the artifact, preserve the exact `yes`/`no` confirmation requirement when locked, and give `$resources` as the next command only after the state is unlocked.

## Blocker Guidance

Include a short section that flags what commonly blocks a later submission or final handoff.

Cover at least these themes:
- missing eligibility confirmation or official-rule verification
- missing required submission fields
- unclear repo, demo, or testing instructions
- unsupported third-party assets, data, or APIs
- a project that does not clearly show why OpenAI capabilities are central

This should feel like practical risk-reduction, not fear-based warning copy.

## State Update

When the user explicitly replies `yes` to the legal confirmation:
- Set `rules_acknowledged` to `true`
- Set `registration.devpost_registered` to `true` if it is still `false`
- Add `review-rules` to `completed_stages` if needed
- Set `current_stage` to `resources`
- Set `next_command` to `resources`
- Update `dashboard` if it exists:
  - set `completion_percent` to `40`
  - set `registration_status` to `complete`
  - preserve any real deadline values already present
  - update `last_rendered_at`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json` so the participant sees the stage unlock immediately.

Then direct the user to `$resources`.
