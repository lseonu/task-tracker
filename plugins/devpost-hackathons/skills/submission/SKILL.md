---
name: submission
description: Run the final pre-submission readiness review against the hackathon requirements and the prepared draft, then submit the project to Devpost via the MCP after explicit user confirmation. Use when the user wants the final checklist or is ready to submit their project.
---

# Submission

## Purpose

Run the final internal readiness review, run the local security scan, update state, compose the Check chat response, and — after explicit user confirmation — actually submit the project to Devpost via the `devpost` MCP server. Report the result.

The MCP submit is the primary path. The browser handoff remains the fallback when the participant prefers it or the authenticated tools are unavailable.

Chat is the primary participant interface. Keep responses text-first so they render in any Codex host; the bundled `devpost` MCP server supplies rich inline visuals on hosts that support them.

## Required Data Source

Official requirements and rules come from the `devpost` MCP server — follow **Devpost MCP Server** in `../PLUGIN_RUNTIME.md` (call only what you need, never verify or set up the server, degrade in one line on failure).

Draw on these only as needed: `devpost.get_submission_requirements`, `devpost.get_hackathon_rules`, `devpost.get_judging_criteria`, `devpost.get_key_dates`. Check readiness against the real requirements; if the server is unavailable, run the check against `config/hackathon.json` and say it is provisional.

For the submit itself (all AUTH-REQUIRED): `devpost.list_my_projects` / `devpost.get_project` (find or confirm the project), `devpost.create_project` / `devpost.update_project` (sync the prepared draft when needed), and `devpost.submit_project` (the actual submission).

## Required References

Read before responding:

- `../PLUGIN_RUNTIME.md`
- `references/preflight-checklist.md`
- `../../config/hackathon.json`
- `../../content/steps/check.md` (the page content you will present)

## Preconditions

Read `.devpost-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review` first.

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
  or a private-key block). The submission cannot be marked `ready` — and you must NOT call
  `submit_project` — until it is removed.
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
- AI usage explained clearly
- Codex usage explained clearly
- testing instructions included
- repo link present or clearly marked TODO
- public demo link present or clearly marked TODO
- demo video plan or URL present or clearly marked TODO
- screenshot plan present
- every event requirement satisfied (cross-check against `get_submission_requirements`)
- unresolved legal or sponsor placeholders clearly labeled
- no obvious contradiction between the build and the submission copy
- no high-confidence exposed secrets from the local security scan
- no risky credential-looking files that need user review

Assign one top-line result: `ready`, `close`, or `not ready`.

## Submit To Devpost (MCP, auth, high-stakes)

The final submit is high-stakes, so it REQUIRES explicit user confirmation before you call the tool.

1. Only proceed when the readiness result is `ready`. Never submit on a `block` scan result.
2. Present a short, plain summary of exactly what will be submitted: the project title, the hackathon name, and any category or custom-question answers. State clearly that this submits the project to Devpost for real.
3. Require the user to explicitly confirm they want to submit now (an unambiguous "yes, submit"). If they do not confirm, stop and leave the project unsubmitted — do not call the tool. Offer the browser handoff as the alternative.
4. On confirmation, call the `devpost.submit_project` MCP tool (AUTH-REQUIRED) for the prepared project and hackathon. If the project does not exist on Devpost yet, create or sync it first via `create_project` / `update_project`, confirming with the user before each write.
5. Report the result: success (with any confirmation id/url the tool returns) or the specific failure and what to do next.

Fallback: if `submit_project` fails on auth or availability, do NOT silently succeed — degrade in one line per `../PLUGIN_RUNTIME.md`: report that the submit could not be completed, note that submitting requires being signed in to the Devpost MCP, and offer the browser handoff (open Devpost, copy `devpost-submission.md`, complete the official form). Leave `submission.status` as `ready` so the MCP submit can be retried with `$submission`.

## State Update

Edit `.devpost-hackathon-state.json` directly, only when state changes on this turn,
preserving the fields you are not touching.

If the submit succeeds via `submit_project`: add `submission` to `completed_stages`, set
`current_stage` to `submission`, `submission.status` to `submitted`, and `next_command` to
`hackathon-map`. Do not persist the full submission payload — a returned confirmation
id/url may be recorded under `submission`.

If the project is ready but the user has not yet confirmed (or chose the browser handoff):
add `submission` to `completed_stages`, set `current_stage` to `submission`,
`submission.status` to `ready`, `submission.browser_handoff_ready` to `true`, and
`next_command` to `submission`.

If it does not pass: set `current_stage` to `submission`, `submission.status` to
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
- when ready but not yet submitted: the explicit confirmation prompt described above (what will be submitted + "yes, submit?"), with the browser handoff named as the alternative
- when submitted: a clear completion message confirming the project was submitted to Devpost, plus any confirmation id/url returned by `submit_project`
- when a submit attempt failed: the specific failure, the sign-in note, and the browser handoff steps

If you cannot read the content file, fall back to a compact text response:

- readiness result
- security scan status
- fix-now list, the confirmation prompt, or the submission result as appropriate
- next recommended command
