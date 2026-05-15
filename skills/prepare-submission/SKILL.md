---
name: prepare-submission
description: Draft the participant's Devpost submission materials from the current project and saved state. Use when the user has a build worth describing and needs help preparing the title, write-up, testing notes, screenshots, and demo materials.
---

# Prepare Submission

## Purpose

Create or update the local Devpost submission prep document, update state, regenerate the Prepare HTML artifact, and provide a compact revision handoff in chat.

This is not a direct submission tool. It prepares the participant for the real Devpost browser submission.

The HTML artifact is the primary participant interface. Chat is only the control surface and fallback.

## Required Reference

Read `../PLUGIN_RUNTIME.md` and `references/submission-template.md` before responding.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, direct the user to `$review-rules` first.

If the workspace or conversation still does not reveal a real project, warn that the draft will contain placeholders rather than a truthful final submission.

## Output File

Create or update `devpost-submission.md` in the current project root.

Preserve any user edits already in that file.

Use `references/submission-template.md` as the outline.

The draft should include:

- title
- one-line summary
- problem
- solution
- why this matters
- how OpenAI capabilities are used
- how Codex was used in the build process
- key features
- architecture summary
- testing instructions
- screenshot shot list
- demo video outline
- browser handoff checklist
- submission readiness notes
- placeholders for repo URL, public demo URL, and video URL
- clearly labeled official form-specific fields where the real event later requires exact copy

Make the draft honest about what exists today versus what is still placeholder material.

## Review And Feedback

After updating `devpost-submission.md`, give a compact revision checklist that covers:

- missing submission components
- weak or vague claims
- unclear product positioning
- missing proof points, demo assets, or testing details
- anything that could make the Devpost submission less convincing

Do not turn this into a long essay. Keep the revision handoff short and actionable.

## Artifact Output

After drafting or updating `devpost-submission.md` and state, run:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --page prepare
```

The generated page is `artifacts/generated/prepare-submission.html`.

Expected preview URL when the repo is served on port 8787:

```text
http://localhost:8787/artifacts/generated/prepare-submission.html
```

## State Update

After drafting:

- add `prepare-submission` to `completed_stages` only when the packet is materially complete and remaining gaps are minor
- set `submission.status` to `drafting`
- set `submission.draft_file` to `devpost-submission.md`
- set `submission.browser_handoff_ready` to `false`
- set `current_stage` to `prepare-submission`
- set `next_command` to:
  - `submission-check` when the packet is materially complete and only minor follow-ups remain
  - otherwise `prepare-submission`

## Chat Output

Keep chat output compact.

Do not render:

- placeholder SVGs
- Markdown images
- Mermaid diagrams
- inline dashboards
- long artifact-style page copy

Respond with:

- whether `devpost-submission.md` was created or updated
- artifact regenerated
- localhost preview URL
- the short revision checklist
- next recommendation: either another `$prepare-submission` pass or `$submission-check`

If artifact generation fails, use a compact text fallback:

- current stage: Prepare
- draft file path
- shortest useful revision checklist
- next recommended command
