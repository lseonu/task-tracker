# Devpost Team Handoff README

This document is for Devpost product managers, designers, event owners, and developers who need to configure this Codex plugin for the OpenAI Codex Hackathon or a future customer hackathon.

The plugin gives participants a guided hackathon flow inside Codex Desktop. Participants talk with Codex in chat, and Codex renders dynamic HTML artifacts in the in-app browser for the current step.

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

Most event-specific content lives in two places:

- `config/hackathon.json` for short structured values, URLs, dates, and asset paths.
- `content/steps/` and `content/learning/` for participant-facing page copy.

Do not edit generated HTML files directly. Files in `artifacts/generated/` are rebuilt by the renderer.

## Configure Event Metadata

Edit `config/hackathon.json`.

Important fields:

| Field | What it controls |
| --- | --- |
| `event.id` | Stable event identifier used internally. Use lowercase, hyphenated text. |
| `event.name` | Human-readable event name shown in page titles and headings. |
| `event.prototype` | Keep `true` for demo/prototype builds. Set deliberately before production launch. |
| `official_urls.landing_page` | Main Devpost event URL. |
| `official_urls.resources_page` | Optional official resources URL. Leave empty if not ready. |
| `official_urls.submission_page` | Devpost submission URL. Often the same as landing page until final routing is known. |
| `dates.submission_deadline.display` | Human-readable deadline, including timezone. |
| `dates.submission_deadline.iso` | Optional ISO timestamp for future automation. |
| `assets.logo_light` | Devpost logo used on light backgrounds. |
| `assets.logo_dark` | Devpost logo used on dark backgrounds. |
| `assets.event_banner` | Event-specific banner shown across generated pages. |
| `content.*` | Paths to Markdown files for each page. Usually leave paths stable and edit the Markdown. |
| `submission_requirements` | Short fallback requirements used by skills and final review. Keep this concise. |

Current caveat: `config/hackathon.json` currently uses `https://openai.devpost.com/`. That URL is real, but as of May 15, 2026 it resolves publicly to the ended OpenAI Open Model Hackathon page, not verified final Codex Hackathon copy. Replace it with the exact live event URL before launch.

## Configure Header And Banner Art

The Devpost logo files are:

- `assets/logos/devpost-logo-original.svg`
- `assets/logos/devpost-logo-white.svg`

The event banner is configured here:

```json
"assets": {
  "logo_light": "assets/logos/devpost-logo-original.svg",
  "logo_dark": "assets/logos/devpost-logo-white.svg",
  "event_banner": "assets/banners/event-banner-placeholder.svg"
}
```

To replace the banner:

1. Add the final image to `assets/banners/`.
2. Update `assets.event_banner` in `config/hackathon.json`.
3. Regenerate artifacts with `node scripts/render-artifacts.mjs --all`.
4. Preview pages through localhost.

Use web-safe image formats for V1: SVG, PNG, or JPG. Avoid remote image dependencies unless the event owner explicitly accepts that risk.

## Edit Page Copy

Top-level sequence copy:

| Command | HTML page | Markdown source |
| --- | --- | --- |
| `$start-hackathon` | `artifacts/generated/start-hackathon.html` | `content/steps/start.md` |
| `$review-rules` | `artifacts/generated/review-rules.html` | `content/steps/rules.md` |
| `$resources` | `artifacts/generated/resources.html` | `content/steps/resources.md` |
| `$prepare-submission` | `artifacts/generated/prepare-submission.html` | `content/steps/prepare.md` |
| `$submission-check` | `artifacts/generated/submission-check.html` | `content/steps/check.md` |
| `$hackathon-map` | `artifacts/generated/hackathon-map.html` | `content/steps/map.md` |

Optional learning path copy:

| Command | HTML page | Markdown source |
| --- | --- | --- |
| `$learning-onboard` | `artifacts/generated/learning-onboard.html` | `content/learning/onboard.md` |
| `$learning-scope` | `artifacts/generated/learning-scope.html` | `content/learning/scope.md` |
| `$learning-prd` | `artifacts/generated/learning-prd.html` | `content/learning/prd.md` |
| `$learning-spec` | `artifacts/generated/learning-spec.html` | `content/learning/spec.md` |
| `$learning-checklist` | `artifacts/generated/learning-checklist.html` | `content/learning/checklist.md` |
| `$learning-build` | `artifacts/generated/learning-build.html` | `content/learning/build.md` |

