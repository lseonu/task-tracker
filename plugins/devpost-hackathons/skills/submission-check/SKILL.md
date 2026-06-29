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

Use the `devpost` MCP server (bundled with this plugin) as the source of truth for official submission requirements and rules. Verify its tools are callable in this Codex session, for example `mcp__devpost__get_hackathon_overview`. If they are missing (an older Codex that does not auto-register bundled servers, or the server was disabled), add it manually with `codex mcp add devpost --url https://devpost.com/mcp` and restart Codex.

Before running the check, call:
- `devpost.get_hackathon_overview`
- `devpost.get_key_dates`
- `devpost.get_hackathon_rules`
- `devpost.get_submission_requirements`
- `devpost.get_judging_criteria`

Check readiness against the real requirements from the MCP response. Do not fabricate official requirements when the server is unavailable; fall back to `config/hackathon.json` and say the check is provisional.

## Required References

Read before responding:

- `../PLUGIN_RUNTIME.md`
- `references/preflight-checklist.md`
- `../../config/hackathon.json`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

If `devpost-submission.md` does not exist, direct the user to `$prepare-submission`.

## Security Scan

Before assigning the final readiness result, run:

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/submission-security-scan.mjs"
```

Read `.openai-codex-hackathon/submission-security-scan.json`.

Treat scan results this way:

- `block`: high-confidence secret or risky credential file found. The submission cannot be marked `ready`.
- `review`: no high-confidence secret, but warning findings need user review. The submission can be `close`, not `ready`, unless the user has explicitly verified the warnings are benign.
- `pass`: no high-confidence findings or warnings from the scanner.

Never paste raw secret values in chat or generated files. Use only redacted evidence from the scanner.

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

## Presentation Output

After running the readiness review and updating state, run:

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/compose-response.mjs" --page check
```

Use the composer output as the participant-facing response.

## State Update

Persist state changes with the `update-state.mjs` script, not by editing
`.openai-codex-hackathon-state.json` directly. The script writes the file as a
single shell command, so the host shows a quiet command run instead of a
reviewable file-diff card. Only run it when state actually changes on this turn.

If the project passes cleanly enough for handoff:

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/update-state.mjs" \
  --add completed_stages=submission-check \
  --set current_stage=submission-check \
  --set submission.status=ready \
  --set submission.browser_handoff_ready=true \
  --set next_command=hackathon-map
```

If it does not pass (set `next_command` to the specific command that fixes the
top issue, e.g. `prepare-submission`):

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/update-state.mjs" \
  --set current_stage=submission-check \
  --set submission.status=needs-work \
  --set next_command=prepare-submission
```

Run this update before the response composer (the composer reads the state you
just wrote). Do not also echo the JSON or describe each field edit in chat; one
short sentence naming the new status and next command is enough.

## Chat Output

Keep chat output compact.

Do not hand-write a separate dashboard. Let the CLI composer render the response and summarize scan results.

Respond with:

- readiness result: `ready`, `close`, or `not ready`
- security scan status
- the shortest useful fix-now list if needed
- when ready, a clear completion message: "You're done in Codex. You're ready to submit on Devpost."
- when ready, explicit final submit steps: open Devpost, copy `devpost-submission.md`, add links/screenshots/video, submit the official form before the deadline
- browser handoff URL only when ready and known

If composer generation fails, use a compact text fallback:

- readiness result
- security scan status
- fix-now list
- next recommended command or explicit Devpost submit handoff
