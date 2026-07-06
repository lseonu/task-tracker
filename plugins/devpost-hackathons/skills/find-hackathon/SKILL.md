---
name: find-hackathon
description: Discover and select the Devpost hackathon to participate in before starting the guided flow. Use when the user has not picked an event yet, wants to browse open Devpost hackathons, or wants to confirm a specific hackathon by slug, name, or URL. This is the pre-stepper discovery step that records the chosen hackathon to local state so every later step targets the right event.
---

# Find Hackathon

## Purpose

Help the participant choose which Devpost hackathon they are doing, then record that selection to local state so `$start-hackathon` and every later step operate on the right event.

This is pre-stepper discovery. Do not call `show_hackathon_stepper` in this skill — the journey stepper starts at `$start-hackathon`.

Chat is the primary participant interface.

## Required Data Source

Official event data comes from the `devpost` MCP server — follow **Devpost MCP Server** in `../PLUGIN_RUNTIME.md` (call only what you need, never verify or set up the server, degrade in one line on failure).

For this step, draw on these only as needed:

- `devpost.get_hackathon_overview` (public — resolves a known slug/URL, no sign-in needed)
- `devpost.list_open_hackathons` (auth-required — open or upcoming Devpost-managed hackathons)
- `devpost.list_hackathons` (auth-required — hackathons the signed-in user is already registered for or submitted to)

## Required References

Read before responding:

- `../PLUGIN_RUNTIME.md`
- `../../config/hackathon.json`

## Authentication Note

Browsing hackathons requires being signed in to the `devpost` MCP server (`list_open_hackathons` and `list_hackathons` are auth-required). Resolving a specific hackathon the user names uses the public `get_hackathon_overview` tool and needs no sign-in.

## State

Load `.openai-codex-hackathon-state.json` if it exists. If it does not exist yet, that is fine — `$start-hackathon` initializes the full V2 state file. This skill only records the chosen hackathon. If the file does not exist, create a minimal file containing just the `hackathon` block so the selection is not lost; `$start-hackathon` preserves existing fields and fills in the rest.

The `hackathon` block:

```jsonc
"hackathon": { "slug": "", "name": "", "url": "", "selected": false, "source": "" }
// source: "search" | "known" | "default"
```

The selection is locally owned participant state (which event this project targets). Do not cache official dates, rules, or registration status here — later steps read those live per `../PLUGIN_RUNTIME.md`.

## Two Paths

### Path A — the user already knows their hackathon

If the user names a specific hackathon (a Devpost slug like `my-event`, a clear event name, or a devpost.com URL):

1. Call `get_hackathon_overview` for that hackathon to confirm it exists and populate details.
2. If it resolves, write `state.hackathon` with `slug`, `name`, `url`, `selected: true`, `source: "known"`.
3. Confirm the selection in chat and point them to `$start-hackathon`.

If it does not resolve, say so and offer Path B.

### Path B — browse and pick

If the user wants to discover an event:

1. If they may already be registered somewhere, call `list_hackathons` first and offer those. Otherwise call `list_open_hackathons`.
2. If the user gave interest keywords, filter the returned list against them yourself — the list tools do not take a query.
3. Present a short numbered list (top 3–5): name, a one-line descriptor, and the slug or URL. Keep it terse.
4. When they pick, call `get_hackathon_overview` for that slug to confirm, then write `state.hackathon` with `selected: true`, `source: "search"`.
5. Confirm the selection and point them to `$start-hackathon`.

## Fallback

If a list tool fails (auth or availability), degrade in one line per `../PLUGIN_RUNTIME.md`: note that browsing requires signing in to the Devpost MCP, and offer Path A (paste a slug, name, or URL). If the participant declines both and `config/hackathon.json` defines an event, use it with `source: "default"` and say which event was assumed.

## Chat Output

Keep chat output minimal:

- if browsing: the short candidate list and a prompt to pick one
- once selected: confirm the hackathon name and that it is saved locally
- a note that browsing (and registration later) requires being signed in to the Devpost MCP, only when it applies

End with the next-command callout as the final line:

```text
Type this next: `$start-hackathon`.
```
