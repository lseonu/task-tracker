# Devpost Hackathon Plugin Prototypes

Prototype Codex plugins for guiding participants through a Devpost hackathon flow. This repo intentionally contains two separate installable plugin packages:

- `plugins/devpost-hackathon-desktop`: Codex Desktop version with inline progress visuals.
- `plugins/devpost-hackathon-cli`: Codex CLI version with terminal-native text progress.

The duplication is deliberate for this early prototype. It keeps each surface easy to inspect, demo, and discard while OpenAI and Devpost decide what they want the final hackathon experience to be.

Devpost team handoff: start with [`docs/devpost-team-onboarding.md`](docs/devpost-team-onboarding.md) for configuration, copy editing, banner assets, plugin installation, QA, and the required first participant command, `$start-hackathon`.

## Intentionally Unresolved For Now

This is a Monday prototype, not final production packaging. The following items are intentionally still open:

- Final Devpost event URL, dates, rules, eligibility, and judging copy need the official event source of truth.
- Desktop progress SVGs are generated from workflow state at compose time, but they still need human QA in Codex Desktop.
- The repo marketplace needs one real install smoke test in Codex Desktop and one in Codex CLI before team-wide handoff.
- Future Devpost MCP/auth behavior is documented as a later integration, not implemented in this V1 prototype.

## Installable Packages

The repository root is a marketplace/prototype workspace, not the plugin itself. Install one of the plugin folders through the repo marketplace:

```text
.agents/plugins/marketplace.json
```

That marketplace exposes:

- `devpost-hackathon-desktop`
- `devpost-hackathon-cli`

During local development, update the plugin folder you are testing and refresh/restart Codex so the installed cache sees the new files.

## Live Content Wiring

The `content/` folders are live runtime inputs, not vestigial files.

Each package has its own `scripts/compose-response.mjs`. The composer reads package-local `config/hackathon.json`, resolves the relevant Markdown path from `config.content`, reads that Markdown file, strips maintainer-only HTML comments, interpolates `[Hackathon name]` and `{{event.name}}`, then inserts the result into the chat response.

The skill files call the composer after doing behavior work such as state updates, gates, scans, and file creation. Skills should define SOP and command behavior; participant-facing step copy should usually live in `content/`.

## Event Configuration

Each plugin package should avoid hardcoding event-specific details in skills or generated response output.

Each package has its own `config/hackathon.json` for lightweight event configuration. Because the Desktop and CLI packages are intentionally separate, update both config files unless you are testing only one surface:

- `plugins/devpost-hackathon-desktop/config/hackathon.json`
- `plugins/devpost-hackathon-cli/config/hackathon.json`

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
| `assets.progress_images_enabled` | Design/product | Desktop only. Set `false` to remove inline progress SVGs and use text fallback. |
| `assets.progress_image_format` | Design/engineering | Desktop only. Documents that generated progress images are SVG. |
| `content.start` | Product/editorial | Path for `$start-hackathon` copy. Usually leave path stable and edit the Markdown file. |
| `content.rules` | Product/legal/event | Path for `$review-rules` page copy. |
| `content.resources` | Product/curriculum | Path for `$resources` page copy. |
| `content.prepare` | Product/editorial | Path for `$prepare-submission` page copy. |
| `content.check` | Product/editorial | Path for `$submission-check` page copy. |
| `content.map` | Product/editorial | Path for `$hackathon-map` page copy. |
| `content.learning.onboard` | Curriculum/product | Path for `$learning-onboard` copy. |
| `content.learning.scope` | Curriculum/product | Path for `$learning-scope` copy. |
| `content.learning.prd` | Curriculum/product | Path for `$learning-prd` copy. |
| `content.learning.spec` | Curriculum/product | Path for `$learning-spec` copy. |
| `content.learning.checklist` | Curriculum/product | Path for `$learning-checklist` copy. |
| `content.learning.build` | Curriculum/product | Path for `$learning-build` copy. |
| `submission_requirements[]` | Product/legal/event | Short fallback submission requirements used by skills and final review. |
| `notes.configuration_owner` | Internal maintainers | Internal note for who should own event configuration. |
| `notes.mcp_future` | Internal maintainers | Internal note about future Devpost MCP ownership. |

Keep config small. It is a V1 fallback configuration surface, not the final source of truth for Devpost data.

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

For V1, treat these as rich text only. The Desktop plugin generates inline progress SVGs from workflow state; the CLI plugin keeps progress text-only.

These Markdown files are the main product-editable participant copy. Update both package copies unless the Desktop and CLI versions intentionally diverge.

