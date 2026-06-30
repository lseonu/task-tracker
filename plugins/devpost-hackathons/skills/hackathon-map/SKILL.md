---
name: hackathon-map
description: Show the OpenAI Codex Hackathon command map, current project progress, deadline/readiness context, and the next recommended command. Use when the user asks what commands are available, wants to resume after context loss, or wants to know what to do next.
---

# Hackathon Map

## Purpose

Read the local state file, tell the participant where they are, and point them to the next command in the main chat body.

Chat is the primary participant interface. Keep responses text-first so they render in any Codex host; the bundled `devpost` MCP server supplies rich inline visuals on hosts that support them.

Unlike the step commands, `$hackathon-map` does not mark workflow stages complete.

## Required Data Source

Official event data comes from the `devpost` MCP server — follow **Devpost MCP Server** in `../PLUGIN_RUNTIME.md` (call only what you need, never verify or set up the server, degrade in one line on failure).

Draw on these only as needed: `devpost.get_hackathon_overview`, `devpost.get_key_dates`, `devpost.get_announcements`.

## Required References

Read:

- `../PLUGIN_RUNTIME.md`
- `../../content/steps/map.md`
- `.openai-codex-hackathon-state.json` when present
- `../../config/hackathon.json`

If the state file does not exist:

- do not create files from this skill alone unless the user explicitly asks
- say that `$start-hackathon` is the entry point
- list the core command sequence compactly

## State Shape

Expect the state file to stay small:

- `current_stage`
- `completed_stages`
- `rules_acknowledged`
- `registration`
- `project`
- `learning`
- `submission`
- `deadlines`
- `next_command`

If an older state file references removed prototype fields like `dashboard`, `reminders`, or `deadline-reminders`, treat them as legacy. Do not reintroduce those concepts into the participant-facing output.

## Presentation Output

When state exists, compose the recovery response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/steps/map.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script.

The response should show the current top-level stage, completed stages, optional guided build tool state, deadline status, and next command without marking anything complete.

## Chat Output

Keep chat output compact.

Do not hand-write a separate dashboard. Let the CLI composer render the response.

Respond with:

- current stage
- completed stages, summarized
- next recommended command
- deadline status if known, otherwise `official deadline to be confirmed`

If state does not exist, respond with:

- `No hackathon state found.`
- entry command: `$start-hackathon`
- core sequence: `$start-hackathon -> $review-rules -> $resources -> $prepare-submission -> $submission-check`

## Command Map

Core sequence:

`$start-hackathon -> $review-rules -> $resources -> $prepare-submission -> $submission-check`

Optional build sequence inside Step 3:

`$build-onboard -> $build-scope -> $build-prd -> $build-spec -> $build-checklist -> $build-project -> $prepare-submission`

Only show the full command map when the user asks for commands or when no state exists. Otherwise show only the next recommended command.
