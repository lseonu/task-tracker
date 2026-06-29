---
name: resources
description: Show the participant's resource hub for working through the hackathon with Codex, including docs, inspiration, and anti-pattern guidance. Use when the user wants hackathon resources, wants inspiration, or needs a reminder of what kinds of projects to avoid.
---

# Resources

## Purpose

Update state for Step 3, compose the Resources chat response, and explain the two available paths: continue directly to submission prep or enter the optional guided build tool.

Chat is the primary participant interface. Keep responses text-first so they render in any Codex host; the bundled `devpost` MCP server supplies rich inline visuals on hosts that support them.

## Required Data Source

Use the `devpost` MCP server (bundled with this plugin) as the source of truth for official hackathon information. Verify its tools are callable in this Codex session, for example `mcp__devpost__get_hackathon_overview`. If they are missing (an older Codex that does not auto-register bundled servers, or the server was disabled), add it manually with `codex mcp add devpost --url https://devpost.com/mcp` and restart Codex.

For official event details, call:
- `devpost.get_hackathon_overview`
- `devpost.get_key_dates`
- `devpost.get_announcements`

Use the local `references/` files for evergreen guidance (links, archetypes, anti-patterns). Do not fabricate official hackathon data when the server is unavailable; fall back to `config/hackathon.json` and say the data is provisional.

## Required References

Read these files before responding:

- `../PLUGIN_RUNTIME.md`
- `../../content/steps/resources.md`
- `../../config/hackathon.json`
- `references/resource-links.md`
- `references/anti-patterns.md`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, tell the user to finish `$review-rules` first. This is a blocker before the rest of the workflow.

## Response Content

The Resources response should help the participant understand:

- useful in-app resources
- strong project archetypes
- anti-patterns to avoid
- the normal next step: `$prepare-submission`
- the optional guided build tool nested inside Step 3

The optional guided build tool is command-driven, not clickable routing in a side pane.

Visible build sequence:

`Ideate -> Scope -> PRD -> Spec -> Checklist -> Build`

Command sequence:

`$build-onboard -> $build-scope -> $build-prd -> $build-spec -> $build-checklist -> $build-project`

Do not render images, posters, or other media in chat.

## Hackathon Resources (live, from the MCP)

Render the hackathon's own resources in chat — a condensed version of the Resources tab on the hackathon's Devpost site. Call the `get_hackathon_overview` MCP tool (bundled `devpost` server, PUBLIC — needs only `hackathon.slug`) and use its `resources_text` / `resources_html` field: pull out the key links and render them as **live markdown hyperlinks**, one short line each (condense — do not dump the whole blob). If the hackathon returns no resources, fall back to `references/resource-links.md`. These chat links are the real resources.

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/steps/resources.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script.

## State Update

After showing resources:

- add `resources` to `completed_stages` if needed
- set `current_stage` to `resources`
- set `next_command` to `prepare-submission`
- preserve registration and deadline fields

Do not mark the optional guided build tool active unless the user chooses it or runs `$build-onboard`.

## Chat Output

Keep chat output minimal.

Do not hand-write a separate dashboard. Let the CLI composer render the response.

Respond with:

- note that guided planning is optional and nested inside Step 3
- one or two sentences explaining the decision between direct submission prep and the guided build tool
- invitation to ask questions about which path fits their project
- recommendation: continue with `$prepare-submission` unless they want guided planning
- guided path entry command: `$build-onboard`

If composer generation fails, use a compact text fallback:

- current stage: Resources
- two paths available
- next likely command: `$prepare-submission`
- optional build command: `$build-onboard`