Markdown comments at the top of those files identify the source path for maintainers. Those comments do not render into participant-facing HTML.

For V1, keep Markdown copy to rich text only: headings, paragraphs, bullets, and inline code. Do not depend on inline images inside Markdown. Use `assets.event_banner` for the shared event image.

## What Developers Edit

Developer-owned files:

- `skills/*/SKILL.md`: command behavior and chat instructions.
- `scripts/render-artifacts.mjs`: deterministic HTML artifact renderer.
- `scripts/submission-security-scan.mjs`: local final-check scanner.
- `artifacts/templates/shared-artifact.css`: shared visual system.
- `artifacts/templates/shared-artifact-template.html`: static template preview.
- `.codex-plugin/plugin.json`: plugin metadata shown by Codex.

Generated or runtime files:

- `artifacts/generated/*.html`: generated previews checked into this prototype repo for QA.
- `.openai-codex-hackathon-state.json`: participant-local state file created in the active project.
- `.openai-codex-hackathon/`: participant-local copied templates/assets used by generated pages.
- `artifacts/generated/submission-security-scan.json`: generated security scan result.

Do not put customer-specific event facts directly into `skills/*/SKILL.md` unless there is no config or Markdown alternative.

## Regenerate And Preview

From the plugin repo:

```bash
node scripts/render-artifacts.mjs --all
python3 -m http.server 8787
```

Open generated pages through localhost:

```text
http://localhost:8787/artifacts/generated/start-hackathon.html
```

Do not rely on `file://` previews. During QA, Codex in-app browser behavior was reliable through localhost and unreliable through direct file navigation.

## Install And Refresh In Codex

Official OpenAI Codex plugin docs:

- [Build plugins: local install](https://developers.openai.com/codex/plugins/build#install-a-local-plugin-manually)
- [Build plugins: how Codex uses marketplaces](https://developers.openai.com/codex/plugins/build#how-codex-uses-marketplaces)
- [Build plugins: add a marketplace from the CLI](https://developers.openai.com/codex/plugins/build#add-a-marketplace-from-the-cli)
- [Codex CLI reference: plugin marketplace](https://developers.openai.com/codex/cli/reference#codex-plugin-marketplace)

The important operational detail: Codex installs plugins into a cache under `~/.codex/plugins/cache/...` and loads the installed copy. If you change the source plugin, refresh the installed copy and restart or reload Codex as needed.

For local QA in this repo, the currently used installed path is:

```text
~/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/
```

After changing this repo, refresh that cache copy before testing in a fresh chat:

```bash
rsync -a --delete --exclude .git --exclude .openai-codex-hackathon-state.json \
  /path/to/codex-hackathon/ \
  ~/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/
```

For a production handoff, package this as a Codex plugin marketplace entry instead of relying on a developer-local cache path.

## Participant QA Checklist

In a fresh Codex Desktop chat, from an empty test project folder:

1. Run `$start-hackathon`.
2. Confirm the welcome message explains chat plus dynamic HTML artifacts.
3. Confirm the generated page opens through localhost and shows the Devpost logo plus event banner.
4. Run `$review-rules`.
5. Confirm the participant must explicitly agree before moving on.
6. Run `$resources`.
7. Confirm the page explains the normal path and optional learning path.
8. Run `$learning-onboard` only if testing the optional learning path.
9. Continue through `$learning-scope`, `$learning-prd`, `$learning-spec`, `$learning-checklist`, and `$learning-build`.
10. Return to `$prepare-submission`.
11. Run `$submission-check`.
12. Confirm the security scan renders clearly in both light and dark mode.

## Future Devpost MCP

The long-term version should not rely on manually copied event metadata forever. A future Devpost MCP can provide official event data, registration state, team identity, rules, submission requirements, and draft readiness.

Until that exists, this repo's config and Markdown files are the source of truth for a configured plugin package.
