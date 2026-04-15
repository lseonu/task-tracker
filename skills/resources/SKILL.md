---
name: resources
description: Show the participant's resource hub for working through the hackathon with Codex, including docs, inspiration, and anti-pattern guidance. Use when the user wants hackathon resources, wants inspiration, or needs a reminder of what kinds of projects to avoid.
---

# Resources

## Overview

Mirror the Devpost Resources tab inside Codex. Make it feel like a compact one-screen resource hub from a real hackathon site: practical, inspiring, and graphical, without filler.

This page should primarily help the participant find useful resources inside the app, while also nudging them toward stronger project choices and a better overall hackathon experience.

## Required References

Read these files before responding:
- `../../config/hackathon.json`
- `references/resource-links.md`
- `references/anti-patterns.md`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, tell the user to finish `$review-rules` first. This is a blocker before the rest of the workflow.

## Response Structure

Render this as a compact resource hub, not just a link dump.

Preferred structure:
- a short intro or quick-start section
- Build toolbox
- Videos or launch media
- Strong project archetypes
- Inspiration
- Anti-patterns to avoid
- what the user can do next in the workflow

Use markdown links for resources. If a direct image URL or supported rich media URL is available, render at most one or two useful inline media items. Prefer official or first-party sources.

If real media is not available yet, render these local placeholders:
- `../../assets/placeholders/resources-video.svg`
- `../../assets/placeholders/anti-patterns-poster.svg`
- `../../assets/placeholders/strong-project-archetypes.svg`

Keep anti-pattern guidance direct. Explicitly call out:
- thin wrappers around a single prompt
- generic chatbots with no clear workflow
- demo-only projects with no usable product loop
- shallow file or website question-answer tools presented as full products
- any additional `[TODO: finalize with Codex team]` anti-patterns from the final launch draft

The anti-pattern visual should actively shape the participant's thinking, not feel like a footnote.

The overall feel should be closer to a polished in-app event resources page than a plain checklist, but still compact and skimmable.

Aim for a no-scroll or near-no-scroll layout inside the Codex desktop chat when practical.

## Content Guidance

Prioritize useful in-app resources over outbound hackathon links.

The participant should leave this screen knowing:
- what to read when they need implementation help
- what kinds of projects tend to perform well
- what weak project shapes to avoid
- which skill to use next depending on where they are

When presenting strong project archetypes, keep them universal and reusable. Favor categories like:
- workflow tools with a clear repeatable user loop
- agents that complete a concrete job with visible leverage from OpenAI capabilities
- products with a real user, credible pain point, and testable end-to-end flow
- interfaces where Codex meaningfully accelerates building, iteration, or operator workflows

Do not turn this into idea generation for one narrow stack or category. The archetypes should be broad enough to inspire, not prescribe.

## Navigation

Do not force a single next step.

After the main content, show the participant which skills are now available and why they might use each one:
- `$hackathon-map` for a live progress snapshot
- `$prepare-submission` once they have enough built to start shaping the final entry
- `$submission-check` when they want a final pass before browser handoff

Also remind them of the overall workflow so the submission path stays legible.

## State Update

After showing resources:
- Add `resources` to `completed_stages` if needed
- Set `current_stage` to `resources`
- Set `next_command` to `prepare-submission`
- Update `dashboard` if it exists:
  - set `completion_percent` to `60`
  - preserve registration and deadline fields
  - update `last_rendered_at`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.

End by showing the available next skills and a short recommendation for the most likely next move, without implying that only one path is allowed.
