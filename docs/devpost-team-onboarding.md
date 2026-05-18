# Devpost Team Handoff README

This document is for Devpost product managers, designers, event owners, and developers who need to configure these Codex plugin prototypes for the OpenAI Codex Hackathon or a future customer hackathon.

This repo contains two intentionally separate plugin packages:

- `plugins/devpost-hackathon-desktop`: Codex Desktop flow with inline progress images.
- `plugins/devpost-hackathon-cli`: Codex CLI flow with text-only progress.

The duplicated content is intentional for this early prototype. Update both packages when the shared hackathon copy changes.

## Start Here

The first participant command is:

```text
$start-hackathon
```

Use a dollar sign. These are Codex plugin skills, not terminal commands and not slash commands.

The main flow is:

1. `$start-hackathon`
2. `$review-rules`
3. `$resources`
4. `$prepare-submission`
5. `$submission-check`

The optional learning path starts from Step 3 and stays nested inside Resources:

1. `$learning-onboard`
2. `$learning-scope`
3. `$learning-prd`
4. `$learning-spec`
5. `$learning-checklist`
6. `$learning-build`

Use `$hackathon-map` anytime to show the current state and recommended next command.

## What Product And Event Owners Edit

Most event-specific content lives inside each plugin package in two places:

- `config/hackathon.json` for short structured values, URLs, dates, and progress image settings.
- `content/steps/` and `content/learning/` for participant-facing step copy.

There is no normal localhost or side-pane HTML experience in this prototype. The Desktop package renders chat-first Markdown with optional inline generated progress SVGs; the CLI package renders chat-first text only.

## Configure Event Metadata

Edit `config/hackathon.json` in each plugin package you are preparing.

Important fields:

| Field | What it controls |
| --- | --- |
| `event.id` | Stable event identifier used internally. Use lowercase, hyphenated text. |
| `event.name` | Human-readable event name shown in headings. |
| `event.prototype` | Keep `true` for demo/prototype builds. Set deliberately before production launch. |
| `official_urls.landing_page` | Main Devpost event URL. |
| `official_urls.resources_page` | Optional official resources URL. Leave empty if not ready. |
| `official_urls.submission_page` | Devpost submission URL. Often the same as landing page until final routing is known. |
| `dates.submission_deadline.display` | Human-readable deadline, including timezone. |
| `dates.submission_deadline.iso` | Optional ISO timestamp for future automation. |
| `assets.logo_light` | Devpost logo used on light backgrounds. |
| `assets.logo_dark` | Devpost logo used on dark backgrounds. |
| `assets.event_banner` | Optional event-specific banner path if the team decides to use one in chat. |
| `assets.progress_images_enabled` | Desktop-only kill switch for inline generated progress SVGs. Set `false` to use text progress. |
| `assets.progress_image_format` | Desktop-only reminder that generated progress visuals are SVG. |
| `content.*` | Paths to Markdown files for each step. Usually leave paths stable and edit the Markdown. |
| `submission_requirements` | Short fallback requirements used by skills and final review. Keep this concise. |

Current caveat: `config/hackathon.json` currently uses `https://openai.devpost.com/`. That URL is real, but as of May 15, 2026 it resolves publicly to the ended OpenAI Open Model Hackathon page, not verified final Codex Hackathon copy. Replace it with the exact live event URL before launch.

## Configure Visual Assets

The Devpost logo files are:

- `assets/logos/devpost-logo-original.svg`
- `assets/logos/devpost-logo-white.svg`

The optional event banner is configured here:

```json
"assets": {
  "logo_light": "assets/logos/devpost-logo-original.svg",
  "logo_dark": "assets/logos/devpost-logo-white.svg",
  "event_banner": "assets/banners/event-banner-placeholder.svg",
  "progress_images_enabled": true,
  "progress_image_format": "svg"
}
```

For the current Desktop visual direction, the composer generates progress SVGs directly from workflow state:

1. The composer reads the current command and `.openai-codex-hackathon-state.json`.
2. It writes an opaque-background SVG under `.openai-codex-hackathon/progress/`.
3. It references that SVG at the top of the Desktop chat response.
4. Run `node plugins/devpost-hackathon-desktop/scripts/compose-response.mjs --page start` and one learning page to verify the composed responses still work.

Do not put Devpost and OpenAI as a single co-branded headline. If Devpost needs attribution in future visual work, prefer a small "Powered by Devpost" treatment or another secondary placement approved by design.

To remove all Desktop images quickly, set `assets.progress_images_enabled` to `false`. The Desktop composer will switch to text progress without touching skills or command copy.

## Edit Step Copy

Top-level sequence copy:

