---
name: submission-check
description: Run the final pre-submission review against the hackathon requirements and the prepared draft materials. Use when the user wants a pass-fail style checklist before handing off to Devpost for the actual submission.
---

# Submission Check

## Purpose

Run the final internal readiness review, run the local security scanner, update state, compose the Check chat response, and give the participant the shortest useful handoff.

This does not submit to Devpost. The participant still completes the official submission in the browser.

Chat is the primary participant interface. Keep responses text-first so they render in any Codex host; the bundled `devpost` MCP server supplies rich inline visuals on hosts that support them.

## Required Data Source

Official requirements and rules come from the `devpost` MCP server — follow **Devpost MCP Server** in `../PLUGIN_RUNTIME.md` (call only what you need, never verify or set up the server, degrade in one line on failure).

Draw on these only as needed: `devpost.get_submission_requirements`, `devpost.get_hackathon_rules`, `devpost.get_judging_criteria`, `devpost.get_key_dates`. Check readiness against the real requirements; if the server is unavailable, run the check against `config/hackathon.json` and say it is provisional.

## Required References

Read before responding:

- `../PLUGIN_RUNTIME.md`
- `references/preflight-checklist.md`
- `../../config/hackathon.json`
- `../../content/steps/check.md` (the page content you will present)

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

If `devpost-submission.md` does not exist, direct the user to `$prepare-submission`.

## Security Scan

Before assigning the final readiness result, scan the project for exposed secrets with a
grep (no script needed). Run from the participant's project root:

```bash
grep -rInE 'sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|gh[posru]_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]+|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(api[_-]?key|secret|password|token)\s*[:=]\s*["'"'"'][^"'"'"']{8,}' . \
  --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.next --exclude-dir=venv --exclude-dir=__pycache__ 2>/dev/null
find . \( -name '.env' -o -name '*.pem' -o -name 'id_rsa' -o -name 'id_dsa' \) -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null
```

Interpret the results:

- **block**: the grep matched a high-confidence secret (OpenAI/GitHub/Slack token, AWS key,
  or a private-key block). The submission cannot be marked `ready` until it is removed.
- **review**: only risky credential-looking files (`.env`, `*.pem`, `id_rsa`) or generic
  `key=…`/`password=…` assignments turned up. The submission can be `close`, not `ready`,
  unless the participant explicitly verifies they are benign.
- **pass**: no matches.

Never paste raw secret values in chat or generated files — refer to the file and line only,
with the value redacted.

## Readiness Review

Review:

- rules acknowledgment recorded
- project brief present
- honest build description
- OpenAI usage explained clearly
- Codex usage explained clearly
- testing instructions included
- repo link present or clearly marked TODO
- public demo link present or clearly marked TODO
- demo video plan or URL present or clearly marked TODO
- screenshot plan present
- browser handoff checklist present
- unresolved legal or sponsor placeholders clearly labeled
- no obvious contradiction between the build and the submission copy
- no high-confidence exposed secrets from the local security scan
- no risky credential-looking files that need user review

Assign one top-line result: `ready`, `close`, or `not ready`.

## State Update

Edit `.openai-codex-hackathon-state.json` directly, only when state changes on this turn,
preserving the fields you are not touching.

If the project passes cleanly enough for handoff: add `submission-check` to
`completed_stages`, set `current_stage` to `submission-check`, `submission.status` to
`ready`, `submission.browser_handoff_ready` to `true`, and `next_command` to
`hackathon-map`.

If it does not pass: set `current_stage` to `submission-check`, `submission.status` to
`needs-work`, and `next_command` to the specific command that fixes the top issue (e.g.
`prepare-submission`).

## Presentation Output

After the readiness review and the state edit, compose the response in-context per
`../PLUGIN_RUNTIME.md` ("Composing the Response"): read `../../content/steps/check.md`,
strip maintainer `<!-- -->` comments, interpolate the event name, and present it. Render
the journey stepper widget first (see PLUGIN_RUNTIME). Summarize the scan + readiness
result in your own words alongside the page content.

## Chat Output

Keep chat output compact. Do not hand-write a separate progress dashboard — the stepper
widget shows progress.

Respond with:

- readiness result: `ready`, `close`, or `not ready`
- security scan status
- the shortest useful fix-now list if needed
- when ready, a clear completion message: "You're done in Codex. You're ready to submit on Devpost."
- when ready, explicit final submit steps: open Devpost, copy `devpost-submission.md`, add links/screenshots/video, submit the official form before the deadline
- browser handoff URL only when ready and known

If you cannot read the content file, fall back to a compact text response:

- readiness result
- security scan status
- fix-now list
- next recommended command or explicit Devpost submit handoff
