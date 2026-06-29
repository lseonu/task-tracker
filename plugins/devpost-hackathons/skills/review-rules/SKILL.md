---
name: review-rules
description: Present the hackathon requirements, judging criteria, eligibility placeholders, and submission obligations, then capture explicit acknowledgment before the user relies on the plugin for the rest of the flow. Use when the user is starting the hackathon or needs to re-check official requirements.
---

# Review Rules

## Purpose

Act as the mandatory rules gate, update state only after explicit `yes`, compose the Rules chat response, and keep the answer terse.

Chat is the primary participant interface. Keep responses text-first so they render in any Codex host; the bundled `devpost` MCP server supplies rich inline visuals on hosts that support them.

## Required Data Source

Use the `devpost` MCP server (bundled with this plugin) as the source of truth for official hackathon rules and requirements. Verify its tools are callable in this Codex session, for example `mcp__devpost__get_hackathon_overview`. If they are missing (an older Codex that does not auto-register bundled servers, or the server was disabled), add it manually with `codex mcp add devpost --url https://devpost.com/mcp` and restart Codex.

Before presenting rules, call:
- `devpost.get_hackathon_overview`
- `devpost.get_hackathon_rules`
- `devpost.get_key_dates`
- `devpost.get_judging_criteria`
- `devpost.get_submission_requirements`
- `devpost.get_announcements`

Quote rules, eligibility, and requirements text from the MCP response; do not paraphrase legal language. Do not fabricate official rules when the server is unavailable; fall back to `references/placeholder-rules.md` and label it provisional.

## Required References

Read these before responding:

- `../PLUGIN_RUNTIME.md`
- `../../content/steps/rules.md`
- `../../config/hackathon.json`
- `references/placeholder-rules.md`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

## Strict Gate

Do not unlock the rest of the plugin flow until the user explicitly agrees to the rules review.

Use this standard:

- If `rules_acknowledged` is `true`, keep the response short and point to `$resources`.
- If `rules_acknowledged` is `false`, present the rules inline through the composer and ask exactly: `Do you agree to these terms? Reply yes or no.`

Accept only `yes` as affirmative confirmation.

Treat `no` as a stop:

- do not update the state file
- keep the flow locked
- invite the participant to ask questions or return later

Do not accept ambiguous acknowledgments such as `confirm`, `acknowledge`, `continue`, or `reviewed`.

If the participant asks substantive questions, answer from the placeholder reference and clearly label provisional areas as awaiting official copy.

## Required Rules Content

The inline rules response should cover:

- fairness and equal-information notice
- official eligibility rules
- official contest dates and deadlines
- what to build
- what to submit
- provisional judging criteria awaiting official approval
- originality, third-party usage, testing, and content restrictions
- common reasons a submission can get blocked later
- official contact and escalation path
- official-pages disclaimer: participants must still verify the official Devpost materials

Keep the response complete enough for the gate, but do not write a second ad hoc version outside the configured content and references.

## Presentation Output

Compose the response in-context per `../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/steps/rules.md`, strip maintainer `<!-- -->` comments, interpolate the event name, then present a short stage headline, the page content, and the next-command callout. Do not run any script.

## State Update

When the user explicitly replies `yes`:

- set `rules_acknowledged` to `true`
- set `registration.devpost_registered` to `true` if it is still `false`
- add `review-rules` to `completed_stages` if needed
- set `current_stage` to `resources`
- set `next_command` to `resources`
- preserve any real deadline values already present

Then compose the Rules response again so the next command is visible.

## Chat Output

Keep chat output minimal.

Do not hand-write a separate dashboard. Let the CLI composer render the response.

If locked, respond with:

- the composed rules response
- a reminder to read the inline rules carefully before answering
- an invitation to ask questions about the rules before replying
- exact confirmation prompt: `Do you agree to these terms? Reply yes or no.`

If unlocked after `yes`, respond with:

- rules acknowledged
- next command: `$resources`

If composer generation fails, use a compact text fallback:

- current stage: Review Rules
- locked/unlocked status
- exact yes/no requirement when locked
- next command only when unlocked
