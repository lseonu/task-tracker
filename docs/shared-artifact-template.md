# Shared Artifact Template

## Purpose

The V1 shared artifact template defines the raw HTML structure every generated Codex Desktop artifact should use.

This is intentionally under-styled. The design team is still preparing the final Devpost design kit, so the current files prioritize stable semantic hooks, slots, state attributes, and layout regions over visual polish.

Template files:

- `artifacts/templates/shared-artifact-template.html`
- `artifacts/templates/shared-artifact.css`
- `artifacts/generated/resources-sample.html`

## Design Posture

Build the first version as raw, design-kit-ready HTML:

- keep the universal Devpost logo at the top of every artifact, using `assets/logos/devpost-logo-original.svg` on light backgrounds and `assets/logos/devpost-logo-white.svg` on dark backgrounds
- use `assets.event_banner` for event-specific banner art where the official design calls for it
- preserve the top-level five-step stepper
- treat the stepper as the primary progress UI rather than rendering large dashboard status boxes
- keep Step 3 as the parent for optional guided learning
- expose a nested learning sequence only when that path is active
- use class names and `data-*` attributes that final CSS can target
- avoid hard-coding final colors, fonts, or art treatments before the design kit lands; the Devpost logo variants are now bundled as shared assets

## Required Slots

Each artifact should include these regions:

- `artifact-header`: Devpost logo and plugin/event title
- `artifact-progress-meta`: compact status metadata for current step, completed stages, next action, and deadline
- `artifact-stepper`: five-step top-level progress UI
- `page-intro`: headline and supporting copy
- `primary-content`: page-specific content
- `optional-learning-flow`: nested learning progress when active
- `next-action`: primary CTA or recommended command

Chat fallback copy remains renderer/skill data for cases where the artifact cannot be opened, but it should not appear inside the normal artifact layout.

## Stepper States

Top-level steps use `data-state` values:

- `complete`
- `active`
- `pending`
- `blocked`

The stable top-level step ids are:

- `start-hackathon`
- `review-rules`
- `resources`
- `prepare-submission`
- `submission-check`

## Nested Learning Flow

When the optional learning module is active, the top-level stepper should still show Step 3 as active.

The nested sequence uses a smaller secondary progress component:

1. Ideate
2. Scope
3. PRD
4. Spec
5. Checklist
6. Build
7. Return

The nested component should feel related to the top-level stepper but visually subordinate once final styles are applied.

## Responsive Rule

Design the progression components for the Codex artifact viewport first.

The common preview shape behaves more like a narrow tablet than a wide desktop. The top-level stepper may be horizontal when there is room, but it must collapse cleanly into a vertical progression without losing meaning. Do not depend on a wide horizontal layout for critical status information.

## Sticky Stepper Proof

Test page: `artifacts/generated/sticky-stepper-proof.html`

Result: `position: sticky` works in the Codex in-app browser when the artifact is served over localhost. After scrolling the proof page, the progression component remained pinned at the top of the artifact viewport.

Use sticky positioning as an available enhancement, not as the only way to understand progress.

## Rendering Rule

Generated artifacts should be derived from:

- `config/hackathon.json`
- `.openai-codex-hackathon-state.json`
- page-specific skill content
- final design-kit style assets when available

Do not store generated HTML in state. State remains the source of truth for workflow progress only.

## Preview Rule

Open generated HTML artifacts through a localhost preview server, not direct `file://` URLs.

Codex Desktop's in-app browser can preview local development servers and file-backed previews, but direct file protocol navigation was rejected during testing. Serving the repo over localhost and opening URLs such as `http://localhost:<port>/artifacts/generated/resources-sample.html` avoids that error for users.

## Media Rule

Direct MP4 embeds are technically supported in Codex Desktop preview, but video is optional for this sprint. Do not make video or per-step art a V1 dependency.

Do not use YouTube iframe embeds in participant-facing V1 artifacts.
