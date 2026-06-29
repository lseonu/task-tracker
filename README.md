# Devpost Hackathon Plugin Prototype

Prototype Codex plugin for guiding participants through a Devpost hackathon flow. This repo contains one installable plugin package:

- `plugins/devpost-hackathons`: a text-first plugin that renders a rich multi-line text "dashboard" in any Codex host. On hosts that can render them (Codex Desktop / ChatGPT), rich inline visuals come from the bundled Devpost MCP server (server `devpost` at `https://devpost.com/mcp`) and its stepper widget; the CLI and other non-widget hosts always show the text dashboard.

The single text-first package keeps the surface easy to inspect, demo, and evolve while OpenAI and Devpost decide what they want the final hackathon experience to be.

Devpost team handoff: start with [`docs/devpost-team-onboarding.md`](docs/devpost-team-onboarding.md) for configuration, copy editing, banner assets, plugin installation, QA, and the required first participant command, `$start-hackathon`.

## Intentionally Unresolved For Now

This is a Monday prototype, not final production packaging. The following items are intentionally still open:

- Final Devpost event URL, dates, rules, eligibility, and judging copy need the official event source of truth.
- The bundled Devpost MCP stepper widget still needs human QA on Codex Desktop / ChatGPT.
- The repo marketplace needs one real install smoke test in Codex Desktop and one in Codex CLI before team-wide handoff.

## Installable Packages

The repository root is a marketplace/prototype workspace, not the plugin itself. Install the plugin folder through the repo marketplace:

```text
.agents/plugins/marketplace.json
```

That marketplace exposes:

- `devpost-hackathons`

During local development, update the plugin folder and refresh/restart Codex so the installed cache sees the new files.

## Live Content Wiring

The `content/` folders are live runtime inputs, not vestigial files.

The package has `scripts/compose-response.mjs`. The composer reads `config/hackathon.json`, resolves the relevant Markdown path from `config.content`, reads that Markdown file, strips maintainer-only HTML comments, interpolates `[Hackathon name]` and `{{event.name}}`, then inserts the result into the chat response.

The skill files call the composer after doing behavior work such as state updates, gates, scans, and file creation. Skills should define SOP and command behavior; participant-facing step copy should usually live in `content/`.

## Event Configuration

The plugin package should avoid hardcoding event-specific details in skills or generated response output.

The package has `config/hackathon.json` for lightweight event configuration:

- `plugins/devpost-hackathons/config/hackathon.json`

Editable config fields:

| Field | Owner | Notes |
| --- | --- | --- |
| `event.id` | Event/engineering | Stable lowercase event key. |
| `event.name` | Product/event | Human-readable event name shown in responses and progress art. |
| `event.prototype` | Product/engineering | Keep `true` for prototype builds. Change deliberately before production use. |
| `official_urls.landing_page` | Event/product | Main Devpost event URL. |
| `official_urls.resources_page` | Event/product | Optional official resources URL. Leave empty if not ready. |
| `official_urls.submission_page` | Event/product | Official Devpost submission URL. |
| `dates.submission_deadline.display` | Event/product | Human-readable deadline with timezone. |
| `dates.submission_deadline.iso` | Engineering/event | Optional machine-readable deadline for later automation. |
| `assets.logo_light` | Design | Logo path for light backgrounds. |
| `assets.logo_dark` | Design | Logo path for dark backgrounds. |
| `assets.event_banner` | Design/product | Optional banner path if the team decides to use banner art. |
| `content.start` | Product/editorial | Path for `$start-hackathon` copy. Usually leave path stable and edit the Markdown file. |
| `content.rules` | Product/legal/event | Path for `$review-rules` page copy. |
| `content.resources` | Product/curriculum | Path for `$resources` page copy. |
| `content.prepare` | Product/editorial | Path for `$prepare-submission` page copy. |
| `content.check` | Product/editorial | Path for `$submission-check` page copy. |
| `content.map` | Product/editorial | Path for `$hackathon-map` page copy. |
| `content.learning.onboard` | Curriculum/product | Path for `$build-onboard` copy. |
| `content.learning.scope` | Curriculum/product | Path for `$build-scope` copy. |
| `content.learning.prd` | Curriculum/product | Path for `$build-prd` copy. |
| `content.learning.spec` | Curriculum/product | Path for `$build-spec` copy. |
| `content.learning.checklist` | Curriculum/product | Path for `$build-checklist` copy. |
| `content.learning.build` | Curriculum/product | Path for `$build-project` copy. |
| `submission_requirements[]` | Product/legal/event | Short fallback submission requirements used by skills and final review. |
| `notes.configuration_owner` | Internal maintainers | Internal note for who should own event configuration. |
| `notes.mcp_future` | Internal maintainers | Internal note about future Devpost MCP ownership. |

Keep config small. It is a V1 fallback configuration surface, not the final source of truth for Devpost data.

## Step Content

Longer step copy should live in Markdown files, not JSON strings.

The plugin package has these content files:

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

For V1, treat these as rich text only. The plugin renders a text-first dashboard everywhere; rich inline visuals come from the bundled Devpost MCP stepper widget on capable hosts.

These Markdown files are the main product-editable participant copy.

