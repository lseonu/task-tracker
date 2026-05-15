---
name: submission-check
description: Run the final pre-submission review against the hackathon requirements and the prepared draft materials. Use when the user wants a pass-fail style checklist before handing off to Devpost for the actual submission.
---

# Submission Check

## Purpose

Run the final internal readiness review, run the local security scanner, update state, regenerate the Check HTML artifact, and give the participant the shortest useful handoff.

This does not submit to Devpost. The participant still completes the official submission in the browser.

The HTML artifact is the primary participant interface. Chat is only the control surface and fallback.

## Required References

Read before responding:

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
node scripts/submission-security-scan.mjs
```

Read `artifacts/generated/submission-security-scan.json`.

Treat scan results this way:

- `block`: high-confidence secret or risky credential file found. The submission cannot be marked `ready`.
- `review`: no high-confidence secret, but warning findings need user review. The submission can be `close`, not `ready`, unless the user has explicitly verified the warnings are benign.
- `pass`: no high-confidence findings or warnings from the scanner.

Never paste raw secret values in chat or artifacts. Use only redacted evidence from the scanner.

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

## Artifact Output

After running the readiness review and updating state, run:

```bash
node scripts/render-artifacts.mjs --page check
```

The generated page is `artifacts/generated/submission-check.html`.

Expected preview URL when the repo is served on port 8787:

```text
http://localhost:8787/artifacts/generated/submission-check.html
```

## State Update

If the project passes cleanly enough for handoff:

- add `submission-check` to `completed_stages` if needed
- set `submission.status` to `ready`
- set `submission.browser_handoff_ready` to `true`
- set `current_stage` to `submission-check`
- clear `next_command` or set it to `hackathon-map`

If it does not pass:

- set `submission.status` to `needs-work`
- set `current_stage` to `submission-check`
- set `next_command` to the specific command that should fix the issue

## Chat Output

Keep chat output compact.

Do not render:

- placeholder SVGs
- Markdown images
- Mermaid diagrams
- inline scorecard graphics
- long checklist dumps already represented in the artifact

Respond with:

- readiness result: `ready`, `close`, or `not ready`
- security scan status
- artifact regenerated
- localhost preview URL
- the shortest useful fix-now list if needed
- browser handoff URL only when ready

If artifact generation fails, use a compact text fallback:

- readiness result
- security scan status
- fix-now list
- next recommended command or Devpost handoff
