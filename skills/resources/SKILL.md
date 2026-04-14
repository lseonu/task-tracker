---
name: resources
description: Show the participant's resource hub for working through the hackathon with Codex, including docs, inspiration, and anti-pattern guidance. Use when the user wants hackathon resources, wants inspiration, or needs a reminder of what kinds of projects to avoid.
---

# Resources

## Overview

Mirror the Devpost Resources tab inside Codex. Make it feel like a compact resources page from a real hackathon site: practical, inspiring, and graphical, without filler.

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
- Docs and official links
- Videos or launch media
- Inspiration
- Anti-patterns to avoid
- the next recommended in-plugin move

Use markdown links for resources. If a direct image URL or supported rich media URL is available, render at most one or two useful inline media items. Prefer official or first-party sources.

If real media is not available yet, render these local placeholders:
- `../../assets/placeholders/resources-video.svg`
- `../../assets/placeholders/anti-patterns-poster.svg`

Keep anti-pattern guidance direct. Explicitly call out:
- thin wrappers around a single prompt
- generic chatbots with no clear workflow
- demo-only projects with no usable product loop
- shallow file or website question-answer tools presented as full products
- any additional `[TODO: finalize with Codex team]` anti-patterns from the final launch draft

The overall feel should be closer to a polished event resources page than a plain checklist, but still compact and skimmable.

## State Update

After showing resources:
- Add `resources` to `completed_stages` if needed
- Set `current_stage` to `resources`
- Set `next_command` to `deadline-reminders`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.

End by directing the user to `$deadline-reminders`.
