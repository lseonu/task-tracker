---
name: resources
description: Show the participant's resource hub for working through the hackathon with Codex, including docs, inspiration, and anti-pattern guidance. Use when the user wants hackathon resources, wants inspiration, or needs a reminder of what kinds of projects to avoid.
---

# Resources

## Purpose

Regenerate the Resources HTML artifact, update state for Step 3, and explain the two available paths: continue directly to submission prep or enter the optional learning path.

The HTML artifact is the primary participant interface. Chat is only the control surface and fallback.

## Required References

Read these files before responding:

- `../PLUGIN_RUNTIME.md`
- `../../config/hackathon.json`
- `references/resource-links.md`
- `references/anti-patterns.md`

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the state file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, tell the user to finish `$review-rules` first. This is a blocker before the rest of the workflow.

## Artifact Content

The Resources artifact should help the participant understand:

- useful in-app resources
- strong project archetypes
- anti-patterns to avoid
- the normal next step: `$prepare-submission`
- the optional learning path nested inside Step 3

The optional learning path is command-driven, not clickable routing inside the artifact.

Visible learning sequence:

`Ideate -> Scope -> PRD -> Spec -> Checklist -> Build -> Return`

Command sequence:

`$learning-onboard -> $learning-scope -> $learning-prd -> $learning-spec -> $learning-checklist -> $learning-build`

Do not render local placeholder images or resource posters in chat.

## Artifact Output

After reading references and updating state, run:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --page resources
```

The generated page is `artifacts/generated/resources.html`.

Expected preview URL when the repo is served on port 8787:

```text
http://localhost:8787/artifacts/generated/resources.html
```

## State Update

After showing resources:

- add `resources` to `completed_stages` if needed
- set `current_stage` to `resources`
- set `next_command` to `prepare-submission`
- preserve registration and deadline fields

Do not mark the optional learning path active unless the user chooses it or runs `$learning-onboard`.

## Chat Output

Keep chat output minimal.

Do not render:

- placeholder SVGs
- Markdown images
- Mermaid diagrams
- inline dashboards
- long resource lists already represented in the artifact

Respond with:

- artifact regenerated
- localhost preview URL
- note that guided planning is optional and nested inside Step 3
- one or two sentences explaining the decision between direct submission prep and the guided learning path
- invitation to ask questions about which path fits their project
- recommendation: continue with `$prepare-submission` unless they want guided planning
- guided path entry command: `$learning-onboard`

If artifact generation fails, use a compact text fallback:

- current stage: Resources
- two paths available
- next likely command: `$prepare-submission`
- optional learning command: `$learning-onboard`
