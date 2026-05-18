---
name: resources
description: Show the participant's resource hub for working through the hackathon with Codex, including docs, inspiration, and anti-pattern guidance. Use when the user wants hackathon resources, wants inspiration, or needs a reminder of what kinds of projects to avoid.
---

# Resources

## Purpose

Update state for Step 3, compose the Resources chat response, and explain the two available paths: continue directly to submission prep or enter the optional learning path.

Chat is the primary participant interface. This Desktop plugin can include a generated progress SVG.

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

## Response Content

The Resources response should help the participant understand:

- useful in-app resources
- strong project archetypes
- anti-patterns to avoid
- the normal next step: `$prepare-submission`
- the optional learning path nested inside Step 3

The optional learning path is command-driven, not clickable routing in a side pane.

Visible learning sequence:

`Ideate -> Scope -> PRD -> Spec -> Checklist -> Build`

Command sequence:

`$learning-onboard -> $learning-scope -> $learning-prd -> $learning-spec -> $learning-checklist -> $learning-build`

Do not render local placeholder images or resource posters in chat. The only Desktop visual planned for this pass is the generated progress SVG.

## Presentation Output

After reading references and updating state, run:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/devpost-hackathon-desktop/0.1.0/scripts/compose-response.mjs" --page resources
```

Use the composer output as the participant-facing response.

## State Update

After showing resources:

- add `resources` to `completed_stages` if needed
- set `current_stage` to `resources`
- set `next_command` to `prepare-submission`
- preserve registration and deadline fields

Do not mark the optional learning path active unless the user chooses it or runs `$learning-onboard`.

## Chat Output

Keep chat output minimal.

Do not hand-write a separate dashboard. Let the Desktop composer render the response.

Respond with:

- note that guided planning is optional and nested inside Step 3
- one or two sentences explaining the decision between direct submission prep and the guided learning path
- invitation to ask questions about which path fits their project
- recommendation: continue with `$prepare-submission` unless they want guided planning
- guided path entry command: `$learning-onboard`

If composer generation fails, use a compact text fallback:

- current stage: Resources
- two paths available
- next likely command: `$prepare-submission`
- optional learning command: `$learning-onboard`