| Command | Desktop source | CLI source |
| --- | --- | --- |
| `$start-hackathon` | `plugins/devpost-hackathon-desktop/content/steps/start.md` | `plugins/devpost-hackathon-cli/content/steps/start.md` |
| `$review-rules` | `plugins/devpost-hackathon-desktop/content/steps/rules.md` | `plugins/devpost-hackathon-cli/content/steps/rules.md` |
| `$resources` | `plugins/devpost-hackathon-desktop/content/steps/resources.md` | `plugins/devpost-hackathon-cli/content/steps/resources.md` |
| `$prepare-submission` | `plugins/devpost-hackathon-desktop/content/steps/prepare.md` | `plugins/devpost-hackathon-cli/content/steps/prepare.md` |
| `$submission-check` | `plugins/devpost-hackathon-desktop/content/steps/check.md` | `plugins/devpost-hackathon-cli/content/steps/check.md` |
| `$hackathon-map` | `plugins/devpost-hackathon-desktop/content/steps/map.md` | `plugins/devpost-hackathon-cli/content/steps/map.md` |
| `$learning-onboard` | `plugins/devpost-hackathon-desktop/content/learning/onboard.md` | `plugins/devpost-hackathon-cli/content/learning/onboard.md` |
| `$learning-scope` | `plugins/devpost-hackathon-desktop/content/learning/scope.md` | `plugins/devpost-hackathon-cli/content/learning/scope.md` |
| `$learning-prd` | `plugins/devpost-hackathon-desktop/content/learning/prd.md` | `plugins/devpost-hackathon-cli/content/learning/prd.md` |
| `$learning-spec` | `plugins/devpost-hackathon-desktop/content/learning/spec.md` | `plugins/devpost-hackathon-cli/content/learning/spec.md` |
| `$learning-checklist` | `plugins/devpost-hackathon-desktop/content/learning/checklist.md` | `plugins/devpost-hackathon-cli/content/learning/checklist.md` |
| `$learning-build` | `plugins/devpost-hackathon-desktop/content/learning/build.md` | `plugins/devpost-hackathon-cli/content/learning/build.md` |

## Reference And Template Content

Some editable hackathon SOP content lives under `skills/**/references/` and `skills/**/templates/`. These files are not rendered as the main step page by the composer, but skill instructions read them when answering questions, creating local docs, or reviewing submissions.

Edit both package copies unless the surfaces intentionally diverge:

| Source file | Owner | Purpose |
| --- | --- | --- |
| `skills/review-rules/references/placeholder-rules.md` | Product/legal/event | Rules source material for the mandatory rules gate and participant questions. Replace provisional eligibility, dates, judging, originality, and support details before launch. |
| `skills/resources/references/resource-links.md` | Product/curriculum | Resource links and official learning/inspiration destinations. |
| `skills/resources/references/anti-patterns.md` | Product/curriculum | Project anti-pattern guidance used by the resources step. |
| `skills/prepare-submission/references/submission-template.md` | Product/editorial | Outline used to create or update `devpost-submission.md`. |
| `skills/submission-check/references/preflight-checklist.md` | Product/event/engineering | Final readiness checklist used before Devpost handoff. |
| `skills/learning-guide/templates/learner-profile-template.md` | Curriculum/product | Template for guided-learning onboarding notes. |
| `skills/learning-guide/templates/scope-template.md` | Curriculum/product | Template for guided-learning scope docs. |
| `skills/learning-guide/templates/prd-template.md` | Curriculum/product | Template for guided-learning PRDs. |
| `skills/learning-guide/templates/spec-template.md` | Curriculum/engineering | Template for guided-learning technical specs. |
| `skills/learning-guide/templates/checklist-template.md` | Curriculum/engineering | Template for guided-learning build checklists. |

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

Desktop progress visuals are generated SVG files, not hand-managed per-step exports. The composer reads the participant's current progress state, writes an opaque-background SVG under `.openai-codex-hackathon/progress/`, and references that SVG at the top of the response. This keeps the visual readable in both light and dark Codex themes.

To remove all Desktop images without changing code, set `assets.progress_images_enabled` to `false` in `plugins/devpost-hackathon-desktop/config/hackathon.json`. The Desktop composer will then use text progress, matching the CLI-style fallback.

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

The Desktop composer generates progress SVGs with absolute local image paths when `assets.progress_images_enabled` is true. The CLI composer emits no image Markdown.

Event, product, and design owners can revise copy in each package's `content/steps/` or `content/learning/` without editing the composer or skill files. The Markdown files include maintainer-only comments with their source paths; participant responses should not display copy-editing instructions.

## Optional Learning Path

The optional learning path stays nested inside Step 3: Resources. It is command-driven, not clickable routing inside a separate screen.

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
