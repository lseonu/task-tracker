# Devpost Hackathon Plugin Prototypes

Prototype Codex plugins for guiding participants through a Devpost hackathon flow. This repo intentionally contains two separate installable plugin packages:

- `plugins/devpost-hackathon-desktop`: Codex Desktop version with inline progress visuals.
- `plugins/devpost-hackathon-cli`: Codex CLI version with terminal-native text progress.

The duplication is deliberate for this early prototype. It keeps each surface easy to inspect, demo, and discard while OpenAI and Devpost decide what they want the final hackathon experience to be.

Devpost team handoff: start with [`docs/devpost-team-onboarding.md`](docs/devpost-team-onboarding.md) for configuration, copy editing, banner assets, plugin installation, QA, and the required first participant command, `$start-hackathon`.

## Installable Packages

The repository root is a marketplace/prototype workspace, not the plugin itself. Install one of the plugin folders through the repo marketplace:

```text
.agents/plugins/marketplace.json
```

That marketplace exposes:

- `devpost-hackathon-desktop`
- `devpost-hackathon-cli`

During local development, update the plugin folder you are testing and refresh/restart Codex so the installed cache sees the new files.

## Event Configuration

Each plugin package should avoid hardcoding event-specific details in skills or generated response output.

Each package has its own `config/hackathon.json` for lightweight event configuration:

- event id and display name
- official Devpost URLs
- submission deadline display/cache
- logo and stepper asset paths
- paths to per-step Markdown content
- minimal submission requirement defaults

Keep this file small. It is a V1 fallback configuration surface, not the final source of truth for Devpost data.

## Step Content

Longer step copy should live in Markdown files, not JSON strings.

Each plugin package has duplicated content files:

- `content/steps/start.md`
- `content/steps/rules.md`
- `content/steps/resources.md`
- `content/steps/prepare.md`
- `content/steps/check.md`
- `content/steps/map.md`

Optional learning-path content lives in:

- `content/learning/onboard.md`
- `content/learning/scope.md`
- `content/learning/prd.md`
- `content/learning/spec.md`
- `content/learning/checklist.md`
- `content/learning/build.md`

For V1, treat these as rich text only. The Desktop plugin references art-team PNG stepper images when present; the CLI plugin keeps progress text-only.

The bundled Devpost logo files live in `assets/logos/`:

- `assets/logos/devpost-logo-original.svg` for light backgrounds
- `assets/logos/devpost-logo-white.svg` for dark backgrounds

The event banner slot is configured at `assets.event_banner`. V1 includes `assets/banners/event-banner-placeholder.svg`; replace it with final hackathon banner art only if the team decides to use a banner in chat.

Desktop main-step PNG slots live in `assets/steppers/main-light/` and are configured by `assets.main_stepper_images`:

- `start.png`
- `rules.png`
- `resources.png`
- `prepare.png`
- `check.png`

## Composing Chat Responses

Chat is the primary participant surface. Each package has its own response composer.

Desktop:

```bash
node plugins/devpost-hackathon-desktop/scripts/compose-response.mjs --page resources
```

CLI:

```bash
node plugins/devpost-hackathon-cli/scripts/compose-response.mjs --page resources
```

The package-local composer reads:

- package-local `config/hackathon.json`
- `.openai-codex-hackathon-state.json` when present
- package-local `content/steps/*.md`
- package-local `content/learning/*.md`
- `.openai-codex-hackathon/submission-security-scan.json` when present for final checks

The Desktop composer references configured PNG stepper files with absolute local image paths when those files exist. It does not generate placeholder art. The CLI composer emits no image Markdown.

Event, product, and design owners can revise copy in each package's `content/steps/` or `content/learning/` without editing the composer or skill files. The Markdown files include maintainer-only comments with their source paths; participant responses should not display copy-editing instructions.

## Optional Learning Path

The optional learning path stays nested inside Step 3: Resources. It is command-driven, not clickable routing inside a separate page.

V1 command sequence:

- `$learning-onboard`
- `$learning-scope`
- `$learning-prd`
- `$learning-spec`
- `$learning-checklist`
- `$learning-build`

These commands should create durable local documents under `docs/hackathon-learning/` and keep `.openai-codex-hackathon-state.json` small by storing only progress, file paths, and confirmed project metadata.

## Future Devpost MCP

The future Devpost MCP should become the source of truth for event, registration, team, and submission data when available.

Until then, `config/hackathon.json` plus the Markdown content files provide a lightweight, forkable setup for a specific hackathon.

See [`docs/future-devpost-mcp.md`](docs/future-devpost-mcp.md) for the current integration notes, OpenAI documentation links, likely read-only tool shape, auth/state guidance, and migration plan. V1 intentionally does not add `.mcp.json` or `mcpServers` until the Devpost MCP server and auth model are known.

## Devpost Team Handoff

For configuring this plugin for OpenAI or a future customer hackathon, start with [`docs/devpost-team-onboarding.md`](docs/devpost-team-onboarding.md). It covers product copy, JSON configuration, banner assets, Codex plugin install docs, QA, and the required first participant command: `$start-hackathon`.