| Command | Source |
| --- | --- |
| `$start-hackathon` | `plugins/devpost-hackathons/content/steps/start.md` |
| `$review-rules` | `plugins/devpost-hackathons/content/steps/rules.md` |
| `$resources` | `plugins/devpost-hackathons/content/steps/resources.md` |
| `$prepare-submission` | `plugins/devpost-hackathons/content/steps/prepare.md` |
| `$submission-check` | `plugins/devpost-hackathons/content/steps/check.md` |
| `$hackathon-map` | `plugins/devpost-hackathons/content/steps/map.md` |
| `$build-onboard` | `plugins/devpost-hackathons/content/learning/onboard.md` |
| `$build-scope` | `plugins/devpost-hackathons/content/learning/scope.md` |
| `$build-prd` | `plugins/devpost-hackathons/content/learning/prd.md` |
| `$build-spec` | `plugins/devpost-hackathons/content/learning/spec.md` |
| `$build-checklist` | `plugins/devpost-hackathons/content/learning/checklist.md` |
| `$build-project` | `plugins/devpost-hackathons/content/learning/build.md` |

## Reference And Template Content

Some editable hackathon SOP content lives under `skills/**/references/` and `skills/**/templates/`. These files are not rendered as the main step page by the composer, but skill instructions read them when answering questions, creating local docs, or reviewing submissions.

| Source file | Owner | Purpose |
| --- | --- | --- |
| `skills/review-rules/references/placeholder-rules.md` | Product/legal/event | Rules source material for the mandatory rules gate and participant questions. Replace provisional eligibility, dates, judging, originality, and support details before launch. |
| `skills/resources/references/resource-links.md` | Product/curriculum | Resource links and official learning/inspiration destinations. |
| `skills/resources/references/anti-patterns.md` | Product/curriculum | Project anti-pattern guidance used by the resources step. |
| `skills/prepare-submission/references/submission-template.md` | Product/editorial | Outline used to create or update `devpost-submission.md`. |
| `skills/submission-check/references/preflight-checklist.md` | Product/event/engineering | Final readiness checklist used before Devpost handoff. |
| `skills/build-guide/templates/learner-profile-template.md` | Curriculum/product | Template for guided-learning onboarding notes. |
| `skills/build-guide/templates/scope-template.md` | Curriculum/product | Template for guided-learning scope docs. |
| `skills/build-guide/templates/prd-template.md` | Curriculum/product | Template for guided-learning PRDs. |
| `skills/build-guide/templates/spec-template.md` | Curriculum/engineering | Template for guided-learning technical specs. |
| `skills/build-guide/templates/checklist-template.md` | Curriculum/engineering | Template for guided-learning build checklists. |

## Marketplace And Plugin Metadata

The marketplace wrapper is editable too:

| File | Editable fields |
| --- | --- |
| `.agents/plugins/marketplace.json` | Marketplace `name`, `interface.displayName`, `interface.description`, each plugin `name`, `source.path`, `category`, and install/auth policy. |
| `plugins/*/.codex-plugin/plugin.json` | Package metadata shown by Codex for the installed plugin. Keep names aligned with the marketplace entry. |

Developers should own behavior files:

- `skills/*/SKILL.md` for command SOP, gates, state updates, and which reference/template files to read.
- `scripts/compose-response.mjs` for deterministic response rendering.
- `scripts/submission-security-scan.mjs` for local final-check scanning.

The bundled Devpost logo files live in `assets/logos/`:

- `assets/logos/devpost-logo-original.svg` for light backgrounds
- `assets/logos/devpost-logo-white.svg` for dark backgrounds

The event banner slot is configured at `assets.event_banner`. V1 includes `assets/banners/event-banner-placeholder.svg`; replace it with final hackathon banner art only if the team decides to use a banner in chat.

Rich inline progress visuals come from the bundled Devpost MCP stepper widget on hosts that can render it (Codex Desktop / ChatGPT). On the CLI and other non-widget hosts, the composer always renders the text dashboard, which stays readable in both light and dark Codex themes.

## Composing Chat Responses

Chat is the primary participant surface. The package has one response composer.

```bash
node plugins/devpost-hackathons/scripts/compose-response.mjs --page resources
```

The composer reads:

- `config/hackathon.json`
- `.openai-codex-hackathon-state.json` when present
- `content/steps/*.md`
- `content/learning/*.md`
- `.openai-codex-hackathon/submission-security-scan.json` when present for final checks

The composer always emits the text dashboard and never emits image Markdown; rich inline visuals are supplied by the bundled Devpost MCP stepper widget on capable hosts.

Event, product, and design owners can revise copy in the package's `content/steps/` or `content/learning/` without editing the composer or skill files. The Markdown files include maintainer-only comments with their source paths; participant responses should not display copy-editing instructions.

## Optional Guided Build Tool

The optional guided build tool stays nested inside Step 3: Resources. It is command-driven, not clickable routing inside a separate screen.

V1 command sequence:

- `$build-onboard`
- `$build-scope`
- `$build-prd`
- `$build-spec`
- `$build-checklist`
- `$build-project`

These commands should create durable local documents under `docs/hackathon-build/` and keep `.openai-codex-hackathon-state.json` small by storing only progress, file paths, and confirmed project metadata.

## Devpost MCP

The Devpost MCP is now bundled with this plugin. A plugin-root `.mcp.json` declares the remote `devpost` server at `https://devpost.com/mcp`, referenced by `"mcpServers": "./.mcp.json"` in `.codex-plugin/plugin.json`. It is the source of truth for official event data and supplies the inline stepper widget on capable hosts.

`config/hackathon.json` plus the Markdown content files remain the lightweight, forkable local fallback for a specific hackathon when the MCP server is unavailable.

See [`docs/future-devpost-mcp.md`](docs/future-devpost-mcp.md) for the wiring, tool names, and auth model (OAuth via discovery; public read tools need no auth).

## Devpost Team Handoff

For configuring this plugin for OpenAI or a future customer hackathon, start with [`docs/devpost-team-onboarding.md`](docs/devpost-team-onboarding.md). It covers product copy, JSON configuration, banner assets, Codex plugin install docs, QA, and the required first participant command: `$start-hackathon`.
