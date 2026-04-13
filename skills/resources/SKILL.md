---
name: resources
description: Show the participant's resource hub for building with Codex, including docs, inspiration, and anti-pattern guidance. Use when the user wants hackathon resources, wants inspiration before planning, or needs a reminder of what kinds of projects to avoid.
---

# Resources

## Overview

Mirror the Devpost Resources tab inside Codex. Keep the response practical, inspiring, and short enough to scan.

## Required References

Read these files before responding:
- `references/resource-links.md`
- `references/anti-patterns.md`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, tell the user to finish `$review-rules` first. This is a blocker before planning and building.

## Response Structure

Render four compact sections:
- Docs
- Videos
- Inspiration
- Anti-patterns to avoid

Use markdown links for resources. If a direct image URL or supported rich media URL is available, render at most one or two useful inline media items. Prefer official or first-party sources.

Keep anti-pattern guidance direct. Explicitly call out:
- thin wrappers around a single prompt
- generic chatbots with no clear workflow
- demo-only projects with no usable product loop
- shallow file or website question-answer tools presented as full products
- any additional `[TODO: finalize with Codex team]` anti-patterns from the final launch draft

## State Update

After showing resources:
- Add `resources` to `completed_stages` if needed
- Set `current_stage` to `plan-project`
- Set `next_command` to `plan-project`

End by directing the user to `$plan-project`.
