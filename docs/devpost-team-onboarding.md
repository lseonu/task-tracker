# Devpost Team Handoff README

This document is for Devpost product managers, designers, event owners, and developers who need to configure this Codex plugin prototype for the OpenAI Codex Hackathon or a future customer hackathon.

This repo contains one plugin package:

- `plugins/devpost-hackathons`: a text-first plugin that renders a rich multi-line text dashboard in any Codex host. On capable hosts (Codex Desktop / ChatGPT), rich inline visuals come from the bundled Devpost MCP stepper widget (server `devpost` at `https://devpost.com/mcp`).

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

The optional guided build tool starts from Step 3 and stays nested inside Resources:

1. `$build-onboard`
2. `$build-scope`
3. `$build-prd`
4. `$build-spec`
5. `$build-checklist`
6. `$build-project`

Use `$hackathon-map` anytime to show the current state and recommended next command.

## What Product And Event Owners Edit

Most event-specific content lives inside the plugin package in two places:

- `config/hackathon.json` for short structured values, URLs, and dates.
- `content/steps/` and `content/learning/` for participant-facing step copy.

There is no normal localhost or side-pane HTML experience in this prototype. The plugin renders a chat-first text dashboard everywhere; rich inline visuals come from the bundled Devpost MCP stepper widget on capable hosts.

## Configure Event Metadata

Edit `config/hackathon.json` in the plugin package.

Important fields:

| Field | What it controls |
| --- | --- |
| `event.id` | Stable event identifier used internally. Use lowercase, hyphenated text. |
| `event.name` | Human-readable event name shown in headings. |
| `event.prototype` | Keep `true` for demo/prototype builds. Set deliberately before production launch. |
| `official_urls.landing_page` | Main Devpost event URL. |
| `official_urls.resources_page` | Optional official resources URL. Leave empty if not ready. |
| `official_urls.submission_page` | Devpost submission URL. Often the same as the main event URL until final routing is known. |
| `dates.submission_deadline.display` | Human-readable deadline, including timezone. |
| `dates.submission_deadline.iso` | Optional ISO timestamp for future automation. |
| `assets.logo_light` | Devpost logo used on light backgrounds. |
| `assets.logo_dark` | Devpost logo used on dark backgrounds. |
| `assets.event_banner` | Optional event-specific banner path if the team decides to use one in chat. |
| `content.*` | Paths to Markdown files for each step. Usually leave paths stable and edit the Markdown. |
| `submission_requirements` | Short fallback requirements used by skills and final review. Keep this concise. |

Current caveat: `config/hackathon.json` currently uses `TBD` for the Devpost event and submission URLs. Replace those values with the exact live event URL before launch.

## Configure Visual Assets

The Devpost logo files are:

- `assets/logos/devpost-logo-original.svg`
- `assets/logos/devpost-logo-white.svg`

The optional event banner is configured here:

```json
"assets": {
  "logo_light": "assets/logos/devpost-logo-original.svg",
  "logo_dark": "assets/logos/devpost-logo-white.svg",
  "event_banner": "assets/banners/event-banner-placeholder.svg"
}
```

The composer always renders a text-first dashboard from workflow state:

1. The composer reads the current command and `.openai-codex-hackathon-state.json`.
2. It composes the text dashboard for the current page; it emits no image Markdown.
3. Run `node plugins/devpost-hackathons/scripts/compose-response.mjs --page start` and one learning page to verify the composed responses still work.

Rich inline visuals come from the bundled Devpost MCP stepper widget on capable hosts (Codex Desktop / ChatGPT), not from generated images.

Do not put Devpost and OpenAI as a single co-branded headline. If Devpost needs attribution in future visual work, prefer a small "Powered by Devpost" treatment or another secondary placement approved by design.

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

Optional guided build tool copy:

| Command | Composer page | Markdown source |
| --- | --- | --- |
| `$build-onboard` | `build-onboard` | `content/learning/onboard.md` |
| `$build-scope` | `build-scope` | `content/learning/scope.md` |
| `$build-prd` | `build-prd` | `content/learning/prd.md` |
| `$build-spec` | `build-spec` | `content/learning/spec.md` |
| `$build-checklist` | `build-checklist` | `content/learning/checklist.md` |
| `$build-project` | `build-project` | `content/learning/build.md` |

Markdown comments at the top of those files identify the source path for maintainers. Those comments do not render into participant-facing responses.

For V1, keep Markdown copy to rich text only: headings, paragraphs, bullets, and inline code. Rich inline visuals come from the bundled Devpost MCP stepper widget on capable hosts, not from Markdown copy.

## What Developers Edit

Developer-owned files inside the plugin package:

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
node plugins/devpost-hackathons/scripts/compose-response.mjs --page start
```

The composer output is a text dashboard and should not include Markdown image syntax. Rich inline visuals come from the bundled Devpost MCP stepper widget on capable hosts.

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

The marketplace file at `.agents/plugins/marketplace.json` exposes the package:

- `devpost-hackathons`

For a production handoff, package this as a Codex plugin marketplace entry instead of relying on a developer-local cache path.

## Participant QA Checklist

In a fresh Codex Desktop chat with the plugin installed, from an empty test project folder:

1. Run `$start-hackathon`.
2. Confirm the welcome message explains chat-first guidance.
3. Confirm the bundled MCP stepper widget renders inline.
4. Run `$review-rules`.
5. Confirm the participant must explicitly agree before moving on.
6. Run `$resources`.
7. Confirm the inline response explains the normal path and optional guided build tool.
8. Run `$build-onboard` only if testing the optional guided build tool.
9. Continue through `$build-scope`, `$build-prd`, `$build-spec`, `$build-checklist`, and `$build-project`.
10. Then run `$prepare-submission`.
11. Run `$submission-check`.
12. Confirm the security scan renders clearly.

In Codex CLI with the plugin installed, repeat the same command sequence and confirm the text dashboard renders and no Markdown image syntax appears.

## Devpost MCP

The Devpost MCP is bundled with the plugin (server `devpost` at `https://devpost.com/mcp`, referenced by `"mcpServers": "./.mcp.json"` in the manifest). It provides official event data and the inline stepper widget on capable hosts. Public read tools work with no auth; a write or protected read triggers an OAuth browser flow via discovery.

When the MCP server is unavailable, this repo's `config/hackathon.json` and Markdown files are the local fallback. See [`docs/future-devpost-mcp.md`](future-devpost-mcp.md) for tool names and the auth model.
