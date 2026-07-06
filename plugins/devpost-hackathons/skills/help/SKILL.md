---
name: help
description: Give a friendly orientation to the Devpost hackathon plugin — what it can do, the available commands, and how to get started. Use when the user asks how to get started with the hackathon or Devpost, asks what this plugin does or what commands are available, seems confused, stuck, or unsure what to do next, hits a problem they can't name a command for, or is just curious about the hackathon experience.
---

# Help

## Purpose

Orient the participant: explain the big ideas of the plugin, show the commands, and point them to the right next move — tailored to where they already are in the flow and what they just asked.

This is a lightweight orientation command. It never marks stages complete and never writes state. It should feel like a friendly tour guide, not a wall of documentation.

## Required References

Read before responding:

- `../PLUGIN_RUNTIME.md`
- `../../content/steps/help.md` (the page content you will present)
- `../../config/hackathon.json`
- `.devpost-hackathon-state.json` when present (read-only, for tailoring)

## Live Command Inventory

Derive the current command list from the plugin itself before composing, so this page never goes stale as skills are added or removed:

1. List the sibling skill directories under `../` — every directory containing a `SKILL.md` is one command.
2. For each, the command name is the frontmatter `name` (presented as `$name`). For a one-line participant-facing description, prefer `interface.short_description` from that skill's `agents/openai.yaml`; if absent, condense the frontmatter description to a few words.
3. Reconcile against the page content in `../../content/steps/help.md`:
   - A command that exists but is missing from the page: add it to the matching section — `build-*` commands under the guided build track, everything else alongside the core journey or as a one-line extra. Place it sensibly; do not renumber the five-step journey unless the new skill is clearly part of it.
   - A command on the page whose skill directory no longer exists: leave it out of your response.
   - Never present a command that has no skill directory. You may omit `$help` itself.

The curated page copy provides the voice and structure; the live inventory is the source of truth for what commands exist.

## Data Sources

Do not call `devpost` MCP tools for a plain help response — orientation needs no official data. Only if the user's question also asks about dates, rules, or other event specifics, follow **Devpost MCP Server** in `../PLUGIN_RUNTIME.md` and call just what that question needs.

Do not call the stepper widget — this command does not move the participant to a new step.

## Tailoring

Adapt to the conversation. Lead with what this user needs; keep the full tour available but compact:

- **No state file / brand-new user:** lead with the welcome and the five-step journey; the entry point is `$start-hackathon`.
- **State file exists:** greet them as returning, note their `current_stage` in one line, and surface their `next_command` before the tour.
- **They asked a specific "how do I…" question:** answer that first in a sentence or two, name the command that handles it, then offer the tour compactly.
- **They seem stuck or frustrated:** acknowledge it, give the single most likely command or fix first, and keep the rest short. Mention `$hackathon-map` for progress recovery.

## Presentation Output

Compose in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/steps/help.md`, strip maintainer `<!-- -->` comments, interpolate the event name, and present it as the participant-facing response — adjusted per **Tailoring** above. Trimming sections that are irrelevant to what the user asked is fine; do not add features or invent commands that are not in the page content.

## Chat Output

Keep it warm, fun, and skimmable — never overbearing:

- one friendly line about what the plugin is
- the five-step command journey
- the optional guided build track, in one compact line
- `$hackathon-map` as the "lost? start here" recovery command
- end with the single best next command for this user

Do not hand-write a progress dashboard, do not list internal files or configuration, and do not walk through every command's details unless asked.