| Command | Composer page | Markdown source |
| --- | --- | --- |
| `$start-hackathon` | `start` | `content/steps/start.md` |
| `$review-rules` | `rules` | `content/steps/rules.md` |
| `$resources` | `resources` | `content/steps/resources.md` |
| `$prepare-submission` | `prepare` | `content/steps/prepare.md` |
| `$submission-check` | `check` | `content/steps/check.md` |
| `$hackathon-map` | `map` | `content/steps/map.md` |

Optional learning path copy:

| Command | Composer page | Markdown source |
| --- | --- | --- |
| `$learning-onboard` | `learning-onboard` | `content/learning/onboard.md` |
| `$learning-scope` | `learning-scope` | `content/learning/scope.md` |
| `$learning-prd` | `learning-prd` | `content/learning/prd.md` |
| `$learning-spec` | `learning-spec` | `content/learning/spec.md` |
| `$learning-checklist` | `learning-checklist` | `content/learning/checklist.md` |
| `$learning-build` | `learning-build` | `content/learning/build.md` |

Markdown comments at the top of those files identify the source path for maintainers. Those comments do not render into participant-facing responses.

For V1, keep Markdown copy to rich text only: headings, paragraphs, bullets, and inline code. Desktop images come from configured assets, not from Markdown copy.

## What Developers Edit

Developer-owned files inside each plugin package:

- `skills/*/SKILL.md`: command behavior and chat instructions.
- `scripts/compose-response.mjs`: deterministic chat response composer.
- `scripts/submission-security-scan.mjs`: local final-check scanner.
- `.codex-plugin/plugin.json`: plugin metadata shown by Codex.

Generated or runtime files:

- `.openai-codex-hackathon-state.json`: participant-local state file created in the active project.
- `.openai-codex-hackathon/`: participant-local support directory.
- `.openai-codex-hackathon/submission-security-scan.json`: generated security scan result.

Do not put customer-specific event facts directly into `skills/*/SKILL.md` unless there is no config or Markdown alternative.

## Compose And Preview

From the plugin repo:

```bash
node plugins/devpost-hackathon-desktop/scripts/compose-response.mjs --page start
node plugins/devpost-hackathon-cli/scripts/compose-response.mjs --page start
```

Desktop output should include local image references when generated progress SVGs are enabled. CLI output should not include Markdown image syntax.

## Install And Refresh In Codex

Official OpenAI Codex plugin docs:

- [Build plugins: local install](https://developers.openai.com/codex/plugins/build#install-a-local-plugin-manually)
- [Build plugins: how Codex uses marketplaces](https://developers.openai.com/codex/plugins/build#how-codex-uses-marketplaces)
- [Build plugins: add a marketplace from the CLI](https://developers.openai.com/codex/plugins/build#add-a-marketplace-from-the-cli)
- [Codex CLI reference: plugin marketplace](https://developers.openai.com/codex/cli/reference#codex-plugin-marketplace)

The important operational detail: Codex installs plugins into a cache under `~/.codex/plugins/cache/...` and loads the installed copy. If you change the source plugin, refresh the installed copy and restart or reload Codex as needed.

For local QA in this repo, use the repo marketplace:

```bash
codex plugin marketplace add /Users/joe/Developer/devpost/codex-hackathon
```

The marketplace file at `.agents/plugins/marketplace.json` exposes both packages. Install whichever surface you are testing:

- `devpost-hackathon-desktop`
- `devpost-hackathon-cli`

For a production handoff, package this as a Codex plugin marketplace entry instead of relying on a developer-local cache path.

## Participant QA Checklist

In a fresh Codex Desktop chat with the Desktop plugin installed, from an empty test project folder:

1. Run `$start-hackathon`.
2. Confirm the welcome message explains chat-first guidance.
3. Confirm the inline stepper image renders.
4. Run `$review-rules`.
5. Confirm the participant must explicitly agree before moving on.
6. Run `$resources`.
7. Confirm the inline response explains the normal path and optional learning path.
8. Run `$learning-onboard` only if testing the optional learning path.
9. Continue through `$learning-scope`, `$learning-prd`, `$learning-spec`, `$learning-checklist`, and `$learning-build`.
10. Then run `$prepare-submission`.
11. Run `$submission-check`.
12. Confirm the security scan renders clearly.

In Codex CLI with the CLI plugin installed, repeat the same command sequence and confirm no Markdown image syntax appears.

## Future Devpost MCP

The long-term version should not rely on manually copied event metadata forever. A future Devpost MCP can provide official event data, registration state, team identity, rules, submission requirements, and draft readiness.

Until that exists, this repo's config and Markdown files are the source of truth for a configured plugin package.
