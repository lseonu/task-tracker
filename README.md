# OpenAI Codex Hackathon Plugin

Prototype Codex plugin for guiding participants through a Devpost hackathon flow inside Codex Desktop.

## Event Configuration

The plugin should avoid hardcoding event-specific details in skills or generated HTML.

Use `config/hackathon.json` for lightweight event configuration:

- event id and display name
- official Devpost URLs
- submission deadline display/cache
- logo asset paths
- paths to per-step Markdown content
- minimal submission requirement defaults

Keep this file small. It is a V1 fallback configuration surface, not the final source of truth for Devpost data.

## Step Content

Longer page copy should live in Markdown files, not JSON strings.

Current top-level content files:

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

For V1, treat these as rich text only. Do not depend on inline images in Markdown. Use the config `assets` section only for shared logo paths.

The bundled Devpost logo files live in `assets/logos/`:

- `assets/logos/devpost-logo-original.svg` for light backgrounds
- `assets/logos/devpost-logo-white.svg` for dark backgrounds

Generated artifacts use the light or white logo automatically based on the artifact theme.

The event banner slot is configured at `assets.event_banner`. V1 includes `assets/banners/event-banner-placeholder.svg`; replace it with the final hackathon banner art when the design team provides it.

## Previewing Artifacts

Serve the repo over localhost before opening generated HTML in the Codex in-app browser.

Example:

```bash
python3 -m http.server 8787
```

Then open:

```text
http://localhost:8787/artifacts/generated/resources.html
```

Direct `file://` navigation was rejected during testing, while localhost previews worked.

## Rendering Artifacts

Generate the top-level HTML artifacts with:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --all
```

Or generate one page:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --page resources
```

Learning-path pages can be generated the same way:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --page learning-onboard
```

The renderer reads:

- `config/hackathon.json`
- `.openai-codex-hackathon-state.json` when present
- `content/steps/*.md`
- `content/learning/*.md`
- `artifacts/templates/shared-artifact.css`

Participants should not need to know this machinery exists. Skills should render or refresh the right artifact automatically when the user runs commands such as `$resources` or `$submission-check`.

Each generated page visibly names the Markdown file that supplies its main body copy. This is intentional: event, product, and design owners can revise copy in `content/steps/` or `content/learning/` without editing the renderer or skill files.

The renderer is deterministic, not an AI page writer. It combines shared HTML/CSS, `config/hackathon.json`, Markdown copy, and the small local state file. Dynamic values such as participant name, project idea, current learning step, readiness status, and security scan results come from state or generated JSON files, while long-form instructional copy stays in Markdown.

## Optional Learning Path

The optional learning path stays nested inside Step 3: Resources. It is command-driven, not clickable routing inside the artifact.

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

For configuring this plugin for OpenAI or a future customer hackathon, start with [`docs/devpost-team-onboarding.md`](docs/devpost-team-onboarding.md).
